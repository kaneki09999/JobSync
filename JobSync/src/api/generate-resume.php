<?php
include 'dbconnect.php';
require '../../vendor/autoload.php'; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data["name"]) || !isset($data["jobTitle"])) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit;
}

$name = $data["name"];
$jobTitle = $data["jobTitle"];

$apiKey = $_ENV['API_KEY'];
$prompt = "For the job title '$jobTitle', provide the following details without numbering or section titles.  
- A list of key skills required, separated by commas.  
- A professional profile summary.  
- A work experience description using justified paragraph formatting.  

Ensure that the response flows naturally without adding any section titles such as 'Professional Profile Summary:', 'Work Experience:', or 'Key Skills:'. Begin directly with the content itself, as if it were part of a resume or professional document.";


$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $apiKey"
]);

curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "model" => "gpt-3.5-turbo",
    "messages" => [
        ["role" => "system", "content" => "You are an expert career advisor and resume writer."],
        ["role" => "user", "content" => $prompt]
    ],
    "temperature" => 0.7,
    "max_tokens" => 300
]));

$response = curl_exec($ch);
curl_close($ch);
if ($response) {
    $decodedResponse = json_decode($response, true);
    $text = $decodedResponse["choices"][0]["message"]["content"] ?? "";

    $text = preg_replace('/(Professional Profile Summary:|Work Experience:|Key Skills:)/i', '', $text);
    $text = trim($text); 

    $sections = preg_split('/\n\s*\n/', $text, 3);  

    $skills = isset($sections[0]) ? explode(", ", trim($sections[0])) : ["Skills not generated."];
    $profileSummary = $sections[1] ?? "Profile summary not generated.";
    $workExperience = $sections[2] ?? "Work experience not generated.";

    echo json_encode([
        "success" => true,
        "jobTitle" => $jobTitle,
        "skills" => $skills,
        "profileSummary" => $profileSummary,
        "workExperience" => $workExperience
    ]);
} else {
    echo json_encode(["success" => false, "message" => "AI request failed."]);
}
?>
