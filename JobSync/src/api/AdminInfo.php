<?php
include 'dbconnect.php';
include 'config.php';

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Database connection failed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$id = $data['id'] ?? null;

if (!$id) {
    echo json_encode(["success" => false, "error" => "Invalid user ID"]);
    exit;
}

try {
    $sql = "SELECT id, username, email, name FROM js_admin WHERE id = :id";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);  
    $stmt->execute();

    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin) {
        echo json_encode(["success" => true, "admin" => $admin]);
    } else {
        echo json_encode(["success" => false, "error" => "Admin not found"]);
    }
} catch (PDOException $e) {
    error_log('Error occurred: ' . $e->getMessage());
    echo json_encode(["success" => false, "error" => "An error occurred while fetching admin data"]);
}
?>
