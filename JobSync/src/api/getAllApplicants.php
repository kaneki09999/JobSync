<?php
include 'dbconnect.php';
include 'config.php';
header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();

    $input = json_decode(file_get_contents('php://input'), true);
    $employer_id = $input['employer_id'] ?? null;

    if (!$employer_id) {
        echo json_encode(['error' => 'Employer ID is required']);
        exit;
    }

    $query = "SELECT v.*, a.profile_picture, ver.account_status 
              FROM view_applications v
              JOIN js_applicants a ON v.applicant_id = a.applicant_id 
              LEFT JOIN js_applicant_verified_id ver ON a.applicant_id = ver.applicant_id
              WHERE v.employer_id = :employer_id ORDER BY v.applied_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $stmt->execute();

    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($applications) {
        foreach ($applications as &$applicant) {
            $profile_picture = $applicant['profile_picture'] ?? null;

            if ($profile_picture) {
                if (strpos($profile_picture, 'http://') === 0 || strpos($profile_picture, 'https://') === 0) {
                    $profile_picture_url = $profile_picture;
                } else {
                    $profile_picture_url =  BASE_URL . ltrim($profile_picture, '/');
                }
            } else {
                $profile_picture_url = null;
            }

            $applicant['profile_picture_url'] = $profile_picture_url;
        }
    }
    echo json_encode(['applications' => $applications]);

} catch (PDOException $e) {
    echo json_encode(['error' => 'Error fetching data: ' . $e->getMessage()]);
}
?>
