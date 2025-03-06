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

    if (!$conn) {
        throw new Exception('Database connection failed.');
    }
    if (!$conn->beginTransaction()) {
        throw new Exception('Transaction could not be started.');
    }
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
} catch (Exception $e) {
    die(json_encode(['error' => $e->getMessage()]));
}


$data = json_decode(file_get_contents('php://input'), true);
$application_id = $data['application_id'] ?? null;
$job_id = $data['job_id'] ?? null;
$employer_id = $data['employer_id'] ?? null;
$channel_name = $data['channel_name'] ?? null;
$date = $data['date'] ?? null;
$time = $data['time'] ?? null;
$message = isset($data['message']) ? htmlspecialchars($data['message']) : null;
$email = $data['email'] ?? null;
$company_name = $data['company_name'] ?? null;
$custom_message = "Your interview has been successfully scheduled. Kindly make a note of this for your reference.";

$check_interview_sql = "SELECT interview_id FROM js_interview_schedule 
                        WHERE application_id = :application_id AND job_id = :job_id";
$check_interview_stmt = $conn->prepare($check_interview_sql);
$check_interview_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
$check_interview_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
$check_interview_stmt->execute();
if (empty($channel_name)) {
    die(json_encode(['error' => 'Channel name is required but is missing or empty']));
}

try {

    if ($check_interview_stmt->rowCount() > 0) {
        $update_interview_sql = "UPDATE js_interview_schedule 
                                 SET channel_name = :channel_name, schedule = :date, 
                                     time = :time, message = :message, status = 'Pending' 
                                 WHERE application_id = :application_id AND job_id = :job_id";
        $update_interview_stmt = $conn->prepare($update_interview_sql);
        $update_interview_stmt->bindParam(':channel_name', $channel_name, PDO::PARAM_STR);
        $update_interview_stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $update_interview_stmt->bindParam(':time', $time, PDO::PARAM_STR);
        $update_interview_stmt->bindParam(':message', $message, PDO::PARAM_STR);
        $update_interview_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $update_interview_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $update_interview_stmt->execute();
    
        $schedule_id = $check_interview_stmt->fetch(PDO::FETCH_ASSOC)['interview_id'];
    } else {
        $insert_interview_sql = "INSERT INTO js_interview_schedule (channel_name, schedule, time, message, application_id, employer_id, job_id, status)
                                 VALUES (:channel_name, :date, :time, :message, :application_id, :employer_id, :job_id, 'Pending')";
        $insert_interview_stmt = $conn->prepare($insert_interview_sql);
        $insert_interview_stmt->bindParam(':channel_name', $channel_name, PDO::PARAM_STR);
        $insert_interview_stmt->bindParam(':date', $date, PDO::PARAM_STR);
        $insert_interview_stmt->bindParam(':time', $time, PDO::PARAM_STR);
        $insert_interview_stmt->bindParam(':message', $message, PDO::PARAM_STR);
        $insert_interview_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $insert_interview_stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
        $insert_interview_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $insert_interview_stmt->execute();
    
        $schedule_id = $conn->lastInsertId();
    }
    $retrieve_stmt = $conn->prepare("SELECT message FROM js_interview_schedule WHERE interview_id = :id");
    $retrieve_stmt->bindParam(':id', $schedule_id, PDO::PARAM_INT);
    $retrieve_stmt->execute();
    $schedule = $retrieve_stmt->fetch(PDO::FETCH_ASSOC);


    $email_message = html_entity_decode($schedule['message'] ?? "No message available", ENT_QUOTES | ENT_HTML5);
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
    $mail->Subject = 'Your interview with ' . $company_name . ' has been scheduled.';
    $mail->Body = trim($email_message_plain);  

    if ($mail->send()) {
        $conn->commit();
        $check_notification_sql = "SELECT notification_id FROM js_notification 
                                WHERE application_id = :application_id 
                                AND job_id = :job_id 
                                AND message = :message 
                                AND type = 'interview'";
        $check_notification_stmt = $conn->prepare($check_notification_sql);
        $check_notification_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $check_notification_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $check_notification_stmt->bindParam(':message', $custom_message, PDO::PARAM_STR);
        $check_notification_stmt->execute();

        if ($check_notification_stmt->rowCount() > 0) {
            $update_notification_sql = "UPDATE js_notification 
                                        SET created_at = NOW(), countRead = 0 
                                        WHERE application_id = :application_id 
                                        AND job_id = :job_id 
                                        AND type = 'interview'";
            $update_notification_stmt = $conn->prepare($update_notification_sql);
            $update_notification_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
            $update_notification_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
            $update_notification_stmt->execute();
        } else {
            $insert_notification_sql = "INSERT INTO js_notification (application_id, job_id, message, type, created_at) 
                                        VALUES (:application_id, :job_id, :message, 'interview', NOW())";
            $insert_notification_stmt = $conn->prepare($insert_notification_sql);
            $insert_notification_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
            $insert_notification_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
            $insert_notification_stmt->bindParam(':message', $custom_message, PDO::PARAM_STR);
            $insert_notification_stmt->execute();
        }
        $applied_status = 'To Interview';
        $update_sql = "UPDATE js_applicant_application_resume 
        SET applied_status = :applied_status
        WHERE application_id = :application_id";
        $update_stmt = $conn->prepare($update_sql);
        $update_stmt->bindParam(':applied_status', $applied_status, PDO::PARAM_STR);
        $update_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $update_stmt->execute();

        $notifType = 'scheduled';
        $update_sql_notif = "UPDATE js_employer_notification 
        SET type = :notifType
        WHERE application_id = :application_id AND job_id = :job_id AND type = 'qualified'";
        $update_stmt_notif = $conn->prepare($update_sql_notif);
        $update_stmt_notif->bindParam(':notifType', $notifType, PDO::PARAM_STR);
        $update_stmt_notif->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $update_stmt_notif->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $update_stmt_notif->execute();
        http_response_code(201);
        echo json_encode(['message' => 'Interview schedule saved and notification sent successfully']);
    } else {
        $conn->rollBack();
        throw new Exception('Failed to send email.');
    }

} catch (PDOException $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    $error_message = 'Failed to save interview schedule: ' . $e->getMessage();
    error_log($error_message, 3, 'error.log');
    http_response_code(500);
    echo json_encode(['error' => $error_message]);
} catch (Exception $e) {
    if ($conn->inTransaction()) {
        $conn->rollBack();
    }
    $error_message = $e->getMessage();
    error_log($error_message, 3, 'error.log');
    http_response_code(500);
    echo json_encode(['error' => $error_message]);
}

?>
