<?php
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/crud.php';

// GET ?event_id=N lists one event's media.
crud_handle(
    'event_media',
    [
        'event_id' => 'int', 'type' => 'str', 'url' => 'str', 'caption' => 'str',
        'sort_order' => 'int', 'in_album' => 'bool', 'is_active' => 'bool',
    ],
    ['event_id', 'url'],
    'sort_order ASC, id ASC',
    'event_id'
);
