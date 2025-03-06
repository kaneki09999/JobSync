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
$interview_id = $data['interview_id'] ?? null;

if ($interview_id === null) {
    echo json_encode(['error' => 'interview_id is required']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT i.*, s.banner, s.messages FROM `js_interview_schedule` i 
    JOIN js_interview_status s ON i.interview_id = s.interview_id WHERE i.interview_id = :interview_id");
    $stmt->bindParam(':interview_id', $interview_id, PDO::PARAM_INT);   
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $interviewStatus = $stmt->fetch(PDO::FETCH_ASSOC);
        $interviewStatus['banner'] = BASE_URL . $interviewStatus['banner'];
        echo json_encode(['interviewStatus' => $interviewStatus]);
    } else {
        echo json_encode(['error' => 'No company information found for the given interview_id']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Query execution failed: ' . $e->getMessage()]);
}

$conn = null;
?>
