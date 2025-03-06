<?php
include 'dbconnect.php';
include 'config.php';  

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'error' => 'Database connection failed: ' . $e->getMessage()])); 
}

$data = json_decode(file_get_contents('php://input'), true);
$employer_id = $data['employer_id'] ?? null;

if ($employer_id === null) {
    echo json_encode(['success' => false, 'error' => 'Applicant ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT n.*, a.applicant_id FROM view_employer_notification n
    JOIN js_applicant_application_resume r ON n.application_id = r.application_id
    JOIN js_applicants a ON r.applicant_id = a.applicant_id WHERE employer_id = :employer_id ORDER BY created_at DESC");
    $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $notification = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($notification as &$notifications) {
            if (isset($notifications['profile_picture']) && !empty($notifications['profile_picture'])) {
                $notifications['profile_picture'] = BASE_URL . $notifications['profile_picture'];
            }
        }

        echo json_encode(['success' => true, 'notification' => $notification]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No unread notifications found for the given applicant id']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'error' => 'Query execution failed: ' . $e->getMessage()]);
}

$conn = null;
?>
