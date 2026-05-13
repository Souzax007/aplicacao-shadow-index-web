<?php
/**
 * API: Health Check
 * GET /api/health.php
 * 
 * Retorna o status da API e da conexão com banco de dados
 */

require_once __DIR__ . '/config.php';

$health = [
    'status' => 'ok',
    'database' => 'connected',
    'timestamp' => date('c'),
    'server' => [
        'php_version' => phpversion(),
        'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
    ]
];

json_success($health);
?>
