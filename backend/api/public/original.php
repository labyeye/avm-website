<?php
// Download the ORIGINAL (full quality) of an uploaded image: GET original.php?f=<id>.webp
// Uploads of JPG/PNG are shown as WebP on the site; the untouched original sits beside it with the same id.
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);
$f = basename((string)($_GET['f'] ?? ''));
if (!preg_match('/^([a-f0-9]{16})\.(webp|jpg|png|gif)$/', $f, $m)) fail('Not found', 404);

$dir = realpath(__DIR__ . '/../../uploads');
$path = null;
foreach (['jpg', 'png', $m[2]] as $ext) {            // original first, the file itself as fallback
    if (is_file("$dir/{$m[1]}.$ext")) { $path = "$dir/{$m[1]}.$ext"; $ext_found = $ext; break; }
}
if (!$path) fail('File not found', 404);

$types = ['jpg' => 'image/jpeg', 'png' => 'image/png', 'webp' => 'image/webp', 'gif' => 'image/gif'];
header_remove('Content-Type');
header('Content-Type: ' . $types[$ext_found]);
header('Content-Length: ' . filesize($path));
header('Content-Disposition: attachment; filename="' . basename($path) . '"');
header('X-Content-Type-Options: nosniff');
readfile($path);
exit;
