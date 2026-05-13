<div id="charts-tab" class="tab-content hidden pt-4">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div class="chart-box">
            <div class="section-title mb-4">Distribuicao por Categoria</div>
            <canvas id="categoryChart"></canvas>
        </div>
        <div class="chart-box">
            <div class="section-title mb-4">Top 10 Linguagens</div>
            <canvas id="languageChart"></canvas>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div class="chart-box">
            <div class="section-title mb-4">Top 15 Ferramentas por Stars</div>
            <canvas id="topStarsChart"></canvas>
        </div>
        <div class="chart-box">
            <div class="section-title mb-4">Novas vs Duplicadas por Varredura</div>
            <canvas id="scanStackedChart"></canvas>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div class="chart-box">
            <div class="section-title mb-4">Tempo de Execucao (s) por Varredura</div>
            <canvas id="scanTimeChart"></canvas>
        </div>
        <div class="chart-box">
            <div class="section-title mb-4">Proporcao Total: Novas vs Duplicadas</div>
            <canvas id="newsDupPieChart"></canvas>
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        <div class="chart-box">
            <div class="section-title mb-4">Ferramentas Encontradas por Categoria (Varreduras)</div>
            <canvas id="catScanChart"></canvas>
        </div>
        <div class="chart-box">
            <div class="section-title mb-4">Adicoes de Ferramentas por Data</div>
            <canvas id="additionsLineChart"></canvas>
        </div>
    </div>
</div>
