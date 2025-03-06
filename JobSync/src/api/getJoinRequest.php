<?php
include 'dbconnect.php';
include 'config.php';  

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()])); 
}

$data = json_decode(file_get_contents('php://input'), true);
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $channelName = $_GET['channelName'] ?? '';
    if (!$channelName) {
        echo json_encode(["error" => "Missing 'channelName' parameter"]);
        exit;
    }

    try {
        $stmt = $conn->prepare("SELECT * FROM view_join_request WHERE channel_name = :channelName AND status = 'pending'");
        $stmt->bindParam(':channelName', $channelName);
        $stmt->execute();
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
        if ($requests) {
            foreach ($requests as &$request) {
                $request['profile_picture'] = BASE_URL . $request['profile_picture'];
            }
    
            echo json_encode(["status" => "success", "requests" => $requests]);
        } else {
            echo json_encode(["status" => "success", "requests" => $requests]);
        }
    
        exit;
    
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        exit;
    }
    
}

echo json_encode(["error" => "Invalid request method"]);
exit;
