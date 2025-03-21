<?php
include 'dbconnect.php';
use Smalot\PdfParser\Parser;
require '../../vendor/autoload.php';

use Dotenv\Dotenv;

// Load .env API key
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();
// Handle file upload
if ($_FILES['resume']['error'] === UPLOAD_ERR_OK) {
    $tmpName = $_FILES['resume']['tmp_name'];

    // Parse PDF text
    $parser = new Parser();
    $pdf = $parser->parseFile($tmpName);
    $text = $pdf->getText();

    file_put_contents('parsed_text.txt', $text); // Save extracted text for debugging

    // Prepare prompt for OpenAI
    $prompt = "Extract the following fields from this resume: full name, email, phone number, list of skills, education history, and work experience. Return in JSON format: {\"name\": \"\", \"email\": \"\", \"phone\": \"\", \"skills\": [], \"education\": [], \"experience\": []}.\n\nResume Text:\n$text";

    // Call OpenAI API
    $OPENAI_API_KEY = $_ENV['API_KEY'];
    $postData = [
        "model" => "gpt-3.5-turbo",
        "messages" => [
            ["role" => "user", "content" => $prompt]
        ],
        "temperature" => 0.2,
    ];

    $ch = curl_init("https://api.openai.com/v1/chat/completions");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer $OPENAI_API_KEY"
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));

    $response = curl_exec($ch);
    curl_close($ch);

    $result = json_decode($response, true);
    $content = $result['choices'][0]['message']['content'];

    // Return extracted JSON data
    header('Content-Type: application/json');
    echo $content;
} else {
    http_response_code(400);
    echo json_encode(["error" => "Failed to upload file."]);
}
?>
