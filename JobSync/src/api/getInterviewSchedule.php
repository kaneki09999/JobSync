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
$job_id = $data['job_id'] ?? null;
$application_id = $data['application_id'] ?? null;

if ($job_id === null) {
    echo json_encode(['error' => 'Employer ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT i.*, a.firstname, a.middlename, a.lastname, a.email, a.profile_picture FROM js_interview_schedule i
    JOIN js_applicant_application_resume res ON i.application_id = res.application_id
    JOIN js_applicants a ON res.applicant_id = a.applicant_id WHERE i.job_id = :job_id AND i.application_id = :application_id");
    $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
    $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $interview = $stmt->fetch(PDO::FETCH_ASSOC);
        $interview['profile_picture'] = BASE_URL . $interview['profile_picture'];
        echo json_encode(['interview' => $interview]);
    } else {
        echo json_encode(['error' => 'No company information found for the given employer ID']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Query execution failed: ' . $e->getMessage()]);
}

$conn = null;
?>
