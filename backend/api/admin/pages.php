<?php
require_once __DIR__ . '/../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$slug = (string)($_GET['slug'] ?? '');
const PAGE_FIELDS = ['title', 'subtitle', 'banner_url', 'image_url', 'file_url', 'file_label', 'body', 'incharge_name', 'incharge_role', 'incharge_photo_url', 'incharge_message', 'headgirl_name', 'headgirl_photo_url', 'headgirl_message', 'vice_name', 'vice_photo_url', 'vice_message', 'team_photo_url'];

try {
    $pdo = db();
    $find = function (string $slug) use ($pdo) {
        $s = $pdo->prepare('SELECT * FROM pages WHERE slug = ?');
        $s->execute([$slug]);
        return $s->fetch();
    };

    if ($method === 'GET') {
        if ($slug === '') respond($pdo->query("SELECT id, slug, title, layout, is_active, updated_at FROM pages WHERE slug NOT LIKE 'home-%' ORDER BY id")->fetchAll());
        $page = $find($slug);
        if (!$page) fail('Not found', 404);
        respond($page);
    }

    if ($method === 'PUT') {
        if ($slug === '' || !$find($slug)) fail('Not found', 404);
        $in = json_input();
        $set = []; $vals = [];
        foreach (PAGE_FIELDS as $f) {
            if (array_key_exists($f, $in)) { $set[] = "`$f` = ?"; $vals[] = trim((string)$in[$f]); }
        }
        if (array_key_exists('is_active', $in)) { $set[] = '`is_active` = ?'; $vals[] = filter_var($in['is_active'], FILTER_VALIDATE_BOOLEAN) ? 1 : 0; }
        if (isset($in['title']) && trim((string)$in['title']) === '') fail('title cannot be empty', 422);
        if ($set) $pdo->prepare('UPDATE pages SET ' . implode(',', $set) . ' WHERE slug = ?')->execute([...$vals, $slug]);
        respond($find($slug));
    }
    fail('Method not allowed', 405);
} catch (PDOException $e) {
    db_fail($e);
}
