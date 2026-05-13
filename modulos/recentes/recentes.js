async function carregarRecentes() {
    try {
        const resposta = await fetch(BASE_API + 'recentes.php?limit=24');
        const dados = await resposta.json();
        if (dados.status !== 'ok') return;

        const container = document.getElementById('recent-tab');
        if (!container) return;
        container.innerHTML = '';

        dados.ferramentas.forEach(ferramenta => {
            const cartao = document.createElement('div');
            cartao.className = 'tool-card';
            cartao.innerHTML = `
                <h3>${ferramenta.nome}</h3>
                <p class="mb-3">${(ferramenta.descricao || '').substring(0, 110)}...</p>
                <div class="flex justify-between text-xs">
                    <span style="color:var(--cyan)">${new Date(ferramenta.data_insercao).toLocaleDateString('pt-BR')}</span>
                    <span class="badge-cat">${ferramenta.categoria || '-'}</span>
                </div>`;
            cartao.addEventListener('click', () => mostrarDetalhesFerramenta(ferramenta.id));
            container.appendChild(cartao);
        });
    } catch (erro) {
        console.error(erro);
    }
}
