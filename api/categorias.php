<?php
/**
 * API: Listar Categorias
 * GET /api/categorias.php
 * 
 * Retorna lista de categorias com contagem de ferramentas
 */

require_once __DIR__ . '/config.php';

$categorias = [];
$result = $mysqli->query("
    SELECT categoria, COUNT(*) as quantidade 
    FROM ferramentas 
    WHERE categoria IS NOT NULL AND categoria != ''
    GROUP BY categoria 
    ORDER BY quantidade DESC
");

while ($row = $result->fetch_assoc()) {
    $categorias[] = [
        'nome' => $row['categoria'],
        'quantidade' => (int)$row['quantidade']
    ];
}

json_success([
    'count' => count($categorias),
    'categorias' => $categorias
]);
?>
