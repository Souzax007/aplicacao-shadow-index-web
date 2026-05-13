<?php
/**
 * API: Varreduras (Histórico)
 * GET /api/varreduras.php?limit=50&offset=0
 * 
 * Retorna histórico de varreduras realizadas
 */

require_once __DIR__ . '/config.php';

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

$limit = min($limit, 200);
$limit = max($limit, 1);

// Contar total
$count_result = $mysqli->query("SELECT COUNT(*) as total FROM varreduras");
$count_row = $count_result->fetch_assoc();
$total = (int)$count_row['total'];

// Buscar varreduras
$varreduras = [];
$result = $mysqli->query("
    SELECT id, categoria, queries, quantidade_encontradas, quantidade_novas, 
           quantidade_duplicadas, tempo_execucao_segundos, data_varredura
    FROM varreduras 
    ORDER BY data_varredura DESC
    LIMIT $limit OFFSET $offset
");

while ($row = $result->fetch_assoc()) {
    $varreduras[] = [
        'id' => (int)$row['id'],
        'categoria' => $row['categoria'],
        'queries' => (int)$row['queries'],
        'quantidade_encontradas' => (int)$row['quantidade_encontradas'],
        'quantidade_novas' => (int)$row['quantidade_novas'],
        'quantidade_duplicadas' => (int)$row['quantidade_duplicadas'],
        'tempo_execucao_segundos' => (float)$row['tempo_execucao_segundos'],
        'data_varredura' => $row['data_varredura']
    ];
}

json_success([
    'count' => count($varreduras),
    'total' => $total,
    'limit' => $limit,
    'offset' => $offset,
    'varreduras' => $varreduras
]);
?>
