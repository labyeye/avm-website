<?php
// Download an event's photos (or ?type=video) as ZIP batches: ?part=1,2,… each holds BATCH files.
const BATCH = 10;
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);
if (!class_exists('ZipArchive')) fail('ZIP support is not installed on this server', 501);

$id = (int)($_GET['id'] ?? 0);
$type = ($_GET['type'] ?? 'photo') === 'video' ? 'video' : 'photo';
if (!$id) fail('id is required', 422);
$part = max(1, (int)($_GET['part'] ?? 1));

try {
    $pdo = db();
    $e = $pdo->prepare('SELECT title FROM events WHERE id = ? AND is_active = 1');
    $e->execute([$id]);
    $event = $e->fetch();
    if (!$event) fail('Event not found', 404);
    $m = $pdo->prepare('SELECT url FROM event_media WHERE event_id = ? AND type = ? AND is_active = 1 AND url LIKE \'/backend/uploads/%\' ORDER BY sort_order ASC, id ASC');
    $m->execute([$id, $type]);
    $urls = array_slice($m->fetchAll(PDO::FETCH_COLUMN), ($part - 1) * BATCH, BATCH);
} catch (PDOException $ex) {
    db_fail($ex);
}

$dir = realpath(__DIR__ . '/../../uploads');
$tmp = tempnam(sys_get_temp_dir(), 'evz');
$zip = new ZipArchive();
if ($zip->open($tmp, ZipArchive::OVERWRITE) !== true) fail('Could not create ZIP', 500);
$n = 0;
foreach ($urls as $u) {
    if (strpos($u, '/backend/uploads/') !== 0) continue;       // only files stored on this server
    $base = basename($u);
    // WebP display copies: swap in the original (jpg/png with the same id) so downloads are full quality
    if (preg_match('/^([a-f0-9]{16})\.webp$/', $base, $mm)) {
        foreach (['jpg', 'png'] as $oe) { if (is_file("$dir/{$mm[1]}.$oe")) { $base = "{$mm[1]}.$oe"; break; } }
    }
    $path = realpath("$dir/$base");
    if ($path && strpos($path, $dir) === 0 && is_file($path)) { $zip->addFile($path, (($part - 1) * BATCH + ++$n) . '-' . $base); }
}
$zip->close();
if (!$n) { @unlink($tmp); fail('No downloadable files for this event', 404); }

$slug = trim(preg_replace('/[^a-z0-9]+/i', '-', $event['title']), '-') ?: 'event';
header('Content-Type: application/zip');
header('Content-Disposition: attachment; filename="' . $slug . '-' . $type . 's-part' . $part . '.zip"');
header('Content-Length: ' . filesize($tmp));
readfile($tmp);
@unlink($tmp);
