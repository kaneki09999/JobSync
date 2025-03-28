<?php
include 'dbconnect.php';
include 'config.php';  

header("Content-Type: application/json");

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$id = $data['id'] ?? null;
$qualificationType = $data['qualificationType'] ?? null;
$applicant_id = $data['applicant_id'] ?? null;

if (!$id || !$qualificationType || !$applicant_id) {
    echo json_encode(["status" => "error", "message" => "Missing parameters"]);
    exit;
}

// Map qualification types to database tables
$tableMap = [
    "skills" => "js_skills",
    "workExperience" => "js_work_experience",
    "education" => "js_education",
    "certifications" => "js_certifications",
    "languages" => "js_languages"
];

if (!isset($tableMap[$qualificationType])) {
    echo json_encode(["status" => "error", "message" => "Invalid qualification type"]);
    exit;
}

$tableName = $tableMap[$qualificationType];

try {
    $sql = "DELETE FROM $tableName WHERE id = :id AND applicant_id = :applicant_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete record"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
