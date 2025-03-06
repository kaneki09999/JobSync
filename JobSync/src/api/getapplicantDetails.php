<?php
include 'dbconnect.php';
include 'config.php';

header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
    $input = json_decode(file_get_contents('php://input'), true);
    $applicant_id = $input['applicant_id'] ?? null;

    $query = "SELECT a.* ,soc.facebook_icon, soc.instagram_icon, soc.youtube_icon, soc.twitter_icon, 
    soc.tiktok_icon, soc.dribble_icon, soc.github_icon, soc.reddit_icon, soc.freelancer_icon 
    FROM applicant_details a
    JOIN js_applicant_socialmedia soc ON a.applicant_id = soc.applicant_id
    WHERE a.applicant_id = :applicant_id
    ";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
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
