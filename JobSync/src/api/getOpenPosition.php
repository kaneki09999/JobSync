<?php
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect(); 
    $conn = $objDb->connect();   

    if (isset($_GET['company_name'])) {
        $company_name = $_GET['company_name'];  

        $sql = "SELECT * FROM active_job_postings WHERE company_name = :company_name"; 

        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':company_name', $company_name, PDO::PARAM_STR); 
        $stmt->execute();

        $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($jobs as &$job) {
            if (isset($job['logo']) && !empty($job['logo'])) {
                $job['logo'] = BASE_URL . $job['logo'];  
            }
        
            if (isset($job['banner']) && !empty($job['banner'])) {
                $job['banner'] = BASE_URL . $job['banner'];  
            }
        }

        if ($jobs) {
            echo json_encode(['status' => 'success', 'data' => $jobs]);
        } else {
            echo json_encode(['status' => 'success', 'data' => []]); 
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Employer ID is required']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
