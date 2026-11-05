<?php
require_once __DIR__ . '/../../config/session.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail('Method not allowed', 405);

$in = json_input();
$username = trim((string)($in['username'] ?? ''));
$password = (string)($in['password'] ?? '');
if ($username === '' || $password === '') fail('Username and password are required', 422);

try {
    $s = db()->prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?');
    $s->execute([$username]);
    $user = $s->fetch();
} catch (PDOException $e) {
    db_fail($e);
}

if (!$user || !password_verify($password, $user['password_hash'])) {
    fail('Invalid username or password', 401);
}

session_regenerate_id(true);
$_SESSION['admin_id'] = (int)$user['id'];
$_SESSION['admin_username'] = $user['username'];
respond(['id' => (int)$user['id'], 'username' => $user['username']]);
