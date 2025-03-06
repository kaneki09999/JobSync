<?php
include 'dbconnect.php';
include 'config.php';

header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
    $input = json_decode(file_get_contents('php://input'), true);
    $query = "SELECT * FROM js_employer_info";
    $stmt = $conn->prepare($query);
    $stmt->execute();
    $employers = $stmt->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($employers)) {
        foreach ($employers as &$employer) {
            $employer['document_path'] = BASE_URL . $employer['document_path'];
            $employer['back_side_path'] = BASE_URL . $employer['back_side_path'];
            $employer['face_path'] = BASE_URL . $employer['face_path'];
            $employer['dti_document'] = BASE_URL . $employer['dti_document'];
            $employer['bir_document'] = BASE_URL . $employer['bir_document'];
            $employer['business_permit'] = BASE_URL . $employer['business_permit'];
        }
        echo json_encode(['employers' => $employers]);
    } else {
        echo json_encode(['employers' => []]);
    }
    
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error fetching data: ' . $e->getMessage()]);
}
?>
