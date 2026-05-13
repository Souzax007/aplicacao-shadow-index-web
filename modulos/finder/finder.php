<div id="finder-tab" class="tab-content pt-4">
    <div class="cyber-card p-4 mb-5">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="relative">
                <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:rgba(0,255,65,0.5)"><i class="fas fa-search text-xs"></i></span>
                <input type="text" id="searchInput" placeholder="buscar ferramenta no banco..." class="cyber-input w-full pl-8 pr-3 py-2 text-sm">
            </div>
            <select id="categoryFilter" class="cyber-select px-3 py-2 text-sm w-full">
                <option value="">-- todas as categorias --</option>
            </select>
            <select id="languageFilter" class="cyber-select px-3 py-2 text-sm w-full">
                <option value="">-- todas as linguagens --</option>
            </select>
        </div>

        <div class="flex gap-2 mt-3 flex-wrap">
            <span class="text-xs" style="color:rgba(0,255,65,0.4);line-height:2">ordenar:</span>
            <button class="sort-pill active" data-sort="nome">A→Z</button>
            <button class="sort-pill" data-sort="stars">⭐ Stars</button>
            <button class="sort-pill" data-sort="data_insercao">Recentes</button>
        </div>
    </div>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div class="cyber-card stat-click-card p-5 active" data-view="tools">
            <div class="stat-num text-3xl" id="totalTools">--</div>
            <div class="text-xs mt-1" style="color:rgba(0,255,65,0.5)">// ferramentas</div>
        </div>
        <div class="cyber-card stat-click-card p-5" data-view="scans">
            <div class="stat-num text-3xl" style="color:var(--cyan);text-shadow:0 0 10px var(--cyan)" id="totalScans">--</div>
            <div class="text-xs mt-1" style="color:rgba(0,212,255,0.5)">// varreduras</div>
        </div>
        <div class="cyber-card stat-click-card p-5" data-view="categories">
            <div class="stat-num text-3xl" style="color:#7ce8ff;text-shadow:0 0 10px #7ce8ff" id="totalCategories">--</div>
            <div class="text-xs mt-1" style="color:rgba(124,232,255,0.5)">// categorias</div>
        </div>
        <div class="cyber-card stat-click-card p-5" data-view="topstars">
            <div class="stat-num text-3xl" style="color:var(--amber);text-shadow:0 0 10px var(--amber)" id="avgStars">--</div>
            <div class="text-xs mt-1" style="color:rgba(255,180,84,0.6)">// top media ⭐</div>
        </div>
    </div>

    <div class="cyber-card p-0 overflow-hidden">
        <div class="flex justify-between items-center px-4 py-3" style="border-bottom:1px solid var(--border)">
            <div class="finder-panel-title" id="finderPanelTitle">LISTA COMPLETA DE FERRAMENTAS</div>
            <button id="showAllBtn" class="btn-primary">mostrar tudo</button>
        </div>

        <div id="finder-tools-panel" class="finder-panel">
            <div class="overflow-x-auto">
                <table class="cyber-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Nome</th>
                            <th>Categoria</th>
                            <th>Linguagem</th>
                            <th>Stars</th>
                            <th>Ação</th>
                        </tr>
                    </thead>
                    <tbody id="toolsTableBody">
                        <tr><td colspan="6" class="text-center py-6" style="color:rgba(0,255,65,0.4)">[ carregando... ]</td></tr>
                    </tbody>
                </table>
            </div>
            <div class="flex justify-between items-center px-4 py-3" style="border-top:1px solid var(--border)">
                <button id="prevBtn" class="btn-primary">◀ anterior</button>
                <span class="page-info" id="pageInfo">pagina 1</span>
                <button id="nextBtn" class="btn-primary">proximo ▶</button>
            </div>
        </div>

        <div id="finder-scans-panel" class="finder-panel hidden overflow-x-auto">
            <table class="cyber-table">
                <thead>
                    <tr>
                        <th>Categoria</th>
                        <th>Queries</th>
                        <th>Encontradas</th>
                        <th>Novas</th>
                        <th>Duplicatas</th>
                        <th>Tempo (s)</th>
                        <th>Data</th>
                    </tr>
                </thead>
                <tbody id="finderScansTableBody">
                    <tr><td colspan="7" class="text-center py-6" style="color:rgba(0,255,65,0.4)">[ carregando... ]</td></tr>
                </tbody>
            </table>
        </div>

        <div id="finder-categories-panel" class="finder-panel hidden overflow-x-auto">
            <table class="cyber-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Categoria</th>
                        <th>Quantidade</th>
                    </tr>
                </thead>
                <tbody id="categoriesTableBody">
                    <tr><td colspan="3" class="text-center py-6" style="color:rgba(0,255,65,0.4)">[ carregando... ]</td></tr>
                </tbody>
            </table>
        </div>

        <div id="finder-topstars-panel" class="finder-panel hidden p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"></div>
    </div>
</div>
