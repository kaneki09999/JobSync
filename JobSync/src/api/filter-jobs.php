<?php
include 'dbconnect.php';
include 'config.php';

$objDb = new Dbconnect();
$conn = $objDb->connect();

$data = json_decode(file_get_contents('php://input'), true);

$applicant_id = $data['applicant_id'] ?? '';
$created_at   = $data['created_at'] ?? '';
$work_type    = $data['work_type'] ?? '';
$min_salary   = $data['min_salary'] ?? '';
$max_salary   = $data['max_salary'] ?? '';

$params = [];
$where = [];

// Determine which query to run based on applicant_id
if (!empty($applicant_id)) {
    // Query for specific applicant's matched jobs
    $where[] = "m.applicant_id = :applicant_id";
    $params[':applicant_id'] = $applicant_id;

    if (!empty($created_at)) {
        $where[] = "j.job_created_at >= :created_at";
        $params[':created_at'] = $created_at;   
    }

    if (!empty($work_type)) {
        $where[] = "j.jobType = :work_type";
        $params[':work_type'] = $work_type;
    }

    if (!empty($min_salary)) {
        $where[] = "j.minSalary >= :min_salary";
        $params[':min_salary'] = $min_salary;
    }

    if (!empty($max_salary)) {
        $where[] = "j.maxSalary <= :max_salary";
        $params[':max_salary'] = $max_salary;
    }

    $whereSQL = 'WHERE ' . implode(' AND ', $where);

    $sql = "
        SELECT m.*, j.* 
        FROM js_job_applicant_matches m
        JOIN active_job_postings j ON m.job_id = j.job_id 
        $whereSQL
        ORDER BY j.job_created_at DESC
    ";

} else {
    // Query for general job search from active_job_postings only
    if (!empty($created_at)) {
        $where[] = "job_created_at >= :created_at";
        $params[':created_at'] = $created_at;   
    }

    if (!empty($work_type)) {
        $where[] = "jobType = :work_type";
        $params[':work_type'] = $work_type;
    }

    if (!empty($min_salary)) {
        $where[] = "minSalary >= :min_salary";
        $params[':min_salary'] = $min_salary;
    }

    if (!empty($max_salary)) {
        $where[] = "maxSalary <= :max_salary";
        $params[':max_salary'] = $max_salary;
    }

    $whereSQL = '';
    if (!empty($where)) {
        $whereSQL = 'WHERE ' . implode(' AND ', $where);
    }

    $sql = "
        SELECT * 
        FROM active_job_postings
        $whereSQL
        ORDER BY job_created_at DESC
    ";
}

try {
    $stmt = $conn->prepare($sql);
    $stmt->execute($params);
    $jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($jobs as &$job) {
        if (isset($job['logo']) && !empty($job['logo'])) {
            $job['logo'] = BASE_URL . $job['logo'];  
        }
        if (isset($job['banner']) && !empty($job['banner'])) {
            $job['banner'] = BASE_URL . $job['banner'];  
        }
    }

    echo json_encode($jobs);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
