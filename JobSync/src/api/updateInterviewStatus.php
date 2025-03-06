<?php
include 'dbconnect.php'; 

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();  
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}
$data = json_decode(file_get_contents('php://input'), true);
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $application_id = isset($data['application_id']) ? $data['application_id'] : null;
    $job_id = isset($data['job_id']) ? $data['job_id'] : null;
    $status = isset($data['status']) ? $data['status'] : null;
    $company_name = isset($data['company_name']) ? $data['company_name'] : null;
    $custom_message = "Thank you for confirming your interview schedule with $company_name";
    $interview_id = isset($data['interview_id']) ? $data['interview_id'] : null;
    $schedule = isset($data['schedule']) ? $data['schedule'] : null;
    $time = isset($data['time']) ? $data['time'] : null;
    $jobTitle = isset($data['jobTitle']) ? $data['jobTitle'] : null;
    $messages = "Thank you for confirming your interview schedule with $company_name. We look forward to meeting you on $schedule, at $time. Please ensure that you are prepared and join the interview on time. Should you have any questions or require further assistance, feel free to contact us.";
    $banner = "uploads/preview/preview.png";
    $custom_message_employer = "The interview schedule for the $jobTitle position has been confirmed";

    if (!$application_id || !$job_id || !$status) {
        echo json_encode(['success' => false, 'error' => 'Missing parameters']);
        exit;
    }
    try {
        $stmt = $conn->prepare("UPDATE js_interview_schedule SET status = :status WHERE application_id = :application_id AND job_id = :job_id");
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);

        $stmt->execute();

        $notification_sql = "INSERT INTO js_notification (application_id, job_id, message, type) 
        VALUES (:application_id, :job_id, :message, 'confirm')";
        $notification_stmt = $conn->prepare($notification_sql);
        $notification_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $notification_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $notification_stmt->bindParam(':message', $custom_message, PDO::PARAM_STR);
        $notification_stmt->execute();

        $status_sql = "INSERT INTO js_interview_status (interview_id, banner, messages) 
        VALUES (:interview_id, :banner, :messages)";
        $status_stmt = $conn->prepare($status_sql);
        $status_stmt->bindParam(':interview_id', $interview_id, PDO::PARAM_INT);
        $status_stmt->bindParam(':banner', $banner, PDO::PARAM_STR);
        $status_stmt->bindParam(':messages', $messages, PDO::PARAM_STR);
        $status_stmt->execute();

        
        $notification_employer_sql = "INSERT INTO js_employer_notification (application_id, job_id, message, type) 
        VALUES (:application_id, :job_id, :message, 'confirm')";
        $notif_employer_stmt = $conn->prepare($notification_employer_sql);
        $notif_employer_stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $notif_employer_stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $notif_employer_stmt->bindParam(':message', $custom_message_employer, PDO::PARAM_STR);
        $notif_employer_stmt->execute();

        if ($stmt->rowCount() > 0) {
            echo json_encode(['success' => true, 'message' => 'Interview status updated successfully']);
        } else {
            echo json_encode(['success' => false]);
        }

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method']);
}
?>
