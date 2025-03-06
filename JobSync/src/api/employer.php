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
$pdo = $objDb->connect();
$logo = BASE_URL . 'uploads/logo3.png';
$data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['document'], $data['face'], $data['backSideId'], $data['email'], $data['lastName'], $data['password'])) {
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    $api_key = "06drhvszBIfFNWgrp16YFysZCR98bTE9"; 
    $api_url = "https://api2.idanalyzer.com/scan";

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
    $dti_document = base64_decode($data['dti_certificate']);
    $bir_document = base64_decode($data['bir_certificate']);
    $business_permit = base64_decode($data['business_permit']);

    $dti_mime_type = mime_content_type('data://application/octet-stream;base64,' . base64_encode($dti_document));
    $bir_mime_type = mime_content_type('data://application/octet-stream;base64,' . base64_encode($bir_document));
    $business_permit_mime_type = mime_content_type('data://application/octet-stream;base64,' . base64_encode($business_permit));

    $dti_extension = getFileExtension($dti_mime_type);
    $bir_extension = getFileExtension($bir_mime_type);
    $business_permit_extension = getFileExtension($business_permit_mime_type);

    $dti_document_filename = $uploads_dir . '/dti_certificate_' . uniqid() . '.' . $dti_extension;
    $bir_document_filename = $uploads_dir . '/bir_certificate_' . uniqid() . '.' . $bir_extension;
    $business_permit_filename = $uploads_dir . '/business_permit_' . uniqid() . '.' . $business_permit_extension;


    $document_image = base64_decode($data['document']);
    $face_image = base64_decode($data['face']);
    $back_image = base64_decode($data['backSideId']);

    $document_filename = $uploads_dir . '/document_' . uniqid() . '.png';
    $face_filename = $uploads_dir . '/face_' . uniqid() . '.png';
    $back_filename = $uploads_dir . '/back_' . uniqid() . '.png';

    if (!file_put_contents($dti_document_filename, $dti_document) ||
        !file_put_contents($bir_document_filename, $bir_document) ||
        !file_put_contents($business_permit_filename, $business_permit) ||
        !file_put_contents($document_filename, $document_image) ||
        !file_put_contents($face_filename, $face_image) ||
        !file_put_contents($back_filename, $back_image)) {
        echo json_encode(['error' => 'Failed to save images to the server']);
        exit;
    }

    $payload = json_encode([
        "profile" => "security_medium",
        "document" => $data['document'],
        "face" => $data['face'],
        "documentSide" => $data['backSideId']
    ]);

    $ch = curl_init($api_url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'X-API-KEY: ' . $api_key,
        'Accept: application/json',
        'Content-Type: application/json'
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        echo json_encode(['error' => $error]);
        exit;
    }

    $response_data = json_decode($response, true);
    $decision = isset($response_data['decision']) ? $response_data['decision'] : 'Unknown';

    if (isset($response_data['document']['expiry'])) {
        $expiry_date = $response_data['document']['expiry'];
        $expiry_timestamp = strtotime($expiry_date);
        if ($expiry_timestamp < time()) {
            echo json_encode(['error' => 'ID is expired']);
            exit;
        }
    }

    $email = $data['email'];
    $lastname = $data['lastName'];
    $type = $data['type'];
    $warnings = [];
    $warningMessages = [
        'DOCUMENT_FACE_NOT_FOUND' => 'Document Face Not Found ',
        'FAKE_ID' => 'The ID is Fake ',
        'MISSING_ENDORSEMENT' => 'Missing Endorsement ',
        'MISSING_ISSUE_DATE' => 'Missing Issue Date ',
        'DOCUMENT_EXPIRED' => 'Document Expired ',
        'IMAGE_EDITED' => 'Image Edited ',
        'FACE_MISMATCH' => 'Face Mismatch',
        'SELFIE_FACE_NOT_FOUND' => 'Selfie Face Not Found',
        'IMAGE_FORGERY' => 'Image Forgery'
    ];

    if (isset($response_data['warning']) && is_array($response_data['warning'])) {
        foreach ($response_data['warning'] as $warning) {
            if ($warning['decision'] !== 'accept') {
                $code = $warning['code'];
                $warnings[] = $warningMessages[$code] ?? $code;
            }
        }
    }

try {
    if ($decision === 'reject') {
        echo json_encode([
            'error' => 'Your ID verification has been rejected.',
            'warnings' => $warnings
        ]);
        exit;
    } elseif ($decision === 'Unknown') {
        echo json_encode([
            'error' => 'The ID verification decision is unknown. Please contact support.',
            'warnings' => $warnings
        ]);
        exit;
    }

    elseif ($decision === 'accept') {
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
            <img src='. $logo .' style="max-width: 100px; margin-bottom: 10px;" alt="JobSync Logo">
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

        $sql = "INSERT INTO js_employer_info (firstname, middlename, lastname, suffix, contact, position, email, password, verification_code, document_path, face_path, back_side_path, dti_document, bir_document, business_permit, decision, account_status) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
            $document_filename, 
            $face_filename, 
            $back_filename, 
            $dti_document_filename, 
            $bir_document_filename,
            $business_permit_filename,
            $decision,
            'Pending'
        ];

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);

        $lastInsertId = $pdo->lastInsertId();

        $company_sql = "INSERT INTO js_company_info (employer_id) VALUES (?)";
        $founding_sql = "INSERT INTO js_founding_info (employer_id) VALUES (?)";
        $contact_sql = "INSERT INTO js_company_contact (employer_id) VALUES (?)";

        $company_stmt = $pdo->prepare($company_sql);
        $company_stmt->execute([$lastInsertId]);

        $founding_stmt = $pdo->prepare($founding_sql);
        $founding_stmt->execute([$lastInsertId]);

        $contact_stmt = $pdo->prepare($contact_sql);
        $contact_stmt->execute([$lastInsertId]);

        exit;
    }

} catch (Exception $e) {
    echo json_encode(['error' => 'Failed to process request: ' . $e->getMessage()]);
    exit;
}

echo json_encode(['decision' => $decision]);

$pdo = null;
?>
