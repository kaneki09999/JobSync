<?php
include 'dbconnect.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database connection failed']);
    exit();
}

$employer_id = $_GET['employer_id'] ?? null;
$token = $_GET['token'] ?? null;

if (!$employer_id || !$token) {
    echo json_encode(["success" => false, "message" => "Missing employer_id or token"]);
    exit();
}

// Check if the token is valid and not used
$query = "SELECT * FROM js_resubmit_tokens WHERE employer_id = :employer_id AND token = :token AND used = 0";
$stmt = $conn->prepare($query);
$stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
$stmt->bindParam(':token', $token, PDO::PARAM_STR);
$stmt->execute();

if ($stmt->rowCount() === 0) {
    echo json_encode(["success" => false, "message" => "Invalid or used token"]);
    exit();
}

echo json_encode(["success" => true, "message" => "Valid token"]);
exit();
