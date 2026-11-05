<?php
require_once __DIR__ . '/../../middleware/auth.php';

const SETTING_KEYS = ['hero_heading', 'about_text', 'contact_email', 'contact_phone', 'address', 'facebook_url', 'instagram_url', 'youtube_url',
    'hero_image', 'about_heading', 'about_subheading', 'gallery_heading', 'gallery_subheading',
    'gallery_columns', 'gallery_scroll', 'gallery_height', 'admission_heading', 'admission_subheading', 'testimonials_heading', 'testimonials_subheading',
    'live_active', 'live_url', 'live_title'];
$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = db();
    $all = fn() => (object)$pdo->query('SELECT `key`, `value` FROM site_settings')->fetchAll(PDO::FETCH_KEY_PAIR);

    if ($method === 'GET') respond($all());

    if ($method === 'PUT') {
        $in = json_input();
        $stmt = $pdo->prepare('INSERT INTO site_settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`)');
        $pdo->beginTransaction();
        foreach (SETTING_KEYS as $k) {
            if (array_key_exists($k, $in)) $stmt->execute([$k, trim((string)$in[$k])]);
        }
        $pdo->commit();
        respond($all());
    }
    fail('Method not allowed', 405);
} catch (PDOException $e) {
    if (isset($pdo) && $pdo->inTransaction()) $pdo->rollBack();
    db_fail($e);
}
