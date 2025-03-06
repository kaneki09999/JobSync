<?php
include 'dbconnect.php';

header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();

    $input = json_decode(file_get_contents('php://input'), true);
    $employer_id = $input['employer_id'] ?? null;

    $query = "SELECT * FROM view_applications WHERE employer_id = :employer_id";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $stmt->execute();

    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if ($applications) {
        echo json_encode(['applications' => $applications]);
    } else {
        echo json_encode(['applications' => []]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error fetching data: ' . $e->getMessage()]);
}
?>
