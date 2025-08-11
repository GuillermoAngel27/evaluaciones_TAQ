<?php
// Wrapper PHP para redirigir a Node.js
$url = 'http://localhost:3000' . $_SERVER['REQUEST_URI'];

// Obtener el origen de la petición
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Lista de dominios permitidos
$allowedOrigins = [
    'https://api.taqro.com.mx',
    'https://admine.taqro.com.mx',
    'https://evaluacion.taqro.com.mx'
];

// Configurar CORS específico en lugar de *
if (in_array($origin, $allowedOrigins)) {
    header('Access-Control-Allow-Origin: ' . $origin);
} else {
    header('Access-Control-Allow-Origin: https://admine.taqro.com.mx');
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Accept: application/json'
));

// Pasar el método HTTP
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $_SERVER['REQUEST_METHOD']);

// Pasar el cuerpo de la petición si existe
if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    $input = file_get_contents('php://input');
    curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
}

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($error) {
    http_response_code(500);
    echo json_encode(['error' => 'Curl error: ' . $error, 'url' => $url]);
    exit();
}

if ($response === false) {
    http_response_code(500);
    echo json_encode(['error' => 'No response from backend', 'url' => $url]);
    exit();
}

// Establecer el código de estado HTTP
http_response_code($httpCode);

// Enviar la respuesta
echo $response;
?>