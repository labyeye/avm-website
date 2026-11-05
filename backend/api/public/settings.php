<?php
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);

try {
    $rows = db()->query('SELECT `key`, `value` FROM site_settings')->fetchAll(PDO::FETCH_KEY_PAIR);
    respond((object)$rows);
} catch (PDOException $e) {
    db_fail($e);
}
