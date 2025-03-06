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
    // Retrieve GET parameters
    $channelName = $_GET['channelName'] ?? '';
    $application_id = $_GET['application_id'] ?? '';
    $job_id = $_GET['job_id'] ?? '';

    // Validate required parameters
    if (!$channelName || !$application_id || !$job_id) {
        echo json_encode([
            "error" => "Missing required parameters. Ensure 'channelName', 'application_id', and 'job_id' are provided."
        ]);
        exit;
    }

    try {
        $stmt = $conn->prepare("
            SELECT * 
            FROM view_join_request 
            WHERE channel_name = :channelName 
            AND application_id = :application_id 
            AND job_id = :job_id
        ");
        $stmt->bindParam(':channelName', $channelName);
        $stmt->bindParam(':application_id', $application_id, PDO::PARAM_INT);
        $stmt->bindParam(':job_id', $job_id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

            // Add BASE_URL to 'profile_picture' field for each record
            foreach ($requests as &$request) {
                if (isset($request['profile_picture']) && !empty($request['profile_picture'])) {
                    $request['profile_picture'] = BASE_URL . $request['profile_picture'];
                }
            }
            echo json_encode(['status'=> "success", 'requests' => $requests]);
        } else {
            echo json_encode(['status'=> "success", 'error' => 'No company information found for the given employer ID']);
        }

        exit;

    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        exit;
    }
}

// If the request method is not GET
echo json_encode(["error" => "Invalid request method"]);
exit;
