<?php
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/crud.php';

crud_handle(
    'testimonials',
    ['title' => 'str', 'video_url' => 'str', 'thumbnail_url' => 'str', 'is_active' => 'bool'],
    ['title', 'video_url', 'thumbnail_url'],
    'id ASC'
);
