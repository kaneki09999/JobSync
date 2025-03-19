<?php
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    $application_id = $input['application_id'] ?? null;
    $applicant_id = $input['applicant_id'] ?? null;
    $job_id = $input['job_id'] ?? null;
    $status = $input['status'] ?? null;
    $job_title = $input['job_title'] ?? null;

    if (!$application_id || !$job_id || !$status || !$job_title) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields.']);
        exit;
    }

    // Start transaction
    $conn->beginTransaction();

    // Update application status
    $update_sql = "UPDATE js_applicant_application_resume SET applied_status = :status, type = 'assessment' WHERE application_id = :application_id";
    $update_stmt = $conn->prepare($update_sql);
    $update_stmt->execute([':status' => $status, ':application_id' => $application_id]);

    if ($update_stmt->rowCount() === 0) {
        throw new Exception('Failed to update applicant status.');
    }

    // Define notification message
    $message = match ($status) {
        'Qualified' => "🎉 Congratulations! You are approved for the '$job_title' position. Next steps will follow.",
        'Rejected' => "❌ Thank you for applying for '$job_title'. Unfortunately, you were not selected.",
        default => "Your application status for '$job_title' has been updated."
    };

    // Insert notification
    $notification_sql = "INSERT INTO js_notification (application_id, job_id, message) VALUES (:application_id, :job_id, :message)";
    $notification_stmt = $conn->prepare($notification_sql);
    $notification_stmt->execute([':application_id' => $application_id, ':job_id' => $job_id, ':message' => $message]);
    
    // Commit transaction
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Status updated and notification sent.']);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
