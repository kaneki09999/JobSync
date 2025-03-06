<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $resume_id = $data['resume_id'] ?? null;

    if ($resume_id) {
        try {
            $conn->beginTransaction();
            $resetQuery = "UPDATE js_applicant_resume SET primaryCv = 0";
            $conn->exec($resetQuery);

            $updateQuery = "UPDATE js_applicant_resume SET primaryCv = 1 WHERE resume_id = :resume_id";
            $stmt = $conn->prepare($updateQuery);
            $stmt->bindParam(':resume_id', $resume_id, PDO::PARAM_INT);

            if ($stmt->execute()) {
                $conn->commit();
                echo json_encode(['success' => true]);
            } else {
                $conn->rollBack();
                echo json_encode(['success' => false, 'error' => 'Failed to update primary CV.']);
            }
        } catch (PDOException $e) {
            $conn->rollBack();
            echo json_encode(['success' => false, 'error' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Invalid resume ID.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request method.']);
}
