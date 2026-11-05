<?php
require_once __DIR__ . '/../config/session.php';

if (empty($_SESSION['admin_id'])) {
    fail('Unauthorized', 401);
}
