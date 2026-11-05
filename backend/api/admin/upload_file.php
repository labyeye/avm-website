<?php
require_once __DIR__ . '/../../middleware/auth.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail('Method not allowed', 405);

$file = $_FILES['file'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    $tooBig = $file && in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
    fail($tooBig ? 'File is too large for the server limit (raise upload_max_filesize and post_max_size)' : 'No file uploaded');
}
if ($file['size'] > 20 * 1024 * 1024) fail('File must be 20 MB or smaller');

$types = ['application/pdf' => 'pdf', 'image/jpeg' => 'jpg', 'image/png' => 'png'];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
if (!isset($types[$mime])) fail('Only PDF, JPG or PNG files are allowed');

$dir = __DIR__ . '/../../uploads';
if (!is_dir($dir) && !mkdir($dir, 0775, true)) fail('Upload folder is not writable', 500);

$name = bin2hex(random_bytes(8)) . '.' . $types[$mime];
if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) fail('Could not save file', 500);

respond(['url' => "/backend/uploads/$name"], 201); // site-relative: works on any host
