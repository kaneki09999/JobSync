<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$data = json_decode(file_get_contents("php://input"), true);
$channel_name = $data['channel_name']?? null;
$job_id = $data['job_id'] ?? null;
$application_id = $data['application_id'] ?? null;

if (!$job_id || !$application_id) {
    echo json_encode(["status" => "error", "message" => "Invalid parameters"]);
    exit;
}

try {
    $sql = "DELETE FROM js_join_request WHERE job_id = :job_id AND application_id = :application_id AND status = 'pending'";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
    $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete the entry."]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
