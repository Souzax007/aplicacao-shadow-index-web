<?php
/**
 * API: Ferramentas por Categoria
 * GET /api/ferramentas-por-categoria.php?categoria=jwt&limit=50&offset=0
 * 
 * Retorna todas as ferramentas de uma categoria específica
 */

require_once __DIR__ . '/config.php';

$categoria = isset($_GET['categoria']) ? trim($_GET['categoria']) : '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

if (empty($categoria)) {
    json_error('Categoria não especificada', 400);
}

$limit = min($limit, 200);
$limit = max($limit, 1);

$categoria = $mysqli->real_escape_string($categoria);

// Contar total
$count_result = $mysqli->query("SELECT COUNT(*) as total FROM ferramentas WHERE categoria = '$categoria'");
$count_row = $count_result->fetch_assoc();
$total = (int)$count_row['total'];

// Buscar ferramentas
$ferramentas = [];
$result = $mysqli->query("
    SELECT id, nome, url, descricao, linguagem, stars, topics, categoria, data_insercao
    FROM ferramentas 
    WHERE categoria = '$categoria'
    ORDER BY stars DESC
    LIMIT $limit OFFSET $offset
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
    'total' => $total,
    'categoria' => $categoria,
    'limit' => $limit,
    'offset' => $offset,
    'ferramentas' => $ferramentas
]);
?>
