const NIVEIS_RADIOATIVIDADE = [
    { minimo: 0, maximo: 500, rotulo: '✅ INOFENSIVO', cor: '#31ff75', anguloAgulha: -90, cpmBase: 2 },
    { minimo: 500, maximo: 2000, rotulo: '⚠ BAIXO RISCO', cor: '#8adf5b', anguloAgulha: -50, cpmBase: 18 },
    { minimo: 2000, maximo: 7000, rotulo: '☢ MODERADO', cor: '#f5ce6b', anguloAgulha: -10, cpmBase: 65 },
    { minimo: 7000, maximo: 20000, rotulo: '☣ PERIGOSO', cor: '#ff9966', anguloAgulha: 30, cpmBase: 190 },
    { minimo: 20000, maximo: 60000, rotulo: '⚠ CRITICO', cor: '#ff5533', anguloAgulha: 60, cpmBase: 540 },
    { minimo: 60000, maximo: Infinity, rotulo: '☢ LETAL', cor: '#ff2244', anguloAgulha: 90, cpmBase: 999 }
];

let paginaRadioativo = 0;
const itensPorPaginaRadioativo = 25;
let listaFerramentasRadioativo = [];
let listaFiltradaRadioativo = [];
let dadosRadioativoCarregados = false;
let idFerramentaAtiva = null;
let idFerramentaFixa = null;
let modoAutomaticoAtivo = true;
let intervaloModoAutomatico = null;
let intervaloCpm = null;
let cpmAlvo = 0;
let cpmAtual = 0;
const CHAVE_PREFERENCIAS_RADIOATIVO = 'osint-radioativo-prefs-v1';

function obterNivelRadioatividade(quantidadeStars) {
    for (const nivel of NIVEIS_RADIOATIVIDADE) {
        if (quantidadeStars >= nivel.minimo && quantidadeStars < nivel.maximo) return nivel;
    }
    return NIVEIS_RADIOATIVIDADE[NIVEIS_RADIOATIVIDADE.length - 1];
}

function obterPercentualRadioatividade(quantidadeStars) {
    const starsMaximoEscala = 120000;
    return Math.min(100, Math.round((quantidadeStars / starsMaximoEscala) * 100));
}

function salvarPreferenciasRadioativo() {
    try {
        localStorage.setItem(CHAVE_PREFERENCIAS_RADIOATIVO, JSON.stringify({
            idFerramentaAtiva,
            idFerramentaFixa,
            modoAutomaticoAtivo
        }));
    } catch (_) {}
}

function carregarPreferenciasRadioativo() {
    try {
        const conteudoSalvo = localStorage.getItem(CHAVE_PREFERENCIAS_RADIOATIVO);
        if (!conteudoSalvo) return;

        const preferencias = JSON.parse(conteudoSalvo);
        idFerramentaAtiva = Number(preferencias.idFerramentaAtiva) || null;
        idFerramentaFixa = Number(preferencias.idFerramentaFixa) || null;
        modoAutomaticoAtivo = typeof preferencias.modoAutomaticoAtivo === 'boolean' ? preferencias.modoAutomaticoAtivo : true;
    } catch (_) {}
}

function encontrarFerramentaPorId(idFerramenta) {
    return listaFerramentasRadioativo.find(item => Number(item.id) === Number(idFerramenta)) || null;
}

function atualizarRealceFerramentaAtiva() {
    document.querySelectorAll('.radio-row').forEach(linha => {
        linha.classList.toggle('active', Number(linha.dataset.toolId) === Number(idFerramentaAtiva));
    });
}

function atualizarInterfaceModoRadioativo() {
    const campoStatus = document.getElementById('radioModeStatus');
    const campoModoAuto = document.getElementById('radioAutoMode');
    const botaoFixar = document.getElementById('radioFixBtn');

    if (campoModoAuto) campoModoAuto.checked = modoAutomaticoAtivo;
    if (!campoStatus || !botaoFixar) return;

    if (idFerramentaFixa) {
        const ferramentaFixa = encontrarFerramentaPorId(idFerramentaFixa);
        campoStatus.textContent = `status: ferramenta fixa (${ferramentaFixa?.nome || 'desconhecida'})`;
        botaoFixar.textContent = 'soltar fixacao';
    } else if (modoAutomaticoAtivo) {
        campoStatus.textContent = 'status: automatico em execucao';
        botaoFixar.textContent = 'fixar selecionada';
    } else {
        campoStatus.textContent = 'status: manual (automatico desativado)';
        botaoFixar.textContent = 'fixar selecionada';
    }
}

function selecionarFerramentaRadioativo(ferramenta) {
    if (!ferramenta) return;

    idFerramentaAtiva = Number(ferramenta.id) || null;
    atualizarPainelGeiger(ferramenta);
    atualizarRealceFerramentaAtiva();
    salvarPreferenciasRadioativo();
}

function limparIntervaloModoAutomatico() {
    if (intervaloModoAutomatico) {
        clearInterval(intervaloModoAutomatico);
        intervaloModoAutomatico = null;
    }
}

function sortearIndiceAleatorio(quantidadeItens, indiceAtual = -1) {
    if (quantidadeItens <= 1) return 0;

    let indiceSorteado = indiceAtual;
    while (indiceSorteado === indiceAtual) {
        indiceSorteado = Math.floor(Math.random() * quantidadeItens);
    }

    return indiceSorteado;
}

function iniciarModoAutomaticoRadioativo() {
    limparIntervaloModoAutomatico();
    if (!modoAutomaticoAtivo || idFerramentaFixa || !listaFiltradaRadioativo.length) return;

    if (!encontrarFerramentaPorId(idFerramentaAtiva)) selecionarFerramentaRadioativo(listaFiltradaRadioativo[0]);

    intervaloModoAutomatico = setInterval(() => {
        if (!modoAutomaticoAtivo || idFerramentaFixa || !listaFiltradaRadioativo.length) return;

        const indiceAtual = listaFiltradaRadioativo.findIndex(item => Number(item.id) === Number(idFerramentaAtiva));
        const indiceAleatorio = sortearIndiceAleatorio(listaFiltradaRadioativo.length, indiceAtual);
        selecionarFerramentaRadioativo(listaFiltradaRadioativo[indiceAleatorio]);
    }, 1000);
}

function montarMarcacoesGeiger() {
    const grupoMarcacoes = document.getElementById('geigerTicks');
    if (!grupoMarcacoes) return;

    const centroX = 150;
    const centroY = 155;
    const raio = 120;
    let desenhoMarcacoes = '';

    for (let indice = 0; indice <= 12; indice++) {
        const angulo = -180 + (indice / 12) * 180;
        const anguloEmRadianos = (angulo * Math.PI) / 180;
        const marcaGrande = indice % 3 === 0;
        const tamanhoMarcacao = marcaGrande ? 14 : 8;
        const x1 = centroX + (raio - 6) * Math.cos(anguloEmRadianos);
        const y1 = centroY + (raio - 6) * Math.sin(anguloEmRadianos);
        const x2 = centroX + (raio - 6 - tamanhoMarcacao) * Math.cos(anguloEmRadianos);
        const y2 = centroY + (raio - 6 - tamanhoMarcacao) * Math.sin(anguloEmRadianos);

        desenhoMarcacoes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="${marcaGrande ? 1.8 : 1}" opacity="${marcaGrande ? 0.55 : 0.25}"/>`;
    }

    grupoMarcacoes.innerHTML = desenhoMarcacoes;
}

function animarAgulhaGeiger(anguloFinal, cpmDestino) {
    const agulha = document.getElementById('geigerNeedle');
    if (agulha) agulha.style.transform = `rotate(${anguloFinal}deg)`;

    cpmAlvo = cpmDestino;
    if (intervaloCpm) clearInterval(intervaloCpm);

    intervaloCpm = setInterval(() => {
        const diferenca = cpmAlvo - cpmAtual;

        if (Math.abs(diferenca) < 1) {
            cpmAtual = cpmAlvo;
            clearInterval(intervaloCpm);
        } else {
            cpmAtual += diferenca * 0.12;
        }

        const campoCpm = document.getElementById('geigerTicksCount');
        if (campoCpm) campoCpm.textContent = Math.round(cpmAtual);
    }, 30);
}

function atualizarPainelGeiger(ferramenta) {
    const nivel = obterNivelRadioatividade(ferramenta.stars || 0);
    const percentual = obterPercentualRadioatividade(ferramenta.stars || 0);

    document.getElementById('geigerToolName').textContent = ferramenta.nome || '---';
    document.getElementById('geigerToolMeta').textContent = (ferramenta.descricao || '').slice(0, 120) || '-';
    document.getElementById('geoStars').textContent = (ferramenta.stars || 0).toLocaleString();
    document.getElementById('geoCat').textContent = ferramenta.categoria || '-';
    document.getElementById('geoLang').textContent = ferramenta.linguagem || '-';
    document.getElementById('geigerPct').textContent = percentual + '%';

    const seloNivel = document.getElementById('geigerLevelBadge');
    seloNivel.textContent = nivel.rotulo;
    seloNivel.style.color = nivel.cor;
    seloNivel.style.borderColor = nivel.cor + '88';
    seloNivel.style.textShadow = `0 0 12px ${nivel.cor}`;

    if (percentual >= 75) seloNivel.classList.add('geiger-pulse');
    else seloNivel.classList.remove('geiger-pulse');

    document.getElementById('geigerBarFill').style.width = percentual + '%';
    animarAgulhaGeiger(nivel.anguloAgulha, nivel.cpmBase + Math.round(Math.random() * 8));
}

function renderizarListaRadioativo(listaFerramentas, pagina) {
    const corpoLista = document.getElementById('radioListBody');
    if (!corpoLista) return;

    corpoLista.innerHTML = '';

    if (!listaFerramentas.length) {
        corpoLista.innerHTML = '<div class="text-center py-8" style="color:rgba(255,34,68,0.4)">[ nenhuma ferramenta detectada ]</div>';
        return;
    }

    const ferramentasPagina = listaFerramentas.slice(
        pagina * itensPorPaginaRadioativo,
        (pagina + 1) * itensPorPaginaRadioativo
    );

    ferramentasPagina.forEach(ferramenta => {
        const nivel = obterNivelRadioatividade(ferramenta.stars || 0);
        const percentualBarra = Math.min(100, Math.round(((ferramenta.stars || 0) / 120000) * 100));

        const linha = document.createElement('div');
        linha.className = 'radio-row';
        linha.dataset.toolId = String(ferramenta.id);
        if (Number(idFerramentaAtiva) === Number(ferramenta.id)) linha.classList.add('active');

        linha.innerHTML = `
            <span class="radio-icon" style="color:${nivel.cor};text-shadow:0 0 8px ${nivel.cor}">
                ${(ferramenta.stars || 0) >= 20000 ? '☢' : (ferramenta.stars || 0) >= 7000 ? '☣' : '◈'}
            </span>
            <span class="radio-name">${ferramenta.nome}</span>
            <span class="badge-cat" style="flex-shrink:0">${ferramenta.categoria || '-'}</span>
            <div class="radio-mini-bar-track">
                <div class="radio-mini-bar" style="width:${percentualBarra}%;background:${nivel.cor}"></div>
            </div>
            <span class="radio-stars" style="color:${nivel.cor}">${formatarValorStars(ferramenta.stars || 0)}</span>
        `;

        linha.addEventListener('click', () => selecionarFerramentaRadioativo(ferramenta));
        corpoLista.appendChild(linha);
    });

    document.getElementById('radioPageInfo').textContent =
        `pagina ${pagina + 1} / ${Math.max(1, Math.ceil(listaFerramentas.length / itensPorPaginaRadioativo))}`;

    atualizarInterfaceModoRadioativo();
}

function aplicarFiltrosRadioativo() {
    const textoBusca = (document.getElementById('radioSearch')?.value || '').trim().toLowerCase();
    const ordenacao = document.getElementById('radioSort')?.value || 'danger_desc';

    let listaFiltrada = listaFerramentasRadioativo.filter(item =>
        !textoBusca ||
        item.nome.toLowerCase().includes(textoBusca) ||
        (item.categoria || '').toLowerCase().includes(textoBusca)
    );

    if (ordenacao === 'danger_desc') listaFiltrada.sort((a, b) => (b.stars || 0) - (a.stars || 0));
    else if (ordenacao === 'danger_asc') listaFiltrada.sort((a, b) => (a.stars || 0) - (b.stars || 0));
    else listaFiltrada.sort((a, b) => a.nome.localeCompare(b.nome));

    listaFiltradaRadioativo = listaFiltrada;
    paginaRadioativo = 0;
    renderizarListaRadioativo(listaFiltradaRadioativo, paginaRadioativo);

    if (idFerramentaFixa) {
        const ferramentaFixa = encontrarFerramentaPorId(idFerramentaFixa);
        if (ferramentaFixa) selecionarFerramentaRadioativo(ferramentaFixa);
    } else if (idFerramentaAtiva) {
        const ferramentaAtiva = encontrarFerramentaPorId(idFerramentaAtiva);
        if (ferramentaAtiva) selecionarFerramentaRadioativo(ferramentaAtiva);
    } else if (listaFiltradaRadioativo.length) {
        selecionarFerramentaRadioativo(listaFiltradaRadioativo[0]);
    }

    iniciarModoAutomaticoRadioativo();
}

async function carregarRadioativo() {
    if (dadosRadioativoCarregados) return;
    dadosRadioativoCarregados = true;

    montarMarcacoesGeiger();
    carregarPreferenciasRadioativo();

    try {
        const resposta = await fetch(BASE_API + 'ferramentas.php?limit=200&offset=0&sort=stars');
        const dados = await resposta.json();

        if (dados.status === 'ok') {
            listaFerramentasRadioativo = dados.ferramentas;
            aplicarFiltrosRadioativo();

            if (idFerramentaFixa) {
                const ferramentaFixa = encontrarFerramentaPorId(idFerramentaFixa);
                if (ferramentaFixa) selecionarFerramentaRadioativo(ferramentaFixa);
                else idFerramentaFixa = null;
            }

            if (!idFerramentaAtiva && listaFerramentasRadioativo.length) {
                selecionarFerramentaRadioativo(listaFerramentasRadioativo[0]);
            }

            atualizarInterfaceModoRadioativo();
            iniciarModoAutomaticoRadioativo();
        }
    } catch (erro) {
        console.error(erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('radioSearch')?.addEventListener('input', () => {
        paginaRadioativo = 0;
        aplicarFiltrosRadioativo();
    });

    document.getElementById('radioSort')?.addEventListener('change', () => {
        paginaRadioativo = 0;
        aplicarFiltrosRadioativo();
    });

    document.getElementById('radioPrev')?.addEventListener('click', () => {
        if (paginaRadioativo > 0) {
            paginaRadioativo--;
            renderizarListaRadioativo(listaFiltradaRadioativo, paginaRadioativo);
        }
    });

    document.getElementById('radioNext')?.addEventListener('click', () => {
        if ((paginaRadioativo + 1) * itensPorPaginaRadioativo < listaFiltradaRadioativo.length) {
            paginaRadioativo++;
            renderizarListaRadioativo(listaFiltradaRadioativo, paginaRadioativo);
        }
    });

    document.getElementById('radioAutoMode')?.addEventListener('change', (evento) => {
        modoAutomaticoAtivo = !!evento.target.checked;
        if (modoAutomaticoAtivo) idFerramentaFixa = null;

        atualizarInterfaceModoRadioativo();
        salvarPreferenciasRadioativo();
        iniciarModoAutomaticoRadioativo();
    });

    document.getElementById('radioFixBtn')?.addEventListener('click', () => {
        if (idFerramentaFixa) {
            idFerramentaFixa = null;
            if (!modoAutomaticoAtivo) modoAutomaticoAtivo = true;
        } else if (idFerramentaAtiva) {
            idFerramentaFixa = idFerramentaAtiva;
            modoAutomaticoAtivo = false;
            limparIntervaloModoAutomatico();
        }

        atualizarInterfaceModoRadioativo();
        salvarPreferenciasRadioativo();
        iniciarModoAutomaticoRadioativo();
    });
});
