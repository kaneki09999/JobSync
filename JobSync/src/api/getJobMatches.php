<?php
include 'dbconnect.php';
include 'config.php';  

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()])); 
}

$data = json_decode(file_get_contents('php://input'), true);
$applicant_id = $data['applicant_id'] ?? null;

try {
    $stmt = $conn->prepare("SELECT m.*, j.* 
    FROM `js_job_applicant_matches` m
    JOIN active_job_postings j ON m.job_id = j.job_id 
    WHERE m.applicant_id = :applicant_id ORDER BY match_score DESC");
    $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $matchjob = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($matchjob as &$matchjobs) {
            if (isset($matchjobs['logo']) && !empty($matchjobs['logo'])) {
                $matchjobs['logo'] = BASE_URL . $matchjobs['logo'];
            }
            if (isset($matchjobs['banner']) && !empty($matchjobs['banner'])) {
                $matchjobs['banner'] = BASE_URL . $matchjobs['banner'];
            }
        }

        echo json_encode(['success' => true, 'matchjob' => $matchjob]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No unread notifications found for the given applicant id']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Query execution failed: ' . $e->getMessage()]);
}

$conn = null;