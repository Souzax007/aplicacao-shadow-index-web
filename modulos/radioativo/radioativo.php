<div id="radioativo-tab" class="tab-content hidden pt-4">
    <div class="geiger-wrapper cyber-card p-6 mb-6">
        <div class="flex flex-col lg:flex-row items-center gap-8">
            <div class="geiger-gauge-wrap flex-shrink-0">
                <svg id="geigerGaugeSvg" viewBox="0 0 300 180" class="geiger-gauge-svg">
                    <path d="M 30 155 A 120 120 0 0 1 270 155" fill="none" stroke="#1a1a1a" stroke-width="22" stroke-linecap="round"/>
                    <path d="M 30 155 A 120 120 0 0 1 270 155" fill="none" stroke="url(#geigerGrad)" stroke-width="16" stroke-linecap="round"/>
                    <defs>
                        <linearGradient id="geigerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stop-color="#31ff75"/>
                            <stop offset="35%" stop-color="#f5ce6b"/>
                            <stop offset="65%" stop-color="#ff7f66"/>
                            <stop offset="100%" stop-color="#ff2244"/>
                        </linearGradient>
                    </defs>
                    <g id="geigerTicks" stroke="rgba(255,255,255,0.18)" stroke-width="1.2"/>
                    <line id="geigerNeedle" x1="150" y1="155" x2="150" y2="50" stroke="#ffffff" stroke-width="3" stroke-linecap="round" transform-origin="150 155" style="transform:rotate(-90deg); transition:transform 1.2s cubic-bezier(.34,1.56,.64,1)"/>
                    <circle cx="150" cy="155" r="7" fill="#31ff75" filter="url(#gpin)"/>
                    <defs>
                        <filter id="gpin"><feGaussianBlur stdDeviation="3" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    </defs>
                    <text x="18" y="172" fill="#31ff75" font-size="9" font-family="Share Tech Mono">SAFE</text>
                    <text x="124" y="34" fill="#f5ce6b" font-size="9" font-family="Share Tech Mono">MOD</text>
                    <text x="255" y="172" fill="#ff2244" font-size="9" font-family="Share Tech Mono" text-anchor="end">LETAL</text>
                </svg>
                <div class="geiger-ticks-display" id="geigerTicksDisplay">
                    <span id="geigerTicksCount">0</span> <span style="font-size:0.7rem;opacity:0.6">cpm</span>
                </div>
            </div>

            <div class="flex-1 min-w-0">
                <div class="geiger-badge mb-3" id="geigerLevelBadge">☢ AGUARDANDO LEITURA</div>
                <div class="geiger-tool-name mb-1" id="geigerToolName">---</div>
                <div class="geiger-tool-meta" id="geigerToolMeta" style="color:rgba(255,255,255,0.35)">selecione uma ferramenta abaixo</div>

                <div class="grid grid-cols-3 gap-3 mt-5">
                    <div class="geo-stat-box">
                        <div class="geo-stat-label">Stars</div>
                        <div class="geo-stat-val" id="geoStars">--</div>
                    </div>
                    <div class="geo-stat-box">
                        <div class="geo-stat-label">Categoria</div>
                        <div class="geo-stat-val text-sm" id="geoCat">--</div>
                    </div>
                    <div class="geo-stat-box">
                        <div class="geo-stat-label">Linguagem</div>
                        <div class="geo-stat-val text-sm" id="geoLang">--</div>
                    </div>
                </div>

                <div class="mt-4">
                    <div class="flex justify-between text-xs mb-1" style="color:rgba(255,255,255,0.4)">
                        <span>Nivel de Radiacao</span>
                        <span id="geigerPct">0%</span>
                    </div>
                    <div class="geiger-bar-track">
                        <div class="geiger-bar-fill" id="geigerBarFill" style="width:0%"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="cyber-card p-0 overflow-hidden">
        <div class="p-4 radio-toolbar" style="border-bottom:1px solid var(--border)">
            <div class="flex flex-col md:flex-row gap-3">
                <div class="relative flex-1">
                    <span style="position:absolute;left:10px;top:50%;transform:translateY(-50%);color:rgba(255,34,68,0.6)"><i class="fas fa-radiation text-xs"></i></span>
                    <input type="text" id="radioSearch" placeholder="escanear ferramenta pelo nome..." class="cyber-input w-full pl-8 pr-3 py-2 text-sm" style="border-color:rgba(255,34,68,0.4);color:#ff8080">
                </div>
                <select id="radioSort" class="cyber-select px-3 py-2 text-sm" style="min-width:180px">
                    <option value="danger_desc">☢ Mais Perigosas</option>
                    <option value="danger_asc">✅ Menos Perigosas</option>
                    <option value="nome">A → Z</option>
                </select>
                <label class="radio-auto-label">
                    <input type="checkbox" id="radioAutoMode" checked>
                    modo automatico
                </label>
                <button id="radioFixBtn" class="btn-radio-fix">fixar selecionada</button>
            </div>
            <div class="radio-mode-status mt-3" id="radioModeStatus">status: automatico em execucao</div>
        </div>
        <div id="radioListBody"></div>
        <div class="flex justify-between items-center px-4 py-3" style="border-top:1px solid var(--border)">
            <button id="radioPrev" class="btn-primary">◀ anterior</button>
            <span class="page-info" id="radioPageInfo">pagina 1</span>
            <button id="radioNext" class="btn-primary">proximo ▶</button>
        </div>
    </div>
</div>
