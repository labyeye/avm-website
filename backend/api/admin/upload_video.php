<?php
require_once __DIR__ . '/../../middleware/auth.php';

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail('Method not allowed', 405);

$file = $_FILES['video'] ?? null;
if (!$file || $file['error'] !== UPLOAD_ERR_OK) {
    $tooBig = $file && in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true);
    fail($tooBig ? 'Video is too large for the server limit (raise upload_max_filesize and post_max_size)' : 'No video uploaded');
}
if ($file['size'] > 50 * 1024 * 1024) fail('Video must be 50 MB or smaller');

$types = ['video/mp4' => 'mp4', 'video/webm' => 'webm', 'video/quicktime' => 'mov'];
$mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
if (!isset($types[$mime])) fail('Only MP4, WEBM or MOV videos are allowed');

$dir = __DIR__ . '/../../uploads';
if (!is_dir($dir) && !mkdir($dir, 0775, true)) fail('Upload folder is not writable', 500);

$name = bin2hex(random_bytes(8)) . '.' . $types[$mime];
if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) fail('Could not save video', 500);

respond(['url' => "/backend/uploads/$name"], 201); // site-relative: works on any host
