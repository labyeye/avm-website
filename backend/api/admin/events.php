<?php
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/crud.php';

crud_handle(
    'events',
    [
        'title' => 'str', 'event_date' => 'date', 'location' => 'str', 'description' => 'str',
        'poster_url' => 'str', 'sort_order' => 'int', 'is_active' => 'bool',
    ],
    ['title', 'event_date'],
    'event_date DESC, id DESC'
);
