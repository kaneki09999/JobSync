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

if (isset($_GET['employer_id'])) {
    $employer_id = intval($_GET['employer_id']); 

    $sql = "SELECT COUNT(*) as total FROM view_applications WHERE employer_id = :employer_id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode(["count" => $row ? $row['total'] : 0]);
} else {
    echo json_encode(["error" => "No employer_id provided"]);
}
?>
