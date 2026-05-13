<?php
/**
 * API: Listar Ferramentas
 * GET /api/ferramentas.php?categoria=&limit=50&offset=0
 * 
 * Retorna lista de ferramentas com paginação e filtros
 */

require_once __DIR__ . '/config.php';

$limit    = isset($_GET['limit'])     ? (int)$_GET['limit']              : 50;
$offset   = isset($_GET['offset'])    ? (int)$_GET['offset']             : 0;
$categoria = isset($_GET['categoria']) ? trim($_GET['categoria'])         : '';
$linguagem = isset($_GET['linguagem']) ? trim($_GET['linguagem'])         : '';
$sort      = isset($_GET['sort'])      ? trim($_GET['sort'])              : 'nome';

// Validar limite
$limit = min($limit, 200);
$limit = max($limit, 1);

// Colunas permitidas para ordenação
$allowed_sorts = ['nome', 'stars', 'data_insercao', 'categoria', 'linguagem'];
if (!in_array($sort, $allowed_sorts)) $sort = 'nome';

// Direção de ordenação
$order_dir = ($sort === 'stars' || $sort === 'data_insercao') ? 'DESC' : 'ASC';

// Condições WHERE
$conditions = ["1=1"];
if (!empty($categoria)) {
    $conditions[] = "categoria = '" . $mysqli->real_escape_string($categoria) . "'";
}
if (!empty($linguagem)) {
    $conditions[] = "linguagem = '" . $mysqli->real_escape_string($linguagem) . "'";
}
$where = implode(' AND ', $conditions);

// Contar total
$count_result = $mysqli->query("SELECT COUNT(*) as total FROM ferramentas WHERE $where");
$count_row = $count_result->fetch_assoc();
$total = (int)$count_row['total'];

// Buscar ferramentas
$ferramentas = [];
$result = $mysqli->query("
    SELECT id, nome, url, descricao, linguagem, stars, topics, categoria, data_insercao
    FROM ferramentas
    WHERE $where
    ORDER BY $sort $order_dir
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
    'limit' => $limit,
    'offset' => $offset,
    'ferramentas' => $ferramentas
]);
?>
