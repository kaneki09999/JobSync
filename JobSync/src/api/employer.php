<?php
include 'dbconnect.php';
include 'config.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$objDb = new Dbconnect();
$conn = $objDb->connect();
$logo = BASE_URL . 'uploads/logo3.png';

// Decode incoming JSON payload
$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields (removed document, face, backSideId validations)
if (
    !isset($data['dti_certificate'], $data['bir_certificate'], $data['business_permit'],
           $data['email'], $data['lastName'], $data['password'])
) {
    echo json_encode(['error' => 'Missing required fields']);
    exit;
}

$uploads_dir = 'uploads';
if (!is_dir($uploads_dir)) {
    mkdir($uploads_dir, 0755, true);
}

function getFileExtension($mimeType) {
    $extensions = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'application/pdf' => 'pdf',
    ];
    return isset($extensions[$mimeType]) ? $extensions[$mimeType] : 'bin';
}

function saveFile($base64String, $prefix) {
    global $uploads_dir;
    
    if (str_contains($base64String, ';base64,')) {
        $parts = explode(';base64,', $base64String);
        // Remove "data:" prefix from MIME part
        $mimeType = str_replace('data:', '', $parts[0]);
        $base64Data = $parts[1];
    } else {
        $base64Data = $base64String;
    }
    
    $decodedFile = base64_decode($base64Data, true);
    if (!$decodedFile) {
        return false;
    }
    
    // Detect MIME type after decoding
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mimeType = $finfo->buffer($decodedFile);
    
    $allowedTypes = [
        'image/jpeg' => 'jpg',
        'image/png' => 'png',
        'application/pdf' => 'pdf'
    ];
    
    if (!isset($allowedTypes[$mimeType])) {
        return false; // Unsupported file type
    }
    
    $extension = $allowedTypes[$mimeType];
    $filePath = "$uploads_dir/{$prefix}_" . uniqid() . ".$extension";
    
    if (file_put_contents($filePath, $decodedFile)) {
        return $filePath;
    }
    
    return false;
}

// Save the three required documents
$dti_document_filename = saveFile($data['dti_certificate'], 'dti');
$bir_document_filename = saveFile($data['bir_certificate'], 'bir');
$business_permit_filename = saveFile($data['business_permit'], 'permit');

if (!$dti_document_filename || !$bir_document_filename || !$business_permit_filename) {
    echo json_encode(['error' => 'Failed to save one or more documents']);
    exit;
}

// Since we're no longer scanning additional images via an external API,
// set the decision to 'accept'
$decision = 'accept';

$email = $data['email'];
$lastname = $data['lastName'];
$type = $data['type'];

try {
    if ($decision === 'reject') {
        echo json_encode([
            'error' => 'Your ID verification has been rejected.'
        ]);
        exit;
    } elseif ($decision === 'Unknown') {
        echo json_encode([
            'error' => 'The ID verification decision is unknown. Please contact support.'
        ]);
        exit;
    } elseif ($decision === 'accept') {
        echo json_encode([
            'decision' => 'accept'
        ]);

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $_ENV['SMTP_HOST'];
        $mail->SMTPAuth = true;
        $mail->Username = $_ENV['SMTP_USER'];
        $mail->Password = $_ENV['SMTP_PASS'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = $_ENV['SMTP_PORT'];
        
        $mail->setFrom($_ENV['SMTP_FROM_EMAIL'], $_ENV['SMTP_FROM_NAME']);
        $mail->addAddress($email, $lastname);
        $mail->isHTML(true);
        
        $verification_code = substr(number_format(time() * rand(), 0, '', ''), 0, 6);
        
        $mail->Subject = 'Email Verification for ' . ucfirst($type) . ' Registration';
        $mail->Body = '<div style="display: flex; justify-content: center; align-items: center; min-height: 50vh; background-color: #f4f4f4; padding: 20px;">
            <div style="max-width: 500px; width: 100%; background: #fff; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); text-align: center; padding: 30px; border-top: 5px solid #007bff;">
                <img src="' . $logo . '" style="max-width: 100px; margin-bottom: 10px;" alt="JobSync Logo">
                <p style="font-size: 18px; color: #333; margin-bottom: 10px;">Dear <strong>' . ucfirst($type) . '</strong>,</p>
                <p style="font-size: 16px; color: #555;">Your Verification Code is:</p>
                <p style="font-size: 40px; font-weight: bold; color: #007bff; margin: 10px 0;">' . $verification_code . '</p>
                <p style="font-size: 16px; color: #555;">Please use this code to complete your registration.</p>
                <p style="font-size: 14px; color: #777; margin-top: 20px;">If you did not request this, please ignore this message.</p>
                <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                <p style="font-size: 14px; color: #555;">Thank you, <br><strong>JobSync Team</strong></p>
            </div>
          </div>';
          
        $mail->send();
        
        $hashed_password = password_hash($data['password'], PASSWORD_DEFAULT);
        try {
            $sql = "INSERT INTO js_employer_info 
                (firstname, middlename, lastname, suffix, contact, position, email, password, verification_code, 
                dti_document, bir_document, business_permit, decision, account_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            $params = [
                $data['firstName'], 
                $data['middleName'], 
                $data['lastName'], 
                $data['suffix'] ?? null, 
                $data['contactNumber'], 
                $data['position'], 
                $data['email'], 
                $hashed_password, 
                $verification_code,
                $dti_document_filename,  
                $bir_document_filename, 
                $business_permit_filename, 
                $decision,
                'Pending'
            ];
            
            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            
            $lastInsertId = $conn->lastInsertId();
            
            $company_sql = "INSERT INTO js_company_info (employer_id) VALUES (?)";
            $founding_sql = "INSERT INTO js_founding_info (employer_id) VALUES (?)";
            $contact_sql = "INSERT INTO js_company_contact (employer_id) VALUES (?)";
            
            $company_stmt = $conn->prepare($company_sql);
            $company_stmt->execute([$lastInsertId]);
            
            $founding_stmt = $conn->prepare($founding_sql);
            $founding_stmt->execute([$lastInsertId]);
            
            $contact_stmt = $conn->prepare($contact_sql);
            $contact_stmt->execute([$lastInsertId]);
            
            exit;
        } catch (PDOException $e) {
            echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
        }
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to process request: ' . $e->getMessage()]);
    exit;
}

echo json_encode(['decision' => $decision]);

$conn = null;
?>
