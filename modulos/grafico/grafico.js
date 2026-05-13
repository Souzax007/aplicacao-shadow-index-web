let graficosCarregados = false;
let graficoCategoriaInstancia = null;
let graficoLinguagemInstancia = null;
let graficoTopStarsInstancia = null;
let graficoVarreduraEmpilhadoInstancia = null;
let graficoTempoVarreduraInstancia = null;
let graficoProporcaoNovasDuplicadasInstancia = null;
let graficoCategoriaVarreduraInstancia = null;
let graficoAdicoesInstancia = null;

const PALETA_CORES = ['#31ff75', '#27c8ff', '#5be0ff', '#ffb454', '#ff7f66', '#5be6cf', '#8adf5b', '#f5ce6b', '#8ec5ff', '#9ccf7a'];
const ESTILO_TICK_X = { color: '#9eb0bf', font: { family: 'Share Tech Mono', size: 11 } };
const ESTILO_TICK_Y = { color: '#31ff75', font: { family: 'Share Tech Mono', size: 11 } };
const ESTILO_GRID_X = { color: 'rgba(255,255,255,0.05)' };
const ESTILO_GRID_Y = { color: 'rgba(255,255,255,0.04)' };
const OPCOES_LEGENDA = {
    position: 'bottom',
    labels: { color: '#9eb0bf', font: { family: 'Share Tech Mono', size: 11 }, boxWidth: 12, padding: 10 }
};

function criarGrafico(idCanvas, instanciaAtual, configuracao) {
    if (instanciaAtual) instanciaAtual.destroy();

    const canvas = document.getElementById(idCanvas);
    if (!canvas) return null;

    return new Chart(canvas.getContext('2d'), configuracao);
}

function carregarGraficosBase(dadosPainel) {
    graficoCategoriaInstancia = criarGrafico('categoryChart', graficoCategoriaInstancia, {
        type: 'doughnut',
        data: {
            labels: dadosPainel.por_categoria.map(item => item.categoria),
            datasets: [{
                data: dadosPainel.por_categoria.map(item => item.quantidade),
                backgroundColor: PALETA_CORES,
                borderColor: '#0b1218',
                borderWidth: 2
            }]
        },
        options: { responsive: true, plugins: { legend: OPCOES_LEGENDA } }
    });

    const topLinguagens = estatisticasLinguagem.slice(0, 10);
    graficoLinguagemInstancia = criarGrafico('languageChart', graficoLinguagemInstancia, {
        type: 'bar',
        data: {
            labels: topLinguagens.map(item => item.linguagem),
            datasets: [{
                label: 'Ferramentas',
                data: topLinguagens.map(item => item.quantidade),
                backgroundColor: PALETA_CORES,
                borderRadius: 3
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { x: { ticks: ESTILO_TICK_X, grid: ESTILO_GRID_X }, y: { ticks: ESTILO_TICK_Y, grid: ESTILO_GRID_Y } }
        }
    });
}

async function carregarGraficosSeNecessario() {
    if (!estatisticasPainel || graficosCarregados) return;

    graficosCarregados = true;
    carregarGraficosBase(estatisticasPainel);

    try {
        const [respostaTopStars, respostaVarreduras, respostaRecentes] = await Promise.all([
            fetch(BASE_API + 'top-stars.php?limit=15'),
            fetch(BASE_API + 'varreduras.php?limit=30'),
            fetch(BASE_API + 'recentes.php?limit=100')
        ]);

        const dadosTopStars = await respostaTopStars.json();
        const dadosVarreduras = await respostaVarreduras.json();
        const dadosRecentes = await respostaRecentes.json();

        if (dadosTopStars.status === 'ok') {
            const listaFerramentas = dadosTopStars.ferramentas;
            graficoTopStarsInstancia = criarGrafico('topStarsChart', graficoTopStarsInstancia, {
                type: 'bar',
                data: {
                    labels: listaFerramentas.map(item => item.nome.length > 18 ? item.nome.slice(0, 16) + '…' : item.nome),
                    datasets: [{
                        label: 'Stars',
                        data: listaFerramentas.map(item => item.stars),
                        backgroundColor: PALETA_CORES,
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        tooltip: { callbacks: { label: contexto => ` ${contexto.parsed.y.toLocaleString()} ⭐` } }
                    },
                    scales: {
                        x: { ticks: { ...ESTILO_TICK_X, maxRotation: 38, minRotation: 25 }, grid: ESTILO_GRID_X },
                        y: { ticks: ESTILO_TICK_X, grid: ESTILO_GRID_X }
                    }
                }
            });
        }

        if (dadosVarreduras.status === 'ok') {
            const listaVarreduras = dadosVarreduras.varreduras.slice().reverse();
            const rotulosDias = listaVarreduras.map(item => new Date(item.data_varredura).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }));

            graficoVarreduraEmpilhadoInstancia = criarGrafico('scanStackedChart', graficoVarreduraEmpilhadoInstancia, {
                type: 'bar',
                data: {
                    labels: rotulosDias,
                    datasets: [
                        { label: 'Novas', data: listaVarreduras.map(item => item.quantidade_novas), backgroundColor: '#31ff75cc', borderRadius: 3 },
                        { label: 'Duplicadas', data: listaVarreduras.map(item => item.quantidade_duplicadas), backgroundColor: '#ffb454bb', borderRadius: 3 }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: { legend: OPCOES_LEGENDA },
                    scales: {
                        x: { stacked: true, ticks: { ...ESTILO_TICK_X, maxRotation: 45 }, grid: ESTILO_GRID_Y },
                        y: { stacked: true, ticks: ESTILO_TICK_X, grid: ESTILO_GRID_X }
                    }
                }
            });

            graficoTempoVarreduraInstancia = criarGrafico('scanTimeChart', graficoTempoVarreduraInstancia, {
                type: 'line',
                data: {
                    labels: rotulosDias,
                    datasets: [{
                        label: 'Tempo (s)',
                        data: listaVarreduras.map(item => parseFloat(item.tempo_execucao_segundos.toFixed(2))),
                        borderColor: '#27c8ff',
                        backgroundColor: 'rgba(39,200,255,0.1)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#27c8ff',
                        tension: 0.35,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { ...ESTILO_TICK_X, maxRotation: 45 }, grid: ESTILO_GRID_Y },
                        y: { ticks: ESTILO_TICK_X, grid: ESTILO_GRID_X }
                    }
                }
            });

            const totalNovas = listaVarreduras.reduce((soma, item) => soma + item.quantidade_novas, 0);
            const totalDuplicadas = listaVarreduras.reduce((soma, item) => soma + item.quantidade_duplicadas, 0);
            graficoProporcaoNovasDuplicadasInstancia = criarGrafico('newsDupPieChart', graficoProporcaoNovasDuplicadasInstancia, {
                type: 'doughnut',
                data: {
                    labels: ['Novas', 'Duplicadas'],
                    datasets: [{
                        data: [totalNovas, totalDuplicadas],
                        backgroundColor: ['#31ff75', '#ffb454'],
                        borderColor: '#0b1218',
                        borderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: OPCOES_LEGENDA,
                        tooltip: { callbacks: { label: contexto => ` ${contexto.label}: ${contexto.parsed.toLocaleString()}` } }
                    }
                }
            });

            const mapaCategorias = {};
            listaVarreduras.forEach(item => {
                if (!item.categoria) return;
                mapaCategorias[item.categoria] = (mapaCategorias[item.categoria] || 0) + item.quantidade_encontradas;
            });
            const categoriasOrdenadas = Object.entries(mapaCategorias).sort((a, b) => b[1] - a[1]).slice(0, 12);

            graficoCategoriaVarreduraInstancia = criarGrafico('catScanChart', graficoCategoriaVarreduraInstancia, {
                type: 'bar',
                data: {
                    labels: categoriasOrdenadas.map(item => item[0]),
                    datasets: [{
                        label: 'Encontradas',
                        data: categoriasOrdenadas.map(item => item[1]),
                        backgroundColor: PALETA_CORES,
                        borderRadius: 3
                    }]
                },
                options: {
                    indexAxis: 'y',
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: ESTILO_TICK_X, grid: ESTILO_GRID_X },
                        y: { ticks: { ...ESTILO_TICK_Y, font: { family: 'Share Tech Mono', size: 10 } }, grid: ESTILO_GRID_Y }
                    }
                }
            });
        }

        if (dadosRecentes.status === 'ok') {
            const mapaAdicoesDia = {};
            dadosRecentes.ferramentas.forEach(item => {
                const dia = item.data_insercao ? item.data_insercao.slice(0, 10) : null;
                if (dia) mapaAdicoesDia[dia] = (mapaAdicoesDia[dia] || 0) + 1;
            });

            const diasOrdenados = Object.keys(mapaAdicoesDia).sort();
            graficoAdicoesInstancia = criarGrafico('additionsLineChart', graficoAdicoesInstancia, {
                type: 'line',
                data: {
                    labels: diasOrdenados.map(dia => new Date(dia + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })),
                    datasets: [{
                        label: 'Adicoes',
                        data: diasOrdenados.map(dia => mapaAdicoesDia[dia]),
                        borderColor: '#a855f7',
                        backgroundColor: 'rgba(168,85,247,0.12)',
                        borderWidth: 2,
                        pointRadius: 3,
                        pointBackgroundColor: '#a855f7',
                        tension: 0.3,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { ticks: { ...ESTILO_TICK_X, maxRotation: 45 }, grid: ESTILO_GRID_Y },
                        y: { ticks: ESTILO_TICK_X, grid: ESTILO_GRID_X }
                    }
                }
            });
        }
    } catch (erro) {
        console.error('Erro ao carregar graficos adicionais:', erro);
    }
}
