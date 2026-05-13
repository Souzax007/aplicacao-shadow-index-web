async function carregarHistoricoVarreduras(idCorpoTabela = 'scansTableBody') {
    try {
        const resposta = await fetch(BASE_API + 'varreduras.php?limit=50');
        const dados = await resposta.json();
        if (dados.status !== 'ok') return;

        const corpoTabela = document.getElementById(idCorpoTabela);
        if (!corpoTabela) return;
        corpoTabela.innerHTML = '';

        dados.varreduras.forEach(varredura => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td><span class="badge-cat">${varredura.categoria}</span></td>
                <td class="text-center">${varredura.queries}</td>
                <td class="text-center">${varredura.quantidade_encontradas}</td>
                <td class="text-center" style="color:var(--green);font-weight:bold">${varredura.quantidade_novas}</td>
                <td class="text-center" style="color:#f59e0b;font-weight:bold">${varredura.quantidade_duplicadas}</td>
                <td class="text-center">${varredura.tempo_execucao_segundos.toFixed(1)}</td>
                <td style="color:rgba(0,212,255,0.7)">${new Date(varredura.data_varredura).toLocaleDateString('pt-BR')}</td>
            `;
            corpoTabela.appendChild(linha);
        });
    } catch (erro) {
        console.error(erro);
    }
}
