<?php
include 'dbconnect.php';
include 'config.php';  

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()])); 
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents("php://input"), true);
    $channel = $input['channel'] ?? '';
    $application_id = intval($input['application_id'] ?? 0);
    $job_id = intval($input['job_id'] ?? 0);

    if (!$channel || !$application_id || !$job_id) {
        echo json_encode(["error" => "Invalid input. channel, application_id, and job_id are required."]);
        exit;
    }

    try {
        $checkStmt = $conn->prepare("
            SELECT status 
            FROM js_join_request 
            WHERE application_id = :application_id AND job_id = :job_id
        ");
        $checkStmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $checkStmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $checkStmt->execute();

        $existingRequest = $checkStmt->fetch(PDO::FETCH_ASSOC);

        if ($existingRequest) {
            if ($existingRequest['status'] === 'approved') {
                echo json_encode(["status" => "approved", "message" => "Join request is already approved. No new request submitted."]);
                exit;
            } else {
                echo json_encode(["status" => $existingRequest['status'], "message" => "A join request already exists with status: " . $existingRequest['status']]);
                exit;
            }
        }
        $stmt = $conn->prepare("
            INSERT INTO js_join_request (channel_name, application_id, job_id, status) 
            VALUES (:channel_name, :application_id, :job_id, 'pending')
        ");
        $stmt->bindParam(':channel_name', $channel);
        $stmt->bindParam(':application_id', $application_id);
        $stmt->bindParam(':job_id', $job_id);
        $stmt->execute();

        echo json_encode(["status" => "pending", "message" => "Join request submitted successfully."]);
        exit;

    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        exit;
    }
}

echo json_encode(["error" => "Invalid request method"]);
exit;
