<?php
require_once __DIR__ . '/../../middleware/auth.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail('Method not allowed', 405);

$file = $_FILES['image'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    fail($file && $file['error'] === UPLOAD_ERR_INI_SIZE ? 'File is too large' : 'No image uploaded');
}
if ($file['size'] > 50 * 1024 * 1024) fail('Image must be 50 MB or smaller');

$types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp', 'image/gif' => 'gif'];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
if (!isset($types[$mime])) fail('Only JPG, PNG, WEBP or GIF images are allowed');

$dir = __DIR__ . '/../../uploads';
if (!is_dir($dir) && !mkdir($dir, 0775, true)) fail('Upload folder is not writable', 500);

$name = bin2hex(random_bytes(8)) . '.' . $types[$mime];
if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) fail('Could not save image', 500);

respond(['url' => "/backend/uploads/$name"], 201); // site-relative: works on any host
