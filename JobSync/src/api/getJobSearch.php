<?php
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 

    $query = isset($_GET['query']) ? $_GET['query'] : '';
    $location = isset($_GET['location']) ? $_GET['location'] : '';

    $sql = "SELECT * FROM active_job_postings WHERE 1=1";

    if ($query) {
        $sql .= " AND (jobTitle LIKE :query OR jobDescription LIKE :query OR company_name LIKE :query)";
    }

    if ($location) {
        $sql .= " AND city LIKE :location";
    }

    $stmt = $conn->prepare($sql);

    if ($query) {
        $searchQuery = "%" . $query . "%";  
        $stmt->bindParam(':query', $searchQuery, PDO::PARAM_STR);
    }
    if ($location) {
        $searchLocation = "%" . $location . "%";  
        $stmt->bindParam(':location', $searchLocation, PDO::PARAM_STR);
    }

    $stmt->execute();

    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    foreach ($jobs as &$job) {
        if (isset($job['logo']) && !empty($job['logo'])) {
            $job['logo'] = BASE_URL . $job['logo'];
        }
    }
 
    echo json_encode($jobs);  

} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()])); 
} finally {
    $conn = null;
}
?>
