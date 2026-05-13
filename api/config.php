<?php
/**
 * Configuracao central da API.
 *
 * As credenciais do banco sao carregadas do arquivo .env na raiz do projeto.
 */

function load_env_file($path) {
    if (!is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);

        if ($line === '' || substr($line, 0, 1) === '#') {
            continue;
        }

        $parts = explode('=', $line, 2);
        if (count($parts) !== 2) {
            continue;
        }

        $key = trim($parts[0]);
        $value = trim($parts[1]);

        if ($value !== '' && (
            ($value[0] === '"' && substr($value, -1) === '"') ||
            ($value[0] === "'" && substr($value, -1) === "'")
        )) {
            $value = substr($value, 1, -1);
        }

        if (getenv($key) === false) {
            putenv($key . '=' . $value);
            $_ENV[$key] = $value;
            $_SERVER[$key] = $value;
        }
    }
}

function env_value($key, $default = null) {
    $value = getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }
    return $value;
}

load_env_file(__DIR__ . '/../.env');

$DB_HOST = env_value('DB_HOST', '127.0.0.1');
$DB_USER = env_value('DB_USER', 'root');
$DB_PASSWORD = env_value('DB_PASSWORD', '');
$DB_NAME = env_value('DB_NAME', 'osint_tools');
$DB_PORT = (int) env_value('DB_PORT', '3306');

if ($DB_USER === '' || $DB_NAME === '') {
    http_response_code(500);
    die(json_encode([
        'status' => 'error',
        'message' => 'Variaveis obrigatorias ausentes em .env (DB_USER/DB_NAME).'
    ]));
}

$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASSWORD, $DB_NAME, $DB_PORT);

if ($mysqli->connect_error) {
    http_response_code(500);
    die(json_encode([
        'status' => 'error',
        'message' => 'Erro de conexao com banco de dados.'
    ]));
}

$mysqli->set_charset('utf8mb4');

function json_error($message, $code = 500) {
    http_response_code($code);
    echo json_encode([
        'status' => 'error',
        'message' => $message
    ]);
    exit;
}

function json_success($data = []) {
    echo json_encode(array_merge(['status' => 'ok'], $data));
    exit;
}

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
