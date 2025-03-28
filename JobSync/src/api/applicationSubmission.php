<?php
include 'dbconnect.php';
include 'config.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php'; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();
try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));  
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $applicant_id = $_POST['applicant_id'];
    $job_id = $_POST['job_id'];
    $jobTitle = $_POST['jobTitle'];
    $resumeName = $_POST['resume_name'];
    $resumePath = $_POST['resume'];
    $message = "A new applicant has applied for the job: $jobTitle.";
    $type = "Pending";

    $coverLetterPath = null;
    if (!empty($_FILES['coverLetter']['name'])) {
        $coverLetterDir = "uploads/cover_letters/";
        if (!is_dir($coverLetterDir)) {
            mkdir($coverLetterDir, 0777, true);
        }
        $coverLetterName = time() . "_" . basename($_FILES['coverLetter']['name']);
        $targetCoverLetterPath = $coverLetterDir . $coverLetterName;

        if (move_uploaded_file($_FILES['coverLetter']['tmp_name'], $targetCoverLetterPath)) {
            $coverLetterPath = $targetCoverLetterPath;
        }
    }
    $checkQuery = "SELECT COUNT(*) FROM js_applicant_application_resume WHERE applicant_id = :applicant_id AND job_id = :job_id";
    $checkStmt = $conn->prepare($checkQuery);
    $checkStmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
    $checkStmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
    $checkStmt->execute();
    $existingApplication = $checkStmt->fetchColumn();

    if ($existingApplication > 0) {
        echo json_encode(['error' => true, 'message' => 'You have already submitted an application for this position.']);
        exit;
    }

    try {
        $resumeQuery = "INSERT INTO js_applicant_application_resume (applicant_id, job_id, resumeName, resumePath, coverLetter, applied_status) 
                        VALUES (:applicant_id, :job_id, :resumeName, :resumePath, :coverLetter, 'Pending')";
        $resumeStmt = $conn->prepare($resumeQuery);
        $resumeStmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
        $resumeStmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $resumeStmt->bindParam(':resumeName', $resumeName, PDO::PARAM_STR);
        $resumeStmt->bindParam(':resumePath', $resumePath, PDO::PARAM_STR);
        $resumeStmt->bindParam(':coverLetter', $coverLetterPath, PDO::PARAM_STR);
        $resumeStmt->execute();

        $application_id = $conn->lastInsertId();

        foreach ($_POST as $key => $value) {
            if (strpos($key, 'screening_answer_') === 0) {
                $question_id = str_replace('screening_answer_', '', $key);
                $answer = $value;

                $answerQuery = "INSERT INTO js_applicant_application (application_id, question_id, answer) 
                                VALUES (:application_id, :question_id, :answer)";
                $answerStmt = $conn->prepare($answerQuery);
                $answerStmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
                $answerStmt->bindParam(':question_id', $question_id, PDO::PARAM_INT);
                $answerStmt->bindParam(':answer', $answer, PDO::PARAM_STR);
                $answerStmt->execute();
            }
        }

        $notifQuery = "INSERT INTO js_employer_notification (application_id, job_id, message, type) VALUES (:application_id, :job_id, :message, :type)";
        $notifStmt = $conn->prepare($notifQuery);
        $notifStmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $notifStmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $notifStmt->bindParam(':message', $message, PDO::PARAM_STR);
        $notifStmt->bindParam(':type', $type, PDO::PARAM_STR);
        $notifStmt->execute();

        $employerQuery = "SELECT e.email, e.lastname FROM js_employer_info e 
                        JOIN js_post_jobs j ON e.employer_id = j.employer_id 
                        WHERE j.job_id = :job_id";
        $employerStmt = $conn->prepare($employerQuery);
        $employerStmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $employerStmt->execute();
        $employer = $employerStmt->fetch(PDO::FETCH_ASSOC);

        if ($employer) {
            $email = $employer['email'];
            $lastname = $employer['lastname'];

            try {
                $mail = new PHPMailer(true);
                $mail->isSMTP();
                $mail->Host = $_ENV['SMTP_HOST'];
                $mail->SMTPAuth = true;
                $mail->Username = $_ENV['SMTP_USER'];
                $mail->Password = $_ENV['SMTP_PASS'];
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
                $mail->Port = $_ENV['SMTP_PORT'];

                $mail->setFrom($_ENV['SMTP_FROM_EMAIL'], $_ENV['SMTP_FROM_NAME']);
                $mail->addAddress($email, $lastname);
                $mail->isHTML(true);

                $mail->Subject = 'New Job Application Received';
                $mail->Body = '
                <div style="max-width: 600px; margin: 20px auto; background: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                    <div style="background: #0073e6; padding: 15px; text-align: center; color: white; font-size: 20px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                        New Job Application Received
                    </div>
                    <div style="padding: 20px; font-size: 16px; line-height: 1.6; color: #333;">
                        <p>Hello <strong>'. $lastname .'</strong>,</p>
                        <p>You have received a new application for the job post: <strong>'. $jobTitle .'</strong>.</p>
                        <p>Please review the application in your employer dashboard.</p>
                        <a href="https://jobsync-ph.com/employer/applications" style="display: inline-block; padding: 12px 20px; margin: 20px 0; background: #0073e6; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View Application</a>
                    </div>
                    <div style="text-align: center; padding: 15px; font-size: 14px; color: #666;">
                        <p>Best Regards,<br>Your JobSync Team</p>
                    </div>
                </div>
                ';
                $mail->send();
            } catch (Exception $e) {
                error_log("Email could not be sent. Mailer Error: {$mail->ErrorInfo}");
            }
        }

        echo json_encode(['success' => true, 'message' => 'Your application has been successfully submitted.']);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }

} else {
    echo json_encode(["error" => "Invalid request method"]);
}
?>
