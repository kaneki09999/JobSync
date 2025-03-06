<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    $applicant_id = $data['applicant_id'] ?? null;

    if ($applicant_id) {
        try {
            $sql = "UPDATE js_notification n
                    JOIN js_applicant_application_resume a ON n.application_id = a.application_id
                    SET n.countRead = 1
                    WHERE a.applicant_id = ? AND n.countRead = 0";

            $stmt = $conn->prepare($sql);
            $stmt->execute([$applicant_id]);

            if ($stmt->rowCount() > 0) {
                http_response_code(200);
                echo json_encode(['success' => true, 'message' => 'Notifications updated successfully.']);
            } else {
                http_response_code(404);
                echo json_encode(['success' => false, 'message' => 'No notifications to update.']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Query execution failed: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(400); 
        echo json_encode(['success' => false, 'message' => 'Invalid or missing applicant ID.']);
    }
} else {
    http_response_code(405);  
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
