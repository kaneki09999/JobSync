<?php
include 'dbconnect.php';
include 'config.php';

header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['employer_id']) || empty($input['employer_id'])) {
        echo json_encode(['error' => 'Missing employer_id']);
        exit;
    }

    $employer_id = intval($input['employer_id']);
    $query = "SELECT * FROM js_employer_info WHERE employer_id = :employer_id";
    $stmt = $conn->prepare($query);
    $stmt->execute([':employer_id' => $employer_id]);
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
