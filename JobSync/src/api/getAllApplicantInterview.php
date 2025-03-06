<?php
include 'dbconnect.php';
include 'config.php';
header('Content-Type: application/json');

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();

    $input = json_decode(file_get_contents('php://input'), true);
    $employer_id = $input['employer_id'] ?? null;

    $query = "SELECT a.*, s.schedule, s.time, s.channel_name, s.status, ap.profile_picture, s.created_at 
            FROM view_applications a
            JOIN js_interview_schedule s ON a.application_id = s.application_id
            JOIN js_applicants ap ON a.applicant_id = ap.applicant_id
            WHERE a.employer_id = :employer_id 
            AND s.status IN ('Confirmed', 'Pending', 'Declined', 'Reschedule') 
            ORDER BY s.created_at DESC";
    $stmt = $conn->prepare($query);
    $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $stmt->execute();


    $applications = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($applications as &$application) {
        if (isset($application['profile_picture']) && !empty($application['profile_picture'])) {
            $application['profile_picture'] = BASE_URL . $application['profile_picture'];  
        }
    }
    if ($applications) {
        echo json_encode(['applications' => $applications]);
    } else {
        echo json_encode(['applications' => []]);
    }
} catch (PDOException $e) {
    echo json_encode(['error' => 'Error fetching data: ' . $e->getMessage()]);
}
?>
