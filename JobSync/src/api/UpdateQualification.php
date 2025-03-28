<?php
include 'dbconnect.php';
include 'config.php';  

header("Content-Type: application/json");

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()])); 
}

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['id'], $data['applicant_id'], $data['qualificationType'])) {
    echo json_encode(["status" => "error", "message" => "Missing required fields"]);
    exit;
}

$id = $data['id'];
$applicant_id = $data['applicant_id'];
$qualificationType = $data['qualificationType'];
$updateFields = [];

switch ($qualificationType) {
    case "skills":
        $table = "js_skills";
        $updateFields = ["skill_name" => $data['skill_name'] ?? null, "years" => $data['years'] ?? null];
        break;
    case "workExperience":
        $table = "js_work_experience";
        $updateFields = ["job_title" => $data['job_title'] ?? null, "years" => $data['years'] ?? null];
        break;
    case "certifications":
        $table = "js_certifications";
        $updateFields = ["certification_name" => $data['certification_name'] ?? null];
        break;
    case "education":
        $table = "js_education";
        $updateFields = ["degree" => $data['degree'] ?? null, "fieldOfStudy" => $data['fieldOfStudy'] ?? null];
        break;
    case "languages":
        $table = "js_languages";
        $updateFields = ["language" => $data['language'] ?? null, "proficiency" => $data['proficiency'] ?? null];
        break;
    default:
        echo json_encode(["status" => "error", "message" => "Invalid qualification type"]);
        exit;
}

$updateFields = array_filter($updateFields, fn($value) => !is_null($value));
if (empty($updateFields)) {
    echo json_encode(["status" => "error", "message" => "No fields to update"]);
    exit;
}

// Check if record exists
$checkSql = "SELECT COUNT(*) FROM $table WHERE id = :id AND applicant_id = :applicant_id";
$checkStmt = $conn->prepare($checkSql);
$checkStmt->execute([":id" => $id, ":applicant_id" => $applicant_id]);
$exists = $checkStmt->fetchColumn();

if (!$exists) {
    echo json_encode(["status" => "error", "message" => "Record not found"]);
    exit;
}

try {
    $setClause = implode(", ", array_map(fn($k) => "$k = :$k", array_keys($updateFields)));
    $sql = "UPDATE $table SET $setClause WHERE id = :id AND applicant_id = :applicant_id";
    $stmt = $conn->prepare($sql);

    foreach ($updateFields as $field => $value) {
        $stmt->bindValue(":$field", $value);
    }
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->bindValue(":applicant_id", $applicant_id, PDO::PARAM_INT);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Record updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update record"]);
    }
} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => "Query Error: " . $e->getMessage()]);
}
?>
