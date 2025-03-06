<?php
include 'dbconnect.php';

header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();

    $input = json_decode(file_get_contents('php://input'), true);
    $applicant_id = $input['applicant_id'] ?? null;

    $query = "SELECT applicant_id, coverLetter FROM js_applicant_application_resume WHERE applicant_id = :applicant_id AND coverLetter IS NOT NULL 
    AND coverLetter <> ''";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
    $stmt->execute();

    $cover = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($cover) {
        echo json_encode(['cover' => $cover]);
    } else {
        echo json_encode(['jobs' => []]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error fetching data: ' . $e->getMessage()]);
}
?>
