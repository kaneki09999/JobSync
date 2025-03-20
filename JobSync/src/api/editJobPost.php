<?php 
include 'dbconnect.php';

$objDb = new Dbconnect();
$conn = $objDb->connect();

try {
    // Read and decode JSON input
    $input = json_decode(file_get_contents("php://input"), true);
    $employerId = $input['employer_id']; 

    // You might also process screeningQuestions and qualificationMessage if needed.

    $conn->beginTransaction();

    // Prepare the selectedBenefits string.
    // It can be either an array or already a string.
    $selectedBenefits = isset($input['selectedBenefits']) 
        ? (is_array($input['selectedBenefits']) ? implode(',', $input['selectedBenefits']) : $input['selectedBenefits'])
        : null;

    $stmt = $conn->prepare("UPDATE js_post_jobs SET 
        employer_id = :employer_id, 
        jobTitle = :jobTitle, 
        jobTags = :jobTags, 
        jobRole = :jobRole, 
        minSalary = :minSalary, 
        maxSalary = :maxSalary, 
        salaryType = :salaryType, 
        education = :education, 
        experience = :experience, 
        jobType = :jobType, 
        expirationDate = :expirationDate, 
        jobLevel = :jobLevel, 
        address = :address, 
        city = :city, 
        selectedBenefits = :selectedBenefits, 
        jobDescription = :jobDescription 
        WHERE job_id = :job_id");

    $stmt->bindParam(':employer_id', $employerId); 
    $stmt->bindParam(':jobTitle', $input['jobTitle']);
    $stmt->bindParam(':jobTags', $input['jobTags']);
    $stmt->bindParam(':jobRole', $input['jobRole']);
    $stmt->bindParam(':minSalary', $input['minSalary']);
    $stmt->bindParam(':maxSalary', $input['maxSalary']);
    $stmt->bindParam(':salaryType', $input['salaryType']);
    $stmt->bindParam(':education', $input['education']);
    $stmt->bindParam(':experience', $input['experience']);
    $stmt->bindParam(':jobType', $input['jobType']);
    $stmt->bindParam(':expirationDate', $input['expirationDate']);
    $stmt->bindParam(':jobLevel', $input['jobLevel']);
    $stmt->bindParam(':address', $input['address']);
    $stmt->bindParam(':city', $input['city']);
    $stmt->bindParam(':selectedBenefits', $selectedBenefits);
    $stmt->bindParam(':jobDescription', $input['jobDescription']);
    $stmt->bindParam(':job_id', $input['job_id']);

    $stmt->execute();

    $conn->commit();

    echo json_encode(["message" => "Job post updated successfully."]);
} catch (Exception $e) {
    $conn->rollBack();
    echo json_encode(["error" => $e->getMessage()]);
}