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
    $error_message = 'Database connection failed: ' . $e->getMessage();
    die(json_encode(['error' => $error_message]));
}

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['prompt'])) {
    $error_message = 'Prompt not provided';
    echo json_encode(['error' => $error_message]);
    exit;
}

$apiKey = $_ENV['API_KEY'];

$openAiUrl = 'https://api.openai.com/v1/chat/completions';

$openAiData = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        [
            'role' => 'system',
            'content' => 'You are an HR assistant. Write a formal, friendly, and professional interview invitation. The message should start with a subject line, followed by a greeting, and include clear and concise paragraphs. Important details such as the company name, interview channel, date, and time should be presented in bold. Format the message using HTML with appropriate line breaks and headings. The tone should be welcoming and the language should be polite. Include the unique interview channel name. It should be stated that the interview will take place in the JobSync video conference portal, not the company’s main channel.'
        ],
        [
            'role' => 'user',
            'content' => $data['prompt'],  
        ]
    ],
    'max_tokens' => 500,
    'temperature' => 0.7,
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $openAiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($openAiData));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $apiKey
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    $curl_error_message = 'Curl error: ' . curl_error($ch);
    echo json_encode(['error' => $curl_error_message]);
    exit;
}

curl_close($ch);

$responseData = json_decode($response, true);

if (isset($responseData['choices'][0]['message']['content'])) {
    $generatedMessage = trim($responseData['choices'][0]['message']['content']);

    $generatedMessage = preg_replace('/```html|```/', '', $generatedMessage);

    $generatedMessage = preg_replace('/<title>.*?<\/title>/', '', $generatedMessage);

    echo json_encode(['message' => $generatedMessage]);
} else {
    $error_message = 'Error generating message from OpenAI';
    echo json_encode(['error' => $error_message]);
}


?>
