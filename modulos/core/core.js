const BASE_API = 'api/';
let paginaAtual = 0;
const itensPorPagina = 20;
let ordenacaoAtual = 'nome';
let visaoFinder = 'tools';
let estatisticasPainel = null;
let estatisticasLinguagem = [];

function atualizarRelogio() {
    const agora = new Date();
    const relogio = document.getElementById('clock');
    if (!relogio) return;
    relogio.textContent =
        agora.toLocaleDateString('pt-BR') + ' ' +
        agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function aguardarDigitacao(funcao, tempoMs) {
    let temporizador;
    return (...argumentos) => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => funcao(...argumentos), tempoMs);
    };
}

function formatarValorStars(valorStars) {
    if (!valorStars) return '0';
    return valorStars >= 1000 ? `${(valorStars / 1000).toFixed(1)}k` : `${valorStars}`;
}

function vincularAbas() {
    document.querySelectorAll('.tab-btn').forEach(botao => {
        botao.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(aba => aba.classList.add('hidden'));
            botao.classList.add('active');

            const idAba = botao.dataset.tab;
            const elementoAba = document.getElementById(idAba);
            if (elementoAba) elementoAba.classList.remove('hidden');

            if (idAba === 'charts-tab' && typeof carregarGraficosSeNecessario === 'function') carregarGraficosSeNecessario();
            if (idAba === 'finder-tab' && typeof definirVisaoFinder === 'function') definirVisaoFinder(visaoFinder);
            if (idAba === 'top-stars-tab' && typeof carregarTopStars === 'function') carregarTopStars('top-stars-tab', 24);
            if (idAba === 'recent-tab' && typeof carregarRecentes === 'function') carregarRecentes();
            if (idAba === 'scans-tab' && typeof carregarHistoricoVarreduras === 'function') carregarHistoricoVarreduras('scansTableBody');
            if (idAba === 'radioativo-tab' && typeof carregarRadioativo === 'function') carregarRadioativo();
        });
    });
}

function vincularModalDetalhes() {
    document.getElementById('closeModal')?.addEventListener('click', () => {
        document.getElementById('detailModal')?.classList.add('hidden');
    });

    document.getElementById('detailModal')?.addEventListener('click', (evento) => {
        if (evento.target === document.getElementById('detailModal')) {
            document.getElementById('detailModal')?.classList.add('hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    atualizarRelogio();
    setInterval(atualizarRelogio, 1000);

    vincularAbas();
    vincularModalDetalhes();

    if (typeof carregarPainelInicial === 'function') carregarPainelInicial();
    if (typeof definirVisaoFinder === 'function') definirVisaoFinder('tools');

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch(erro => console.error('Falha ao registrar SW:', erro));
        });
    }
});
