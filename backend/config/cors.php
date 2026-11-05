<?php
// JSON + CORS headers, OPTIONS preflight, and response helpers.
// Required (via db.php / session.php) by every endpoint.

function env_value(string $key, string $default = ''): string
{
    static $vars = null;
    if ($vars === null) {
        $vars = [];
        $file = __DIR__ . '/../.env';
        if (is_readable($file)) {
            foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);
                if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;
                [$k, $v] = explode('=', $line, 2);
                $vars[trim($k)] = trim($v, " \t\"'");
            }
        }
    }
    return $vars[$key] ?? $default;
}

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: ' . env_value('CORS_ORIGIN', 'http://localhost:5173'));
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

function respond($data = null, int $code = 200): void
{
    http_response_code($code);
    echo json_encode(['success' => true, 'data' => $data], JSON_UNESCAPED_UNICODE);
    exit();
}

function fail(string $message, int $code = 400): void
{
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit();
}

function json_input(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw ?: '', true);
    return is_array($data) ? $data : [];
}

// Database failures: always logged; the real message is returned only in local development.
function db_fail(Throwable $e): void
{
    error_log('[AVM] ' . $e->getMessage());
    $debug = env_value('APP_DEBUG', strpos(env_value('CORS_ORIGIN', 'http://localhost:5173'), 'localhost') !== false ? 'true' : 'false') === 'true';
    fail($debug ? 'Database error: ' . $e->getMessage() : 'Database error', 500);
}
