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

$channel = $data['channel'] ?? null;
$uid = $data['application_id'] ?? null;
$job_id = $data['job_id'] ?? null;

if (!$uid || !$job_id) {
    echo json_encode([
        'error' => 'application_id and job_id are required',
        'received' => $data
    ]);
    exit;
}

try {
    $stmt = $conn->prepare("
        SELECT status, channel_name 
        FROM js_join_request 
        WHERE application_id = :application_id 
          AND job_id = :job_id
    ");
    $stmt->bindParam(':application_id', $uid, PDO::PARAM_INT);
    $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode([
            'status' => $row['status'],
            'channel_name' => $row['channel_name']
        ]);
    } else {
        echo json_encode(['error' => 'No matching join request found for the given application_id and job_id']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Query execution failed: ' . $e->getMessage()]);
}

$conn = null;
?>
