<?php
include 'dbconnect.php';
include 'config.php'; 

header('Content-Type: application/json');
try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();  
} catch (PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()])); 
}

$employer_id = isset($_GET['employer_id']) ? $_GET['employer_id'] : (isset($_POST['employer_id']) ? $_POST['employer_id'] : null);

if (!$employer_id) {
    echo json_encode(['status' => 'error', 'message' => 'Missing employer_id']);
    exit;
}
try {
    $stmt = $conn->prepare("
        SELECT a.firstname, a.lastname, a.middlename, a.suffix, a.gender, a.contact, a.profile_picture, a.email, p.*, v.account_status, f.employer_id
        FROM js_applicants a
        JOIN js_personal_info p ON a.applicant_id = p.applicant_id
        JOIN js_favorite_applicants f ON a.applicant_id = f.applicant_id
        JOIN js_employer_info e ON f.employer_id = e.employer_id
        LEFT JOIN js_applicant_verified_id v ON a.applicant_id = v.applicant_id
        WHERE f.employer_id = :employer_id
    ");

    $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $stmt->execute();
    $applicants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Append full profile picture URL
    foreach ($applicants as &$applicant) {
        if (!empty($applicant['profile_picture'])) {
            $applicant['profile_picture'] = BASE_URL . $applicant['profile_picture'];
        }
    }

    echo json_encode($applicants);
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
?>
