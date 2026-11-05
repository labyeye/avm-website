<?php
require_once __DIR__ . '/../../middleware/auth.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $pdo = db();
    if ($method === 'GET') respond($pdo->query('SELECT * FROM contact_messages ORDER BY submitted_at DESC, id DESC')->fetchAll());
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) fail('id is required', 422);
        $s = $pdo->prepare('DELETE FROM contact_messages WHERE id = ?');
        $s->execute([$id]);
        if (!$s->rowCount()) fail('Not found', 404);
        respond(null);
    }
    fail('Method not allowed', 405);
} catch (PDOException $e) {
    db_fail($e);
}
