<?php
include 'dbconnect.php'; 

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

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $application_id = $data['application_id'] ?? null;
    $job_id = $data['job_id'] ?? null;
    $reason = $data['reason'] ?? null;
    $interview_id = $data['interview_id'] ?? null;
    $jobTitle = $data['jobTitle'] ?? null;
    $email = $data['email'] ?? null;
    $firstname = $data['firstname'] ?? null;
    $lastname = $data['lastname'] ?? null;
    $company_name = $data['company_name'] ?? null;
    $decisionType = $data['decision_type'] ?? 'Declined';  

    if ($decisionType === 'Reschedule') {
        $messages = "The applicant has requested to reschedule the interview for the $jobTitle position.";
    } else {
        $messages = "The applicant has declined the interview schedule for the $jobTitle position.";
    }

    try {
        $decision_sql = "INSERT INTO js_declined_schedule (interview_id, reason) 
                         VALUES (:interview_id, :reason)";
        $decision_stmt = $conn->prepare($decision_sql);
        $decision_stmt->bindParam(':interview_id', $interview_id, PDO::PARAM_INT);
        $decision_stmt->bindParam(':reason', $reason, PDO::PARAM_STR);
        $decision_stmt->execute();

        $email_message = html_entity_decode($reason ?? "No message available", ENT_QUOTES | ENT_HTML5);
        $email_message_plain = strip_tags($email_message);  

        $email_message_plain = strip_tags($email_message, '<li><p><h3>');  
        $email_message_plain = preg_replace('/<h[1-6]>(.*?)<\/h[1-6]>/i', "$1\n\n", $email_message_plain);
        $email_message_plain = preg_replace('/<p>(.*?)<\/p>/i', "$1\n\n", $email_message_plain);
        $email_message_plain = preg_replace('/<li>(.*?)<\/li>/i', "• $1\n", $email_message_plain);
        $email_message_plain = strip_tags($email_message_plain);
        $email_message_plain = preg_replace('/\n{2,}/', "\n\n", trim($email_message_plain));

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USER'];
        $mail->Password = $_ENV['SMTP_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $_ENV['SMTP_PORT'];

        $mail->setFrom($_ENV['SMTP_FROM_EMAIL'], $_ENV['SMTP_FROM_NAME']);
        $mail->addAddress($email);
        $mail->isHTML(false);
        if ($decisionType === 'Reschedule') {
            $mail->Subject = trim($firstname) . ' ' . trim($lastname) . ' requested to reschedule the interview with ' . $company_name;
        } else {
            $mail->Subject = trim($firstname) . ' ' . trim($lastname) . ' declined the interview schedule with ' . $company_name;
        }
        $mail->Body = trim($email_message_plain);
        $mail->send();

        $stmt = $conn->prepare("UPDATE js_interview_schedule SET status = :decision_type WHERE application_id = :application_id AND job_id = :job_id");
        $stmt->bindParam(':decision_type', $decisionType, PDO::PARAM_STR);
        $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $stmt->execute();

        $notification_sql = "INSERT INTO js_employer_notification (application_id, job_id, message, type) 
                             VALUES (:application_id, :job_id, :message, :decision_type)";
        $notif_stmt = $conn->prepare($notification_sql);
        $notif_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $notif_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $notif_stmt->bindParam(':message', $messages, PDO::PARAM_STR);
        $notif_stmt->bindParam(':decision_type', $decisionType, PDO::PARAM_STR);
        $notif_stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => "Interview status updated to $decisionType successfully"]);
        } else {
            echo json_encode(['success' => false, 'message' => "Failed to update interview status"]);
        }

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
?>
