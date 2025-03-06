<?php
include 'dbconnect.php';
include 'config.php';

header("Content-Type: application/json");

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(["error" => "Database connection failed: " . $e->getMessage()]));
}

$data = json_decode(file_get_contents("php://input"), true);
$applicant_id = $data['applicant_id'] ?? null;

if (!$applicant_id) {
    echo json_encode(["error" => "Applicant ID is required"]);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT * FROM js_resume_builder WHERE applicant_id = ?");
    $stmt->execute([$applicant_id]);
    $resumeBuilder = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$resumeBuilder) {
        echo json_encode(["error" => "No resume found"]);
        exit;
    }

    $builder_id = $resumeBuilder['builder_id'];

    $stmt = $conn->prepare("SELECT * FROM js_resume_work_experience WHERE builder_id = ?");
    $stmt->execute([$builder_id]);
    $workExperience = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $stmt = $conn->prepare("SELECT * FROM js_resume_skills WHERE builder_id = ?");
    $stmt->execute([$builder_id]);
    $skills = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $profile_picture = $resumeBuilder['profile_picture'] ?? null;
    if ($profile_picture) {
        if (strpos($profile_picture, 'http://') === 0 || strpos($profile_picture, 'https://') === 0) {
            $profile_picture_url = $profile_picture; 
        } else {
            $profile_picture_url = BASE_URL . $profile_picture;  
        }
    } else {
        $profile_picture_url = null; 
    }

    $resumeBuilder['profile_picture_url'] = $profile_picture_url;

    echo json_encode([
        "applicant" => $resumeBuilder,
        "work_experience" => $workExperience,
        "skills" => $skills
    ]);
} catch (PDOException $e) {
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
?>
