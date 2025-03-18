<?php
include 'dbconnect.php';
include 'config.php';

header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()])); 
}

if (isset($_GET['applicant_id'])) {
    $applicant_id = intval($_GET['applicant_id']); 

    $sql = "SELECT COUNT(*) as total FROM applied_jobs WHERE applicant_id = :applicant_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        echo json_encode(["count" => $row['total']]);
    } else {
        echo json_encode(["count" => 0]);
    }
} else {
    echo json_encode(["error" => "No applicant_id provided"]);
}
?>
