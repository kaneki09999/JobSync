<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $channel_name = isset($data['channel_name']) ? $data['channel_name'] : null;
    $employer_id = isset($data['employer_id']) ? $data['employer_id'] : null;
    try {
        $stmt = $conn->prepare("INSERT INTO js_channel_interview (channel_name, employer_id) VALUES (:channel_name, :employer_id)");
        $stmt->bindParam(':channel_name', $channel_name, PDO::PARAM_STR);
        $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Channel name saved successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to save the channel name.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
