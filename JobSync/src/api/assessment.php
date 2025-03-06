<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || !is_array($data)) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid input data."]);
        exit();
    }

    try {
        $conn->beginTransaction();

        $job_id = $data[0]['job_id'];
        $jobTitle = $data[0]['jobTitle'];
        $deleteStmt = $conn->prepare("DELETE FROM js_saved_assessment WHERE job_id = :job_id");
        $deleteStmt->execute([':job_id' => $job_id]);

        $stmt = $conn->prepare("INSERT INTO js_assessment (application_id, job_id, type, instructions, correctAnswer) 
                               VALUES (:application_id, :job_id, :type, :instructions, :correctAnswer)");

        $applicationIds = []; 

        foreach ($data as $assessment) {
            $application_id = $assessment['application_id'];
            $type = $assessment['type'];
            $instructions = $assessment['instructions'];
            $correctAnswer = $assessment['correctAnswer'] ?? null;

            $stmt->execute([
                ':application_id' => $application_id,
                ':job_id' => $job_id,
                ':type' => $type,
                ':instructions' => $instructions,
                ':correctAnswer' => $correctAnswer,
            ]);

            $updateStmt = $conn->prepare("UPDATE js_applicant_application_resume SET applied_status = :applied_status, type = :type 
                                         WHERE application_id = :application_id");

            $updateStmt->execute([
                ':applied_status' => 'On hold',
                ':type' => 'assessment',
                ':application_id' => $application_id,
            ]);

            if (!in_array($application_id, $applicationIds)) {
                $applicationIds[] = $application_id;
            }
        }

        $notifValues = [];
        $notifPlaceholders = [];
        $messageTemplate = "You have received an assessment for the %s role.";
        
        foreach ($applicationIds as $application_id) {
            $message = sprintf($messageTemplate, $jobTitle); 
            $notifPlaceholders[] = "(?, ?, ?)";
            $notifValues[] = $application_id;
            $notifValues[] = $job_id;
            $notifValues[] = $message;
        }
        
        if (!empty($notifPlaceholders)) {
            $notifQuery = "INSERT INTO js_notification (application_id, job_id, message) VALUES " . implode(", ", $notifPlaceholders);
            $notifStmt = $conn->prepare($notifQuery);
            $notifStmt->execute($notifValues);
        }
        
        

        $conn->commit();

        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Assessments saved successfully."]);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(500);
        echo json_encode(["status" => "error", "message" => "Failed to save assessments: " . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Invalid request method. Only POST is allowed."]);
}
