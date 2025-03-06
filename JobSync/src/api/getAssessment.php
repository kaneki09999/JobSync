<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()])); 
}

$job_id = isset($_GET['job_id']) ? intval($_GET['job_id']) : null;
$application_id = isset($_GET['application_id']) ? intval($_GET['application_id']) : null;

if (!$job_id || !$application_id) {
    echo json_encode(["error" => "Missing required parameters: job_id or application_id"]);
    exit();
}

try {
    $sql = "SELECT * FROM js_assessment WHERE job_id = :job_id AND application_id = :application_id";
    $stmt = $conn->prepare($sql);

    $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
    $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);

    $stmt->execute();

    $assessments = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($assessments)) {
        echo json_encode(["assessment" => $assessments]);
    } else {
        echo json_encode(["error" => "No assessments found"]);
    }
} catch (PDOException $e) {
    echo json_encode(["error" => "An error occurred while fetching assessments: " . $e->getMessage()]);
}
?>
