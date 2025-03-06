<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();

    $input = json_decode(file_get_contents('php://input'), true);
    $applicant_id = $input['applicant_id'] ?? null;
    $sql = "UPDATE js_job_match_alerts SET is_read = 1 WHERE applicant_id = :applicant_id AND is_read = 0";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'All alerts marked as read']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error marking alerts as read']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} finally {
    $conn = null;
}
?>
