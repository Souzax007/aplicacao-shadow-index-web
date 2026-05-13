<?php
/**
 * API: Estatísticas
 * GET /api/stats.php
 * 
 * Retorna estatísticas do banco de dados
 */

require_once __DIR__ . '/config.php';

// Total de ferramentas
$result = $mysqli->query("SELECT COUNT(*) as total FROM ferramentas");
$row = $result->fetch_assoc();
$total_ferramentas = $row['total'] ?? 0;

// Total de varreduras
$result = $mysqli->query("SELECT COUNT(*) as total FROM varreduras");
$row = $result->fetch_assoc();
$total_varreduras = $row['total'] ?? 0;

// Ferramentas por categoria
$por_categoria = [];
$result = $mysqli->query("
    SELECT categoria, COUNT(*) as quantidade 
    FROM ferramentas 
    WHERE categoria IS NOT NULL AND categoria != ''
    GROUP BY categoria 
    ORDER BY quantidade DESC
");
while ($row = $result->fetch_assoc()) {
    $por_categoria[] = [
        'categoria' => $row['categoria'],
        'quantidade' => (int)$row['quantidade']
    ];
}

// Top 10 mais estreladas
$top_stars = [];
$result = $mysqli->query("
    SELECT id, nome, stars, url 
    FROM ferramentas 
    ORDER BY stars DESC 
    LIMIT 10
");
while ($row = $result->fetch_assoc()) {
    $top_stars[] = [
        'id' => (int)$row['id'],
        'nome' => $row['nome'],
        'stars' => (int)$row['stars'],
        'url' => $row['url']
    ];
}

json_success([
    'total_ferramentas' => $total_ferramentas,
    'total_varreduras' => $total_varreduras,
    'por_categoria' => $por_categoria,
    'top_stars' => $top_stars
]);
?>
