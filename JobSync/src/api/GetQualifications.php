<?php
include 'dbconnect.php';
include 'config.php';  

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['applicant_id'])) {
    $applicant_id = $_GET['applicant_id'];
    
    $tables = [
        "workExperience" => "js_work_experience",
        "education" => "js_education",
        "skills" => "js_skills",
        "licenses" => "js_licenses",
        "certifications" => "js_certifications",
        "languages" => "js_languages"
    ];

    $response = [];

    foreach ($tables as $key => $table) {
        $query = "SELECT * FROM $table WHERE applicant_id = :applicant_id";
        $stmt = $conn->prepare($query);
        $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
        $stmt->execute();
        $response[$key] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    echo json_encode(["status" => "success", "qualifications" => $response]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request or missing applicant_id"]);
}
?>
