<?php
include 'dbconnect.php';
include 'config.php';
try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    error_log("Received parameters: " . json_encode($_GET));

    $job_id = $_GET['job_id'] ?? null;

    if ($job_id) {
        try {
            $stmt = $conn->prepare("SELECT * FROM js_saved_assessment WHERE job_id = :job_id");
            $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
            $stmt->execute();

            $savedAssessments = $stmt->fetchAll(PDO::FETCH_ASSOC);
                foreach ($savedAssessments as &$assessment) {
                    if (isset($assessment['image']) && !empty($assessment['image'])) {
                        $assessment['image'] = BASE_URL . $assessment['image'];  
                    }
                }


            echo json_encode(['saveAssessments' => $savedAssessments]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid job ID.']);
    }
}
?>
