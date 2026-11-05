<?php
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);

try {
    $rows = db()->query('SELECT id, title, video_url, thumbnail_url FROM testimonials WHERE is_active = 1 ORDER BY id ASC')->fetchAll();
    respond($rows);
} catch (PDOException $e) {
    db_fail($e);
}
