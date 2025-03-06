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

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "message" => "Invalid request method"]);
    exit();
}

$data = json_decode(file_get_contents('php://input'), true);

$employer_id = $data['employer_id'] ?? null;
$token = $data['token'] ?? null;
$dtiBase64 = $data['dti_document'] ?? null;
$birBase64 = $data['bir_document'] ?? null;
$permitBase64 = $data['business_permit'] ?? null;

if (!$employer_id) {
    echo json_encode(["success" => false, "message" => "Missing employer_id"]);
    exit();
}
$uploads_dir = 'uploads';
if (!is_dir($uploads_dir)) {
    mkdir($uploads_dir, 0755, true);
}

function saveBase64File($base64String, $prefix) {
    global $uploads_dir;

    if (!$base64String) return null; 

    if (strpos($base64String, ',') !== false) {
        list(, $base64String) = explode(',', $base64String);
    }

    $decodedData = base64_decode($base64String);
    if (!$decodedData) return null;  

    $finfo = finfo_open();
    $mimeType = finfo_buffer($finfo, $decodedData, FILEINFO_MIME_TYPE);
    finfo_close($finfo);

    $extensions = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'application/pdf' => 'pdf',
    ];
    $fileExtension = $extensions[$mimeType] ?? 'bin';
    $filePath = $uploads_dir . '/' . $prefix . '_' . uniqid() . '.' . $fileExtension;
    if (!file_put_contents($filePath, $decodedData)) {
        return null; 
    }

    return $filePath;
}

$dtiPath = saveBase64File($data['dti_document'] ?? null, 'dti_certificate');
$birPath = saveBase64File($data['bir_document'] ?? null, 'bir_certificate');
$permitPath = saveBase64File($data['business_permit'] ?? null, 'business_permit');

if (!$dtiPath && !$birPath && !$permitPath) {
    echo json_encode(["success" => false, "error" => "No valid files uploaded"]);
    exit();
}

try { 
    $check_resubmit_token = "SELECT * FROM js_resubmit_tokens WHERE employer_id = :employer_id AND token = :token AND used = 0";
    $stmt_check_token = $conn->prepare($check_resubmit_token);
    $stmt_check_token->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
    $stmt_check_token->bindParam(':token', $token, PDO::PARAM_STR);
    $stmt_check_token->execute();

        if($stmt_check_token ->rowCount() > 0) {
            $update_resubmit_token = "UPDATE js_resubmit_tokens SET used = 1, token = NULL WHERE token = :token";
            $stmt_update = $conn->prepare($update_resubmit_token);
            $stmt_update->bindParam(':token', $token, PDO::PARAM_STR);
            $stmt_update->execute();

            $query = "UPDATE js_employer_info 
            SET 
                dti_document = COALESCE(NULLIF(:dti_document, ''), dti_document), 
                bir_document = COALESCE(NULLIF(:bir_document, ''), bir_document), 
                business_permit = COALESCE(NULLIF(:business_permit, ''), business_permit), 
                account_status = 'Pending' 
            WHERE employer_id = :employer_id";

          $stmt = $conn->prepare($query);
          $stmt->bindParam(':dti_document', $dtiPath, PDO::PARAM_STR);
          $stmt->bindParam(':bir_document', $birPath, PDO::PARAM_STR);
          $stmt->bindParam(':business_permit', $permitPath, PDO::PARAM_STR);
          $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
            
          if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Documents uploaded successfully"]);
            } else {
                echo json_encode(["success" => false, "error" => "Database update failed"]);
            }
        } else {
            echo json_encode(["success" => false, "error" => "This token is already used"]);
        }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
