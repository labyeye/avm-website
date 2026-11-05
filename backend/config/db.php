<?php
require_once __DIR__ . '/cors.php';

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            env_value('DB_HOST', '127.0.0.1'),
            env_value('DB_PORT', '3306'),
            env_value('DB_NAME', 'avm_website')
        );
        try {
            $pdo = new PDO($dsn, env_value('DB_USER', 'root'), env_value('DB_PASS', ''), [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]);
        } catch (PDOException $e) {
            fail('Database connection failed', 500);
        }
    }
    return $pdo;
}
