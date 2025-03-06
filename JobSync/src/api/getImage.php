<?php
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$imageName = basename($_GET['image']);
$imagePath = __DIR__ . "/uploads/" . $imageName;

if (!file_exists($imagePath)) {
    http_response_code(404);
    echo "Image not found";
    exit;
}

$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $imagePath);
finfo_close($finfo);

header("Content-Type: " . $mimeType);

readfile($imagePath);
?>
