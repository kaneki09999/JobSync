<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        $channel_name = $data['channel_name'];
        $application_id = $data['application_id'];
        $job_id = $data['job_id'];

        $sql = "SELECT COUNT(*) FROM js_interview_schedule 
                WHERE channel_name = :channel_name 
                AND application_id = :application_id 
                AND job_id = :job_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':channel_name', $channel_name, PDO::PARAM_STR);
        $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $stmt->execute();
        $count = $stmt->fetchColumn();

        if ($count > 0) {
            echo json_encode(['status' => 'exists']);
        } else {
            echo json_encode(['status' => 'not_found']);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'An error occurred', 
            'error' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
