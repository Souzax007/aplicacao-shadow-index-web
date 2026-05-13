<?php
/**
 * API: Detalhes de Uma Ferramenta
 * GET /api/ferramentas-detalhes.php?id=1
 * 
 * Retorna detalhes completos de uma ferramenta específica
 */

require_once __DIR__ . '/config.php';

$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

if ($id <= 0) {
    json_error('ID inválido', 400);
}

$result = $mysqli->query("
    SELECT * FROM ferramentas WHERE id = $id
");

if ($result->num_rows === 0) {
    json_error('Ferramenta não encontrada', 404);
}

$row = $result->fetch_assoc();

json_success([
    'ferramenta' => [
        'id' => (int)$row['id'],
        'nome' => $row['nome'],
        'url' => $row['url'],
        'descricao' => $row['descricao'],
        'linguagem' => $row['linguagem'],
        'stars' => (int)$row['stars'],
        'topics' => $row['topics'],
        'categoria' => $row['categoria'],
        'query' => $row['query'],
        'data_insercao' => $row['data_insercao'],
        'data_atualizacao' => $row['data_atualizacao']
    ]
]);
?>
