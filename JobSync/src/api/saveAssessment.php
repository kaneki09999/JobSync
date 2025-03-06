<?php
include 'dbconnect.php';
require '../../vendor/autoload.php'; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();
try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()])); 
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['assessmentData']) && is_array($data['assessmentData'])) {
    $conn->beginTransaction();

    try {
        $correctAnswersCount = 0;
        $incorrectAnswersCount = 0;
        $evaluationMessages = [];
        foreach ($data['assessmentData'] as $task) {
            $assessment_id = $task['assessment_id'];
            $answer = $task['answer'];
            $applicant_id = $task['applicant_id'];
            $application_id = $task['application_id'];
            $job_id = $task['job_id'];
            $jobTitle = $task['jobTitle'];
            $sql = "INSERT INTO js_assessment_answer (assessment_id, answer, applicant_id) 
                    VALUES (:assessment_id, :answer, :applicant_id)";
            
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':assessment_id', $assessment_id, PDO::PARAM_INT);
            $stmt->bindParam(':answer', $answer, PDO::PARAM_STR);
            $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);

            if (!$stmt->execute()) {
                throw new Exception('Failed to save assessment data.');
            }

            $sql_question = "SELECT instructions FROM js_assessment WHERE assessment_id = :assessment_id";
            $stmt_question = $conn->prepare($sql_question);
            $stmt_question->bindParam(':assessment_id', $assessment_id, PDO::PARAM_INT);
            $stmt_question->execute();
            $question = $stmt_question->fetchColumn();

            if (!$question) {
                throw new Exception('Assessment question not found.');
            }

            $apiKey = $_ENV['API_KEY'];
            $url = 'https://api.openai.com/v1/chat/completions';

            $data = [
                'model' => 'gpt-3.5-turbo', 
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an expert evaluator who checks answers to assessment questions and provides feedback on correctness and reasoning.'],
                    ['role' => 'user', 'content' => "Here is the question: \"$question\"\n\nThe applicant's answer is: \"$answer\"\n\nPlease evaluate if the answer is correct or incorrect. Respond only with 'answer: correct' if it is correct, or 'answer: incorrect' if it is incorrect."]
                ]
            ];
            

            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

            $response = curl_exec($ch);
            curl_close($ch);
            
            $responseData = json_decode($response, true);
            
            $logFile = __DIR__ . '/uploads/openai_api_response.log';
            error_log("OpenAI API Response: " . print_r($responseData, true), 3, $logFile);
            
            if (isset($responseData['choices']) && count($responseData['choices']) > 0) {
                $evaluation = $responseData['choices'][0]['message']['content'];
            
                error_log("Evaluation Response: " . $evaluation, 3, $logFile);
            
                $is_qualified = false;
            
                if (strpos(strtolower($evaluation), 'correct') !== false) {
                    $is_qualified = true; 
                }
            
                if (strpos(strtolower($evaluation), 'incorrect') !== false) {
                    $is_qualified = false; 
                }
            
                if ($is_qualified) {
                    $correctAnswersCount++;
                } else {
                    $incorrectAnswersCount++;
                }
            } else {
                $evaluation = 'Response is malformed or failed to evaluate.';
                error_log("Malformed API Response or Failure", 3, $logFile);
            
                echo json_encode([
                    'success' => false,
                    'error' => 'Response is malformed or failed to evaluate. Please try again.',
                ]);
                $conn->rollBack(); 
                exit;
            }
            

            error_log("Correct Answers: " . print_r($correctAnswersCount, true), 3, $logFile);
            error_log(" Incorrect Answers: " . print_r($incorrectAnswersCount, true), 3, $logFile);
            $applied_status = 'Rejected'; 

            $sql_questions = "SELECT COUNT(*) FROM js_assessment WHERE application_id = :application_id AND job_id = :job_id";
            $stmt_questions = $conn->prepare($sql_questions);
            $stmt_questions->bindParam(':application_id', $application_id, PDO::PARAM_INT);
            $stmt_questions->bindParam(':job_id', $job_id, PDO::PARAM_INT);
            $stmt_questions->execute();
            $total_questions = $stmt_questions->fetchColumn();

            if ($correctAnswersCount > $incorrectAnswersCount) {
                $applied_status = 'Qualified';
            } else {
                $applied_status = 'Rejected';
            }
            
            error_log("Final Decision: " . $applied_status, 3, $logFile);
        }          
           // Determine final applied status
           $applied_status = ($correctAnswersCount > $incorrectAnswersCount) ? 'Qualified' : 'Rejected';
           $custom_message = ($applied_status === 'Qualified')
               ? "Congratulations! You have successfully qualified for the next step. We look forward to your continued success!"
               : "Thank you for your application. After careful consideration, we’ve decided to move forward with other candidates. We appreciate your time and wish you success in the future.";
   
           // Update js_applicant_application_resume
           $evaluationMessageStr = implode('; ', $evaluationMessages);
           
           $update_sql = "UPDATE js_applicant_application_resume 
                          SET applied_status = :applied_status, message = :evaluation_message 
                          WHERE application_id = :application_id";
           $update_stmt = $conn->prepare($update_sql);
           $update_stmt->bindParam(':applied_status', $applied_status, PDO::PARAM_STR);
           $update_stmt->bindParam(':evaluation_message', $evaluationMessageStr, PDO::PARAM_STR);
           $update_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
   
           if (!$update_stmt->execute()) {
               throw new Exception('Failed to update applicant status and evaluation message.');
           }
   
           // Insert notification if not already exists
           $check_notification_sql = "SELECT COUNT(*) FROM js_notification 
                                       WHERE application_id = :application_id 
                                       AND job_id = :job_id 
                                       AND message = :message";
           $check_notification_stmt = $conn->prepare($check_notification_sql);
           $check_notification_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
           $check_notification_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
           $check_notification_stmt->bindParam(':message', $custom_message, PDO::PARAM_STR);
           $check_notification_stmt->execute();
           $existing_notification_count = $check_notification_stmt->fetchColumn();
   
           if ($existing_notification_count == 0) {
               $notification_sql = "INSERT INTO js_notification (application_id, job_id, message) 
                                    VALUES (:application_id, :job_id, :message)";
               $notification_stmt = $conn->prepare($notification_sql);
               $notification_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
               $notification_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
               $notification_stmt->bindParam(':message', $custom_message, PDO::PARAM_STR);
   
               if (!$notification_stmt->execute()) {
                   throw new Exception('Failed to insert applicant notification.');
               }
           }

           // Insert notification for the employer
           $employer_message = ($applied_status === 'Qualified') 
               ? "The applicant has been qualified to proceed to the next phase of the recruitment process for the $jobTitle position. They are now eligible to schedule their interview."
               : "The applicant did not meet the qualifications for the $jobTitle position.";
           
           $check_employer_notification_sql = "SELECT COUNT(*) FROM js_employer_notification 
                                               WHERE application_id = :application_id 
                                               AND job_id = :job_id 
                                               AND message = :message";
           $check_employer_notification_stmt = $conn->prepare($check_employer_notification_sql);
           $check_employer_notification_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
           $check_employer_notification_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
           $check_employer_notification_stmt->bindParam(':message', $employer_message, PDO::PARAM_STR);
           $check_employer_notification_stmt->execute();
           $existing_employer_notification_count = $check_employer_notification_stmt->fetchColumn();
   
           if ($existing_employer_notification_count == 0) {
               $employer_notification_sql = "INSERT INTO js_employer_notification (application_id, job_id, message, type) 
                                             VALUES (:application_id, :job_id, :message, 'qualified')";
               $employer_notification_stmt = $conn->prepare($employer_notification_sql);
               $employer_notification_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
               $employer_notification_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
               $employer_notification_stmt->bindParam(':message', $employer_message, PDO::PARAM_STR);
   
               if (!$employer_notification_stmt->execute()) {
                   throw new Exception('Failed to insert employer notification.');
               }
           }  


        $conn->commit();
        echo json_encode([
            'success' => true,
            'applied_status' => $applied_status, 
        ]);
    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid data received.']);
}
?>
