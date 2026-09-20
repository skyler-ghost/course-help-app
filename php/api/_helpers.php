<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
require_once __DIR__ . '/../config/database.php';

function json_out($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit;
}

function input_get($key, $default = null) {
    return isset($_GET[$key]) ? trim($_GET[$key]) : $default;
}
