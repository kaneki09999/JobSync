<?php
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();

    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    $application_id = $input['application_id'] ?? null;

    if (!$application_id) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid input: application_id is required.',
        ]);
        exit;
    }

    // SQL Query to fetch assessment data
    $sql = "SELECT 
                assessment.type AS Type,
                assessment.instructions AS Instructions,
                answer.answer AS Answer
            FROM js_assessment AS assessment
            LEFT JOIN js_assessment_answer AS answer 
            USING(assessment_id)
            WHERE assessment.application_id = :application_id";

    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
    $stmt->execute();
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["answer" => $results]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $e->getMessage(),
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => 'An error occurred: ' . $e->getMessage(),
    ]);
}
?>
