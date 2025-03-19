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

            // Insert the answer
            $sql = "INSERT INTO js_assessment_answer (assessment_id, answer, applicant_id) 
                    VALUES (:assessment_id, :answer, :applicant_id)";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':assessment_id', $assessment_id, PDO::PARAM_INT);
            $stmt->bindParam(':answer', $answer, PDO::PARAM_STR);
            $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
            if (!$stmt->execute()) {
                throw new Exception('Failed to save assessment data.');
            }

            // Get the question/instructions for this assessment
            $sql_question = "SELECT instructions FROM js_assessment WHERE assessment_id = :assessment_id";
            $stmt_question = $conn->prepare($sql_question);
            $stmt_question->bindParam(':assessment_id', $assessment_id, PDO::PARAM_INT);
            $stmt_question->execute();
            $question = $stmt_question->fetchColumn();
            if (!$question) {
                throw new Exception('Assessment question not found.');
            }

            // Prepare the OpenAI API request
            $apiKey = $_ENV['API_KEY'];
            $url = 'https://api.openai.com/v1/chat/completions';
            $requestData = [
                'model' => 'gpt-3.5-turbo', 
                'messages' => [
                    [
                        'role' => 'system', 
                        'content' => 'You are an expert evaluator who checks answers to assessment questions and provides feedback on correctness and reasoning.'
                    ],
                    [
                        'role' => 'user', 
                        'content' => "Here is the question: \"$question\"\n\nThe applicant's answer is: \"$answer\"\n\nPlease evaluate if the answer is correct or incorrect. Respond only with 'answer: correct' if it is correct, or 'answer: incorrect' if it is incorrect."
                    ]
                ]
            ];

            // Send the request to OpenAI API via cURL
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Authorization: Bearer ' . $apiKey,
                'Content-Type: application/json'
            ]);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($requestData));
            $response = curl_exec($ch);
            curl_close($ch);
            
            $responseData = json_decode($response, true);
            $logFile = __DIR__ . '/uploads/openai_api_response.log';
            error_log("OpenAI API Response: " . print_r($responseData, true), 3, $logFile);
            
            if (isset($responseData['choices']) && count($responseData['choices']) > 0) {
                $evaluation = $responseData['choices'][0]['message']['content'];
                error_log("Evaluation Response: " . $evaluation, 3, $logFile);
                
                // Determine if the answer is correct or incorrect.
                // (We assume if the response contains 'correct' it's a correct answer;
                //  if it contains 'incorrect', it's not.)
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
            error_log("Incorrect Answers: " . print_r($incorrectAnswersCount, true), 3, $logFile);

            // Optionally, you can accumulate individual evaluation messages in $evaluationMessages.
            // $evaluationMessages[] = $evaluation;
        }
        
        // Determine final applied status based on total counts:
        // If there are more correct than incorrect, they are Qualified.
        // If not, and if there are 3 or more incorrect answers, mark as On Hold.
        // Otherwise, mark as Rejected.
        // Determine final applied status based on total counts:
        if ($correctAnswersCount === 0) {
            $applied_status = 'Rejected';
        } elseif ($correctAnswersCount === 1) {
            $applied_status = 'On hold';
        } elseif ($correctAnswersCount === count($data['assessmentData'])) {
            $applied_status = 'Qualified';
        } elseif ($correctAnswersCount === 2) {
            $applied_status = 'On hold';
        } else {
            $applied_status = 'On hold';
        }

        // Set a custom message based on the final status.
        if ($applied_status === 'Qualified') {
            $custom_message = "Congratulations! You have successfully passed all assessments and are approved for the next step.";
            $type = 'assessment'; 
        } elseif ($applied_status === 'On hold') {
            $custom_message = "You have performed well! Your application is currently waiting for approval.";
            $type = 'hold';
        } else {
            $custom_message = "Thank you for your application. After careful consideration, we’ve decided to move forward with other candidates. We appreciate your time and wish you success in the future.";
            $type = 'assessment'; 
        }

        // Combine evaluation messages if needed
        $evaluationMessageStr = implode('; ', $evaluationMessages);

        // Update the applicant's status and message in the database
        $update_sql = "UPDATE js_applicant_application_resume 
        SET applied_status = :applied_status, message = :evaluation_message, type = :type
        WHERE application_id = :application_id";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bindParam(':applied_status', $applied_status, PDO::PARAM_STR);
        $update_stmt->bindParam(':evaluation_message', $evaluationMessageStr, PDO::PARAM_STR);
        $update_stmt->bindParam(':type', $type, PDO::PARAM_STR);
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

        //    // Insert notification for the employer
        $employer_message = ($applied_status === 'Qualified') 
            ? "The applicant has been approved to proceed to the next phase of the recruitment process for the $jobTitle position. They are now eligible to schedule their interview."
            : (($applied_status === 'On hold') 
            ? "The applicant has performed well and is waiting for approval to proceed to the next phase of the recruitment process for the $jobTitle position."
            : "The applicant has been rejected for the $jobTitle position. Thank you for your time and consideration.");

           
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
                                             VALUES (:application_id, :job_id, :message, 'Pending')";
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
