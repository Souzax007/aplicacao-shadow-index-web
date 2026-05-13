<?php
/**
 * API: Busca Avançada
 * GET /api/search.php?q=termo&limit=50
 * 
 * Busca em nome, descrição e tópicos
 */

require_once __DIR__ . '/config.php';

$q = isset($_GET['q']) ? trim($_GET['q']) : '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;

if (empty($q)) {
    json_error('Termo de busca vazio', 400);
}

$limit = min($limit, 200);
$limit = max($limit, 1);

$q = $mysqli->real_escape_string($q);

$ferramentas = [];
$result = $mysqli->query("
    SELECT id, nome, url, descricao, linguagem, stars, topics, categoria, data_insercao
    FROM ferramentas 
    WHERE nome LIKE '%$q%' 
       OR descricao LIKE '%$q%' 
       OR topics LIKE '%$q%'
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
    'query' => $q,
    'ferramentas' => $ferramentas
]);
?>
