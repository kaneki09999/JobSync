<?php
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

// Fetch new job postings in the last 24 hours
$jobQuery = "SELECT a.*, c.company_name FROM active_job_postings a
            JOIN js_company_info c ON a.employer_id = c.employer_id
            WHERE job_created_at >= NOW() - INTERVAL 1 DAY";
$stmt = $conn->prepare($jobQuery);
$stmt->execute();
$jobs = $stmt->fetchAll(PDO::FETCH_ASSOC);

if (count($jobs) > 0) {
    // Fetch applicants with their skills & experience
    $applicantQuery = "SELECT a.applicant_id, a.email, 
                              GROUP_CONCAT(DISTINCT s.skill_name) AS skills, 
                              GROUP_CONCAT(DISTINCT w.job_title) AS experience  
                       FROM js_applicants a
                       LEFT JOIN js_skills s ON a.applicant_id = s.applicant_id
                       LEFT JOIN js_work_experience w ON a.applicant_id = w.applicant_id
                       GROUP BY a.applicant_id";
    $applicantStmt = $conn->prepare($applicantQuery);
    $applicantStmt->execute();
    $applicants = $applicantStmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($jobs as $job) {
        $jobId = $job['job_id'];
        $jobTitle = $job['jobTitle'];
        $jobDescription = $job['jobDescription'];
        $jobRole = $job['jobRole'];
        $minSalary = $job['minSalary'];
        $maxSalary = $job['maxSalary'];
        $company_name = $job['company_name'];
        $city = $job['city'];
        $logo = BASE_URL . $job['logo'];
    
        foreach ($applicants as $applicant) {
            $applicantEmail = $applicant['email'];
            $applicantSkills = $applicant['skills'] ?? '';  
            $applicantExperience = $applicant['experience'] ?? '';  
    
            
            if (isApplicantSuitable($jobTitle, $applicantSkills, $applicantExperience)) {
                $insertQuery = "INSERT INTO js_job_match_alerts (applicant_id, job_id, status) VALUES (:applicant_id, :job_id, 'New')";
                $insertStmt = $conn->prepare($insertQuery);
                $insertStmt->execute([
                    ':applicant_id' => $applicant['applicant_id'],
                    ':job_id' => $jobId
                ]);
                sendEmailNotification($applicantEmail, $jobTitle, $jobDescription, $jobRole, $jobId, $minSalary, $maxSalary, $logo, $company_name, $city);
            }
        }
    }
} else {
    echo "No new job postings.\n";
}

function isApplicantSuitable($jobTitle, $applicantSkills, $applicantExperience) {
    $apiKey = $_ENV['API_KEY'];
    $url = "https://api.openai.com/v1/chat/completions";
    
    $data = [
        "model" => "gpt-3.5-turbo",
        "messages" => [
            ["role" => "system", "content" => "You are an expert in job matching. Given a job description, an applicant's skills, and work experience, determine if the applicant is a good fit for the job."],
            ["role" => "user", "content" => "Job Title: $jobTitle\nApplicant Skills: $applicantSkills\nApplicant Work Experience: $applicantExperience\nDoes this applicant match this job? Answer 'Yes' or 'No'."]
        ],
        "max_tokens" => 10
    ];

    $headers = [
        "Content-Type: application/json",
        "Authorization: Bearer $apiKey"
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $response = curl_exec($ch);
    curl_close($ch);
    
    if ($response) {
        $json = json_decode($response, true);
        $answer = strtolower($json['choices'][0]['message']['content'] ?? '');
        
        return trim($answer) === 'yes'; 
    }

    return false; 
}

function sendEmailNotification($email, $jobTitle, $jobDescription, $jobRole, $jobId, $minSalary, $maxSalary, $logo, $company_name, $city) {
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
        $mail->addAddress($email);
        $mail->isHTML(true);
        $mail->Subject = "New Job Alert: $jobTitle";
        $mail->Body = "
        <!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css'>
    <title>Job Listings</title>
    <style>
        .container {
            width: 90%;
            max-width: 1215px;
            margin: auto;
        }
        .row {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
        }
        .job-card {
            width: 30%;
            margin: 10px;
            padding: 20px;
            border: 1px solid #e6e6e6;
            border-radius: 10px;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
            background: linear-gradient(90deg, rgba(239,246,255,1) 1%, rgba(255,255,255,1) 100%);
            cursor: pointer;
            transition: transform 0.3s, box-shadow 0.3s;
            position: relative;
        }
        .job-card:hover {
            transform: scale(1.02);
        }
        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .job-title {
            font-weight: bold;
            font-size: 20px;
            color: #000;
            margin-bottom: 10px;
        }
        .job-button {
            background-color: #007bff;
            color: white;
            border: none;
            padding: 5px 10px;
            font-size: 14px;
            border-radius: 5px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .job-button:hover {
            background-color: #0056b3;
        }
        .job-type {
            color: #0c912a;
            font-weight: 500;
            background-color: #bef1c6;
            border-radius: 5px;
            padding: 5px 8px;
            font-size: small;
            text-transform: uppercase;
        }
        .salary {
            font-size: 14px;
            color: #6c757d;
            margin-left: 10px;
        }
        .company-info {
            display: flex;
            align-items: center;
            margin-top: 15px;
        }
        .company-logo {
            width: 60px;
            height: 60px;
            border-radius: 8px;
            margin-right: 15px;
        }
        .company-name {
            font-weight: bold;
            font-size: 20px;
        }
        .location {
            color: #6c757d;
            display: flex;
            font-size: 15px;
            align-items: center;
        }
        .location i {
            margin-right: 5px;
        }
        .bookmark {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 20px;
            cursor: pointer;
            color: #bbbbbb;
        }
        .bookmark.active {
            color: #007bff;
        }
        @media (max-width: 1024px) {
            .job-card {
                width: 45%;
            }
        }
        @media (max-width: 768px) {
            .job-card {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class='container'>
        <div class='row'>
            <div class='job-card'>
                <a href='https://jobsync-ph.com/jobdetails/$jobId' style='text-decoration: none; color: inherit;'>
                <div style='display: flex; justify-content: space-between; align-items: center;'>
                    <h2 style='margin: 0;'>$jobTitle</h2>
                </div>
                    <p>
                        <span class='job-type'>$jobRole</span>
                        <span class='salary'>Salary: ₱$minSalary - ₱$maxSalary</span>
                    </p>

                    <div class='company-info'>
                        <img src={$logo} alt='Company Logo' class='company-logo'>
                        <div>
                            <p class='company-name'>$company_name</p>
                                <p style='margin-top: -20px; font-size: 15px'>$city</p>
                            <button style='background: #007bff; color: white; border: none; padding: 8px 16px; font-size: 14px; border-radius: 5px;'>Apply Now</button>
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>
    <script>
        function toggleBookmark(element) {
            element.classList.toggle('active');
        }
    </script>
</body>
</html>

        ";

        $mail->send();
        echo "Email sent to $email\n";
    } catch (Exception $e) {
        echo "Email failed to send to $email. Error: {$mail->ErrorInfo}\n";
    }
}
?>
