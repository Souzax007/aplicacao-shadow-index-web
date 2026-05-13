<?php
/**
 * API: Top Stars
 * GET /api/top-stars.php?limit=20
 * 
 * Retorna ferramentas mais estreladas
 */

require_once __DIR__ . '/config.php';

$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$limit = min($limit, 200);
$limit = max($limit, 1);

$ferramentas = [];
$result = $mysqli->query("
    SELECT id, nome, url, descricao, linguagem, stars, topics, categoria, data_insercao
    FROM ferramentas 
    ORDER BY stars DESC
    LIMIT $limit
");

while ($row = $result->fetch_assoc()) {
    $ferramentas[] = [
        'id' => (int)$row['id'],
        'nome' => $row['nome'],
        'url' => $row['url'],
        'descricao' => $row['descricao'],
        'linguagem' => $row['linguagem'],
        'stars' => (int)$row['stars'],
        'topics' => $row['topics'],
        'categoria' => $row['categoria'],
        'data_insercao' => $row['data_insercao']
    ];
}

json_success([
    'count' => count($ferramentas),
    'ferramentas' => $ferramentas
]);
?>
