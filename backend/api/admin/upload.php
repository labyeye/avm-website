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

$id = bin2hex(random_bytes(8));
$ext = $types[$mime];
$name = "$id.$ext";
if (!move_uploaded_file($file['tmp_name'], "$dir/$name")) fail('Could not save image', 500);

// JPG / PNG: keep the original untouched (used for downloads) and make a light WebP copy (max 1920px wide) for the website.
// The page uses the .webp URL; original.php / event_zip.php find the original next to it by the shared id.
if (($ext === 'jpg' || $ext === 'png') && function_exists('imagewebp')) {
    @ini_set('memory_limit', '768M');
    $src = $ext === 'jpg' ? @imagecreatefromjpeg("$dir/$name") : @imagecreatefrompng("$dir/$name");
    if ($src) {
        if ($ext === 'jpg' && function_exists('exif_read_data')) {            // honour the camera's rotation
            $exif = @exif_read_data("$dir/$name");
            $rot = [3 => 180, 6 => -90, 8 => 90][$exif['Orientation'] ?? 0] ?? 0;
            if ($rot && ($r = imagerotate($src, $rot, 0))) { $src = $r; }
        }
        $w = imagesx($src);
        if ($w > 1920) {
            $h = max(1, (int)round(imagesy($src) * 1920 / $w));
            $scaled = imagecreatetruecolor(1920, $h);
            imagealphablending($scaled, false); imagesavealpha($scaled, true);
            if (imagecopyresampled($scaled, $src, 0, 0, 0, 0, 1920, $h, $w, imagesy($src))) $src = $scaled;
        }
        if ($ext === 'png') { imagepalettetotruecolor($src); imagealphablending($src, true); imagesavealpha($src, true); }
        if (@imagewebp($src, "$dir/$id.webp", 80) && is_file("$dir/$id.webp") && filesize("$dir/$id.webp") > 0) {
           
            respond(['url' => "/backend/uploads/$id.webp"], 201);
        }
        @unlink("$dir/$id.webp");
       
    }
}

respond(['url' => "/backend/uploads/$name"], 201); // site-relative: works on any host
