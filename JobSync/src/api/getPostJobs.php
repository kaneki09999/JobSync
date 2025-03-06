<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$data = json_decode(file_get_contents('php://input'), true);
$employer_id = $data['employer_id'] ?? null;

if ($employer_id === null) {
    echo json_encode(['error' => 'Employer ID is required']);
    exit;
}

try {
    // Update job status if necessary
    $updateStmt = $conn->prepare("
        UPDATE js_post_jobs
        SET status = 'Expired', expirationDate = IF(expirationDate < NOW(), expirationDate, NOW())
        WHERE employer_id = :employer_id AND expirationDate < NOW()
    ");
    $updateStmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $updateStmt->execute();

    // Fetch job information along with applicant counts
    $stmt = $conn->prepare("
        SELECT 
            j.*, 
            GREATEST(DATEDIFF(j.expirationDate, NOW()), 0) AS remainingDays,
            IF(DATEDIFF(NOW(), j.created_at) <= 30, 1, 0) AS recent,
            IFNULL(v.applicant_count, 0) AS applicant_count
        FROM 
            js_post_jobs j
        LEFT JOIN 
            view_applicant_count v 
        ON 
            j.job_id = v.job_id
        WHERE 
            j.employer_id = :employer_id
        ORDER BY 
            CASE
                WHEN j.status = 'Expired' THEN 1
                ELSE 0
            END,
            j.expirationDate ASC, 
            j.created_at DESC
    ");
    $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $stmt->execute();

    $jobsInfo = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($jobsInfo) {
        echo json_encode(['jobs' => $jobsInfo]);
    } else {
        echo json_encode(['error' => 'No jobs found for the given employer ID']);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Query execution failed: ' . $e->getMessage()]);
}

$conn = null;
?>
