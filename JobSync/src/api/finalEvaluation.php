<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['application_id']) && isset($data['applied_status'])) {
    $application_id = $data['application_id'];
    $applied_status = $data['applied_status'];

    try {
        $conn->beginTransaction();

        $query = "UPDATE js_applicant_application_resume SET applied_status = :applied_status WHERE application_id = :application_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':applied_status', $applied_status, PDO::PARAM_STR);
        $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        
        if ($stmt->execute()) {
            $jobQuery = "SELECT job_id FROM js_applicant_application_resume WHERE application_id = :application_id";
            $jobStmt = $conn->prepare($jobQuery);
            $jobStmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
            $jobStmt->execute();
            $job = $jobStmt->fetch(PDO::FETCH_ASSOC);

            if ($job) {
                $job_id = $job['job_id'];
                
                if ($applied_status === 'Final Evaluation') {
                    $message = "Your application is now in the Final Evaluation stage.";

                    $notifQuery = "INSERT INTO js_notification (application_id, job_id, message, type) VALUES (:application_id, :job_id, :message, 'final')";
                    $notifStmt = $conn->prepare($notifQuery);
                    $notifStmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
                    $notifStmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
                    $notifStmt->bindParam(':message', $message, PDO::PARAM_STR);
                    $notifStmt->execute();

                    $updateScheduleQuery = "UPDATE js_interview_schedule SET status = 'Final Evaluation' WHERE application_id = :application_id";
                    $updateScheduleStmt = $conn->prepare($updateScheduleQuery);
                    $updateScheduleStmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
                    $updateScheduleStmt->execute();
                }
            }

            $conn->commit();
            echo json_encode(["success" => true]);
        } else {
            $conn->rollBack();
            echo json_encode(["success" => false, "error" => "Failed to update status"]);
        }
    } catch (PDOException $e) {
        $conn->rollBack();
        echo json_encode(["success" => false, "error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Invalid request"]);
}
?>
