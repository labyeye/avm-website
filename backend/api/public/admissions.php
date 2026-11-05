<?php
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$in = json_input();
$f = [];
foreach (['student_name', 'parent_name', 'email', 'phone', 'dob', 'class_applied'] as $k) {
    $f[$k] = trim((string)($in[$k] ?? ''));
    if ($f[$k] === '') fail("$k is required", 422);
}

if (!filter_var($f['email'], FILTER_VALIDATE_EMAIL)) fail('Invalid email address', 422);
if (!preg_match('/^[0-9+\-\s()]{7,20}$/', $f['phone'])) fail('Invalid phone number', 422);
$d = DateTime::createFromFormat('Y-m-d', $f['dob']);
if (!$d || $d->format('Y-m-d') !== $f['dob'] || $d > new DateTime()) fail('Invalid date of birth', 422);
$classes = array_merge(['Nursery', 'KG'], array_map(fn($n) => "Class $n", range(1, 12)));
if (!in_array($f['class_applied'], $classes, true)) fail('Invalid class', 422);
if (mb_strlen($f['student_name']) > 150 || mb_strlen($f['parent_name']) > 150) fail('Name too long', 422);

try {
    $pdo = db();
    $pdo->prepare('INSERT INTO admissions (student_name, parent_name, email, phone, dob, class_applied) VALUES (?, ?, ?, ?, ?, ?)')
        ->execute(array_values($f));
    respond(['id' => (int)$pdo->lastInsertId()], 201);
} catch (PDOException $e) {
    db_fail($e);
}
