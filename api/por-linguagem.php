<?php
/**
 * API: Agrupado por Linguagem
 * GET /api/por-linguagem.php
 * 
 * Retorna ferramentas agrupadas por linguagem de programação
 */

require_once __DIR__ . '/config.php';

$linguagens = [];
$result = $mysqli->query("
    SELECT linguagem, COUNT(*) as quantidade, SUM(stars) as total_stars
    FROM ferramentas 
    WHERE linguagem IS NOT NULL AND linguagem != '' AND linguagem != 'Unknown'
    GROUP BY linguagem 
    ORDER BY quantidade DESC
");

while ($row = $result->fetch_assoc()) {
    $linguagens[] = [
        'linguagem' => $row['linguagem'],
        'quantidade' => (int)$row['quantidade'],
        'total_stars' => (int)($row['total_stars'] ?? 0)
    ];
}

json_success([
    'count' => count($linguagens),
    'linguagens' => $linguagens
]);
?>
