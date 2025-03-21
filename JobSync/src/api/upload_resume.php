<?php 
include 'dbconnect.php';
require '../../vendor/autoload.php';
use Dotenv\Dotenv;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$OPENAI_API_KEY = $_ENV['API_KEY'];

$objDb = new Dbconnect();
$conn = $objDb->connect();   

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['resume'])) {
    $fileTmpPath = $_FILES['resume']['tmp_name'];
    $fileName = $_FILES['resume']['name'];

    $uploadFileDir = 'uploads/';
    if (!is_dir($uploadFileDir)) {
        mkdir($uploadFileDir, 0777, true);
    }

    $destPath = $uploadFileDir . $fileName;

    if (!move_uploaded_file($fileTmpPath, $destPath)) {
        echo json_encode(['message' => 'Failed to upload file.']);
        exit;
    }

    // Parse PDF
    try {
        $parser = new \Smalot\PdfParser\Parser();
        $pdf = $parser->parseFile($destPath);
        $text = $pdf->getText();
    } catch (Exception $e) {
        echo json_encode(['message' => 'Failed to parse PDF.', 'error' => $e->getMessage()]);
        exit;
    }

    // Prepare OpenAI Prompt
    $prompt = "Extract the following fields from this resume: Name, Email, Phone, Skills, Education. Format it in JSON.\n\n$text";

    $postData = [
        'model' => 'gpt-3.5-turbo',
        'messages' => [
            ['role' => 'user', 'content' => $prompt]
        ],
        'temperature' => 0.2, 
        'max_tokens' => 1000
    ];

    // Call OpenAI API
    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $OPENAI_API_KEY,
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
    $result = curl_exec($ch);

    if (curl_errno($ch)) {
        echo json_encode(['message' => 'OpenAI API request failed.', 'error' => curl_error($ch)]);
        curl_close($ch);
        exit;
    }
    curl_close($ch);

    $resultData = json_decode($result, true);
    $content = $resultData['choices'][0]['message']['content'] ?? '';

    // Attempt to parse JSON
    $extractedData = json_decode($content, true);

    // If invalid JSON, try to fix with regex (fallback)
    if (!$extractedData) {
        $content = trim($content);
        $content = preg_replace('/```json|```/', '', $content);  // Remove markdown formatting if present
        $extractedData = json_decode($content, true);
    }

    if (!$extractedData) {
        echo json_encode(['message' => 'Failed to parse GPT response.', 'gpt_output' => $content]);
        exit;
    }

    // Optional: Validate required fields
    $requiredFields = ['Name', 'Email', 'Phone', 'Skills', 'Education'];
    foreach ($requiredFields as $field) {
        if (!isset($extractedData[$field])) {
            echo json_encode(['message' => "Missing required field: $field"]);
            exit;
        }
    }

    // Assign to variables for bindParam (pass by reference)
    $name = $extractedData['Name'];
    $email = $extractedData['Email'];
    $phone = $extractedData['Phone'];
    $skills = json_encode($extractedData['Skills']);
    $education = json_encode($extractedData['Education']);

    // Insert into Database
    try {
        $sql = "INSERT INTO resumes (name, email, phone, skills, experience, education) 
                VALUES (:name, :email, :phone, :skills, null, :education)";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':phone', $phone);
        $stmt->bindParam(':skills', $skills);
        $stmt->bindParam(':education', $education);
        $stmt->execute();

        echo json_encode(['message' => 'Resume processed and saved successfully.']);
    } catch (PDOException $e) {
        echo json_encode(['message' => 'Database error.', 'error' => $e->getMessage()]);
    }
} else {
    echo json_encode(['message' => 'No file uploaded.']);
}
?>
