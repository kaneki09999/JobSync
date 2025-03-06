<?php
include 'dbconnect.php';
include 'config.php';

header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
    $input = json_decode(file_get_contents('php://input'), true);
    $query = "SELECT * FROM applicant_details";
    $stmt = $conn->prepare($query);
    $stmt->execute();

    $applicants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($applicants) {
        foreach ($applicants as &$applicant) {
            $profile_picture = $applicant['profile_picture'];

            if ($profile_picture && (strpos($profile_picture, 'http://') === 0 || strpos($profile_picture, 'https://') === 0)) {
                $profile_picture_url = $profile_picture;
            } else {
                $profile_picture_url = $profile_picture ? BASE_URL . $profile_picture : null;
            }
            $applicant['profile_picture_url'] = $profile_picture_url;
        }
        echo json_encode(['applicants' => $applicants,
                          'profile_picture_url' => $profile_picture_url
                        ]);
    } else {
        echo json_encode(['applicants' => []]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error fetching data: ' . $e->getMessage()]);
}
?>
