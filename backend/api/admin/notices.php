<?php
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/crud.php';

crud_handle(
    'notices',
    ['title' => 'str', 'content' => 'str', 'link_url' => 'str', 'image_url' => 'str', 'published_at' => 'date', 'is_active' => 'bool'],
    ['title', 'published_at'],
    'published_at DESC, id DESC'
);
