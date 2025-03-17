<?php
include 'dbconnect.php';
include 'config.php';  
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

$OPENAI_API_KEY = $_ENV['API_KEY'];

function matchJobsWithGPT($skills, $workExperience, $jobs) {
    global $OPENAI_API_KEY;

    $prompt = "You are an AI job matching assistant. Given the applicant's skills and work experience, match them with the most relevant job postings.\n\n";

    $prompt .= "Applicant Skills: " . implode(", ", $skills) . "\n";
    $prompt .= "Work Experience: " . implode(", ", $workExperience) . "\n\n";
    
    $prompt .= "Job Listings:\n";
    foreach ($jobs as $job) {
        $prompt .= "- Job ID: {$job['job_id']}, Title: {$job['jobTitle']}, Description: {$job['jobDescription']}\n";
    }

    $prompt .= "\nReturn **AT LEAST 10** job matches, or more if available. 
    Each job match should be an object containing:
    - 'job_id': The job ID from the list.
    - 'score': A relevance score between 0 and 1.
    
    Example output:
    [
        { \"job_id\": 1, \"score\": 0.85 },
        { \"job_id\": 2, \"score\": 0.72 },
        { \"job_id\": 3, \"score\": 0.60 },
        { \"job_id\": 4, \"score\": 0.50 },
        { \"job_id\": 5, \"score\": 0.45 },
        { \"job_id\": 6, \"score\": 0.40 },
        { \"job_id\": 7, \"score\": 0.35 },
        { \"job_id\": 8, \"score\": 0.30 },
        { \"job_id\": 9, \"score\": 0.25 },
        { \"job_id\": 10, \"score\": 0.20 }
    ]
    Make sure to return at least 10 matches, sorted by relevance. Provide more if possible.
    Do not return anything except valid JSON.";

    $url = "https://api.openai.com/v1/chat/completions";
    $data = json_encode([
        "model" => "gpt-3.5-turbo",
        "messages" => [
            ["role" => "system", "content" => "You are an expert job matching assistant."],
            ["role" => "user", "content" => $prompt]
        ],
        "temperature" => 0.7,
    ]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: Bearer $OPENAI_API_KEY",
        "Content-Type: application/json"
    ]);

    $response = curl_exec($ch);
    if (!$response) {
        curl_close($ch);
        return [];
    }
    curl_close($ch);
    
    $responseData = json_decode($response, true);
    
    if (!isset($responseData['choices'][0]['message']['content'])) {
        return [];
    }
    
    $responseText = trim($responseData['choices'][0]['message']['content']);
    
    $matchedJobs = json_decode($responseText, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [];
    }
    
    $responseData = json_decode($response, true);
    return $matchedJobs ?? [];
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $rawInput = file_get_contents("php://input");
    $inputData = json_decode($rawInput, true);
    
    $applicant_id = $inputData['applicant_id'] ?? null;

    if (!$applicant_id) {
        echo json_encode(["error" => "Applicant ID is required."]);
        exit;
    }

    // Check if matches already exist in cache
    $stmt = $conn->prepare("SELECT m.*, j.* 
                            FROM `js_job_applicant_matches` m
                            JOIN active_job_postings j ON m.job_id = j.job_id 
                            WHERE m.applicant_id = :applicant_id");
    $stmt->execute(['applicant_id' => $applicant_id]);

    $cachedMatches = $stmt->fetchAll(PDO::FETCH_ASSOC);
    $matchedJobs = [];

    foreach ($cachedMatches as $cachedMatch) {
        $matchedJobs[] = [
            'job_id' => $cachedMatch['job_id'],        
            'score' => $cachedMatch['match_score'],    
            'jobTitle' => $cachedMatch['jobTitle'],   
            'company_name' => $cachedMatch['company_name'],      
            'job_description' => $cachedMatch['jobDescription'],  
            'minSalary' => $cachedMatch['minSalary'],  
            'maxSalary' => $cachedMatch['maxSalary'],  
            'city' => $cachedMatch['city'],  
            'jobType' => $cachedMatch['jobType'],  
            'logo' => $cachedMatch['logo'],  
        ];
    }

    if (empty($matchedJobs)) {
        // Get skills
        $stmt = $conn->prepare("SELECT skill_name FROM js_skills WHERE applicant_id = :applicant_id");
        $stmt->execute(['applicant_id' => $applicant_id]);
        $skills = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'skill_name');

        // Get work experience
        $stmt = $conn->prepare("SELECT job_title FROM js_work_experience WHERE applicant_id = :applicant_id");
        $stmt->execute(['applicant_id' => $applicant_id]);
        $workExperience = array_column($stmt->fetchAll(PDO::FETCH_ASSOC), 'job_title');

        if (empty($skills) || empty($workExperience)) {
            echo json_encode(["error" => "Job matching requires at least one skill and one work experience entry."]);
            exit;
        }
        $stmt = $conn->prepare("SELECT * FROM active_job_postings");
        $stmt->execute();
        $jobResult = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (empty($jobResult)) {
            echo json_encode(["error" => "No job postings available."]);
            exit;
        }

    $matchedJobs = matchJobsWithGPT($skills, $workExperience, $jobResult);

            if (!empty($matchedJobs)) {
                foreach ($matchedJobs as $job) {
                    try {
                        $insertStmt = $conn->prepare(
                            "INSERT INTO js_job_applicant_matches (applicant_id, job_id, match_score) 
                            VALUES (:applicant_id, :job_id, :match_score)
                            ON DUPLICATE KEY UPDATE match_score = :match_score"
                        );
            
                        $insertStmt->execute([
                            'applicant_id' => $applicant_id,
                            'job_id' => $job['job_id'],
                            'match_score' => $job['score']
                        ]);
                    } catch (PDOException $e) {
                        echo json_encode("sql_error.log", "SQL Error: " . $e->getMessage() . "\n", FILE_APPEND);
                    }
                }
            }
    }
    usort($matchedJobs, function($a, $b) {
        return $b['score'] <=> $a['score'];
    });

    foreach ($matchedJobs as &$matchedJob) {
        if (isset($matchedJob['logo']) && !empty($matchedJob['logo'])) {
            $matchedJob['logo'] = BASE_URL . $matchedJob['logo'];
        }
    }

    echo json_encode(["jobs" => $matchedJobs]);
}
?>
