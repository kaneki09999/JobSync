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

if ($job_id === null) {
    echo json_encode(['error' => 'Employer ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT e.email, c.*, j.* FROM js_company_info c
    JOIN js_post_jobs j ON c.employer_id = j.employer_id
    JOIN js_employer_info e ON c.employer_id = e.employer_id WHERE job_id = :job_id");
    $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $companyname = $stmt->fetch(PDO::FETCH_ASSOC);
        $companyname['logo'] = BASE_URL . $companyname['logo'];
        echo json_encode(['companyname' => $companyname]);
    } else {
        echo json_encode(['error' => 'No company information found for the given employer ID']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Query execution failed: ' . $e->getMessage()]);
}

$conn = null;
?>
