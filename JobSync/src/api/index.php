<?php
include 'dbconnect.php';
include 'config.php';
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php'; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$objDb = new Dbconnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];
$response = ['status' => 0, 'message' => 'Invalid request.']; 
$logo = BASE_URL . 'uploads/logo3.png';

switch ($method) {
    case "POST":
        $user = json_decode(file_get_contents('php://input'));

        if (isset($user->type)) {
            $type = $user->type;
            $created_at = date('Y-m-d H:i:s');
            $updated_at = null;

            switch ($type) {
                case 'applicant':
                    $table = 'js_applicants';
                    $fields = ['firstname', 'middlename', 'lastname', 'suffix', 'gender', 'contact', 'email', 'password', 'verification_code'];
                    break;
                
                case 'employer':
                    $table = 'employer';
                    $fields = ['firstname', 'lastname', 'email', 'password', 'department'];
                    break;

                default:
                    $response = ['status' => 0, 'message' => 'Invalid user type.'];
                    echo json_encode($response);
                    exit;
            }

            $requiredFields = ['email', 'lastname'];
            foreach ($requiredFields as $field) {
                if (empty($user->$field)) {
                    $response = ['status' => 0, 'message' => ucfirst($field) . ' is required.'];
                    echo json_encode($response);
                    exit;
                }
            }

            $email = filter_var(trim($user->email), FILTER_SANITIZE_EMAIL);
            $lastname = htmlspecialchars(trim($user->lastname));

            $verification_code = substr(number_format(time() * rand(), 0, '', ''), 0, 6);

            try {
                $sql = "INSERT INTO $table (" . implode(", ", $fields) . ", created_at, updated_at) VALUES (:" . implode(", :", $fields) . ", :created_at, :updated_at)";
                $stmt = $conn->prepare($sql);
                
                foreach ($fields as $field) {
                    if ($field === 'verification_code') {
                        $stmt->bindValue(":$field", $verification_code);
                    } elseif (isset($user->$field)) {
                        if ($field === 'password') {
                            $hashedPassword = password_hash($user->password, PASSWORD_BCRYPT);
                            $stmt->bindValue(":$field", $hashedPassword);
                        } else {
                            $stmt->bindValue(":$field", htmlspecialchars(trim($user->$field)));
                        }
                    } else {
                        $stmt->bindValue(":$field", null); 
                    }
                }

                $stmt->bindValue(':created_at', $created_at);
                $stmt->bindValue(':updated_at', $updated_at);

                if ($stmt->execute()) {
                    $applicant_id = $conn->lastInsertId();

                    $sqlPersonalInfo = "INSERT INTO js_personal_info (applicant_id, created_at) VALUES (:applicant_id, :created_at)";
                    $stmtPersonalInfo = $conn->prepare($sqlPersonalInfo);
                    $stmtPersonalInfo->bindValue(':applicant_id', $applicant_id);
                    $stmtPersonalInfo->bindValue(':created_at', $created_at);

                    if ($stmtPersonalInfo->execute()) {
                        $mail = new PHPMailer(true);
                        try {
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

                            $response = ['status' => 1, 'message' => ucfirst($type) . 'Verification email sent.'];
                            echo json_encode($response);
                            exit();
                        } catch (Exception $e) {
                            $response = ['status' => 0, 'message' => "Something went wrong. Please try again."];
                            echo json_encode($response);
                            exit();
                        }
                    } else {
                        $response = ['status' => 0, 'message' => 'Failed to insert personal info.'];
                    }
                } else {
                    $response = ['status' => 0, 'message' => 'Failed to register ' . $type . '.'];
                }
            } catch (PDOException $e) {
                $response = ['status' => 0, 'message' => 'Database error: ' . $e->getMessage()];
            }

        } else {
            $response = ['status' => 0, 'message' => 'User type not specified.'];
        }

        echo json_encode($response);
        break;

    default:
        echo json_encode($response);
        break;
}

