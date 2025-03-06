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
$employer_id = $data['employer_id'] ?? null;
$application_id = $data['application_id'] ?? null;
$job_id = $data['job_id'] ?? null;

if ($employer_id === null) {
    echo json_encode(['error' => 'Employer ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM js_interview_schedule WHERE employer_id = :employer_id AND application_id = :application_id AND job_id = :job_id");
    $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
    $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $channelname = $stmt->fetch(PDO::FETCH_ASSOC);
        echo json_encode(['channelname' => $channelname]);
    } else {
        echo json_encode(['error' => 'No channel name found for the given employer ID']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Query execution failed: ' . $e->getMessage()]);
}

$conn = null;
?>
