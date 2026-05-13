<?php
/**
 * Shadow Index - Web Dashboard modularizado por abas.
 */

function asset_version(string $path): string {
    $fullPath = __DIR__ . '/' . $path;
    return is_file($fullPath) ? (string) filemtime($fullPath) : (string) time();
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#020406">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Shadow Index">
    <link rel="manifest" href="manifest.webmanifest?v=<?php echo asset_version('manifest.webmanifest'); ?>">
    <link rel="apple-touch-icon" href="assets/icons/icon-192.svg?v=<?php echo asset_version('assets/icons/icon-192.svg'); ?>">
    <title>Shadow Index</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="modulos/layout/layout.css?v=<?php echo asset_version('modulos/layout/layout.css'); ?>">
    <link rel="stylesheet" href="modulos/finder/finder.css?v=<?php echo asset_version('modulos/finder/finder.css'); ?>">
    <link rel="stylesheet" href="modulos/grafico/grafico.css?v=<?php echo asset_version('modulos/grafico/grafico.css'); ?>">
    <link rel="stylesheet" href="modulos/top-stars/top-stars.css?v=<?php echo asset_version('modulos/top-stars/top-stars.css'); ?>">
    <link rel="stylesheet" href="modulos/recentes/recentes.css?v=<?php echo asset_version('modulos/recentes/recentes.css'); ?>">
    <link rel="stylesheet" href="modulos/historico/historico.css?v=<?php echo asset_version('modulos/historico/historico.css'); ?>">
    <link rel="stylesheet" href="modulos/radioativo/radioativo.css?v=<?php echo asset_version('modulos/radioativo/radioativo.css'); ?>">
    <link rel="stylesheet" href="assets/mobile-pwa.css?v=<?php echo asset_version('assets/mobile-pwa.css'); ?>">
</head>
<body>
<?php include __DIR__ . '/modulos/layout/nav.php'; ?>

<div class="max-w-7xl mx-auto px-4 py-6">
    <div class="mb-6 text-sm">
        <span class="prompt-user">root@shadow-index</span><span class="prompt">:~# </span>
        <span style="color:#ccc" class="blink">search --all-tools --interactive</span>
    </div>

    <div>
        <div class="flex tabs-border mb-0">
            <button class="tab-btn active" data-tab="finder-tab"><i class="fas fa-search mr-1"></i> Finder</button>
            <button class="tab-btn" data-tab="charts-tab"><i class="fas fa-chart-pie mr-1"></i> Graficos</button>
            <button class="tab-btn" data-tab="top-stars-tab"><i class="fas fa-star mr-1"></i> Top Stars</button>
            <button class="tab-btn" data-tab="recent-tab"><i class="fas fa-clock mr-1"></i> Recentes</button>
            <button class="tab-btn" data-tab="scans-tab"><i class="fas fa-history mr-1"></i> Historico</button>
            <button class="tab-btn" data-tab="radioativo-tab"><i class="fas fa-radiation mr-1"></i> Radioativo</button>
        </div>

        <?php include __DIR__ . '/modulos/finder/finder.php'; ?>
        <?php include __DIR__ . '/modulos/grafico/grafico.php'; ?>
        <?php include __DIR__ . '/modulos/top-stars/top-stars.php'; ?>
        <?php include __DIR__ . '/modulos/recentes/recentes.php'; ?>
        <?php include __DIR__ . '/modulos/historico/historico.php'; ?>
        <?php include __DIR__ . '/modulos/radioativo/radioativo.php'; ?>
    </div>
</div>

<?php include __DIR__ . '/modulos/layout/modal.php'; ?>

<script src="modulos/core/core.js?v=<?php echo asset_version('modulos/core/core.js'); ?>" defer></script>
<script src="modulos/finder/finder.js?v=<?php echo asset_version('modulos/finder/finder.js'); ?>" defer></script>
<script src="modulos/grafico/grafico.js?v=<?php echo asset_version('modulos/grafico/grafico.js'); ?>" defer></script>
<script src="modulos/top-stars/top-stars.js?v=<?php echo asset_version('modulos/top-stars/top-stars.js'); ?>" defer></script>
<script src="modulos/recentes/recentes.js?v=<?php echo asset_version('modulos/recentes/recentes.js'); ?>" defer></script>
<script src="modulos/historico/historico.js?v=<?php echo asset_version('modulos/historico/historico.js'); ?>" defer></script>
<script src="modulos/radioativo/radioativo.js?v=<?php echo asset_version('modulos/radioativo/radioativo.js'); ?>" defer></script>
</body>
</html>
