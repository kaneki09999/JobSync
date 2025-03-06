<?php
include 'dbconnect.php';
include 'config.php';

header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()])); 
}
    $input = json_decode(file_get_contents('php://input'), true);
    $applicant_id = $_GET['applicant_id'] ?? null;

    $query = "SELECT v.*, c.logo FROM v_job_match_alerts v
              JOIN js_company_info c ON v.employer_id = c.employer_id
              WHERE applicant_id = :applicant_id
              ORDER BY created_at DESC";
    try {
        $stmt = $conn->prepare($query); 
        $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
        $stmt->execute();
        $alertJobs = $stmt->fetchAll(PDO::FETCH_ASSOC); 
        foreach ($alertJobs as &$AlertJob) {
            if (isset($AlertJob['logo']) && !empty($AlertJob['logo'])) {
                $AlertJob['logo'] = BASE_URL . $AlertJob['logo'];  
            }
        }
        echo json_encode($alertJobs);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Failed to fetch favorite jobs: ' . $e->getMessage()]);
    }

?>
