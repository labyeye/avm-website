<?php
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$in = json_input();
$f = [];
foreach (['name', 'email', 'phone', 'subject', 'message'] as $k) $f[$k] = trim((string)($in[$k] ?? ''));
foreach (['name', 'email', 'message'] as $k) if ($f[$k] === '') fail("$k is required", 422);
if (!filter_var($f['email'], FILTER_VALIDATE_EMAIL)) fail('Invalid email address', 422);
if ($f['phone'] !== '' && !preg_match('/^[0-9+\-\s()]{7,20}$/', $f['phone'])) fail('Invalid phone number', 422);
if (mb_strlen($f['name']) > 150 || mb_strlen($f['subject']) > 255 || mb_strlen($f['message']) > 5000) fail('Input too long', 422);

try {
    $pdo = db();
    $pdo->prepare('INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)')->execute(array_values($f));
    respond(['id' => (int)$pdo->lastInsertId()], 201);
} catch (PDOException $e) {
    db_fail($e);
}
