<?php
session_start();  
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}
$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['username']) || !isset($data['password'])) {
    echo json_encode(["success" => false, "message" => "Invalid request"]);
    exit;
}

$username = $data['username'];
$password = $data['password'];

try {
    $sql = "SELECT id, password FROM js_admin WHERE username = :username";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['id'] = $user['id'];

        echo json_encode(["success" => true, "id" => $user['id']]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid credentials"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Query error: " . $e->getMessage()]);
}
?>
