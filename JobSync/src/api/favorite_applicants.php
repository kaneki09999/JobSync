<?php
include 'dbconnect.php';
include 'config.php'; 

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();  
} catch (PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()])); 
}

try {
    $stmt = $conn->query("
        SELECT a.firstname, a.lastname, a.middlename, a.suffix, a.gender, a.contact, a.profile_picture, a.email, p.* 
        FROM js_applicants a
        JOIN js_personal_info p ON a.applicant_id = p.applicant_id
        JOIN js_favorite_applicants f ON a.applicant_id = f.applicant_id
        JOIN js_employer_info e ON f.employer_id = e.employer_id
    ");
    
    $applicants = $stmt->fetchAll(PDO::FETCH_ASSOC);


    foreach ($applicants as &$applicant) {
        if (isset($applicant['profile_picture']) && !empty($applicant['profile_picture'])) {
            $applicant['profile_picture'] = BASE_URL . $applicant['profile_picture'];
        }
    }

    echo json_encode($applicants);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
