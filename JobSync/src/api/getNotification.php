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
$applicant_id = $data['applicant_id'] ?? null;

if ($applicant_id === null) {
    echo json_encode(['success' => false, 'error' => 'Applicant ID is required']);
    exit;
}

try {
    $stmt = $conn->prepare("SELECT v.*, c.logo FROM view_applicant_notification v 
    JOIN js_post_jobs j ON v.job_id = j.job_id
    JOIN js_company_info c ON j.employer_id = c.employer_id WHERE applicant_id = :applicant_id ORDER BY created_at DESC");
    $stmt->bindParam(':applicant_id', $applicant_id, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $notification = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($notification as &$notifications) {
            if (isset($notifications['logo']) && !empty($notifications['logo'])) {
                $notifications['logo'] = BASE_URL . $notifications['logo'];
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
