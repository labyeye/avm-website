<?php
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/crud.php';

crud_handle(
    'page_items',
    [
        'page_slug' => 'str', 'title' => 'str', 'subtitle' => 'str', 'description' => 'str',
        'captain' => 'str', 'incharge' => 'str', 'captain_photo_url' => 'str', 'incharge_photo_url' => 'str', 'team_photo_url' => 'str',
        'image_url' => 'str', 'file_url' => 'str', 'sort_order' => 'int', 'is_active' => 'bool',
    ],
    ['page_slug', 'title'],
    'sort_order ASC, id ASC',
    'page_slug'
);
