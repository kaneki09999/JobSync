<?php
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();

    // Debug incoming parameters

    $query = isset($_GET['query']) ? $_GET['query'] : '';
    $location = isset($_GET['location']) ? $_GET['location'] : '';
    $industry = isset($_GET['industry']) ? $_GET['industry'] : '';
    $jobType = isset($_GET['jobType']) ? $_GET['jobType'] : '';
    $minSalary = isset($_GET['minSalary']) ? (int)$_GET['minSalary'] : 0;
    $maxSalary = isset($_GET['maxSalary']) ? (int)$_GET['maxSalary'] : 0;

    // Initialize params array at the beginning
    $params = [];

    // Base query
    $sql = "SELECT j.*, c.industry FROM active_job_postings j
            JOIN js_founding_info c ON j.employer_id = c.employer_id WHERE 1=1";

    // Apply filters dynamically
    if ($query) {
        $sql .= " AND (j.jobTitle LIKE :query OR j.jobDescription LIKE :query OR j.company_name LIKE :query)";
        $params[':query'] = "%$query%";
    }
    if ($location) {
        $sql .= " AND j.city LIKE :location";
        $params[':location'] = "%$location%";
    }
    if ($industry) {
        $sql .= " AND c.industry = :industry";
        $params[':industry'] = $industry;
    }
    if ($jobType) {
        $sql .= " AND j.jobType = :jobType";
        $params[':jobType'] = $jobType;
    }
    if ($minSalary > 0) {
        $sql .= " AND (j.minSalary >= :minSalary OR j.minSalary IS NULL)";
        $params[':minSalary'] = $minSalary;
    }
    if ($maxSalary > 0) {
        $sql .= " AND (j.maxSalary <= :maxSalary OR j.maxSalary IS NULL)";
        $params[':maxSalary'] = $maxSalary;
    }

    // Prepare the SQL statement
    $stmt = $conn->prepare($sql);

    // Bind parameters
    foreach ($params as $key => &$val) {
        $stmt->bindParam($key, $val, is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }

    $stmt->execute();
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Debug: Save SQL query with replaced parameters
    $debug_sql = $sql;
    foreach ($params as $key => $val) {
        $debug_sql = str_replace($key, "'$val'", $debug_sql);
    }

    // Add base URL to logo path
    foreach ($jobs as &$job) {
        if (isset($job['logo']) && !empty($job['logo'])) {
            $job['logo'] = BASE_URL . $job['logo'];
        }
    
        if (isset($job['banner']) && !empty($job['banner'])) {
            $job['banner'] = BASE_URL . $job['banner'];
        }
    }

    // Send JSON response
    header('Content-Type: application/json');
    echo json_encode($jobs);

} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
} finally {
    $conn = null;
}
?>
