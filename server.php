<?php

$publicPath = __DIR__.'/public';

$uri = urldecode(
    parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? ''
);

// Allow CORS for images and static assets in public folder
if ($uri !== '/' && file_exists($publicPath.$uri)) {
    $ext = strtolower(pathinfo($uri, PATHINFO_EXTENSION));
    $mimeTypes = [
        'webp' => 'image/webp',
        'png'  => 'image/png',
        'jpg'  => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif'  => 'image/gif',
        'svg'  => 'image/svg+xml',
        'ico'  => 'image/x-icon',
        'mp4'  => 'video/mp4',
        'apk'  => 'application/vnd.android.package-archive',
    ];

    if (isset($mimeTypes[$ext])) {
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, OPTIONS');
        header('Access-Control-Allow-Headers: *');
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            exit(0);
        }
        if ($ext === 'apk') {
            header('Content-Disposition: attachment; filename="'.basename($uri).'"');
        }
        header('Content-Type: '.$mimeTypes[$ext]);
        header('Content-Length: '.filesize($publicPath.$uri));
        header('Cache-Control: public, max-age=86400');
        readfile($publicPath.$uri);
        exit;
    }

    return false;
}

$formattedDateTime = date('D M j H:i:s Y');
$requestMethod = $_SERVER['REQUEST_METHOD'];
$remoteAddress = ($_SERVER['REMOTE_ADDR'] ?? '127.0.0.1').':'.($_SERVER['REMOTE_PORT'] ?? '8000');

file_put_contents('php://stdout', "[$formattedDateTime] $remoteAddress [$requestMethod] URI: $uri
");

require_once $publicPath.'/index.php';
