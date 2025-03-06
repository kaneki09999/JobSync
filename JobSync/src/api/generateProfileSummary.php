<?php
include 'dbconnect.php';
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

$api_key = $_ENV['API_KEY'];
if (!$api_key) {
    die(json_encode(['error' => 'API key is missing.']));
}

$data = json_decode(file_get_contents("php://input"), true);
$jobTitle = $data["jobTitle"] ?? "";

if (empty($jobTitle)) {
    echo json_encode(["error" => "Job title is required"]);
    exit;
}

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer $api_key",
    "Content-Type: application/json",
]);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
    "model" => "gpt-3.5-turbo",
    "messages" => [
        ["role" => "system", "content" => "You generate professional profile summaries based on job titles."],
        ["role" => "user", "content" => "Write a professional profile summary for a '$jobTitle'."]
    ],
    "max_tokens" => 250,
    "temperature" => 0.7
]));

$response = curl_exec($ch);
curl_close($ch);

$responseData = json_decode($response, true);

if (!isset($responseData["choices"][0]["message"]["content"])) {
    echo json_encode(["error" => "Unexpected API response", "response" => $responseData]);
    exit;
}

$generatedText = $responseData["choices"][0]["message"]["content"];

echo json_encode(["profileSummary" => $generatedText]);
