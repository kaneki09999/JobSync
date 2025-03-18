<?php
include 'dbconnect.php';
require '../../vendor/autoload.php'; 
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$api_key = $_ENV['API_KEY'];
if (!$api_key) {
    die(json_encode(['error' => 'API key is missing.']));
}

try {
    $objDb = new Dbconnect();
    $conn = $objDb->connect(); 
} catch (PDOException $e) {
    die(json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]));
}

$input = json_decode(file_get_contents('php://input'), true);

$jobTitle = $input['jobTitle'] ?? '';
$jobRole = $input['jobRole'] ?? '';

if (empty($jobTitle) || empty($jobRole)) {
    echo json_encode(['error' => 'Job Title and Job Role are required.']);
    exit;
}

$data = [
    'model' => 'gpt-3.5-turbo',
    'messages' => [
        ['role' => 'system', 'content' => 'You are an expert HR recruiter. Write detailed job descriptions.'],
        ['role' => 'user', 'content' => "Write a detailed job description for a $jobTitle in the role of $jobRole."]
    ],
    'max_tokens' => 600,
];

$ch = curl_init("https://api.openai.com/v1/chat/completions");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer $api_key"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);

if ($response === false) {
    echo json_encode(['error' => 'cURL Error: ' . curl_error($ch)]);
    curl_close($ch);
    exit;
}

curl_close($ch);
$result = json_decode($response, true);

if (isset($result['choices'][0]['message']['content'])) {
    $jobDescription = $result['choices'][0]['message']['content'];

    $jobDescription = preg_replace('/^(Job Title|Location|Company|Company Description|Job Type|Reports to): .*$/m', '', $jobDescription);
    $jobDescription = trim($jobDescription);
    $jobDescription = preg_replace('/About Us:.*$/s', '', $jobDescription);
    // Bold the section headers
    $keywords = ['Responsibilities:', 'Requirements:', 'Qualifications:', 'Skills:', 'Benefits:', 'Duties:'];
    foreach ($keywords as $keyword) {
        $jobDescription = preg_replace("/($keyword)/", '<strong>$1</strong>', $jobDescription);
    }
    
    $jobDescription = preg_replace_callback('/<strong>(.*?)<\/strong>\s*(.*?)((?=<strong>)|$)/s', function($matches) {
        $sectionTitle = $matches[1];
        $content = trim($matches[2]);
        $lines = preg_split('/\n+/', $content);
        $bulletItems = '';
    
        foreach ($lines as $line) {
            $line = preg_replace('/^\d+[\.\)]\s*/', '', $line);  
            $line = trim($line, "-• \t");   
            if (!empty($line)) {
                $bulletItems .= '<li>' . htmlspecialchars($line) . '</li>';
            }
        }
    
        return "<strong>$sectionTitle</strong><ul>$bulletItems</ul>";
    }, $jobDescription);
    
    $jobDescription = '<div style="text-align: justify;">' . 
    '<style>ul { list-style-type: disc; padding-left: 20px; }</style>' . 
    $jobDescription . 
    '</div>';
    echo json_encode(['jobDescription' => $jobDescription], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    
} else {
    echo json_encode(['error' => 'Failed to generate job description. Response: ' . json_encode($result)]);
}
?>
