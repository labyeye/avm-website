<?php
// Streams an uploaded document as a download:
//   GET download.php?id=<page_items.id>      a document attached to a page item
//   GET download.php?page=<pages.slug>       the file attached to a page itself
// Only files stored in /backend/uploads that are attached to an active item can be fetched.
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);

$id = (int)($_GET['id'] ?? 0);
$slug = trim((string)($_GET['page'] ?? ''));
if (!$id && $slug === '') fail('id or page is required', 422);

try {
    if ($slug !== '') {
        $s = db()->prepare('SELECT IF(file_label <> \'\', file_label, title) AS title, file_url FROM pages WHERE slug = ? AND is_active = 1');
        $s->execute([$slug]);
    } else {
        $s = db()->prepare('SELECT title, file_url FROM page_items WHERE id = ? AND is_active = 1');
        $s->execute([$id]);
    }
    $item = $s->fetch();
} catch (PDOException $e) {
    db_fail($e);
}
if (!$item) fail('Not found', 404);

// The stored URL must point at our uploads folder; only the basename is ever used for the filesystem path.
$name = basename((string)parse_url($item['file_url'], PHP_URL_PATH));
if (!preg_match('/^[a-f0-9]{16}\.(pdf|jpg|png)$/', $name, $m)) fail('This item has no downloadable file', 404);
$path = realpath(__DIR__ . '/../../uploads') . DIRECTORY_SEPARATOR . $name;
if (!is_file($path)) fail('File not found', 404);

$types = ['pdf' => 'application/pdf', 'jpg' => 'image/jpeg', 'png' => 'image/png'];
$filename = trim(preg_replace('/[^A-Za-z0-9 _.-]+/', '', $item['title'])) ?: 'document';

header_remove('Content-Type');
header('Content-Type: ' . $types[$m[1]]);
header('Content-Length: ' . filesize($path));
header('Content-Disposition: attachment; filename="' . $filename . '.' . $m[1] . '"');
header('X-Content-Type-Options: nosniff');
readfile($path);
exit;
