<?php
require_once __DIR__ . '/../../config/db.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);

try {
    $pdo = db();
    $id = (int)($_GET['id'] ?? 0);
    if ($id) {
        $s = $pdo->prepare('SELECT id, title, event_date, location, description, poster_url FROM events WHERE id = ? AND is_active = 1');
        $s->execute([$id]);
        $event = $s->fetch();
        if (!$event) fail('Event not found', 404);
        $m = $pdo->prepare('SELECT id, type, url, caption, in_album FROM event_media WHERE event_id = ? AND is_active = 1 ORDER BY sort_order ASC, id ASC');
        $m->execute([$id]);
        $event['media'] = $m->fetchAll();
        respond($event);
    }
    respond($pdo->query(
        "SELECT e.id, e.title, e.event_date, e.location, e.description, e.poster_url,
            (SELECT COUNT(*) FROM event_media m WHERE m.event_id = e.id AND m.is_active = 1 AND m.type = 'photo') AS photo_count,
            (SELECT COUNT(*) FROM event_media m WHERE m.event_id = e.id AND m.is_active = 1 AND m.type = 'video') AS video_count
         FROM events e WHERE e.is_active = 1 ORDER BY e.event_date DESC, e.id DESC"
    )->fetchAll());
} catch (PDOException $e) {
    db_fail($e);
}
