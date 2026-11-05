<?php
require_once __DIR__ . '/../../middleware/auth.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);

try {
    $pdo = db();
    $count = fn(string $sql) => (int)$pdo->query($sql)->fetchColumn();
    respond([
        'admin' => ['id' => (int)$_SESSION['admin_id'], 'username' => $_SESSION['admin_username'] ?? 'admin'],
        'total_admissions' => $count('SELECT COUNT(*) FROM admissions'),
        'active_gallery' => $count('SELECT COUNT(*) FROM gallery WHERE is_active = 1'),
        'active_testimonials' => $count('SELECT COUNT(*) FROM testimonials WHERE is_active = 1'),
        'published_notices' => $count('SELECT COUNT(*) FROM notices WHERE is_active = 1'),
        'recent_admissions' => $pdo->query('SELECT id, student_name, class_applied, phone, submitted_at FROM admissions ORDER BY submitted_at DESC, id DESC LIMIT 5')->fetchAll(),
    ]);
} catch (PDOException $e) {
    db_fail($e);
}
