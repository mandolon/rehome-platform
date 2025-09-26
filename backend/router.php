<?php
// Router for PHP built-in server to handle Laravel API routes

// Only run in CLI server mode
if (php_sapi_name() !== 'cli-server') {
    return false;
}

$uri = urldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

// Serve static files from public directory if they exist
if ($uri !== '/' && file_exists(__DIR__.'/public'.$uri)) {
    return false;
}

// Set up environment for Laravel
$_SERVER = array_merge($_SERVER, [
    'SCRIPT_NAME' => '/index.php',
    'SCRIPT_FILENAME' => __DIR__.'/public/index.php',
]);

// Load Laravel
require_once __DIR__.'/public/index.php';
