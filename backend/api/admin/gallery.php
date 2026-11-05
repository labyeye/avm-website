<?php
require_once __DIR__ . '/../../middleware/auth.php';
require_once __DIR__ . '/../../config/crud.php';

crud_handle(
    'gallery',
    ['image_url' => 'str', 'caption' => 'str', 'sort_order' => 'int', 'is_active' => 'bool'],
    ['image_url'],
    'sort_order ASC, id ASC'
);
