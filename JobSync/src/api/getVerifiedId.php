<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['applicant_id'])) {
    $applicant_id = intval($data['applicant_id']);

    try {
        $stmt = $conn->prepare("SELECT * FROM js_applicant_verified_id WHERE applicant_id = :applicant_id");
        $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
        $stmt->execute();
        $verified = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($verified) {
            echo json_encode(['verified' => $verified]);
        } else {
            echo json_encode(['error' => 'Applicant not found.']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Query failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request, applicant_id missing.']);
}

$conn = null; // Close connection
?>
