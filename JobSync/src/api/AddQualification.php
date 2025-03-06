<?php
include 'dbconnect.php';
include 'config.php';  

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()])); 
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['qualificationType']) || empty($data['qualificationType'])) {
        echo json_encode(["status" => "error", "message" => "Qualification type is required."]);
        exit;
    }

    $applicant_id = $data['applicant_id'];
    $qualificationType = $data['qualificationType'];

    switch ($qualificationType) {
        case 'skills':
            if (isset($data['skillName']) && isset($data['yearsOfExperience'])) {
                $skillName = $conn->quote($data['skillName']);
                $applicant_id = $conn->quote($data['applicant_id']);
                $yearsOfExperience = $conn->quote($data['yearsOfExperience']);
                $query = "INSERT INTO js_skills (applicant_id, skill_name, years) VALUES ($applicant_id, $skillName, $yearsOfExperience)";
            } else {
                echo json_encode(["status" => "error", "message" => "Skill name and years of experience are required."]);
                exit;
            }
            break;

        case 'workExperience':
            if (isset($data['jobTitle']) && isset($data['yearsOfExperience'])) {
                $applicant_id = $conn->quote($data['applicant_id']);
                $jobTitle = $conn->quote($data['jobTitle']);
                $yearsOfExperience = $conn->quote($data['yearsOfExperience']);
                $query = "INSERT INTO js_work_experience (applicant_id, job_title, years) VALUES ($applicant_id, $jobTitle, $yearsOfExperience)";
            } else {
                echo json_encode(["status" => "error", "message" => "Job title and years of experience are required."]);
                exit;
            }
            break;

        case 'education':
            if (isset($data['degree']) && isset($data['fieldOfStudy'])) {
                $applicant_id = $conn->quote($data['applicant_id']);
                $degree = $conn->quote($data['degree']);
                $fieldOfStudy = $conn->quote($data['fieldOfStudy']);
                $query = "INSERT INTO js_education (applicant_id, degree, field_of_study) VALUES ($applicant_id, $degree, $fieldOfStudy)";
            } else {
                echo json_encode(["status" => "error", "message" => "Degree and field of study are required."]);
                exit;
            }
            break;

        case 'licenses':
            if (isset($data['licenseName'])) {
                $applicant_id = $conn->quote($data['applicant_id']);
                $licenseName = $conn->quote($data['licenseName']);
                $query = "INSERT INTO js_licenses (applicant_id, license_name) VALUES ($applicant_id, $licenseName)";
            } else {
                echo json_encode(["status" => "error", "message" => "License name is required."]);
                exit;
            }
            break;

        case 'certifications':
            if (isset($data['certificationName'])) {
                $applicant_id = $conn->quote($data['applicant_id']);
                $certificationName = $conn->quote($data['certificationName']);
                $query = "INSERT INTO js_certifications (applicant_id, certification_name) VALUES ($applicant_id, $certificationName)";
            } else {
                echo json_encode(["status" => "error", "message" => "Certification name is required."]);
                exit;
            }
            break;

        case 'languages':
            if (isset($data['language']) && isset($data['proficiency'])) {
                $applicant_id = $conn->quote($data['applicant_id']);
                $language = $conn->quote($data['language']);
                $proficiency = $conn->quote($data['proficiency']);
                $query = "INSERT INTO js_languages (applicant_id, language, proficiency) VALUES ($applicant_id, $language, $proficiency)";
            } else {
                echo json_encode(["status" => "error", "message" => "Language and proficiency are required."]);
                exit;
            }
            break;

        default:
            echo json_encode(["status" => "error", "message" => "Invalid qualification type."]);
            exit;
    }

    try {
        // Prepare and execute the query
        $stmt = $conn->prepare($query);
        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "Data saved successfully."]);
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error saving data: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
}
?>
