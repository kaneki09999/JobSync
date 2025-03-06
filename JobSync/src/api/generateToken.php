<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require_once("php/src/RtcTokenBuilder2.php");
require_once '../../vendor/autoload.php';


$appId = "969528b81d9d47f49fe811e371eb1510";
$appCertificate = "550e6a89b7c04dae823ecc880a4d1698";



$channelName = $_GET['channelName'] ?? '';
$uid = intval($_GET['uid'] ?? 0);
$role = $_GET['role'] ?? 'subscriber';
$tokenExpirationInSeconds = 3600;


$requestDetails = [
    'method' => $_SERVER['REQUEST_METHOD'],
    'params' => [
        'channelName' => $channelName,
        'uid' => $uid,
        'role' => $role,
        'tokenExpirationInSeconds' => $tokenExpirationInSeconds,
    ],
    'timestamp' => date('Y-m-d H:i:s'),
];

if (!$channelName || !$uid) {
    $errorResponse = ["error" => "Missing parameters"];
    echo json_encode($errorResponse);
    exit;
}

$roleConstant = $role === 'publisher' ? RtcTokenBuilder2::ROLE_PUBLISHER : RtcTokenBuilder2::ROLE_SUBSCRIBER;

$token = RtcTokenBuilder2::buildTokenWithUid(
    $appId,
    $appCertificate,
    $channelName,
    $uid,
    $roleConstant,
    $tokenExpirationInSeconds
);


// Log successful token response
$responseDetails = [
    'rtcToken' => $token,
    'timestamp' => date('Y-m-d H:i:s'),
];

echo json_encode(["rtcToken" => $token]);
?>
