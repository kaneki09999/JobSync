<?php 
if (php_sapi_name() !== 'cli') { 
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE, PUT");
    header("Access-Control-Allow-Headers: Content-Type, Authorization, X-API-KEY, X-Requested-With");
    header('Content-Type: application/json');
    header("Access-Control-Allow-Origin: http://localhost:5173");
    header("Access-Control-Allow-Credentials: true");

    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit;
    }
}

// Database connection class
class Dbconnect {
    private $server = 'localhost';
    private $dbname = 'db_jobsync';
    private $user = 'root';
    private $pass = '';
    
    public function connect() {
        try {
            $conn = new PDO('mysql:host=' . $this->server . ';dbname=' . $this->dbname, $this->user, $this->pass);
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (\PDOException $e) {
            error_log("Database Error: " . $e->getMessage());
            echo json_encode(["error" => "Database connection error."]);
            http_response_code(500); 
            exit; 
        }
    }
}
