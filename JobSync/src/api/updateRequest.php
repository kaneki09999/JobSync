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

    $channelName = $input['channelName'] ?? '';
    $uid = intval($input['uid'] ?? 0);
    $approved = $input['approved'] ?? false;

    if (!$channelName || !$uid) {
        echo json_encode(["error" => "Missing parameters"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("UPDATE js_join_request SET status = :status WHERE channel_name = :channelName AND request_id = :uid");
        $status = $approved ? 'approved' : 'rejected';
        $stmt->bindParam(':status', $status);
        $stmt->bindParam(':channelName', $channelName);
        $stmt->bindParam(':uid', $uid);

        $stmt->execute();

        echo json_encode(["status" => $status]);
        exit;

    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        exit;
    }
}

echo json_encode(["error" => "Invalid request method"]);
exit;
