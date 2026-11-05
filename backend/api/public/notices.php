<?php
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);

try {
    $rows = db()->query('SELECT id, title, content, published_at FROM notices WHERE is_active = 1 ORDER BY published_at DESC, id DESC')->fetchAll();
    respond($rows);
} catch (PDOException $e) {
    db_fail($e);
}
