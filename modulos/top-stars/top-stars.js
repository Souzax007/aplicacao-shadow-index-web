async function carregarTopStars(idContainer = 'top-stars-tab', limite = 24) {
    try {
        const resposta = await fetch(BASE_API + `top-stars.php?limit=${limite}`);
        const dados = await resposta.json();
        if (dados.status !== 'ok') return;

        const container = document.getElementById(idContainer);
        if (!container) return;
        container.innerHTML = '';

        dados.ferramentas.forEach(ferramenta => {
            const cartao = document.createElement('div');
            cartao.className = 'tool-card';
            cartao.innerHTML = `
                <h3>${ferramenta.nome}</h3>
                <p class="mb-3">${(ferramenta.descricao || '').substring(0, 110)}...</p>
                <div class="flex justify-between text-xs">
                    <span class="star-val">⭐ ${formatarValorStars(ferramenta.stars)}</span>
                    <span class="badge-lang">${ferramenta.linguagem || '-'}</span>
                </div>`;
            cartao.addEventListener('click', () => mostrarDetalhesFerramenta(ferramenta.id));
            container.appendChild(cartao);
        });
    } catch (erro) {
        console.error(erro);
    }
}
