<?php
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 

    $applicant_id = isset($_GET['applicant_id']) ? $_GET['applicant_id'] : null;
    
    $sql = "
        SELECT js_skills.*, js_work_experience.*
        FROM js_skills
        LEFT JOIN js_work_experience ON js_skills.applicant_id = js_work_experience.applicant_id
    ";
    
    if ($applicant_id) {
        $sql .= " WHERE js_skills.applicant_id = :applicant_id";
    }

    $stmt = $conn->prepare($sql);

    if ($applicant_id) {
        $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
    }

    $stmt->execute();

    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["results" => $results]); 

} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
} finally {
    $conn = null;
}
?>
