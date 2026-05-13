function popularFiltroCategoria(listaCategorias) {
    const seletor = document.getElementById('categoryFilter');
    if (!seletor) return;

    seletor.innerHTML = '<option value="">-- todas as categorias --</option>';

    const categoriasOrdenadas = [...listaCategorias].sort((a, b) => a.categoria.localeCompare(b.categoria));
    categoriasOrdenadas.forEach(categoria => {
        const opcao = document.createElement('option');
        opcao.value = categoria.categoria;
        opcao.textContent = `${categoria.categoria} (${categoria.quantidade})`;
        seletor.appendChild(opcao);
    });
}

function popularFiltroLinguagem(listaLinguagens) {
    const seletor = document.getElementById('languageFilter');
    if (!seletor) return;

    seletor.innerHTML = '<option value="">-- todas as linguagens --</option>';

    const linguagensOrdenadas = [...listaLinguagens].sort((a, b) => a.linguagem.localeCompare(b.linguagem));
    linguagensOrdenadas.slice(0, 30).forEach(linguagem => {
        const opcao = document.createElement('option');
        opcao.value = linguagem.linguagem;
        opcao.textContent = `${linguagem.linguagem} (${linguagem.quantidade})`;
        seletor.appendChild(opcao);
    });
}

function renderizarListaCategorias(listaCategorias) {
    const corpoTabela = document.getElementById('categoriesTableBody');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = '';

    if (!listaCategorias.length) {
        corpoTabela.innerHTML = '<tr><td colspan="3" class="text-center py-6" style="color:rgba(0,255,65,0.4)">[ nenhuma categoria encontrada ]</td></tr>';
        return;
    }

    listaCategorias.forEach((categoria, indice) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td style="color:rgba(0,255,65,0.35)">${indice + 1}</td>
            <td><span class="badge-cat">${categoria.categoria}</span></td>
            <td style="color:#e5e5e5;font-weight:600">${categoria.quantidade.toLocaleString()}</td>
        `;
        corpoTabela.appendChild(linha);
    });
}

async function carregarPainelInicial() {
    try {
        const [respostaStats, respostaLinguagens] = await Promise.all([
            fetch(BASE_API + 'stats.php'),
            fetch(BASE_API + 'por-linguagem.php')
        ]);

        const dadosStats = await respostaStats.json();
        const dadosLinguagens = await respostaLinguagens.json();
        if (dadosStats.status !== 'ok') return;

        estatisticasPainel = dadosStats;
        estatisticasLinguagem = (dadosLinguagens.status === 'ok' && Array.isArray(dadosLinguagens.linguagens))
            ? dadosLinguagens.linguagens
            : [];

        document.getElementById('totalTools').textContent = dadosStats.total_ferramentas.toLocaleString();
        document.getElementById('totalScans').textContent = dadosStats.total_varreduras.toLocaleString();
        document.getElementById('totalCategories').textContent = dadosStats.por_categoria.length;

        const mediaStars = dadosStats.top_stars.length > 0
            ? (dadosStats.top_stars.reduce((soma, item) => soma + item.stars, 0) / dadosStats.top_stars.length)
            : 0;

        document.getElementById('avgStars').textContent = formatarValorStars(Math.round(mediaStars));

        popularFiltroCategoria(dadosStats.por_categoria);
        popularFiltroLinguagem(estatisticasLinguagem);

        if (visaoFinder === 'categories') renderizarListaCategorias(dadosStats.por_categoria);

        if (document.querySelector('.tab-btn.active')?.dataset.tab === 'charts-tab' && typeof carregarGraficosSeNecessario === 'function') {
            carregarGraficosSeNecessario();
        }
    } catch (erro) {
        console.error(erro);
    }
}

function definirVisaoFinder(novaVisao) {
    visaoFinder = novaVisao;

    document.querySelectorAll('.stat-click-card').forEach(cartao => {
        cartao.classList.toggle('active', cartao.dataset.view === novaVisao);
    });

    document.querySelectorAll('.finder-panel').forEach(painel => painel.classList.add('hidden'));

    const mapaTitulos = {
        tools: 'LISTA COMPLETA DE FERRAMENTAS',
        scans: 'LISTA DE VARREDURAS',
        categories: 'LISTA DE CATEGORIAS',
        topstars: 'LISTA TOP STARS'
    };

    const tituloPainel = document.getElementById('finderPanelTitle');
    if (tituloPainel) tituloPainel.textContent = mapaTitulos[novaVisao] || mapaTitulos.tools;

    if (novaVisao === 'tools') {
        document.getElementById('finder-tools-panel')?.classList.remove('hidden');
        carregarFerramentas(0);
        return;
    }

    if (novaVisao === 'scans') {
        document.getElementById('finder-scans-panel')?.classList.remove('hidden');
        carregarHistoricoVarreduras('finderScansTableBody');
        return;
    }

    if (novaVisao === 'categories') {
        document.getElementById('finder-categories-panel')?.classList.remove('hidden');
        renderizarListaCategorias(estatisticasPainel?.por_categoria || []);
        return;
    }

    if (novaVisao === 'topstars') {
        document.getElementById('finder-topstars-panel')?.classList.remove('hidden');
        carregarTopStars('finder-topstars-panel', 24);
    }
}

async function carregarFerramentas(pagina = 0) {
    const filtroCategoria = document.getElementById('categoryFilter')?.value || '';
    const filtroLinguagem = document.getElementById('languageFilter')?.value || '';
    const deslocamento = pagina * itensPorPagina;

    let url = BASE_API + `ferramentas.php?limit=${itensPorPagina}&offset=${deslocamento}&sort=${ordenacaoAtual}`;
    if (filtroCategoria) url += `&categoria=${encodeURIComponent(filtroCategoria)}`;
    if (filtroLinguagem) url += `&linguagem=${encodeURIComponent(filtroLinguagem)}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.status === 'ok') {
            renderizarTabelaFerramentas(dados.ferramentas);
            document.getElementById('pageInfo').textContent = `pagina ${pagina + 1}`;
            paginaAtual = pagina;
        }
    } catch (erro) {
        console.error(erro);
    }
}

function renderizarTabelaFerramentas(listaFerramentas) {
    const corpoTabela = document.getElementById('toolsTableBody');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = '';

    if (!listaFerramentas.length) {
        corpoTabela.innerHTML = '<tr><td colspan="6" class="text-center py-6" style="color:rgba(0,255,65,0.4)">[ nenhuma ferramenta encontrada ]</td></tr>';
        return;
    }

    listaFerramentas.forEach((ferramenta, indice) => {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td style="color:rgba(0,255,65,0.35)">${(paginaAtual * itensPorPagina) + indice + 1}</td>
            <td style="color:#e5e5e5;font-weight:600">${ferramenta.nome}</td>
            <td><span class="badge-cat">${ferramenta.categoria || '-'}</span></td>
            <td><span class="badge-lang">${ferramenta.linguagem || '-'}</span></td>
            <td class="star-val">${formatarValorStars(ferramenta.stars)}</td>
            <td><button class="btn-view view-btn" data-id="${ferramenta.id}">[ ver ]</button></td>
        `;
        corpoTabela.appendChild(linha);
    });

    document.querySelectorAll('.view-btn').forEach(botao => {
        botao.addEventListener('click', () => mostrarDetalhesFerramenta(botao.dataset.id));
    });
}

async function mostrarDetalhesFerramenta(idFerramenta) {
    try {
        const resposta = await fetch(BASE_API + `ferramentas-detalhes.php?id=${idFerramenta}`);
        const dados = await resposta.json();
        if (dados.status !== 'ok') return;

        const ferramenta = dados.ferramenta;
        const urlFerramenta = ferramenta.url && ferramenta.url.startsWith('http')
            ? ferramenta.url
            : 'https://github.com/' + ferramenta.url;

        document.getElementById('modalContent').innerHTML = `
            <h2 style="font-family:'Orbitron',monospace;color:var(--green);font-size:1.1rem;text-shadow:0 0 10px var(--green);margin-bottom:12px">
                <i class="fas fa-skull mr-2" style="font-size:.9rem"></i>${ferramenta.nome}
            </h2>
            <p style="color:#aaa;font-size:.85rem;line-height:1.6;margin-bottom:16px;border-left:2px solid rgba(0,255,65,0.3);padding-left:12px">${ferramenta.descricao || '-'}</p>
            <div class="grid grid-cols-2 gap-3 mb-4">
                <div><div class="modal-label">Categoria</div><div class="modal-val"><span class="badge-cat">${ferramenta.categoria || '-'}</span></div></div>
                <div><div class="modal-label">Linguagem</div><div class="modal-val"><span class="badge-lang">${ferramenta.linguagem || '-'}</span></div></div>
                <div><div class="modal-label">Stars</div><div class="modal-val star-val">⭐ ${(ferramenta.stars || 0).toLocaleString()}</div></div>
                <div><div class="modal-label">Query</div><div class="modal-val" style="font-size:.8rem">${ferramenta.query || '-'}</div></div>
            </div>
            ${ferramenta.topics ? `<div style="margin-bottom:16px"><div class="modal-label mb-1">Topicos</div><div style="color:#888;font-size:.8rem">${ferramenta.topics}</div></div>` : ''}
            <a href="${urlFerramenta}" target="_blank" rel="noopener noreferrer" class="btn-github">
                <i class="fab fa-github"></i> abrir no github
            </a>
        `;

        document.getElementById('detailModal')?.classList.remove('hidden');
    } catch (erro) {
        console.error(erro);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sort-pill').forEach(botaoOrdenacao => {
        botaoOrdenacao.addEventListener('click', () => {
            document.querySelectorAll('.sort-pill').forEach(item => item.classList.remove('active'));
            botaoOrdenacao.classList.add('active');
            ordenacaoAtual = botaoOrdenacao.dataset.sort;

            if (visaoFinder !== 'tools') definirVisaoFinder('tools');
            else carregarFerramentas(0);
        });
    });

    document.getElementById('prevBtn')?.addEventListener('click', () => {
        if (paginaAtual > 0) carregarFerramentas(paginaAtual - 1);
    });

    document.getElementById('nextBtn')?.addEventListener('click', () => {
        carregarFerramentas(paginaAtual + 1);
    });

    document.getElementById('searchInput')?.addEventListener('input', aguardarDigitacao(async (evento) => {
        const textoBusca = evento.target.value.trim();

        if (visaoFinder !== 'tools') definirVisaoFinder('tools');

        if (textoBusca.length < 2) {
            carregarFerramentas(0);
            return;
        }

        try {
            const resposta = await fetch(BASE_API + `search.php?q=${encodeURIComponent(textoBusca)}&limit=50`);
            const dados = await resposta.json();
            if (dados.status === 'ok') {
                paginaAtual = 0;
                renderizarTabelaFerramentas(dados.ferramentas);
            }
        } catch (erro) {
            console.error(erro);
        }
    }, 300));

    document.getElementById('categoryFilter')?.addEventListener('change', () => {
        const campoBusca = document.getElementById('searchInput');
        if (campoBusca) campoBusca.value = '';

        if (visaoFinder !== 'tools') definirVisaoFinder('tools');
        else carregarFerramentas(0);
    });

    document.getElementById('languageFilter')?.addEventListener('change', () => {
        const campoBusca = document.getElementById('searchInput');
        if (campoBusca) campoBusca.value = '';

        if (visaoFinder !== 'tools') definirVisaoFinder('tools');
        else carregarFerramentas(0);
    });

    document.querySelectorAll('.stat-click-card').forEach(cartao => {
        cartao.addEventListener('click', () => definirVisaoFinder(cartao.dataset.view));
    });

    document.getElementById('showAllBtn')?.addEventListener('click', () => definirVisaoFinder('tools'));
});
