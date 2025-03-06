<?php
session_start();
include 'dbconnect.php';
include 'config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../../vendor/autoload.php'; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect();
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (isset($data['employer_id']) && isset($data['status'])) {
    $employer_id = $data['employer_id'];
    $status = $data['status'];
    $email = $data['email'];
    $firstname = $data['firstname'];
    $lastname = $data['lastname'];

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

    $hashed_firstname = password_hash($data['firstname'], PASSWORD_DEFAULT);
    if ($status == 'Approved') {
        $mail->Subject = 'Approval of Registration for Authorized Representative';
        $mail->Body = "<!DOCTYPE html>
                        <html lang='en'>
                        <head>
                            <meta charset='UTF-8'>
                            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                            <style>
                                .container-body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: auto; position: relative; top: 30px; padding: 0; background-color: #f4f7fb; }
                                .email-container { width: 100%; max-width: 650px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); }
                                .header { text-align: center; padding-bottom: 30px; border-bottom: 3px solid #e6e6e6; }
                                .header h1 { color: #1c3e5b; font-size: 32px; margin: 0; font-weight: 600; }
                                .content { padding: 20px 0; font-size: 16px; color: #444444; line-height: 1.7; }
                                .content p { margin-bottom: 12px; }
                                .cta { text-align: center; margin-top: 30px; }
                                .cta a { text-decoration: none; background-color: #0066cc; color: white; padding: 14px 36px; border-radius: 8px; font-size: 18px; font-weight: 600; display: inline-block; transition: background-color 0.3s ease; }
                                .cta a:hover { background-color: #004d99; }
                                .footer { text-align: center; padding-top: 25px; border-top: 3px solid #e6e6e6; font-size: 14px; color: #7d7d7d; margin-top: 35px; }
                                .footer p { margin: 8px 0; }
                                .footer a { color: #0066cc; text-decoration: none; font-weight: 500; transition: color 0.3s ease; }
                                .footer a:hover { color: #004d99; }
                                .social-links { margin-top: 15px; }
                                .social-links a { margin: 0 12px; font-size: 18px; color: #0066cc; transition: color 0.3s ease; }
                                .social-links a:hover { color: #004d99; }
                            </style>
                        </head>
                        <body>
                        <div class='container-body'>
                            <div class='email-container'>
                                <div class='header'>
                                    <h1>JobSync Registration Approved!</h1>
                                </div>
                                <div class='content'>
                                    <b>Dear " . $firstname . " " . $lastname .",</b>
                                    <p>We are excited to inform you that your registration as an authorized representative has been successfully approved in the JobSync portal.</p>
                                    <p>You can now access and manage your company’s account, post job listings, review applicants, and take full advantage of all the valuable services we offer.</p>
                                    <p>If you need any assistance or have questions, feel free to contact us at any time.</p>
                                    <p>Thank you for choosing JobSync! We're thrilled to have you onboard.</p>
                                    <p><strong>Best regards,</strong></p>
                                    <p>Admin<br>  
                                    <strong>JobSync Team</strong><br>  
                                    <a href='mailto:me.jobsync@gmail.com'>me.jobsync@gmail.com</a><br>  
                                    +63 912-345-6712</p>
                                </div>
                                <div class='cta'>
                                    <a href='https://jobsync-ph.com/employer_login'>Access Your Account</a>
                                </div>
                                <div class='footer'>
                                    <p><strong>Contact Information:</strong></p>
                                    <p>Email: <a href='mailto:me.jobsync@gmail.com'>me.jobsync@gmail.com</a></p>
                                    <p>Phone: +63 912-345-6712</p>
                                    <p><a href='#'>Contact Us</a></p>
                                    <p><a href='#'>Terms and Conditions</a> | <a href='#'>Privacy Policy</a></p>
                                    <div class='social-links'>
                                        <a href='#' target='_blank'>Facebook</a>
                                        <a href='#' target='_blank'>Twitter</a>
                                        <a href='#' target='_blank'>Instagram</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </body>
                        </html>";
    } elseif ($status == 'Resubmit') {
        $token = bin2hex(random_bytes(32));
        $expires_at = date('Y-m-d H:i:s', strtotime('+1 day'));
        try {
            $insertTokenQuery = "INSERT INTO js_resubmit_tokens (employer_id, token, expires_at, used) VALUES (:employer_id, :token, :expires_at, 0)";
            $stmt = $conn->prepare($insertTokenQuery);
            $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);
            $stmt->bindParam(':token', $token, PDO::PARAM_STR);
            $stmt->bindParam(':expires_at', $expires_at, PDO::PARAM_STR);
            $stmt->execute();
        
        } catch (PDOException $e) {
            echo "Error: " . $e->getMessage();
        }
        $verificationLink = "http://localhost:5173/checkToken?employer_id=" . $employer_id . "&token=" . $token;
        $mail->Subject = 'Document Resubmission Request - JobSync';
        $mail->Body = "<!DOCTYPE html>
                        <html lang='en'>
                        <head>
                            <meta charset='UTF-8'>
                            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                            <style>
                            .container-body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;  margin: auto; position: relative; top: 30px; padding: 0; background-color: #f4f7fb; }
                            .email-container { width: 100%; max-width: 650px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); }
                            .header { text-align: center; padding-bottom: 30px; border-bottom: 3px solid #e6e6e6; }
                            .header h1 { color: #1c3e5b; font-size: 32px; margin: 0; font-weight: 600; }
                            .content { padding: 20px 0; font-size: 16px; color: #444444; line-height: 1.7; }
                            .content p { margin-bottom: 12px; }
                            .cta { text-align: center; margin-top: 30px; }
                            .cta a { text-decoration: none; background-color: #0066cc; color: white; padding: 14px 36px; border-radius: 8px; font-size: 18px; font-weight: 600; display: inline-block; transition: background-color 0.3s ease; }
                            .cta a:hover { background-color: #004d99; }
                            .footer { text-align: center; padding-top: 25px; border-top: 3px solid #e6e6e6; font-size: 14px; color: #7d7d7d; margin-top: 35px; }
                            .footer p { margin: 8px 0; }
                            .footer a { color: #0066cc; text-decoration: none; font-weight: 500; transition: color 0.3s ease; }
                            .footer a:hover { color: #004d99; }
                            .social-links { margin-top: 15px; }
                            .social-links a { margin: 0 12px; font-size: 18px; color: #0066cc; transition: color 0.3s ease; }
                            .social-links a:hover { color: #004d99; }
                        </style>
                        </head>
                        <body>
                        <div class='container-body'>
                            <div class='email-container'>
                                <div class='header'>
                                    <h1>Document Resubmission Request</h1>
                                </div>
                                <div class='content'>
                                    <b>Dear " . $firstname . " " . $lastname .",</b>
                                    <p>We recently reviewed your registration as an authorized representative, but we found that some required documents were incomplete or incorrect.</p>
                                    <p>To complete your registration, please resubmit the necessary documents through the JobSync portal as soon as possible.</p>
                                    <p>If you need any assistance or clarification, feel free to contact us.</p>
                                    <p>Thank you for choosing JobSync. We look forward to receiving your updated submission.</p>
                                    <p><strong>Best regards,</strong></p>
                                    <p>Admin<br>  
                                    <strong>JobSync Team</strong><br>  
                                    <a href='mailto:me.jobsync@gmail.com'>me.jobsync@gmail.com</a><br>  
                                    +63 912-345-6712</p>
                                </div>
                                <div class='cta'>
                                    <a href='" . $verificationLink . "'>Resubmit Documents</a>
                                </div>
                                <div class='footer'>
                                    <p><strong>Contact Information:</strong></p>
                                    <p>Email: <a href='mailto:me.jobsync@gmail.com'>me.jobsync@gmail.com</a></p>
                                    <p>Phone: +63 912-345-6712</p>
                                    <p><a href='#'>Contact Us</a></p>
                                    <p><a href='#'>Terms and Conditions</a> | <a href='#'>Privacy Policy</a></p>
                                    <div class='social-links'>
                                        <a href='#' target='_blank'>Facebook</a>
                                        <a href='#' target='_blank'>Twitter</a>
                                        <a href='#' target='_blank'>Instagram</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </body>
                        </html>";
    } elseif ($status == 'Rejected') {
        $mail->Subject = 'Registration Rejected - JobSync';
        $mail->Body = "<!DOCTYPE html>
                        <html lang='en'>
                        <head>
                            <meta charset='UTF-8'>
                            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
                            <style>
                            .container-body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;  margin: auto; position: relative; top: 30px; padding: 0; background-color: #f4f7fb; }
                            .email-container { width: 100%; max-width: 650px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1); }
                            .header { text-align: center; padding-bottom: 30px; border-bottom: 3px solid #e6e6e6; }
                            .header h1 { color: #1c3e5b; font-size: 32px; margin: 0; font-weight: 600; }
                            .content { padding: 20px 0; font-size: 16px; color: #444444; line-height: 1.7; }
                            .content p { margin-bottom: 12px; }
                            .cta { text-align: center; margin-top: 30px; }
                            .cta a { text-decoration: none; background-color: #0066cc; color: white; padding: 14px 36px; border-radius: 8px; font-size: 18px; font-weight: 600; display: inline-block; transition: background-color 0.3s ease; }
                            .cta a:hover { background-color: #004d99; }
                            .footer { text-align: center; padding-top: 25px; border-top: 3px solid #e6e6e6; font-size: 14px; color: #7d7d7d; margin-top: 35px; }
                            .footer p { margin: 8px 0; }
                            .footer a { color: #0066cc; text-decoration: none; font-weight: 500; transition: color 0.3s ease; }
                            .footer a:hover { color: #004d99; }
                            .social-links { margin-top: 15px; }
                            .social-links a { margin: 0 12px; font-size: 18px; color: #0066cc; transition: color 0.3s ease; }
                            .social-links a:hover { color: #004d99; }
                        </style>
                        </head>
                        <body>
                        <div class='container-body'>
                            <div class='email-container'>
                                <div class='header'>
                                    <h1>JobSync Registration Rejected</h1>
                                </div>
                                <div class='content'>
                                    <b>Dear " . $firstname . " " . $lastname .",</b>
                                    <p>We regret to inform you that your registration as an authorized representative has been <strong>permanently rejected</strong> due to failure to meet eligibility criteria, repeated submission of incorrect documents.</p>
                                    <p>Unfortunately, this decision is final, and we will not be able to process any further resubmissions.</p>
                                    <p>If you have any questions or require clarification, please feel free to contact us.</p>
                                    <p>Thank you for your understanding.</p>
                                    <p><strong>Best regards,</strong></p>
                                    <p>Admin<br>  
                                    <strong>JobSync Team</strong><br>  
                                    <a href='mailto:me.jobsync@gmail.com'>me.jobsync@gmail.com</a><br>  
                                    +63 912-345-6712</p>
                                </div>
                                <div class='footer'>
                                    <p><strong>Contact Information:</strong></p>
                                    <p>Email: <a href='mailto:me.jobsync@gmail.com'>me.jobsync@gmail.com</a></p>
                                    <p>Phone: +63 912-345-6712</p>
                                    <p><a href='#'>Contact Us</a></p>
                                    <p><a href='#'>Terms and Conditions</a> | <a href='#'>Privacy Policy</a></p>
                                    <div class='social-links'>
                                        <a href='#' target='_blank'>Facebook</a>
                                        <a href='#' target='_blank'>Twitter</a>
                                        <a href='#' target='_blank'>Instagram</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </body>
                        </html>";
                    }
    $mail->send();

    try {
        $sql = "UPDATE js_employer_info SET account_status = :status WHERE employer_id = :employer_id";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':status', $status, PDO::PARAM_STR);
        $stmt->bindParam(':employer_id', $employer_id, PDO::PARAM_INT);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Employer status updated successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error updating record"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["success" => false, "message" => "Database error: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
}
?>
