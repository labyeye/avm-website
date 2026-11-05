<?php
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);

$slug = trim((string)($_GET['slug'] ?? ''));
if ($slug === '') fail('slug is required', 422);

try {
    $pdo = db();
    $s = $pdo->prepare('SELECT slug, title, subtitle, banner_url, image_url, file_url, file_label, body, layout FROM pages WHERE slug = ? AND is_active = 1');
    $s->execute([$slug]);
    $page = $s->fetch();
    if (!$page) fail('Page not found', 404);

    $i = $pdo->prepare('SELECT id, title, subtitle, description, image_url, file_url FROM page_items WHERE page_slug = ? AND is_active = 1 ORDER BY sort_order ASC, id ASC');
    $i->execute([$slug]);
    $page['items'] = $i->fetchAll();
    respond($page);
} catch (PDOException $e) {
    db_fail($e);
}
