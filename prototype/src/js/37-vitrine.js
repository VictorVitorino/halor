/* ==========================================================================
   VITRINE DE EFEITOS
   Filtro por intenção, palco com 12 demos ao vivo e editáveis e o catálogo dos
   40 efeitos, cada um com uma prévia que responde ao cursor e ao clique.
   Cada demo é uma fábrica que devolve { start, resume, pause, replay, still }
   e, para o editor, { fields, set, reset }.
   start: primeira entrada na tela · resume/pause: entra e sai da tela
   replay: botão Repetir · still: quadro final para quem pede menos movimento
   fields: controles do painel Editar efeito · set(k, v): muda o efeito na hora
   reset: volta o que os campos não cobrem (ordem, seleção, itens criados).
   ========================================================================== */
const VT_INTENT = {
  abertura: 'Abrir com impacto', ritmo: 'Dar ritmo', foco: 'Focar o olhar', detalhe: 'Mostrar detalhe', relacao: 'Relacionar',
  magnitude: 'Dar peso a números', tempo: 'Contar no tempo', comparacao: 'Comparar', processo: 'Explicar processo'
};

/* [número, nome, família, intenções, dose de movimento (1 a 3), resumo] */
const VT_FX = [
  [1, 'Motion Graphics', 'Movimento', 'abertura ritmo', 3, 'Abertura de capítulo coreografada: forma, linha, título e número entram no tempo certo.'],
  [2, 'Icon Motion', 'Movimento', 'ritmo foco', 1, 'Ícones de linha que se desenham na entrada e respondem ao cursor.'],
  [3, 'Hologram 3D Cards', '3D', 'detalhe abertura', 2, 'Cards com profundidade, reflexo e brilho que seguem o cursor.'],
  [4, '3D Tilt / Perspective', '3D', 'detalhe foco', 2, 'Camadas com profundidade real que inclinam conforme o cursor.'],
  [5, 'Hover Elevation', 'Interface', 'foco detalhe', 1, 'O card sobe de nível quando recebe o cursor, numa escala de 0 a 3.'],
  [6, 'Glow / Light Sweep', 'Movimento', 'foco abertura', 2, 'O número principal ganha anel de luz e varredura. O resto fica quieto.'],
  [7, 'Glassmorphism', 'Interface', 'foco abertura', 1, 'Painel de vidro que desfoca o fundo e flutua sobre o conteúdo.'],
  [8, 'Animated Gradient', 'Movimento', 'abertura ritmo', 2, 'Capa com gradiente violeta em movimento lento, como uma luz que respira.'],
  [9, 'Parallax', '3D', 'relacao abertura', 2, 'Camadas que se movem em velocidades diferentes e criam profundidade.'],
  [10, 'Reveal / Mask Reveal', 'Movimento', 'ritmo foco', 2, 'Blocos surgem de dentro de uma máscara, um após o outro.'],
  [11, 'Animated Typography', 'Movimento', 'abertura foco', 2, 'O título entra palavra a palavra e a palavra-chave ganha um sublinhado de luz.'],
  [12, 'Counter Animation', 'Dados', 'magnitude', 1, 'Números que contam do zero ao valor final e dão peso ao resultado.'],
  [13, 'Progress Motion', 'Dados', 'magnitude tempo', 1, 'Barras e anel avançam até a nota real, com a meta marcada.'],
  [14, 'Heatmap Animation', 'Dados', 'comparacao foco', 2, 'Matriz de calor que acende da célula mais fria à mais quente.'],
  [15, 'Data Highlight', 'Dados', 'foco', 1, 'Um clique esmaece o gráfico e acende só as barras que sustentam a mensagem.'],
  [16, 'Chart Build Animation', 'Dados', 'magnitude tempo', 2, 'O gráfico se monta em etapas: barras, linha, pontos e rótulos.'],
  [17, 'BPMN Flow Motion', 'Processos', 'processo', 2, 'Um ponto de luz percorre o processo na ordem real de execução.'],
  [18, 'Connector / Flow Line', 'Processos', 'processo relacao', 2, 'Linhas se desenham entre os nós e passam a fluir. Um toque mostra as ligações.'],
  [19, 'Pulse / Beacon', 'Interface', 'foco', 1, 'Anéis que se expandem marcam onde está a atenção pendente.'],
  [20, 'Ripple Interaction', 'Interatividade', 'ritmo foco', 1, 'Uma onda nasce no ponto do clique e confirma o toque.'],
  [21, 'Flip Card', 'Interatividade', 'comparacao detalhe', 2, 'O card gira e mostra o verso: antes na frente, depois atrás.'],
  [22, 'Expandable Card', 'Interatividade', 'detalhe', 1, 'Cards fechados que se abrem para revelar o detalhe, um por vez.'],
  [23, 'Modal Focus', 'Interface', 'foco detalhe', 1, 'Um card ganha o palco: o fundo escurece e o detalhe vem para a frente.'],
  [24, 'Spotlight / Focus', 'Narrativa', 'foco', 2, 'Um foco de luz escurece o resto e conduz o olhar passo a passo.'],
  [25, 'Magnetic Button', 'Interatividade', 'ritmo', 2, 'Um botão atraído pelo cursor que volta ao lugar com mola.'],
  [26, 'Microinteractions', 'Interface', 'ritmo foco', 1, 'Respostas curtas a cada clique: alternar, marcar, salvar.'],
  [27, 'Scroll Reveal', 'Movimento', 'ritmo tempo', 1, 'Blocos entram em cena no ritmo da rolagem.'],
  [28, 'Sticky Storytelling', 'Narrativa', 'tempo foco', 2, 'O visual fica fixo e muda de fase enquanto o texto avança.'],
  [29, 'Morphing Shapes', 'Movimento', 'ritmo comparacao', 2, 'Formas que se transformam: silos viram centro, o centro vira rede.'],
  [30, 'Particle System', '3D', 'abertura relacao', 3, 'Campo de partículas ligadas que reage ao cursor. Um fundo vivo de capa.'],
  [31, 'Shimmer / Holographic Sweep', 'Movimento', 'foco abertura', 1, 'Um brilho varre o espaço até o conteúdo chegar, com selo holográfico.'],
  [32, 'Floating Elements', 'Movimento', 'abertura relacao', 2, 'Cards que flutuam em órbita ao redor de um núcleo.'],
  [33, 'Card Stack', 'Interatividade', 'detalhe ritmo', 2, 'Uma pilha de cards: o do topo sai e vai para o fundo, um por vez.'],
  [34, 'Carousel / Horizontal Gallery', 'Interatividade', 'detalhe tempo', 1, 'Galeria horizontal em que cada card encaixa no centro.'],
  [35, 'Interactive Matrix', 'Interatividade', 'comparacao foco', 1, 'Matriz 2×2 com bolhas que você arrasta entre os quadrantes.'],
  [36, 'Tooltip / Contextual Info', 'Interface', 'detalhe', 1, 'Detalhes que aparecem no lugar certo, sem poluir o slide.'],
  [37, 'Before / After Slider', 'Interatividade', 'comparacao', 1, 'Um divisor arrastável compara o antes e o depois no mesmo lugar.'],
  [38, 'Timeline Motion', 'Narrativa', 'tempo', 2, 'Linha do tempo que se desenha marco a marco, no ritmo da fala.'],
  [39, 'Node Network Motion', 'Processos', 'relacao processo', 2, 'Rede viva: toque num nó e os vizinhos acendem.'],
  [40, 'Animated Shader / Hero', '3D', 'abertura', 3, 'Capa com fundo vivo gerado em tempo real e um fio de luz atrás do título.']
];

/* · Prévias do catálogo ·
   O app usa uma cópia gerada destas prévias (apps/web/lib/engines/vitrine/vt-minis.ts): depois de
   mudar VT_MINI, rode na raiz do repositório node apps/web/lib/engines/vitrine/vt-gen-minis.mjs.
   Só elementos de frase (span, b, i, em, svg): a prévia mora dentro do botão do item.
   Cada prévia é um quadro estático bem resolvido; com o cursor (ou o foco) ela roda
   em laço (.is-play) e o clique faz o efeito acontecer. Modo do clique:
   'cyc N I' alterna N estados a partir de I · 'pick' escolhe o item clicado ·
   'spawn' solta um pulso onde clicou · 'net' acende os vizinhos do nó · '' repete. */
const vtB = (c, s, inner = '') => `<b class="${c}" style="${s}">${inner}</b>`;
const vtI = (c, s, inner = '') => `<i class="${c}" style="${s}">${inner}</i>`;
const VT_MINI = {
  1: ['', `<svg class="vm-ring" viewBox="0 0 40 40" style="left:6%;top:16px;width:60px;height:60px"><circle class="in" cx="20" cy="20" r="11"/><circle cx="20" cy="20" r="17" pathLength="100" style="--vm-a:vm-draw"/></svg>${vtI('vm-ac', 'left:calc(6% + 50px);top:12px;width:9px;height:9px;border-radius:2px;--vm-a:vm-pop;--vm-d:.5s')}${vtB('vm-ln', 'left:38%;top:22px;width:46%;height:8px;--vm-a:vm-rise;--vm-d:.25s')}${vtB('vm-ln s', 'left:38%;top:36px;width:30%;--vm-a:vm-rise;--vm-d:.4s')}${vtB('vm-ln s', 'left:38%;top:58px;width:13%;height:13px;border-radius:3px;--vm-a:vm-rise;--vm-d:.6s')}${vtB('vm-ln s', 'left:54%;top:58px;width:13%;height:13px;border-radius:3px;--vm-a:vm-rise;--vm-d:.72s')}${vtB('vm-ac', 'left:70%;top:58px;width:16%;height:13px;border-radius:3px;--vm-a:vm-rise;--vm-d:.84s')}`],
  2: ['', [[6, 'M5 19v-6M10 19V8M15 19v-9M20 19v-4', .1], [37, 'M12 3.5a8.5 8.5 0 1 0 .01 0M12 7.5V12l3 2', .25], [68, 'M4 12h15M13.5 6l6 6-6 6', .4]].map(([x, d, dl]) => `${vtB('vm-cd', `left:${x}%;top:14px;width:26%;height:64px`)}<svg class="vm-ic" viewBox="0 0 24 24" style="left:calc(${x + 13}% - 13px);top:22px;--vm-a:vm-hop;--vm-d:${dl}s"><path d="${d}" pathLength="100" style="--vm-a:vm-draw;--vm-d:${dl}s"/></svg>${vtB('vm-ln s', `left:calc(${x + 13}% - 17px);top:58px;width:34px;height:4px`)}`).join('')],
  3: ['', `<span class="vm-holo vm-abs vm-p vm-hit" style="left:calc(50% - 58px);top:10px;width:116px;height:72px;--vm-a:vm-sway;--vm-h:vm-spinY">${vtI('vm-dt', 'left:10px;top:10px;width:10px;height:10px;background:#fff;box-shadow:0 0 8px #a970ff')}${vtB('vm-ln s', 'right:10px;top:12px;width:20%;height:6px')}${vtB('vm-ln', 'left:10px;top:30px;width:56%;height:10px')}${vtB('vm-ln s', 'left:10px;top:46px;width:38%;height:5px')}${vtB('vm-ac', 'left:10px;bottom:10px;width:30%;height:5px;border-radius:3px')}</span>`],
  4: ['cyc 2 0', `<span class="vm-stk vm-p" style="left:calc(50% - 52px);top:18px;width:104px;height:58px;--vm-a:vm-tsway"><b class="vm-cd" style="--z:0"></b><b class="vm-cd" style="--z:1"></b><b class="vm-cd vm-top vm-abs" style="--z:2">${vtB('vm-ln', 'left:10px;top:12px;width:50%;height:6px')}${vtB('vm-ln s', 'left:10px;top:24px;width:34%;height:4px')}</b></span>`],
  5: ['pick', [6, 29.5, 53, 76.5].map((x, i) => `<b class="vm-cd vm-el vm-abs${i === 1 ? ' is-pk' : ''}" data-p style="left:${x}%;top:22px;width:17.5%;height:54px;--vm-a:vm-lift;--vm-d:${i * .35}s">${vtI('vm-ac', 'left:8px;top:9px;width:9px;height:9px;border-radius:3px')}${vtI('vm-ln', 'left:8px;top:26px;width:62%;height:5px')}${vtI('vm-ln s', 'left:8px;top:36px;width:40%;height:4px')}</b>`).join('')],
  6: ['', `<span class="vm-glow vm-abs" style="left:6%;top:12px;width:50%;height:68px;--vm-a:vt-spin;--vm-t:4s;--vm-e:linear">${vtB('vm-ln s', 'left:12px;top:14px;width:42%;height:5px')}<em class="vm-num" style="left:12px;top:30px">41%</em>${vtI('vm-sw2', '--vm-a:vm-sweep;--vm-t:2.6s')}</span>${[12, 49].map(y => `${vtB('vm-cd', `left:60%;top:${y}px;width:34%;height:31px`)}${vtB('vm-ln s', `left:calc(60% + 9px);top:${y + 8}px;width:14%;height:4px`)}${vtB('vm-ln', `left:calc(60% + 9px);top:${y + 17}px;width:11%;height:6px;opacity:.55`)}`).join('')}`],
  7: ['cyc 2 0', `${vtI('vm-blob', 'left:8%;top:-14px;width:96px;height:96px;--vm-a:vm-drift;--vm-t:6s')}${vtI('vm-blob b2', 'left:56%;top:26px;width:84px;height:84px;--vm-a:vm-drift;--vm-t:6s;--vm-d:-3s')}${vtB('vm-cd', 'left:7%;top:14px;width:22%;height:22px')}${vtB('vm-cd', 'left:72%;top:58px;width:20%;height:20px')}<span class="vm-glass vm-abs vm-p" style="left:calc(50% - 64px);top:15px;width:128px;height:62px">${vtB('vm-ln', 'left:12px;top:14px;width:50%;height:7px')}${vtB('vm-ln s', 'left:12px;top:28px;width:72%;height:4px')}${vtB('vm-ln s', 'left:12px;top:38px;width:44%;height:4px')}${vtI('vm-ac', 'right:12px;top:12px;width:8px;height:8px;border-radius:50%')}</span>`],
  8: ['cyc 3 0', `${vtI('vm-grad', 'inset:-30%;--vm-a:vm-drift;--vm-t:7s')}${vtI('vm-ac', 'left:8%;top:30px;width:22px;height:3px;border-radius:2px')}${vtB('vm-ln', 'left:8%;top:42px;width:50%;height:10px')}${vtB('vm-ln s', 'left:8%;top:60px;width:30%;height:5px')}`],
  9: ['', `${vtI('vm-grid vm-p', 'inset:-14px;--k:5px;--vm-a:vm-par')}${vtB('vm-cd vm-p', 'left:12%;top:16px;width:32%;height:28px;--k:12px;--vm-a:vm-par')}<b class="vm-cd vm-hl vm-abs vm-p" style="left:50%;top:38px;width:36%;height:34px;--k:26px;--vm-a:vm-par">${vtB('vm-ln', 'left:10px;top:10px;width:50%;height:6px')}${vtB('vm-ln s', 'left:10px;top:21px;width:32%;height:4px')}</b>${vtB('vm-ln vm-p', 'left:12%;top:56px;width:28%;height:8px;--k:18px;--vm-a:vm-par')}${vtB('vm-ln s vm-p', 'left:12%;top:70px;width:20%;height:4px;--k:18px;--vm-a:vm-par')}`],
  10: ['', [14, 38, 62].map((y, i) => `${vtI('vm-dt vm-ac', `left:8%;top:${y}px;width:9px;height:9px;--vm-a:vm-pop;--vm-d:${.1 + i * .2}s`)}${vtB('vm-ln', `left:calc(8% + 18px);top:${y}px;width:${[44, 36, 40][i]}%;height:7px;--vm-a:vm-wipe;--vm-d:${.15 + i * .2}s`)}${vtB('vm-ln s', `left:calc(8% + 18px);top:${y + 11}px;width:${[30, 26, 22][i]}%;height:4px;--vm-a:vm-wipe;--vm-d:${.25 + i * .2}s`)}`).join('') + [26, 40, 58].map((h, i) => vtB('vm-br' + (i === 2 ? ' vm-hb' : ''), `left:${72 + i * 7}%;width:5%;height:${h}px;--vm-a:vm-gy;--vm-d:${.7 + i * .12}s`)).join('')],
  11: ['', `${vtB('vm-ln', 'left:8%;top:26px;width:22%;height:11px;--vm-a:vm-rise;--vm-d:.1s')}${vtB('vm-ln', 'left:33%;top:26px;width:30%;height:11px;--vm-a:vm-rise;--vm-d:.22s')}${vtI('vm-ac', 'left:33%;top:41px;width:30%;height:2.5px;border-radius:2px;transform-origin:left;--vm-a:vm-gx;--vm-d:.6s')}${vtB('vm-ln', 'left:66%;top:26px;width:22%;height:11px;--vm-a:vm-rise;--vm-d:.34s')}${vtB('vm-ln', 'left:8%;top:52px;width:26%;height:11px;--vm-a:vm-rise;--vm-d:.46s')}<em class="vm-num" style="left:37%;top:47px;--vm-a:vm-pop;--vm-d:.8s">38%</em>`],
  12: ['', [[6, 38, '+', '%'], [36.5, 1240, '', ''], [67, 86, '', '%']].map(([x, n, p, s], i) => `${vtB('vm-cd', `left:${x}%;top:14px;width:27%;height:64px`)}${vtB('vm-ln s', `left:calc(${x}% + 9px);top:23px;width:12%;height:4px`)}<em class="vm-cnt" style="left:calc(${x}% + 9px);top:33px;--to:${n};--vm-n:${n};--pre:'${p}';--suf:'${s}';--vm-a:vm-count;--vm-d:${i * .15}s"></em>${vtI('vm-ac', `left:calc(${x}% + 9px);top:62px;width:calc(27% - 18px);height:3px;border-radius:2px;transform-origin:left;--vm-a:vm-gx;--vm-d:${i * .15}s`)}`).join('')],
  13: ['cyc 3 0', `<svg class="vm-prog" viewBox="0 0 40 40" style="left:6%;top:16px;width:60px;height:60px"><circle class="tr" cx="20" cy="20" r="16"/><circle class="pv" cx="20" cy="20" r="16" pathLength="100" style="--vm-a:vm-prog"/></svg><em class="vm-pct" style="left:6%;top:16px;width:60px;height:60px"></em>` + [[20, 'p1', .8], [42, 'p2', .6], [64, 'p3', .9]].map(([y, p, t], i) => `${vtB('vm-ln s', `left:38%;top:${y}px;width:54%;height:6px`)}${vtB('vm-ac vm-fill', `left:38%;top:${y}px;width:calc(54% * var(--${p}));height:6px;border-radius:99px;transform-origin:left;--vm-a:vm-gx;--vm-d:${.2 + i * .15}s`)}${vtI('vm-tick', `left:calc(38% + 54% * ${t} - 1px);top:${y - 3}px`)}`).join('')],
  14: ['pick', `<span class="vm-heat" style="left:6%;right:6%;top:12px;bottom:12px">${[.2, .35, .5, .3, .62, .8, .45, .25, .4, .55, .7, .9, .6, .35, .5, .3, .15, .3, .45, .6, .75, 1, .55, .4].map(h => `<i data-p style="--h:${h};--vm-a:vm-heat;--vm-d:${(h * 1.1).toFixed(2)}s"></i>`).join('')}</span>`],
  15: ['', [.42, .55, .48, .92, .6, .5, .38].map((h, i) => vtB('vm-br' + (i === 3 ? ' vm-hb' : ' vm-dim2'), `left:${8 + i * 12.4}%;width:8%;height:${Math.round(h * 58)}px;--vm-a:${i === 3 ? 'vm-glowb' : 'vm-dimb'}`)).join('') + `<em class="vm-tag" style="left:calc(${(8 + 3 * 12.4 + 4).toFixed(1)}% - 21px);top:4px">+58%</em>`],
  16: ['', [.35, .45, .5, .62, .72, .9].map((h, i) => vtB('vm-br' + (i === 5 ? ' vm-hb' : ''), `left:${7 + i * 14.5}%;width:9%;height:${Math.round(h * 56)}px;--vm-a:vm-gy;--vm-d:${i * .1}s`)).join('') + `<svg class="vm-line" viewBox="0 0 100 92" preserveAspectRatio="none" style="left:0;top:0;width:100%;height:100%"><path d="M11.5 50 L26 44.8 L40.5 42 L55 35.3 L69.5 29.7 L84 19.6" pathLength="100" style="--vm-a:vm-draw;--vm-d:.7s"/></svg>` + [50, 44.8, 42, 35.3, 29.7, 19.6].map((y, i) => vtI('vm-pt', `left:calc(${11.5 + i * 14.5}% - 3.5px);top:${y - 3.5}px;--vm-a:vm-pop;--vm-d:${1 + i * .08}s`)).join('')],
  17: ['', `<svg class="vm-bpmn" viewBox="0 0 300 88" style="inset:0;width:100%;height:100%"><path class="ln" d="M35 44H62M120 44H136M164 44H186M244 44H265"/><circle class="ev" cx="26" cy="44" r="9"/><rect class="tk" x="62" y="30" width="58" height="28" rx="7"/><rect class="lb" x="71" y="41" width="36" height="5" rx="2.5"/><path class="gw" d="M150 30L164 44L150 58L136 44Z" style="--vm-a:vm-gwf"/><rect class="tk" x="186" y="30" width="58" height="28" rx="7"/><rect class="lb" x="195" y="41" width="40" height="5" rx="2.5"/><circle class="ev end" cx="274" cy="44" r="9"/><circle class="tok" cx="26" cy="44" r="5" style="--vm-a:vm-tok"/></svg>`],
  18: ['', `<svg class="vm-conn" viewBox="0 0 300 88" style="inset:0;width:100%;height:100%">${['M62 24C95 24 95 44 128 44', 'M62 64C95 64 95 44 128 44', 'M172 44C205 44 205 24 238 24', 'M172 44C205 44 205 64 238 64'].map(d => `<path class="bs" d="${d}"/><path class="fl" d="${d}" style="--vm-a:vm-dash;--vm-t:1s;--vm-e:linear"/>`).join('')}${[[18, 14, 44, 20], [18, 54, 44, 20], [128, 32, 44, 24, 1], [238, 14, 44, 20], [238, 54, 44, 20]].map(([x, y, w, h, c]) => `<rect class="nd${c ? ' core' : ''}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/>`).join('')}</svg>`],
  19: ['spawn', `${vtI('vm-map', 'inset:0')}${[[18, 24], [32, 62], [82, 26], [72, 66]].map(([x, y]) => vtI('vm-dt vm-nd', `left:${x}%;top:${y}px`)).join('')}${vtI('vm-pg', 'left:52%;top:46px;--vm-a:vm-ping;--vm-t:2s')}${vtI('vm-pg', 'left:52%;top:46px;--vm-a:vm-ping;--vm-t:2s;--vm-d:1s')}${vtI('vm-dt vm-bc', 'left:52%;top:46px')}<b class="vm-cd vm-abs" style="left:calc(52% + 16px);top:14px;width:28%;height:22px">${vtI('vm-ln', 'left:8px;top:6px;width:60%;height:4px')}${vtI('vm-ln s', 'left:8px;top:13px;width:40%;height:3px')}</b>`],
  20: ['cyc 2 0', `<b class="vm-cd vm-rc vm-abs" style="left:7%;top:16px;width:56%;height:60px">${vtI('vm-ac', 'left:10px;top:12px;width:14px;height:14px;border-radius:4px')}${vtB('vm-ln', 'left:10px;top:34px;width:62%;height:6px')}${vtB('vm-ln s', 'left:10px;top:46px;width:40%;height:4px')}${vtI('vm-wave', 'left:58%;top:30px;--vm-a:vm-wave')}</b>${vtB('vm-cd', 'left:67%;top:16px;width:26%;height:60px;opacity:.55')}${vtI('vm-cur', 'left:calc(7% + 56% * .58);top:46px;--vm-a:vm-tap')}`],
  21: ['', [6, 36.5, 67].map((x, i) => `<span class="vm-flip" style="left:${x}%;top:14px;width:27%;height:64px"><i class="vm-fin${i === 1 ? ' on' : ''}" style="--vm-a:vm-flipc;--vm-d:${i * .3}s"><b class="f vm-abs">${vtI('vm-ln s', 'left:9px;top:10px;width:46%;height:4px')}${vtI('vm-ln', 'left:9px;top:24px;width:40%;height:10px;opacity:.6')}</b><b class="b vm-abs">${vtI('vm-ln', 'left:9px;top:10px;width:46%;height:4px;opacity:.8')}${vtI('vm-ln', 'left:9px;top:24px;width:52%;height:10px')}</b></i></span>`).join('')],
  22: ['cyc 3 0', `<span class="vm-acc" style="left:8%;right:8%;top:8px;bottom:8px">${[0, 1, 2].map(r => `<b class="r vm-abs" style="--vm-a:vm-accx;--vm-d:${[0, -2.4, -1.2][r]}s">${vtI('vm-ln', `left:10px;top:5px;width:${[46, 38, 52][r]}%;height:6px`)}${vtI('chv', '')}${vtI('vm-ln s', 'left:10px;top:18px;width:70%;height:4px')}${vtI('vm-ln s', 'left:10px;top:26px;width:52%;height:4px')}</b>`).join('')}</span>`],
  23: ['cyc 2 1', `${[[6, 12], [37, 12], [68, 12], [6, 50], [37, 50], [68, 50]].map(([x, y]) => vtB('vm-cd', `left:${x}%;top:${y}px;width:26%;height:30px`)).join('')}${vtI('vm-dim', 'inset:0;--vm-a:vm-dimm')}<span class="vm-modal vm-abs" style="left:calc(50% - 62px);top:12px;width:124px;height:68px;--vm-a:vm-modal">${vtB('vm-ln', 'left:10px;top:10px;width:58%;height:7px')}${vtB('vm-ln s', 'left:10px;top:23px;width:78%;height:4px')}${[[.8, 33], [.55, 41], [.35, 49]].map(([w, y]) => `${vtB('vm-ln s', `left:10px;top:${y}px;width:calc(100% - 20px);height:4px;opacity:.5`)}${vtB('vm-ac', `left:10px;top:${y}px;width:calc((100% - 20px) * ${w});height:4px;border-radius:99px`)}`).join('')}${vtI('vm-x', '')}</span>`],
  24: ['', `${vtB('vm-ln s', 'left:6%;top:14px;width:40%;height:6px')}${[6, 29.5, 53, 76.5].map((x, i) => vtB('vm-cd' + (i === 2 ? ' vm-hot' : ''), `left:${x}%;top:36px;width:17.5%;height:26px`)).join('')}${vtI('vm-spot', 'left:-100%;width:300%;top:0;bottom:0;--vm-a:vm-spotm')}`],
  25: ['', `${vtI('vm-field', 'left:calc(50% - 50px);top:-4px;width:100px;height:100px')}<b class="vm-mag vm-abs vm-p vm-hit" style="left:calc(50% - 46px);top:31px;width:92px;height:30px;--vm-a:vm-magp;--vm-h:vm-press">${vtI('vm-ln', 'left:16px;top:12px;width:42px;height:6px;background:#fff')}${vtI('arr', 'right:14px;top:11px')}</b>`],
  26: ['cyc 4 2', `<b class="vm-sw" style="left:8%;top:17px"><i></i></b>${vtB('vm-ln s', 'left:calc(8% + 46px);top:24px;width:34%;height:5px')}<b class="vm-ck" style="left:8%;top:54px"><svg viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" pathLength="100"/></svg></b>${vtB('vm-ln s', 'left:calc(8% + 46px);top:61px;width:40%;height:5px')}<b class="vm-star" style="right:9%;top:calc(50% - 18px);--vm-a:vm-beat"><svg viewBox="0 0 24 24"><path d="M12 3.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6L12 17l-5.4 3 1.2-6-4.5-4.2 6.1-.7z"/></svg></b>`],
  27: ['', `${vtI('vm-track', 'right:7px;top:10px;height:72px')}${vtI('vm-thumb', 'right:7px;top:10px;--vm-a:vm-thumb')}${[12, 37, 62].map((y, i) => `<span class="vm-row" style="left:7%;right:12%;top:${y}px;height:20px;--vm-a:vm-rise;--vm-d:${.15 + i * .25}s"><i class="vm-dt vm-ac"></i><b class="vm-ln" style="width:${[42, 34, 48][i]}%"></b><b class="vm-ln s" style="width:${[20, 26, 16][i]}%;margin-left:auto"></b></span>`).join('')}`],
  28: ['cyc 4 0', `<span class="vm-stv" style="left:6%;top:10px;width:40%;height:72px">${[0, 1, 2, 3].map(i => `<i class="b" style="left:${12 + i * 21}%;height:var(--h${i})"></i>`).join('')}<span class="vm-phd"><i></i><i></i><i></i><i></i></span></span><span class="vm-stt" style="left:52%;right:6%;top:0;bottom:0"><span class="in">${[60, 48, 66, 54].map(w => `<span><b class="vm-ln" style="width:${w}%;height:6px"></b><b class="vm-ln s" style="width:88%;height:4px"></b><b class="vm-ln s" style="width:64%;height:4px"></b></span>`).join('')}</span></span>`],
  29: ['cyc 3 2', `<svg class="vm-mnet" viewBox="0 0 180 92" style="left:calc(50% - 90px);top:0;width:180px;height:92px"><path d="M90 46L22 20M90 46L22 72M90 46L158 20M90 46L158 72"/><circle cx="22" cy="20" r="6"/><circle cx="22" cy="72" r="6"/><circle cx="158" cy="20" r="6"/><circle cx="158" cy="72" r="6"/></svg>${vtI('vm-morph', 'left:calc(50% - 26px);top:20px;width:52px;height:52px;--vm-a:vm-morph;--vm-t:4.8s')}`],
  30: ['', (() => {
    const P = [[18, 20], [52, 10], [84, 30], [122, 14], [160, 28], [204, 12], [246, 24], [284, 10], [30, 62], [70, 76], [110, 60], [150, 78], [196, 64], [236, 80], [278, 58], [96, 40], [184, 46], [262, 42]];
    let ln = '';
    P.forEach(([x, y], i) => P.slice(i + 1).forEach(([u, v]) => { if (Math.hypot(x - u, y - v) < 50) ln += `M${x} ${y}L${u} ${v}`; }));
    return `<svg class="vm-pts" viewBox="0 0 300 92" preserveAspectRatio="xMidYMid slice" style="inset:0;width:100%;height:100%"><path d="${ln}"/>${P.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i % 4 ? 1.6 : 2.6}" style="--vm-a:vm-blink;--vm-d:-${(i * .37).toFixed(2)}s"/>`).join('')}</svg>${vtB('vm-ln', 'left:calc(50% - 50px);top:36px;width:100px;height:9px')}${vtB('vm-ln s', 'left:calc(50% - 30px);top:52px;width:60px;height:4px')}`;
  })()],
  31: ['cyc 2 0', `${vtB('vm-sk vm-img', 'left:7%;top:14px;width:22%;height:64px')}${vtB('vm-sk', 'left:35%;top:18px;width:46%;height:9px')}${vtB('vm-sk', 'left:35%;top:34px;width:56%;height:6px')}${vtB('vm-sk', 'left:35%;top:46px;width:38%;height:6px')}${vtB('vm-sk vm-pl', 'left:35%;top:62px;width:22%;height:12px')}${vtI('vm-shim', 'top:0;bottom:0;left:0;width:34%;--vm-a:vm-sweep;--vm-t:1.6s')}`],
  32: ['cyc 2 0', `${vtI('vm-orbit', '')}${vtI('vm-core', 'left:calc(50% - 17px);top:calc(50% - 17px);width:34px;height:34px')}<span class="vm-orbw" style="left:50%;top:50%"><span class="vm-orb" style="--vm-a:vm-spin;--vm-t:10s;--vm-e:linear">${[0, 72, 144, 216, 288].map(r => `<i style="--r:${r}deg"></i>`).join('')}</span></span>`],
  33: ['', `${vtB('vm-cd', 'left:calc(50% - 52px);top:28px;width:104px;height:54px;transform:translateY(-14px) scale(.86);opacity:.6')}${vtB('vm-cd', 'left:calc(50% - 52px);top:28px;width:104px;height:54px;transform:translateY(-7px) scale(.93);opacity:.85')}<b class="vm-cd vm-topc vm-abs" style="left:calc(50% - 52px);top:28px;width:104px;height:54px;--vm-a:vm-swipe">${vtI('vm-ln s', 'left:10px;top:9px;width:30%;height:4px')}${vtI('vm-ln', 'left:10px;top:20px;width:58%;height:8px')}${vtI('vm-ln s', 'left:10px;top:34px;width:72%;height:4px')}</b>`],
  34: ['cyc 4 1', `<span class="vm-car" style="left:50%;top:12px;height:58px">${[0, 1, 2, 3, 4].map(() => `<b class="vm-cd vm-abs">${vtI('vm-ac', 'left:9px;top:9px;width:10px;height:10px;border-radius:3px')}${vtI('vm-ln', 'left:9px;top:26px;width:62%;height:6px')}${vtI('vm-ln s', 'left:9px;top:37px;width:44%;height:4px')}</b>`).join('')}</span><span class="vm-dots" style="left:calc(50% - 25px);bottom:9px"><i></i><i></i><i></i><i></i></span>`],
  35: ['', `<span class="vm-mx" style="left:10%;right:6%;top:8px;bottom:12px"><i></i><i></i><i></i><i></i></span>${vtI('vm-ln s', 'left:4%;top:calc(50% - 14px);width:3px;height:28px')}${vtI('vm-bub', 'left:28%;top:26px')}${vtI('vm-bub b2', 'left:70%;top:24px')}${vtI('vm-bub b2', 'left:66%;top:58px')}${vtI('vm-bub vm-hb2', 'left:36%;top:58px;--vm-a:vm-mxm')}`],
  36: ['pick', `${vtB('vm-ln s', 'left:14%;right:22%;top:63px;height:2px')}${[14, 46, 78].map((x, i) => `<b class="vm-node${i === 1 ? ' is-pk' : ''}" data-p style="left:calc(${x}% - 8px);top:56px">${vtI('vm-pg2', `--vm-a:vm-ping;--vm-t:2.4s;--vm-d:${i * .8}s`)}<em class="vm-tip">${vtI('vm-ln', 'width:60%;height:5px')}${vtI('vm-ln s', 'width:84%;height:4px')}${vtI('vm-ln s', 'width:46%;height:4px')}</em></b>`).join('')}`],
  37: ['', `<span class="vm-ba-a vm-abs" style="inset:0">${[.36, .5, .64, 1].map((h, i) => vtB('vm-br' + (i === 3 ? ' vm-hb' : ''), `left:${58 + i * 9}%;width:6%;height:${Math.round(h * 34)}px`)).join('')}<em class="vm-num" style="right:8%;top:12px">+38%</em></span><span class="vm-ba-b vm-abs" style="inset:0;--vm-a:vm-bab">${[16, 28, 40, 52, 64].map((y, i) => vtB('vm-ln', `left:8%;top:${y}px;width:${[40, 34, 38, 30, 36][i]}%;height:4px`)).join('')}</span>${vtI('vm-ba-l', 'top:0;bottom:0;left:50%;--vm-a:vm-bal')}`],
  38: ['cyc 4 1', `${vtI('vm-tl', 'left:8%;right:8%;top:52px')}${vtI('vm-tlp', 'left:8%;top:52px;--vm-a:vm-gx')}${[0, 1, 2, 3].map(i => `${vtB('vm-ms', `left:calc(8% + 84% * ${(i / 3).toFixed(4)} - 6px);top:46px;--vm-a:vm-pop;--vm-d:${(.2 + i * .35).toFixed(2)}s`)}${vtI('vm-ln s', `left:calc(8% + 84% * ${(i / 3).toFixed(4)} - ${i === 0 ? 4 : i === 3 ? 28 : 16}px);top:${i % 2 ? 66 : 22}px;width:32px;height:5px`)}${vtI('vm-ln s', `left:calc(8% + 84% * ${(i / 3).toFixed(4)} - ${i === 0 ? 4 : i === 3 ? 18 : 11}px);top:${i % 2 ? 75 : 31}px;width:22px;height:3px;opacity:.6`)}`).join('')}`],
  39: ['net', (() => {
    const N = [[36, 26], [96, 64], [92, 16], [150, 40], [206, 70], [214, 22], [264, 46], [150, 80]];
    const E = [[0, 1], [0, 2], [2, 3], [1, 3], [3, 4], [3, 5], [5, 6], [4, 6], [1, 7], [7, 4]];
    const H = 3, nb = new Set(E.filter(e => e.includes(H)).flat());
    return `<svg class="vm-net" viewBox="0 0 300 92" style="inset:0;width:100%;height:100%">${E.map(([a, b]) => `<line data-e="${a} ${b}"${a === H || b === H ? ' class="on"' : ''} x1="${N[a][0]}" y1="${N[a][1]}" x2="${N[b][0]}" y2="${N[b][1]}" style="--vm-a:vm-dash;--vm-t:1.2s;--vm-e:linear"/>`).join('')}${N.map(([x, y], i) => `<circle data-p="${i}"${i === H ? ' class="is-pk"' : nb.has(i) ? ' class="nb"' : ''} cx="${x}" cy="${y}" r="${i === H ? 8 : 5.5}"/>`).join('')}</svg>`;
  })()],
  40: ['', `${vtI('vm-shd', 'inset:-60%;--vm-a:vm-spin;--vm-t:16s;--vm-e:linear')}<svg class="vm-thread" viewBox="0 0 300 92" preserveAspectRatio="none" style="inset:0;width:100%;height:100%"><path d="M-10 74C50 74 70 30 130 40S220 84 310 26" pathLength="100" style="--vm-a:vm-draw"/></svg>${vtI('vm-light vm-hit', 'inset:0;--vm-h:vm-burst')}${vtI('vm-ac', 'left:8%;top:22px;width:7px;height:7px;border-radius:50%')}${vtB('vm-ln', 'left:8%;top:34px;width:50%;height:10px')}${vtB('vm-ln s', 'left:8%;top:52px;width:32%;height:5px')}`]
};
/* HTML da prévia: a raiz guarda o modo e o estado inicial */
function vtMiniHTML(n) {
  const [mode, html] = VT_MINI[n] || ['', ''];
  const [k, cnt, s0] = mode.split(' ');
  const st = k === 'cyc' ? ` data-n="${cnt}" data-s="${s0}"` : '';
  const pk = (k === 'pick' || k === 'net') && /is-pk/.test(html) ? ' has-pk' : '';
  return `<span class="vt-mini m${n}${pk}" aria-hidden="true" data-k="${k || ''}"${st}>${html}</span>`;
}
/* O que o clique numa prévia fez, dito ao leitor de tela (a prévia é decorativa).
   cyc: um texto por estado · pick/net: (índice, aceso?) => texto · os demais: um texto. */
const vtOrd = i => ['primeiro', 'segundo', 'terceiro', 'quarto'][i] || `${i + 1}º`;
const VT_MINI_SAY = {
  4: ['camadas juntas', 'camadas afastadas, com mais profundidade'],
  5: (i, on) => on ? `${vtOrd(i)} card elevado` : 'todos os cards no chão',
  7: ['vidro desfocado', 'vidro nítido'],
  8: ['paleta 1 de 3', 'paleta 2 de 3', 'paleta 3 de 3'],
  13: ['progresso em 72%', 'progresso em 48%', 'progresso em 94%'],
  14: (i, on) => on ? `célula ${i + 1} de 24 em destaque` : 'mapa inteiro aceso',
  19: 'um novo pulso foi solto',
  20: ['onda solta', 'card tocado e selecionado'],
  22: ['primeiro card aberto', 'segundo card aberto', 'terceiro card aberto'],
  23: ['modal fechado', 'modal aberto, fundo escurecido'],
  26: ['tudo desligado', 'chave ligada', 'item marcado', 'favorito salvo'],
  28: ['fase 1 de 4', 'fase 2 de 4', 'fase 3 de 4', 'fase 4 de 4'],
  29: ['círculo', 'losango', 'rede'],
  31: ['carregando, com brilho', 'conteúdo carregado'],
  32: ['órbita fechada', 'órbita aberta'],
  34: ['card 1 de 4 no centro', 'card 2 de 4 no centro', 'card 3 de 4 no centro', 'card 4 de 4 no centro'],
  36: (i, on) => on ? `${vtOrd(i)} detalhe aberto` : 'detalhes fechados',
  38: ['marco 1 de 4', 'marco 2 de 4', 'marco 3 de 4', 'marco 4 de 4'],
  39: (i, on, nb) => on ? `nó ${i + 1} aceso com ${nb} vizinhos` : 'rede em repouso'
};
function vtMiniSay(n, name, s, on, nb) {
  const t = VT_MINI_SAY[n];
  const what = typeof t === 'function' ? t(s, on, nb) : Array.isArray(t) ? t[s] : t || 'a prévia rodou de novo';
  return `${name}: ${what}.`;
}

const VT_DEMO = {};
const vtClamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const vtEase = p => 1 - Math.pow(1 - p, 3);
/* paleta Halor das amostras de cor */
const VT_SW = [['Violeta', '#8b3dff'], ['Neon', '#a970ff'], ['Lilás', '#c9a6ff'], ['Rosa', '#ff9ad5'], ['Verde', '#4fd69a'], ['Âmbar', '#f7bd55']];
const vtRgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
function vtAccent(card, hex) {
  card.style.setProperty('--vt-acc', hex);
  card.style.setProperty('--vt-rgb', vtRgb(hex).join(' '));
}
/* avisa o painel de um valor que mudou por fora (ex.: o card do topo trocou) */
const vtSync = (card, k, v) => card.dispatchEvent(new CustomEvent('vt-sync', { detail: { k, v } }));
const vtFmt = (v, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
/* número digitado em pt-BR ("1.240", "12,8") ou com ponto decimal ("12.8") */
const vtNum = s => {
  let t = String(s).trim().replace(/[−–]/g, '-').replace(/\s/g, '');
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  return parseFloat(t);
};
/* reinicia as transições CSS de um card: estado inicial sem transição, depois o final com transição */
function vtRestart(card) {
  card.classList.add('vt-reset');
  card.classList.remove('is-on');
  void card.offsetWidth;
  card.classList.remove('vt-reset');
  card.classList.add('is-on');
}
/* reinicia uma classe de animação de uso único */
function vtKick(n, cls, ms) {
  n.classList.remove(cls); void n.offsetWidth; n.classList.add(cls);
  clearTimeout(n['_' + cls]);
  if (ms) n['_' + cls] = setTimeout(() => n.classList.remove(cls), ms);
}
/* interpolação curta com rAF; devolve a função que cancela */
function vtTween(dur, fn, done) {
  if (REDUCED) { fn(1); if (done) done(); return () => {}; }
  let raf = 0; const t0 = performance.now();
  const tick = t => { const p = vtClamp((t - t0) / dur); fn(p); if (p < 1) raf = requestAnimationFrame(tick); else if (done) done(); };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
/* Ripple (efeito 20): uma onda nasce no ponto do toque e some */
function vtRipple(host, x, y) {
  if (REDUCED) return;
  const r = host.getBoundingClientRect();
  const s = Math.min(2 * Math.hypot(Math.max(x, r.width - x), Math.max(y, r.height - y)), host.classList.contains('vt-demo') ? 380 : 900);
  const w = el('span', 'vt-rip'); w.setAttribute('aria-hidden', 'true');
  w.style.cssText = `left:${x}px;top:${y}px;--s:${s.toFixed(0)}px`;
  host.append(w);
  setTimeout(() => w.remove(), 760);
}

function bootVitrine() {
  const sec = document.getElementById('vitrine');
  if (!sec || sec.dataset.vtBoot) return;
  sec.dataset.vtBoot = '1';
  /* a seção pertence ao site: se ficou fora da view, entra no main antes dos planos */
  if (!sec.closest('.view')) {
    const main = document.querySelector('#v-site main');
    if (main) main.insertBefore(sec, main.querySelector(':scope > #planos') || main.querySelector(':scope > .s-final'));
  }
  sec.classList.add('vt-ready');
  if (REDUCED) sec.classList.add('vt-reduced');
  const live = {};
  $$('.vt-card', sec).forEach(c => c.dataset.fx.split(' ').forEach(n => { live[n] = c; }));
  /* aviso para leitor de tela (região viva da seção) */
  const status = $('#vt-status', sec);
  let sayT = 0;
  const say = t => { status.textContent = ''; clearTimeout(sayT); sayT = setTimeout(() => { status.textContent = t; }, 30); };
  vtCatalog(sec, live);
  vtFilter(sec, say);
  vtDemos(sec, say);
  vtMinis(sec, say);
  vtCatEditor(sec, say, live);
  vtRipples(sec);
}

/* · Ripple em tudo o que se clica na vitrine · */
const VT_RIP = '.vt-demo, .vt-item, .vt-edit, .vt-replay, .vt-ed-reset, .vt-ed-add, .vt-chip, .vt-plus-pill';
function vtRipples(sec) {
  sec.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const host = e.target.closest(VT_RIP); if (!host) return;
    const r = host.getBoundingClientRect();
    vtRipple(host, e.clientX - r.left, e.clientY - r.top);
  });
  /* clique pelo teclado (Enter ou Espaço): a onda nasce no centro do que foi acionado */
  sec.addEventListener('click', e => {
    if (e.detail !== 0) return;
    const host = e.target.closest(VT_RIP); if (!host) return;
    const r = host.getBoundingClientRect(), t = e.target.getBoundingClientRect();
    vtRipple(host, t.left + t.width / 2 - r.left, t.top + t.height / 2 - r.top);
  });
}

/* · Catálogo ·
   Cada item é um botão só com conteúdo de frase (spans): o nome acessível é o número e o
   nome do efeito; o resumo, a dose e a instrução vão na descrição. O invólucro .vt-item-rv
   entra no Scroll Reveal reversível (o li fica livre para o pulo do filtro). */
function vtCatalog(sec, live) {
  const ul = $('#vt-cat', sec);
  VT_FX.forEach(([n, name, fam, ints, dose, sum], i) => {
    const li = el('li'); li.dataset.intents = ints;
    const rv = el('div', 'vt-item-rv'); rv.dataset.rv = 'card'; rv.style.setProperty('--rv-i', i % 4);
    const card = live[n], id = 'vt-i' + n;
    const it = el('button', 'vt-item'); it.type = 'button'; it.dataset.n = n;
    it.setAttribute('aria-labelledby', `${id}-n ${id}-t`); it.setAttribute('aria-describedby', `${id}-s ${id}-h`);
    it.insertAdjacentHTML('beforeend', vtMiniHTML(n));
    const top = el('span', 'vt-item-top');
    const num = el('span', 'vt-item-n', String(n).padStart(2, '0')); num.id = id + '-n';
    top.append(num, el('span', 'vt-item-c', fam));
    if (card) top.append(el('span', 'vt-live', 'Ao vivo'));
    const d = el('span', 'vt-dose'); d.setAttribute('aria-hidden', 'true');
    for (let k = 1; k <= 3; k++) d.append(el('i', k <= dose ? 'on' : ''));
    top.append(d);
    const t = el('span', 'vt-item-t', name); t.id = id + '-t';
    const s = el('span', 'vt-item-s', sum); s.id = id + '-s';
    const h = el('span', 'sr-only', `Dose de movimento ${dose} de 3. ${card ? 'Ao vivo: leva à demonstração editável no palco.' : 'Clique para mexer na prévia.'}`); h.id = id + '-h';
    it.append(top, t, s, h);
    if (card) {
      it.dataset.live = '1';
      it.addEventListener('click', () => {
        card.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
        card.setAttribute('tabindex', '-1');
        card.focus({ preventScroll: true });
        card.classList.remove('is-ping'); void card.offsetWidth; card.classList.add('is-ping');
        clearTimeout(card._ping); card._ping = setTimeout(() => card.classList.remove('is-ping'), 1800);
      });
    }
    /* Editar efeito: irmão do botão do item (nunca dentro dele), numa faixa no pé do item.
       Nos ao vivo leva ao painel do card no palco; nos outros abre o editor da prévia. */
    const ed = el('button', 'btn btn-ghost btn-xs vt-edit vt-item-ed'); ed.type = 'button'; ed.dataset.n = n;
    ed.setAttribute('aria-label', `Editar efeito: ${name}`);
    if (!card) ed.setAttribute('aria-haspopup', 'dialog');
    ed.innerHTML = '<svg aria-hidden="true"><use href="#i-sliders"/></svg><span>Editar efeito</span>';
    rv.append(it, ed); li.append(rv); ul.append(li);
  });
}

/* · Estado de uma prévia · cyc: o índice em data-s · pick/net: o item aceso (-1 = nenhum).
   Os que não têm estado devolvem null. vtMiniState aplica um estado e devolve, na rede, quantos
   vizinhos acenderam. */
function vtMiniGet(m) {
  const k = m.dataset.k;
  if (k === 'cyc') return +m.dataset.s;
  if (k === 'pick' || k === 'net') return $$('[data-p]', m).findIndex(x => x.classList.contains('is-pk'));
  return null;
}
function vtMiniState(m, i) {
  const k = m.dataset.k;
  if (k === 'cyc') { m.dataset.s = i; return 0; }
  if (k !== 'pick' && k !== 'net') return 0;
  const ps = $$('[data-p]', m), on = i >= 0, p = ps[i];
  ps.forEach(x => x.classList.toggle('is-pk', x === p));
  m.classList.toggle('has-pk', on);
  let cnt = 0;
  if (k === 'net') {
    const id = on ? p.dataset.p : null, nb = new Set();
    $$('line', m).forEach(l => { const ends = l.dataset.e.split(' '), hit = on && ends.includes(id); l.classList.toggle('on', hit); if (hit) ends.forEach(x => nb.add(x)); });
    ps.forEach(x => { const v = nb.has(x.dataset.p) && x !== p; x.classList.toggle('nb', v); if (v) cnt++; });
  }
  return cnt;
}
/* valor digitado no editor que um estado novo substitui (o progresso do 13 volta ao do estado) */
const VT_MINI_VALS = ['--p0', '--p1', '--p2', '--p3'];
/* O clique numa prévia (no catálogo ou ampliada no editor): alterna, escolhe, solta um pulso ou
   repete, e diz o que fez na região viva. Devolve o estado novo, ou null se a prévia não tem estado.
   A prévia pode estar ampliada (transform): as contas de posição voltam à escala dela. */
function vtMiniHit(m, e, kb, n, name, say) {
  if ($('.vm-hit', m)) vtKick(m, 'is-hit', 1000);
  const k = m.dataset.k;
  if (k === 'cyc') {
    const s = (+m.dataset.s + 1) % +m.dataset.n;
    VT_MINI_VALS.forEach(v => m.style.removeProperty(v));
    vtMiniState(m, s); say(vtMiniSay(n, name, s)); return s;
  }
  if (k === 'pick' || k === 'net') {
    const ps = $$('[data-p]', m);
    let p = kb ? null : e.target.closest('[data-p]');
    if (p && !m.contains(p)) p = null;
    if (!p) { const i = ps.findIndex(x => x.classList.contains('is-pk')); p = ps[(i + 1) % ps.length]; }
    const on = !p.classList.contains('is-pk'), i = on ? ps.indexOf(p) : -1;
    const cnt = vtMiniState(m, i);
    say(vtMiniSay(n, name, ps.indexOf(p), on, cnt));
    return i;
  }
  say(vtMiniSay(n, name));
  if (k === 'spawn') {
    const r = m.getBoundingClientRect(), sc = r.width / (m.offsetWidth || r.width);
    const w = r.width / sc, h = r.height / sc;
    const x = kb ? w * (.2 + Math.random() * .6) : (e.clientX - r.left) / sc, y = kb ? h * (.3 + Math.random() * .4) : (e.clientY - r.top) / sc;
    if (x < 0 || y < 0 || x > w || y > h) return null;
    const g = el('i', 'vm-pg vm-sp'); g.style.cssText = `left:${x}px;top:${y}px`;
    const g2 = el('i', 'vm-pg vm-sp d2'); g2.style.cssText = g.style.cssText;
    const dt = el('i', 'vm-dt vm-bc vm-sp'); dt.style.cssText = g.style.cssText;
    m.append(g, g2, dt);
    setTimeout(() => { g.remove(); g2.remove(); dt.remove(); }, REDUCED ? 900 : 1700);
  }
  return null;
}

/* · Prévias: rodam com o cursor ou o foco, respondem ao clique · */
function vtMinis(sec, say) {
  const items = $$('.vt-item', sec);
  const play = (m, on) => m.classList.toggle('is-play', on && !REDUCED);
  const restart = m => { if (REDUCED) return; m.classList.remove('is-play'); void m.offsetWidth; m.classList.add('is-play'); };
  items.forEach(it => {
    const m = $('.vt-mini', it); if (!m) return;
    let hov = false, tap = 0;
    it.addEventListener('pointerenter', e => { if (e.pointerType !== 'mouse') return; hov = true; play(m, true); });
    it.addEventListener('pointerleave', e => {
      if (e.pointerType !== 'mouse') return;
      hov = false; play(m, false); m.classList.remove('is-ptr');
      m.style.removeProperty('--mx'); m.style.removeProperty('--my');
    });
    it.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      const r = m.getBoundingClientRect();
      const x = vtClamp((e.clientX - r.left) / r.width, -.2, 1.2), y = vtClamp((e.clientY - r.top) / r.height, -.2, 1.2);
      m.style.setProperty('--mx', x.toFixed(3)); m.style.setProperty('--my', y.toFixed(3));
      m.classList.add('is-ptr');
    });
    it.addEventListener('focus', () => { if (it.matches(':focus-visible')) play(m, true); });
    it.addEventListener('blur', () => { if (!hov) play(m, false); });
    if (it.dataset.live) return;
    it.addEventListener('click', e => {
      restart(m);
      if (!hov) { clearTimeout(tap); tap = setTimeout(() => { if (!hov && document.activeElement !== it) play(m, false); }, 4200); }
      vtMiniHit(m, e, e.detail === 0, +it.dataset.n, $('.vt-item-t', it).textContent, say);
    });
  });
  /* a primeira vez que o catálogo aparece, cada prévia roda uma vez, em cascata */
  if (REDUCED || !('IntersectionObserver' in window)) return;
  const cat = $('#vt-cat', sec);
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    io.disconnect();
    $$('#vt-cat > li:not([hidden]) .vt-mini', sec).forEach((m, i) => setTimeout(() => {
      if (m.classList.contains('is-play')) return;
      play(m, true);
      setTimeout(() => { if (!m.closest('.vt-item').matches(':hover, :focus-visible')) play(m, false); }, 3700);
    }, 200 + i * 140));
  }), { threshold: .25 });
  io.observe(cat);
}

/* · Filtro por intenção (vale para o palco e para o catálogo) · */
function vtFilter(sec, say) {
  const chips = $$('.vt-chip', sec), wrap = $('#vt-chips', sec), stage = $('#vt-stage', sec);
  const cards = $$('.vt-card', sec), items = $$('#vt-cat > li', sec), cat = $('#vt-cat', sec);
  const empty = $('#vt-empty', sec), count = $('#vt-count', sec);
  /* o catálogo abre com 8 itens; o botão + mostra os outros ali mesmo, e o link leva aos planos */
  const SHOW = 8, more = $('#vt-more', sec), moreI = $('span', more), moreT = $('b', more);
  let cur = 'todos', open = false;
  const moreSync = n => {
    more.hidden = n <= SHOW;
    more.setAttribute('aria-expanded', String(open));
    moreI.textContent = open ? '−' : '+';
    moreT.textContent = open ? 'Mostrar menos' : `${n - SHOW} efeitos`;
    more.setAttribute('aria-label', open ? 'Mostrar menos efeitos no catálogo' : `Ver mais ${n - SHOW} efeitos no catálogo`);
  };
  const pop = n => { if (REDUCED) return; n.classList.remove('is-in'); void n.offsetWidth; n.classList.add('is-in'); };
  /* com o Scroll Reveal ligado, quem acaba de aparecer já entra pelo reveal: o pulo fica para quem continua à mostra */
  const rv = () => !!sec.closest('.rv-on');
  const apply = (k, quiet) => {
    cur = k;
    chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.intent === k)));
    const ok = n => k === 'todos' || n.dataset.intents.split(' ').includes(k);
    let nd = 0, ni = 0;
    cards.forEach(c => { const s = ok(c); const was = !c.hidden; c.hidden = !s; if (s) { nd++; if (!quiet || !was) pop(c); } });
    let shown = 0;
    items.forEach(li => { const s = ok(li); if (s) ni++; const v = s && (open || shown < SHOW); const was = !li.hidden; li.hidden = !v; if (v) { shown++; if (was ? !quiet : !rv()) pop(li); } });
    stage.classList.toggle('is-filtered', k !== 'todos');
    stage.hidden = nd === 0;
    empty.hidden = nd !== 0;
    if (!nd) empty.textContent = `Para ${VT_INTENT[k].toLowerCase()}, os efeitos estão no catálogo logo abaixo.`;
    count.textContent = `${shown} de ${ni}`;
    moreSync(ni);
    if (!quiet) say(k === 'todos' ? `Todos os efeitos: ${ni} no catálogo, ${nd} ao vivo.` : `${VT_INTENT[k]}: ${ni} efeitos no catálogo, ${nd} ao vivo.`);
  };
  chips.forEach(c => c.addEventListener('click', () => { if (c.getAttribute('aria-pressed') !== 'true') apply(c.dataset.intent); }));
  /* ao recolher, o catálogo encolhe acima do botão: a página compensa a diferença para o
     botão ficar no mesmo ponto da tela, logo abaixo dos itens que ficaram */
  more.addEventListener('click', () => {
    const before = cat.getBoundingClientRect().bottom;
    open = !open; apply(cur, true);
    say(open ? `Catálogo aberto: ${count.textContent} efeitos à mostra.` : `Catálogo recolhido: ${count.textContent} efeitos à mostra.`);
    if (open) return;
    const d = cat.getBoundingClientRect().bottom - before;
    if (d) window.scrollBy({ top: d, behavior: 'instant' });
    const r = more.getBoundingClientRect();
    if (r.top < 96 || r.bottom > innerHeight) more.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
  const edge = () => wrap.classList.toggle('at-end', wrap.scrollLeft + wrap.clientWidth >= wrap.scrollWidth - 2);
  wrap.addEventListener('scroll', edge, { passive: true });
  window.addEventListener('resize', edge, { passive: true });
  edge();
  apply('todos', true);
}

/* · Controles do editor: monta a grade a partir de fields; set(k, v) muda o efeito na hora.
   Serve ao painel dos cards do palco e ao editor das prévias do catálogo. Devolve a grade e,
   por chave, a função que mostra um valor que mudou por fora. · */
function vtFieldGrid(id, fields, set) {
  const grid = el('div', 'vt-ed-grid');
  const ctl = {};
  fields.forEach(f => {
    const row = el('div', 'vt-ed-f vt-ef-' + f.t), fid = `${id}-${f.k}`;
    const lab = el(f.t === 'color' || f.t === 'toggle' ? 'span' : 'label', 'vt-ed-l', f.l);
    lab.id = fid + '-l'; if (lab.tagName === 'LABEL') lab.htmlFor = fid;
    row.append(lab);
    if (f.t === 'text' || f.t === 'number') {
      const inp = el('input', 'vt-ed-in'); inp.id = fid; inp.type = 'text'; inp.value = f.t === 'number' ? vtFmt(f.v, f.dec || 0) : f.v;
      inp.autocomplete = 'off'; inp.spellcheck = false;
      if (f.t === 'number') { inp.inputMode = f.dec ? 'decimal' : 'numeric'; inp.classList.add('vt-ed-num'); }
      if (f.max && f.t === 'text') inp.maxLength = f.max;
      inp.addEventListener('input', () => {
        if (f.t === 'text') { set(f.k, inp.value); return; }
        const v = vtNum(inp.value);
        if (!isFinite(v)) return;
        set(f.k, vtClamp(v, f.min, f.max));
      });
      inp.addEventListener('blur', () => { if (f.t !== 'number') return; const v = vtNum(inp.value); inp.value = vtFmt(isFinite(v) ? vtClamp(v, f.min, f.max) : f.v, f.dec || 0); });
      ctl[f.k] = v => { inp.value = f.t === 'number' ? vtFmt(v, f.dec || 0) : v; };
      const box = el('span', 'vt-ed-box'); box.append(inp);
      if (f.unit) box.append(el('span', 'vt-ed-u', f.unit));
      row.append(box);
    } else if (f.t === 'range') {
      const inp = el('input', 'vt-range vt-ed-rg'); inp.id = fid; inp.type = 'range';
      inp.min = f.min; inp.max = f.max; inp.step = f.step; inp.value = f.v;
      const out = el('output', 'vt-ed-out'); out.setAttribute('for', fid); out.setAttribute('aria-hidden', 'true');
      const show = v => { const t = f.fmt ? f.fmt(v) : String(v); out.textContent = t; inp.setAttribute('aria-valuetext', t); inp.style.setProperty('--v', (v - f.min) / (f.max - f.min) * 100 + '%'); };
      inp.addEventListener('input', () => { const v = +inp.value; show(v); set(f.k, v); });
      show(f.v); ctl[f.k] = v => { inp.value = v; show(v); };
      const box = el('span', 'vt-ed-box'); box.append(inp, out);
      row.append(box);
    } else if (f.t === 'color') {
      const g = el('div', 'vt-ed-sw'); g.setAttribute('role', 'radiogroup'); g.setAttribute('aria-labelledby', lab.id);
      const bs = VT_SW.map(([nm, hex]) => {
        const b = el('button'); b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', nm);
        b.style.setProperty('--c', hex); b.dataset.c = hex; g.append(b); return b;
      });
      const sel = v => bs.forEach(b => { const on = b.dataset.c === v; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
      bs.forEach((b, i) => {
        b.addEventListener('click', () => { sel(b.dataset.c); set(f.k, b.dataset.c); });
        b.addEventListener('keydown', e => {
          const s = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!s) return;
          e.preventDefault(); const nb = bs[(i + s + bs.length) % bs.length]; nb.focus(); nb.click();
        });
      });
      sel(f.v); ctl[f.k] = sel; row.append(g);
    } else if (f.t === 'toggle') {
      const b = el('button', 'vt-ed-tg'); b.type = 'button'; b.id = fid;
      b.setAttribute('role', 'switch'); b.setAttribute('aria-labelledby', lab.id);
      const sel = v => b.setAttribute('aria-checked', String(!!v));
      b.addEventListener('click', () => { const v = b.getAttribute('aria-checked') !== 'true'; sel(v); set(f.k, v); });
      sel(f.v); ctl[f.k] = sel; row.append(b);
    } else if (f.t === 'add') {
      const inp = el('input', 'vt-ed-in'); inp.id = fid; inp.type = 'text'; inp.placeholder = f.ph || ''; inp.maxLength = f.max || 20;
      inp.autocomplete = 'off'; inp.enterKeyHint = 'done';
      const add = el('button', 'btn btn-ghost btn-xs vt-ed-add'); add.type = 'button';
      add.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>Adicionar';
      const go = () => { const v = inp.value.trim(); if (!v) { inp.focus(); return; } if (set(f.k, v) !== false) inp.value = ''; };
      add.addEventListener('click', go);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
      /* cheia: o campo se apaga e o rótulo diz por quê */
      ctl[f.k] = v => {
        const full = v === 'full';
        add.disabled = inp.disabled = full;
        if (full || v === '') inp.value = '';
        lab.textContent = full && f.full ? f.full : f.l;
        row.classList.toggle('is-full', full);
      };
      const box = el('span', 'vt-ed-box vt-ed-addbox'); box.append(inp, add);
      row.append(box);
    }
    grid.append(row);
  });
  return { grid, ctl };
}

/* · Painel Editar efeito: monta os controles a partir de demo.fields · */
function vtEditor(card, d, say) {
  const btn = $('.vt-edit', card);
  if (!btn || !d.fields) { if (btn) btn.hidden = true; return; }
  const meta = $('.vt-meta', card), name = $('h3', card).textContent;
  const id = btn.getAttribute('aria-controls');
  const pan = el('div', 'vt-ed'); pan.id = id; pan.hidden = true;
  pan.setAttribute('role', 'group'); pan.setAttribute('aria-label', `Editar ${name}`);
  const { grid, ctl } = vtFieldGrid(id, d.fields, (k, v) => d.set(k, v));
  /* Restaurar fica na linha de ações do card (no lugar de Repetir enquanto o painel está aberto),
     para o painel caber na área do texto que ele substitui sem mudar a altura do card */
  const rst = el('button', 'btn btn-ghost btn-xs vt-ed-reset'); rst.type = 'button'; rst.hidden = true;
  rst.setAttribute('aria-label', `Restaurar o padrão de ${name}`);
  rst.innerHTML = '<svg aria-hidden="true"><use href="#i-restore"/></svg>Restaurar';
  rst.addEventListener('click', () => {
    d.fields.forEach(f => { if (f.t === 'add') { ctl[f.k](''); return; } ctl[f.k](f.v); d.set(f.k, f.v); });
    d.reset?.();
    say(`${name} voltou ao padrão.`);
  });
  btn.after(rst);
  const note = el('p', 'sr-only', 'Cada controle muda o efeito na hora. Esc fecha o painel.'); note.id = id + '-note';
  pan.setAttribute('aria-describedby', note.id);
  pan.append(grid, note);
  meta.append(pan);
  card.addEventListener('vt-sync', e => ctl[e.detail.k]?.(e.detail.v));

  const ico = $('use', btn), txt = $('span', btn);
  const show = (on, kb) => {
    btn.setAttribute('aria-expanded', String(on));
    card.classList.toggle('is-edit', on);
    pan.hidden = !on; rst.hidden = !on;
    txt.textContent = on ? 'Concluir' : 'Editar efeito';
    ico.setAttribute('href', on ? '#i-check' : '#i-sliders');
    if (on) {
      vtKick(pan, 'is-in');
      if (kb) $('input, button', grid)?.focus({ preventScroll: true });
    }
  };
  btn.addEventListener('click', e => show(btn.getAttribute('aria-expanded') !== 'true', e.detail === 0));
  card.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !card.classList.contains('is-edit') || e.defaultPrevented) return;
    e.preventDefault(); show(false); btn.focus();
  });
}

/* · Editor das prévias do catálogo ·
   Todo item do catálogo tem Editar efeito. Nos ao vivo o botão leva ao card no palco e abre o
   painel dele; nos outros abre uma janela com a prévia ampliada (que também responde ao clique e
   ao cursor) e os controles. Cor, Velocidade e Intensidade valem para todas as prévias: filtro de
   cor e brilho e ritmo do laço (--vm-k) na raiz da prévia. Quando o efeito tem um estado ou uma
   medida própria, um quarto controle mexe nela (VT_MINI_X). O que se muda fica na prévia do
   catálogo depois de fechar; Restaurar volta ao quadro original. */
const VT_MINI_TINT = {
  '#8b3dff': '', '#a970ff': 'saturate(1.35) brightness(1.1)', '#c9a6ff': 'saturate(.42) brightness(1.24)',
  '#ff9ad5': 'hue-rotate(58deg) saturate(1.1) brightness(1.06)', '#4fd69a': 'hue-rotate(-118deg) saturate(.9) brightness(1.04)', '#f7bd55': 'hue-rotate(148deg) saturate(1.5) brightness(1.12)'
};
const vtOfN = t => v => `${v} de ${t}`;
/* quarto controle · k 's': estado da prévia que alterna (faixa 1..N ou chave 0/1) ·
   k 'p': item aceso (0 = nenhum) · k 'pv': valor do progresso · css: variável da prévia */
const VT_MINI_X = {
  2: { k: 'x', t: 'range', l: 'Espessura do traço', min: 1, max: 3.2, step: .2, v: 1.8, css: '--vm-sw', fmt: v => vtFmt(v, 1) + ' px' },
  4: { k: 's', t: 'toggle', l: 'Afastar as camadas' },
  5: { k: 'p', t: 'range', l: 'Card elevado', min: 0, max: 4, step: 1, fmt: v => v ? `${v} de 4` : 'nenhum' },
  7: { k: 's', t: 'toggle', l: 'Vidro nítido' },
  8: { k: 's', t: 'range', l: 'Paleta', min: 1, max: 3, step: 1, fmt: vtOfN(3) },
  9: { k: 'x', t: 'range', l: 'Profundidade', min: 0, max: 2, step: .1, v: 1, css: '--vm-z', fmt: v => vtFmt(v, 1) + '×' },
  13: { k: 'pv', t: 'range', l: 'Progresso', min: 5, max: 100, step: 1, fmt: v => v + '%', fromS: s => [72, 48, 94][s] },
  14: { k: 'p', t: 'range', l: 'Célula em destaque', min: 0, max: 24, step: 1, fmt: v => v ? `${v} de 24` : 'todas' },
  19: { k: 'x', t: 'range', l: 'Alcance do pulso', min: 1.6, max: 4, step: .1, v: 2.8, css: '--vm-r', fmt: v => vtFmt(v, 1) + '×' },
  20: { k: 's', t: 'toggle', l: 'Card selecionado' },
  22: { k: 's', t: 'range', l: 'Card aberto', min: 1, max: 3, step: 1, fmt: vtOfN(3) },
  23: { k: 's', t: 'toggle', l: 'Modal aberto' },
  25: { k: 'x', t: 'range', l: 'Força do ímã', min: 0, max: 2, step: .1, v: 1, css: '--vm-z', fmt: v => vtFmt(v, 1) + '×' },
  26: { k: 's', t: 'range', l: 'Resposta', min: 1, max: 4, step: 1, fmt: v => ['nenhuma', 'chave', 'marca', 'favorito'][v - 1] },
  28: { k: 's', t: 'range', l: 'Fase', min: 1, max: 4, step: 1, fmt: vtOfN(4) },
  29: { k: 's', t: 'range', l: 'Forma', min: 1, max: 3, step: 1, fmt: v => ['círculo', 'losango', 'rede'][v - 1] },
  31: { k: 's', t: 'toggle', l: 'Conteúdo carregado' },
  32: { k: 's', t: 'toggle', l: 'Órbita aberta' },
  34: { k: 's', t: 'range', l: 'Card no centro', min: 1, max: 4, step: 1, fmt: vtOfN(4) },
  36: { k: 'p', t: 'range', l: 'Detalhe aberto', min: 0, max: 3, step: 1, fmt: v => v ? `${v} de 3` : 'nenhum' },
  38: { k: 's', t: 'range', l: 'Marco', min: 1, max: 4, step: 1, fmt: vtOfN(4) },
  39: { k: 'p', t: 'range', l: 'Nó aceso', min: 0, max: 8, step: 1, fmt: v => v ? `nó ${v}` : 'nenhum' }
};
/* o que o clique na prévia ampliada faz, dito embaixo dela */
const VT_MINI_HINT = {
  cyc: 'Clique na prévia para alternar o estado.', pick: 'Clique num item da prévia para destacá-lo.',
  net: 'Clique num nó para acender os vizinhos.', spawn: 'Clique em qualquer ponto para soltar um pulso.', '': 'Clique na prévia para repetir o efeito.'
};
/* valor do quarto controle lido da prévia (a prévia é a fonte da verdade: o clique também a muda) */
function vtMiniXGet(m, X) {
  if (X.k === 's') { const s = vtMiniGet(m); return X.t === 'toggle' ? s === 1 : s + 1; }
  if (X.k === 'p') return vtMiniGet(m) + 1;
  if (X.k === 'pv') { const v = m.style.getPropertyValue('--p0'); return v ? +v : X.fromS(+m.dataset.s); }
  const v = m.style.getPropertyValue(X.css); return v ? +v : X.v;
}
function vtMiniXSet(m, X, v) {
  if (X.k === 's') vtMiniState(m, X.t === 'toggle' ? (v ? 1 : 0) : v - 1);
  else if (X.k === 'p') vtMiniState(m, v - 1);
  else if (X.k === 'pv') { const p = v / 100; [v, p, p * .64, Math.min(1, p * 1.19)].forEach((x, i) => m.style.setProperty(VT_MINI_VALS[i], i ? x.toFixed(3) : String(x))); }
  else m.style.setProperty(X.css, String(v));
}
/* cor, velocidade e intensidade: filtro e ritmo na raiz da prévia */
function vtMiniLook(m, st) {
  const it = st.it / 100;
  const f = `${VT_MINI_TINT[st.c] || ''}${it !== 1 ? ` brightness(${(.72 + .28 * it).toFixed(2)}) saturate(${it.toFixed(2)})` : ''}`.trim();
  if (f) m.style.filter = f; else m.style.removeProperty('filter');
  if (st.sp !== 1) m.style.setProperty('--vm-k', (1 / st.sp).toFixed(3)); else m.style.removeProperty('--vm-k');
}
function vtCatEditor(sec, say, live) {
  const ST = new WeakMap(), S0 = new WeakMap();
  const look0 = { c: '#8b3dff', sp: 1, it: 100 };
  /* o estado original de cada prévia, para Restaurar */
  $$('#vt-cat .vt-mini', sec).forEach(m => S0.set(m, vtMiniGet(m)));

  /* ao vivo: leva ao card no palco e abre o painel Editar efeito dele */
  $$('#vt-cat .vt-item-ed', sec).forEach(ed => {
    const n = +ed.dataset.n, card = live[n];
    if (!card) { ed.addEventListener('click', () => open(n, ed)); return; }
    ed.addEventListener('click', () => {
      card.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
      const b = $('.vt-edit', card);
      if (b && !b.hidden && b.getAttribute('aria-expanded') !== 'true') b.click();
      const f = $('.vt-ed input, .vt-ed button', card);
      if (f) f.focus({ preventScroll: true }); else { card.setAttribute('tabindex', '-1'); card.focus({ preventScroll: true }); }
      card.classList.remove('is-ping'); void card.offsetWidth; card.classList.add('is-ping');
      clearTimeout(card._ping); card._ping = setTimeout(() => card.classList.remove('is-ping'), 1800);
    });
  });

  const dlg = el('dialog', 'vt-dlg'); dlg.id = 'vt-dlg';
  dlg.setAttribute('aria-labelledby', 'vt-dlg-t'); dlg.setAttribute('aria-describedby', 'vt-dlg-s vt-dlg-note');
  dlg.innerHTML = `<div class="vt-dlg-in">
    <header class="vt-dlg-h">
      <p class="vt-dlg-k"><span class="vt-item-n" id="vt-dlg-n"></span><span class="vt-item-c" id="vt-dlg-c"></span><span class="vt-dose" aria-hidden="true"><i></i><i></i><i></i></span></p>
      <h3 class="vt-dlg-t" id="vt-dlg-t"></h3>
      <p class="vt-dlg-s" id="vt-dlg-s"></p>
      <button class="vt-dlg-x" type="button" aria-label="Fechar o editor"><svg aria-hidden="true"><use href="#i-x"/></svg></button>
    </header>
    <button class="vt-dlg-stage" type="button" aria-describedby="vt-dlg-hint"></button>
    <p class="vt-dlg-hint" id="vt-dlg-hint"><svg aria-hidden="true"><use href="#i-spark"/></svg><span></span></p>
    <div class="vt-dlg-ed" role="group" aria-label="Controles do efeito"></div>
    <p class="sr-only" id="vt-dlg-note">Cada controle muda a prévia na hora e o catálogo guarda o resultado. Esc fecha o editor.</p>
    <footer class="vt-dlg-f">
      <button class="btn btn-ghost btn-sm vt-ed-reset vt-dlg-rst" type="button"><svg aria-hidden="true"><use href="#i-restore"/></svg>Restaurar</button>
      <button class="btn btn-primary btn-sm vt-dlg-ok" type="button"><svg aria-hidden="true"><use href="#i-check"/></svg>Concluir</button>
    </footer>
  </div>`;
  sec.append(dlg);
  const stage = $('.vt-dlg-stage', dlg), hint = $('.vt-dlg-hint span', dlg), box = $('.vt-dlg-ed', dlg);
  let cur = null;

  function open(n, opener) {
    const it = $(`#vt-cat .vt-item[data-n="${n}"]`, sec), m0 = $('.vt-mini', it);
    const [, name, fam, , dose, sum] = VT_FX.find(f => f[0] === n);
    const X = VT_MINI_X[n], st = ST.get(m0) || { ...look0 };
    $('#vt-dlg-n', dlg).textContent = String(n).padStart(2, '0');
    $('#vt-dlg-c', dlg).textContent = fam;
    $$('.vt-dose i', dlg).forEach((d, i) => d.classList.toggle('on', i < dose));
    $('#vt-dlg-t', dlg).textContent = name;
    $('#vt-dlg-s', dlg).textContent = sum;
    /* a prévia ampliada é uma cópia viva da do catálogo: as duas mudam juntas */
    const m1 = m0.cloneNode(true);
    m1.classList.remove('is-play', 'is-ptr', 'is-hit');
    m1.style.removeProperty('--mx'); m1.style.removeProperty('--my');
    $$('.vm-sp', m1).forEach(x => x.remove());
    stage.replaceChildren(m1);
    stage.setAttribute('aria-label', `Prévia de ${name}`);
    hint.textContent = VT_MINI_HINT[m1.dataset.k] || VT_MINI_HINT[''];
    if (!REDUCED) m1.classList.add('is-play');
    /* os controles: cor, velocidade, intensidade e o do efeito */
    const fields = [{ k: 'c', t: 'color', l: 'Cor', v: st.c }];
    if (!REDUCED) fields.push({ k: 'sp', t: 'range', l: 'Velocidade', min: .4, max: 2, step: .1, v: st.sp, fmt: v => vtFmt(v, 1) + '×' });
    fields.push({ k: 'it', t: 'range', l: 'Intensidade', min: 40, max: 160, step: 5, v: st.it, fmt: v => v + '%' });
    if (X) fields.push({ ...X, k: 'x', v: vtMiniXGet(m0, X) });
    const ms = [m0, m1], ed = $(`.vt-item-ed[data-n="${n}"]`, sec);
    const set = (k, v) => {
      if (k === 'x') ms.forEach(m => vtMiniXSet(m, X, v));
      else { st[k] = v; ST.set(m0, st); ms.forEach(m => vtMiniLook(m, st)); }
      if (k === 'c') vtAccent(dlg, v);
      ed.classList.add('is-mod');
    };
    const { grid, ctl } = vtFieldGrid('vt-dlg-' + n, fields, set);
    box.replaceChildren(grid);
    vtAccent(dlg, st.c);
    cur = { n, name, X, st, m0, m1, ctl, fields, ed, opener };
    dlg.showModal();
    /* o foco começa nos controles (a cor escolhida), não no Fechar */
    $('[aria-checked="true"]', grid)?.focus();
  }
  /* clique na prévia ampliada: o mesmo que no catálogo, nas duas cópias */
  stage.addEventListener('click', e => {
    if (!cur) return;
    const { m0, m1, n, name, X, ctl } = cur;
    if (!REDUCED) { m1.classList.remove('is-play'); void m1.offsetWidth; m1.classList.add('is-play'); }
    const s = vtMiniHit(m1, e, e.detail === 0, n, name, say);
    if (s == null) return;
    VT_MINI_VALS.forEach(v => m0.style.removeProperty(v));
    vtMiniState(m0, s);
    if (X) ctl.x?.(vtMiniXGet(m1, X));
  });
  stage.addEventListener('pointermove', e => {
    if (!cur || e.pointerType !== 'mouse') return;
    const r = cur.m1.getBoundingClientRect();
    cur.m1.style.setProperty('--mx', vtClamp((e.clientX - r.left) / r.width, -.2, 1.2).toFixed(3));
    cur.m1.style.setProperty('--my', vtClamp((e.clientY - r.top) / r.height, -.2, 1.2).toFixed(3));
    cur.m1.classList.add('is-ptr');
  });
  stage.addEventListener('pointerleave', () => {
    if (!cur) return;
    cur.m1.classList.remove('is-ptr'); cur.m1.style.removeProperty('--mx'); cur.m1.style.removeProperty('--my');
  });
  $('.vt-dlg-rst', dlg).addEventListener('click', () => {
    if (!cur) return;
    const { m0, m1, X, ctl, ed, name } = cur;
    Object.assign(cur.st, look0); ST.delete(m0);
    [m0, m1].forEach(m => {
      ['filter', '--vm-k', '--vm-sw', '--vm-z', '--vm-r', ...VT_MINI_VALS].forEach(p => m.style.removeProperty(p));
      const s0 = S0.get(m0); if (s0 != null) vtMiniState(m, s0);
    });
    ctl.c?.(look0.c); ctl.sp?.(look0.sp); ctl.it?.(look0.it); if (X) ctl.x?.(vtMiniXGet(m0, X));
    vtAccent(dlg, look0.c);
    ed.classList.remove('is-mod');
    say(`${name} voltou ao padrão.`);
  });
  const shut = () => dlg.close();
  $('.vt-dlg-x', dlg).addEventListener('click', shut);
  $('.vt-dlg-ok', dlg).addEventListener('click', shut);
  /* clique no fundo escurecido fecha (o diálogo ocupa só a caixa; fora dela o alvo é o próprio dialog) */
  dlg.addEventListener('click', e => {
    if (e.target !== dlg) return;
    const r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) shut();
  });
  dlg.addEventListener('close', () => {
    if (!cur) return;
    const { opener, name } = cur;
    cur.m1.remove(); cur = null;
    say(`Editor de ${name} fechado. A prévia do catálogo guarda o que você mudou.`);
    opener?.focus({ preventScroll: true });
  });
}

/* · Palco: liga cada demo à tela e ao editor ·
   Os cards também entram no Scroll Reveal: nascem ao descer e somem ao subir, saindo e
   voltando pelo mesmo lado (data-vt-out). Um card em que ninguém mexeu volta ao quadro
   inicial quando sai por baixo e roda de novo quando reaparece. */
function vtDemos(sec, say) {
  const ctl = new Map();
  $$('.vt-card', sec).forEach(card => {
    const make = VT_DEMO[card.dataset.demo];
    const d = (make && make(card, say)) || {};
    ctl.set(card, d);
    vtEditor(card, d, say);
    if (REDUCED) { card.classList.add('is-on', 'is-vis'); d.still?.(); return; }
    $('.vt-replay', card)?.addEventListener('click', () => {
      vtRestart(card);
      d.replay ? d.replay() : d.start?.();
    });
    const touch = () => { card.dataset.vtTouched = '1'; };
    ['pointerdown', 'keydown', 'input'].forEach(t => card.addEventListener(t, touch));
  });
  if (REDUCED) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    const card = e.target, d = ctl.get(card);
    card.classList.toggle('is-vis', e.isIntersecting);
    if (e.isIntersecting && e.intersectionRatio >= .3 && !card.classList.contains('is-on')) {
      card.classList.add('is-on');
      if (card.dataset.vtRerun) { delete card.dataset.vtRerun; d.replay ? d.replay() : d.start?.(); } else d.start?.();
    }
    if (e.isIntersecting) { if (card.classList.contains('is-on')) d.resume?.(); return; }
    d.pause?.();
    /* saiu inteiro por baixo sem ter sido tocado: volta ao quadro inicial, sem transição */
    if (e.boundingClientRect.top > 0 && card.classList.contains('is-on') && !card.dataset.vtTouched && !card.classList.contains('is-edit')) {
      card.classList.add('vt-reset'); card.classList.remove('is-on');
      void card.offsetWidth; card.classList.remove('vt-reset');
      card.dataset.vtRerun = '1';
    }
  }), { threshold: [0, .3] });
  let wave = 0, waveT = 0;
  const rv = new IntersectionObserver(es => es.forEach(e => {
    const card = e.target, d = ctl.get(card);
    if (!e.isIntersecting) { card.dataset.vtOut = e.boundingClientRect.top < 0 ? 'up' : 'down'; return; }
    /* os que entram juntos chegam em cascata */
    card.style.setProperty('--vt-rd', (wave++ % 3) * 90 + 'ms');
    clearTimeout(waveT); waveT = setTimeout(() => { wave = 0; }, 120);
    delete card.dataset.vtOut;
    if (card.dataset.vtRerun) {
      delete card.dataset.vtRerun;
      card.classList.add('is-on');
      d.replay ? d.replay() : d.start?.();
    }
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  ctl.forEach((d, card) => { io.observe(card); rv.observe(card); });
}

/* ---------------------------------------------------------------- 30 · Particle System */
VT_DEMO.particle = card => {
  const box = $('.vt-pa', card), cv = $('canvas', box), ctx = cv.getContext('2d'), title = $('.vt-pa-t', card);
  let W = 0, H = 0, P = [], pulses = [], running = false, raf = 0, last = 0;
  let dens = 1, links = true, rgb = vtRgb('#a970ff');
  const m = { x: 0, y: 0, on: false };
  const size = () => {
    const r = box.getBoundingClientRect(); if (!r.width || !r.height) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sx = W ? r.width / W : 1, sy = H ? r.height / H : 1;
    P.forEach(p => { p.x *= sx; p.y *= sy; });
    W = r.width; H = r.height;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  };
  const target = () => Math.round(vtClamp(W * H / 3600, 40, 120) * dens);
  const make = (burst, fade) => {
    const tx = Math.random() * W, ty = Math.random() * H;
    const p = { x: tx, y: ty, vx: 0, vy: 0, bx: (Math.random() - .5) * .34, by: (Math.random() - .5) * .34, r: .7 + Math.random() * 1.7, a: fade && !REDUCED ? 0 : 1 };
    if (burst) { p.x = W / 2 + (Math.random() - .5) * 10; p.y = H / 2 + (Math.random() - .5) * 10; p.vx = (tx - p.x) * .05; p.vy = (ty - p.y) * .05; }
    return p;
  };
  const seed = burst => { P = Array.from({ length: target() }, () => make(burst)); };
  const fit = () => {
    if (!W) return;
    const n = target();
    while (P.length < n) P.push(make(false, true));
    if (P.length > n) P.length = n;
  };
  const pulse = (x, y) => { pulses.push({ x, y, t: 0 }); if (!running) draw(); };
  const step = dt => {
    const k = dt / 16.67, fr = Math.pow(.95, k), R = 120;
    pulses.forEach(q => { q.t += dt / 1100; });
    pulses = pulses.filter(q => q.t < 1);
    const maxR = Math.hypot(W, H) * .6;
    for (const p of P) {
      if (p.a < 1) p.a = Math.min(1, p.a + dt / 700);
      if (m.on) {
        const dx = p.x - m.x, dy = p.y - m.y, d2 = dx * dx + dy * dy;
        if (d2 < R * R && d2 > 1) { const d = Math.sqrt(d2), f = (1 - d / R) * .9 * k; p.vx += dx / d * f; p.vy += dy / d * f; }
      }
      for (const q of pulses) {
        const dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy) || 1, band = Math.abs(d - q.t * maxR);
        if (band < 36) { const f = (1 - band / 36) * 1.6 * (1 - q.t) * k; p.vx += dx / d * f; p.vy += dy / d * f; }
      }
      p.vx *= fr; p.vy *= fr;
      p.x += (p.vx + p.bx) * k; p.y += (p.vy + p.by) * k;
      if (p.x < -12) p.x = W + 12; else if (p.x > W + 12) p.x = -12;
      if (p.y < -12) p.y = H + 12; else if (p.y > H + 12) p.y = -12;
    }
  };
  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const [cr, cg, cb] = rgb, lt = rgb.map(c => Math.round(c + (255 - c) * .45)).join(', ');
    if (links) {
      const L = vtClamp(W / 7, 80, 128), L2 = L * L, B = [[], [], [], []];
      for (let i = 0; i < P.length; i++) {
        const a = P[i];
        for (let j = i + 1; j < P.length; j++) {
          const b = P[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < L2) B[Math.min(3, Math.floor((1 - d2 / L2) * 4))].push(a.x, a.y, b.x, b.y);
        }
      }
      ctx.lineWidth = 1;
      B.forEach((s, bi) => {
        if (!s.length) return;
        ctx.strokeStyle = `rgba(${cr}, ${cg}, ${cb}, ${.08 + bi * .13})`;
        ctx.beginPath();
        for (let i = 0; i < s.length; i += 4) { ctx.moveTo(s[i], s[i + 1]); ctx.lineTo(s[i + 2], s[i + 3]); }
        ctx.stroke();
      });
    }
    if (m.on) {
      ctx.beginPath();
      for (const p of P) { const d = Math.hypot(p.x - m.x, p.y - m.y); if (d < 170) { ctx.moveTo(m.x, m.y); ctx.lineTo(p.x, p.y); } }
      ctx.strokeStyle = 'rgba(244, 238, 255, .16)'; ctx.lineWidth = 1; ctx.stroke();
      ctx.beginPath(); ctx.arc(m.x, m.y, 118, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${lt}, .24)`; ctx.lineWidth = 1.5; ctx.stroke();
    }
    for (const p of P) {
      ctx.globalAlpha = p.a;
      if (p.r > 2) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2); ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, .24)`; ctx.fill(); }
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.r > 1.9 ? '#ffffff' : `rgba(${lt}, .85)`; ctx.fill();
    }
    ctx.globalAlpha = 1;
    for (const q of pulses) {
      ctx.beginPath(); ctx.arc(q.x, q.y, q.t * Math.hypot(W, H) * .6, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(244, 238, 255, ${(1 - q.t) * .7})`; ctx.lineWidth = 2; ctx.stroke();
    }
  };
  const frame = t => {
    if (!running) return;
    const dt = Math.min(48, last ? t - last : 16.67); last = t;
    step(dt); draw();
    raf = requestAnimationFrame(frame);
  };
  const resume = () => { if (running || REDUCED || !W) return; running = true; last = 0; raf = requestAnimationFrame(frame); };
  const pause = () => { running = false; cancelAnimationFrame(raf); };
  const at = e => { const r = box.getBoundingClientRect(); m.x = e.clientX - r.left; m.y = e.clientY - r.top; };
  box.addEventListener('pointermove', e => { if (e.pointerType === 'touch') return; at(e); m.on = true; });
  box.addEventListener('pointerleave', () => { m.on = false; });
  box.addEventListener('pointerdown', e => { at(e); if (!REDUCED) pulse(m.x, m.y); });
  box.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); if (!REDUCED) pulse(W / 2, H / 2); } });
  new ResizeObserver(() => { if (!P.length) return; if (size()) { if (!running) draw(); } }).observe(box);
  const TITLE = title.textContent;
  return {
    start() { if (!size()) return; seed(true); resume(); },
    resume, pause,
    replay() { pulses = []; seed(true); pulse(W / 2, H / 2); resume(); },
    still() { if (!size()) return; seed(false); draw(); },
    fields: [
      { k: 'title', t: 'text', l: 'Título', v: TITLE, max: 40 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'dens', t: 'range', l: 'Densidade', v: 100, min: 30, max: 220, step: 10, fmt: v => v + '%' },
      { k: 'links', t: 'toggle', l: 'Ligações', v: true }
    ],
    set(k, v) {
      if (k === 'title') title.textContent = v || ' ';
      else if (k === 'acc') { vtAccent(card, v); rgb = vtRgb(v); }
      else if (k === 'dens') { dens = v / 100; fit(); }
      else if (k === 'links') links = v;
      if (!running && W) draw();
    }
  };
};

/* ---------------------------------------------------------------- 03 · 04 · Tilt / Hologram */
VT_DEMO.tilt = (card, say) => {
  const box = $('.vt-ti', card), c = $('.vt-ti-card', box), live = $('.vt-ti-live', box);
  const num = $('.vt-ti-l2 b', c), bnum = $('.vt-ti-bt b', c), cap = $('.vt-ti-l2 span', c), parts = $$('.vt-ti-bl li', c);
  let MAX = 16, flip = false;
  let tx = 0, ty = 0, rx = 0, ry = 0, mx = 50, my = 50, tmx = 50, tmy = 50, manual = false, running = false, raf = 0, t0 = performance.now(), hold = 0;
  const apply = () => {
    c.style.setProperty('--rx', rx.toFixed(2) + 'deg'); c.style.setProperty('--ry', ry.toFixed(2) + 'deg');
    c.style.setProperty('--mx', mx.toFixed(1) + '%'); c.style.setProperty('--my', my.toFixed(1) + '%');
  };
  const frame = t => {
    if (!running) return;
    if (!manual) {
      const s = (t - t0) / 1000, a = MAX / 16;
      ty = Math.sin(s * .8) * 11 * a; tx = Math.cos(s * .6) * 6 * a;
      tmx = 50 + ty * 3.2; tmy = 50 - tx * 3.2;
    }
    rx += (tx - rx) * .09; ry += (ty - ry) * .09; mx += (tmx - mx) * .09; my += (tmy - my) * .09;
    apply();
    raf = requestAnimationFrame(frame);
  };
  const label = () => {
    c.setAttribute('aria-label', `Cartão holográfico com a marca do cliente: ${num.textContent}, ${cap.textContent.toLowerCase()}. ${flip ? 'Mostrando o verso. Enter volta para a frente.' : 'Enter vira o cartão e mostra o detalhe; as setas inclinam.'}`);
  };
  const turn = on => {
    flip = on;
    c.classList.toggle('is-flip', on);
    c.setAttribute('aria-pressed', String(on));
    label();
    live.textContent = on ? `Verso: ${parts.map(p => `${p.querySelector('span').textContent} ${p.querySelector('b').textContent}`).join(', ')}.` : 'Frente do cartão.';
  };
  box.addEventListener('pointermove', e => {
    if (REDUCED) return;
    const r = c.getBoundingClientRect();
    const px = vtClamp((e.clientX - r.left) / r.width, -.15, 1.15), py = vtClamp((e.clientY - r.top) / r.height, -.15, 1.15);
    manual = true; clearTimeout(hold);
    ty = vtClamp((px - .5) * 2 * MAX, -MAX, MAX); tx = vtClamp(-(py - .5) * 2 * MAX, -MAX, MAX);
    tmx = px * 100; tmy = py * 100;
  });
  box.addEventListener('pointerleave', () => { tx = ty = 0; tmx = tmy = 50; hold = setTimeout(() => { manual = false; t0 = performance.now(); }, 900); });
  c.addEventListener('click', () => turn(!flip));
  c.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); c.click(); return; }
    const k = { ArrowLeft: [0, -5], ArrowRight: [0, 5], ArrowUp: [5, 0], ArrowDown: [-5, 0] }[e.key];
    if (!k || REDUCED) return;
    e.preventDefault(); manual = true; clearTimeout(hold);
    tx = vtClamp(tx + k[0], -MAX, MAX); ty = vtClamp(ty + k[1], -MAX, MAX);
    tmx = 50 + ty * 3; tmy = 50 - tx * 3;
    hold = setTimeout(() => { manual = false; t0 = performance.now(); }, 2500);
  });
  const resume = () => { if (running || REDUCED) return; running = true; raf = requestAnimationFrame(frame); };
  const pause = () => { running = false; cancelAnimationFrame(raf); };
  const W = [.55, .29, .16];
  return {
    start: resume, resume, pause,
    replay() { turn(false); manual = false; t0 = performance.now(); ry = -38; rx = 10; resume(); },
    still() { rx = 6; ry = -12; mx = 30; my = 30; apply(); },
    fields: [
      { k: 'num', t: 'text', l: 'Número', v: '+38%', max: 12 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'tilt', t: 'range', l: 'Inclinação', v: 16, min: 0, max: 30, step: 1, fmt: v => v + '°' },
      { k: 'sheen', t: 'toggle', l: 'Reflexo', v: true }
    ],
    set(k, v) {
      if (k === 'num') {
        /* sinal de menos tipográfico na frente e no verso */
        const s = String(v).replace(/-(?=\s*\d)/g, '−');
        num.textContent = bnum.textContent = s || ' ';
        /* o verso reparte o número nas três origens, na mesma proporção e com as mesmas
           casas decimais, prefixo e unidade da entrada ("R$ 2,5 mi" vira 1,4 + 0,7 + 0,4) */
        const m = s.match(/^([^\d−]*)(−?)\s*(\d+(?:[.,]\d+)*)(.*)$/);
        if (m) {
          const raw = m[3], n = vtNum(raw);
          const dec = raw.includes(',') ? raw.split(',').pop().length : /^\d{1,3}(\.\d{3})+$/.test(raw) ? 0 : (raw.split('.')[1] || '').length;
          const u = Math.pow(10, dec), sign = m[2] ? '−' : m[1].includes('+') ? '+' : '', pre = m[1].replace('+', '');
          let left = Math.round(n * u);
          parts.forEach((p, i) => {
            const x = i < 2 ? Math.round(n * u * W[i]) : left; left -= x;
            p.querySelector('b').textContent = `${sign}${pre}${vtFmt(x / u, dec)}${m[4]}`;
          });
        }
        label();
      } else if (k === 'acc') vtAccent(card, v);
      else if (k === 'tilt') { MAX = v; if (REDUCED) { rx = v * .4; ry = -v * .75; apply(); } }
      else if (k === 'sheen') card.classList.toggle('no-sheen', !v);
    },
    reset() { turn(false); }
  };
};

/* ---------------------------------------------------------------- 11 · Animated Typography */
VT_DEMO.type = card => {
  const h = $('.vt-ty-h', card), sr = $('.vt-ty-sr', card);
  let ws = $$('.w', h), key = ws.findIndex(w => w.classList.contains('vt-ty-u')), replayT = 0;
  const pick = (i, draw) => {
    key = i;
    ws.forEach((w, j) => { w.classList.toggle('vt-ty-u', j === i); w.setAttribute('aria-pressed', String(j === i)); w.tabIndex = j === i ? 0 : -1; });
    if (draw && ws[i]) vtKick(ws[i], 'is-pick', 900);
  };
  const build = text => {
    const words = String(text).trim().split(/\s+/).filter(Boolean);
    const prev = ws[key]?.textContent;
    h.textContent = '';
    let i = 0;
    ws = words.map((t, j) => {
      const b = el('button', 'w', t); b.type = 'button';
      const n = /\d/.test(t);
      if (n) { b.classList.add('vt-ty-n'); i++; }
      b.style.setProperty('--i', i++);
      if (j) h.append(' ');
      h.append(b); return b;
    });
    h.style.setProperty('--n', i);
    /* a palavra-chave continua a mesma; se ela sumiu, vai para o primeiro número ou, sem número, para a palavra mais longa */
    let k = ws.findIndex(w => w.textContent === prev);
    if (k < 0) k = ws.findIndex(w => w.classList.contains('vt-ty-n'));
    if (k < 0) k = ws.reduce((a, w, j) => w.textContent.length > ws[a].textContent.length ? j : a, 0);
    pick(k);
    sr.textContent = words.join(' ');
  };
  h.addEventListener('click', e => { const b = e.target.closest('.w'); if (b) pick(ws.indexOf(b), true); });
  h.addEventListener('keydown', e => {
    const i = ws.indexOf(document.activeElement); if (i < 0) return;
    const j = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: ws.length - 1 }[e.key];
    if (j == null) return;
    e.preventDefault();
    const n = ws[(j + ws.length) % ws.length];
    ws.forEach(w => { w.tabIndex = w === n ? 0 : -1; }); n.focus();
  });
  h.addEventListener('focusout', e => { if (!h.contains(e.relatedTarget)) ws.forEach((w, j) => { w.tabIndex = j === key ? 0 : -1; }); });
  const TITLE = sr.textContent;
  pick(key);
  return {
    replay() { if (ws[key]) vtKick(ws[key], 'is-pick', 900); },
    fields: [
      { k: 'title', t: 'text', l: 'Título', v: TITLE, max: 64 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'speed', t: 'range', l: 'Ritmo', v: 110, min: 40, max: 260, step: 10, fmt: v => v + ' ms' },
      { k: 'line', t: 'toggle', l: 'Sublinhado', v: true }
    ],
    set(k, v) {
      if (k === 'title') build(v || TITLE);
      else if (k === 'acc') vtAccent(card, v);
      else if (k === 'line') card.classList.toggle('no-line', !v);
      else if (k === 'speed') {
        card.style.setProperty('--vt-stg', v + 'ms');
        clearTimeout(replayT);
        if (!REDUCED && card.classList.contains('is-on')) replayT = setTimeout(() => vtRestart(card), 380);
      }
    },
    reset() { const i = ws.findIndex(w => w.textContent === 'cresceu'); if (i >= 0) pick(i); }
  };
};

/* ---------------------------------------------------------------- 12 · Counter Animation */
VT_DEMO.count = card => {
  const its = $$('.vt-co-i', card), vals = $$('.vt-co-v', card), bars = $$('.vt-co-bar', card), det = $('.vt-co-det', card), list = $('.vt-co-list', card);
  const KEYS = its.map(b => $('.vt-co-k', b).textContent);
  const DEF = vals.map(v => +v.dataset.to);
  let raf = 0, dur = 1800, sel = -1;
  const shown = vals.map(v => +v.dataset.to);
  const text = (v, n) => {
    const d = +(v.dataset.dec || 0), pre = v.dataset.pre || '';
    const s = n < 0 ? '−' : pre === '+' ? '+' : '';
    return (pre === '+' ? '' : pre) + s + vtFmt(Math.abs(n), d) + (v.dataset.suf || '');
  };
  const render = (i, n, e) => {
    shown[i] = n;
    vals[i].textContent = text(vals[i], n);
    bars[i].style.setProperty('--w', vtClamp(+vals[i].dataset.to / +vals[i].dataset.goal).toFixed(3));
    bars[i].style.setProperty('--p', e.toFixed(3));
  };
  /* o rótulo usa sempre o valor final, nunca o número no meio da contagem */
  const label = i => its[i].setAttribute('aria-label', `${KEYS[i]}: ${text(vals[i], +vals[i].dataset.to)}. ${sel === i ? 'Selecionado.' : 'Clique para ver o detalhe.'}`);
  const pct = i => Math.round(+vals[i].dataset.to / +vals[i].dataset.goal * 100);
  const DET = [
    () => `${pct(0)}% da meta anual de R$ 14,9 mi. O 4º trimestre puxou a alta.`,
    () => `${pct(1)}% da meta de +59% para o ano. Recompra e novos clientes somam a alta.`,
    () => `${pct(2)}% da meta de 1.240 clientes, média de ${vtFmt(Math.round(+vals[2].dataset.to / 12))} por mês.`
  ];
  const detail = () => {
    det.textContent = '';
    if (sel < 0) { det.append(el('span', 'vt-co-hint', 'Clique num indicador para ver o detalhe.')); return; }
    det.append(el('b', '', KEYS[sel]), ' ' + DET[sel]());
    vtKick(det, 'is-in');
  };
  const run = () => {
    cancelAnimationFrame(raf);
    if (REDUCED) { vals.forEach((v, i) => render(i, +v.dataset.to, 1)); return; }
    const t0 = performance.now();
    const tick = t => {
      let done = true;
      vals.forEach((v, i) => {
        const p = vtClamp((t - t0 - 250 - i * 180) / dur);
        if (p < 1) done = false;
        const e = p >= 1 ? 1 : 1 - Math.pow(2, -10 * p);
        render(i, +v.dataset.to * e, e);
      });
      if (!done) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  };
  /* recontagem curta de um indicador, do valor à mostra até o novo */
  const stops = [];
  const recount = (i, from, ms = 650) => {
    stops[i]?.();
    const to = +vals[i].dataset.to;
    stops[i] = vtTween(ms, p => render(i, from + (to - from) * vtEase(p), 1), () => label(i));
  };
  const select = i => {
    sel = sel === i ? -1 : i;
    its.forEach((b, j) => { b.setAttribute('aria-pressed', String(j === sel)); label(j); });
    list.classList.toggle('has-sel', sel >= 0);
    if (sel >= 0) { vtKick(bars[sel], 'is-pulse', 1100); recount(sel, +vals[sel].dataset.to * .55, 700); }
    detail();
  };
  its.forEach((b, i) => { b.addEventListener('click', () => select(i)); label(i); });
  if (!REDUCED) vals.forEach((v, i) => render(i, 0, 0));
  let rerun = 0;
  return {
    start: run, replay: run,
    still: () => vals.forEach((v, i) => render(i, +v.dataset.to, 1)),
    fields: [
      { k: 'v0', t: 'number', l: 'Receita', v: DEF[0], min: 0, max: 999, dec: 1, unit: 'R$ mi' },
      { k: 'v1', t: 'number', l: 'Crescimento', v: DEF[1], min: -99, max: 999, unit: '%' },
      { k: 'v2', t: 'number', l: 'Clientes', v: DEF[2], min: 0, max: 99999, unit: 'novos' },
      { k: 'dur', t: 'range', l: 'Contagem', v: 1.8, min: .4, max: 4, step: .1, fmt: v => vtFmt(v, 1) + ' s' }
    ],
    set(k, v) {
      if (k === 'dur') {
        dur = v * 1000; clearTimeout(rerun);
        if (card.classList.contains('is-on')) rerun = setTimeout(run, 420);
        return;
      }
      const i = +k.slice(1);
      if (+vals[i].dataset.to === v) return;
      vals[i].dataset.to = v;
      label(i);
      recount(i, shown[i]);
      if (sel === i) detail();
    },
    reset() { if (sel >= 0) select(sel); }
  };
};

/* ---------------------------------------------------------------- 06 · Glow / Light Sweep */
VT_DEMO.glow = card => {
  const main = $('.vt-gl-main', card), k = $('.vt-gl-k', main), v = $('.vt-gl-v', main), dd = $('.vt-gl-d', main), side = $$('.vt-gl-s', card);
  const DEF = [{ k: 'Margem bruta', v: '41%', d: '+6 p.p. no ano' }, { k: 'Custo', v: '−12%', d: '−R$ 1,1 mi no ano' }, { k: 'Prazo', v: '18 dias', d: '9 dias a menos que em 2025' }];
  let K = DEF.map(x => ({ ...x })), order = [0, 1, 2], swapT = 0;
  const render = () => {
    const m = K[order[0]];
    k.textContent = m.k; v.textContent = m.v; dd.textContent = m.d;
    main.setAttribute('aria-label', `Indicador em destaque: ${m.k}, ${m.v}, ${m.d}. Clique para a luz passar de novo.`);
    side.forEach((b, i) => {
      const x = K[order[i + 1]];
      b.querySelector('span').textContent = x.k; b.querySelector('b').textContent = x.v;
      b.setAttribute('aria-label', `${x.k}: ${x.v}. Pôr em destaque.`);
    });
  };
  const promote = (slot, now) => {
    [order[0], order[slot]] = [order[slot], order[0]];
    clearTimeout(swapT);
    vtKick(side[slot - 1], 'is-pop', 600);
    if (REDUCED || now) { render(); vtSync(card, 'val', K[order[0]].v); return; }
    main.classList.add('is-swap');
    swapT = setTimeout(() => {
      render(); vtSync(card, 'val', K[order[0]].v);
      main.classList.remove('is-swap');
      vtKick(main, 'is-flare', 1300);
    }, 220);
  };
  side.forEach((b, i) => b.addEventListener('click', () => promote(i + 1)));
  /* o principal também responde: a varredura e o anel passam de novo */
  main.addEventListener('click', () => vtKick(main, 'is-flare', 1300));
  render();
  return {
    replay() { vtKick(main, 'is-flare', 1300); },
    fields: [
      { k: 'val', t: 'text', l: 'Valor', v: '41%', max: 9 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'int', t: 'range', l: 'Intensidade', v: 100, min: 20, max: 220, step: 10, fmt: v => v + '%' },
      { k: 'sweep', t: 'toggle', l: 'Varredura', v: true }
    ],
    set(key, val) {
      if (key === 'val') { K[order[0]].v = val || ' '; render(); }
      else if (key === 'acc') vtAccent(card, val);
      else if (key === 'int') card.style.setProperty('--vt-gi', (val / 100).toFixed(2));
      else if (key === 'sweep') card.classList.toggle('no-sweep', !val);
    },
    reset() { K = DEF.map(x => ({ ...x })); order = [0, 1, 2]; render(); }
  };
};

/* ---------------------------------------------------------------- 24 · Spotlight / Focus */
VT_DEMO.spot = card => {
  const box = $('.vt-sp', card), cap = $('.vt-sp-cap', box), btns = $$('.vt-sp-ctl button', box), ttl = $('.vt-sp-title', box);
  const CAPS = {
    1: 'Passo 1 · Tudo começa na compra: 100.',
    2: 'Passo 2 · O estoque leva 4 pontos.',
    3: 'Passo 3 · O frete leva 9. É aqui que a margem vaza.',
    4: 'Passo 4 · Sobram 87 na venda: 13 pontos ficaram pelo caminho.',
    free: 'Livre · o foco segue o seu cursor.'
  };
  let step = 0, timer = 0, auto = false;
  const place = (x, y, r, instant) => {
    if (instant) box.classList.add('is-free');
    box.style.setProperty('--vt-sx', x + 'px'); box.style.setProperty('--vt-sy', y + 'px');
    if (r) box.style.setProperty('--vt-sr', r + 'px');
    if (instant && step !== 'free') { void box.offsetWidth; box.classList.remove('is-free'); }
  };
  const toNode = (k, instant) => {
    const n = $(`.vt-sp-node[data-step="${k}"]`, box); if (!n) return;
    const r = n.getBoundingClientRect(), b = box.getBoundingClientRect();
    place(r.left + r.width / 2 - b.left, r.top + r.height / 2 - b.top, Math.max(r.width, r.height) * 1.25, instant);
  };
  const go = (k, fromUser) => {
    if (fromUser) { auto = false; clearTimeout(timer); }
    const first = box.classList.contains('is-off');
    step = k;
    btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.go === String(k))));
    box.classList.toggle('is-free', k === 'free');
    $$('.vt-sp-node', box).forEach(n => n.classList.toggle('is-lit', n.dataset.step === String(k)));
    cap.textContent = CAPS[k];
    if (k === 'free') { const b = box.getBoundingClientRect(); if (first) place(b.width / 2, b.height * .4, 84, true); else box.style.setProperty('--vt-sr', '84px'); }
    else toNode(k, first);
    box.classList.remove('is-off');
  };
  const next = () => {
    if (!auto) return;
    const s = typeof step === 'number' ? step : 0;
    if (s >= 3) { auto = false; return; }
    timer = setTimeout(() => { go(s + 1); next(); }, s === 0 ? 350 : 2300);
  };
  btns.forEach(b => b.addEventListener('click', () => go(b.dataset.go === 'free' ? 'free' : +b.dataset.go, true)));
  /* clicar num bloco do slide leva o foco até ele */
  box.addEventListener('click', e => {
    const n = e.target.closest('.vt-sp-node');
    if (n) go(+n.dataset.step, true);
  });
  box.addEventListener('pointermove', e => {
    if (step !== 'free') return;
    const b = box.getBoundingClientRect();
    place(e.clientX - b.left, e.clientY - b.top);
  });
  new ResizeObserver(() => { if (typeof step === 'number' && step > 0) toNode(step, true); }).observe(box);
  box.classList.add('is-off');
  return {
    start() { auto = true; step = 0; next(); },
    resume() { if (auto && !timer) next(); },
    pause() { clearTimeout(timer); timer = 0; },
    replay() { clearTimeout(timer); box.classList.add('is-off'); auto = true; step = 0; next(); },
    still() { go(3); },
    fields: [
      { k: 'title', t: 'text', l: 'Título', v: ttl.textContent, max: 36 },
      { k: 'acc', t: 'color', l: 'Halo', v: '#c9a6ff' },
      { k: 'size', t: 'range', l: 'Foco', v: 100, min: 60, max: 170, step: 5, fmt: v => v + '%' },
      { k: 'dark', t: 'range', l: 'Escurecer', v: 84, min: 30, max: 96, step: 2, fmt: v => v + '%' }
    ],
    set(k, v) {
      if (k === 'title') ttl.textContent = v || ' ';
      else if (k === 'size') card.style.setProperty('--vt-sz', (v / 100).toFixed(2));
      else if (k === 'dark') card.style.setProperty('--vt-dk', (v / 100).toFixed(2));
      else if (k === 'acc') vtAccent(card, v);
      if (box.classList.contains('is-off')) go(3, true);
    },
    /* o padrão é o fim do roteiro: foco no passo 3, sem modo Livre e sem autoplay pendente */
    reset() { auto = false; clearTimeout(timer); timer = 0; go(3, true); }
  };
};

/* ---------------------------------------------------------------- 33 · Card Stack */
VT_DEMO.stack = card => {
  const pile = $('.vt-st-pile', card), cards = $$('.vt-st-card', pile), live = $('.vt-st-live', card);
  const TT = cards.map(c => c.querySelector('b').textContent);
  let order = cards.map((_, i) => i), busy = false;
  const label = c => `Capítulo ${c.querySelector('span').textContent.replace(' / ', ' de ')}: ${c.querySelector('b').textContent}. ${c.querySelector('p').textContent}`;
  const layout = () => order.forEach((ci, o) => {
    const c = cards[ci];
    c.style.setProperty('--o', o);
    c.style.setProperty('--sg', o % 2 ? -1 : 1);
    c.classList.toggle('is-top', o === 0);
    c.tabIndex = o === 0 ? 0 : -1;
    c.setAttribute('aria-hidden', String(o !== 0));
  });
  const name = () => cards.forEach(c => c.setAttribute('aria-label', label(c) + ' Pressione Enter para o próximo.'));
  cards.forEach(c => c.setAttribute('role', 'button'));
  name();
  const next = (dir = 1) => {
    if (busy) return; busy = true;
    const c = cards[order[0]], had = document.activeElement === c;
    c.classList.remove('is-drag');
    c.style.setProperty('--dx', dir * pile.offsetWidth * 1.15 + 'px');
    c.style.setProperty('--dr', dir * 16 + 'deg');
    setTimeout(() => {
      order.push(order.shift());
      c.style.removeProperty('--dx'); c.style.removeProperty('--dr');
      layout();
      live.textContent = label(cards[order[0]]);
      vtSync(card, 'top', cards[order[0]].querySelector('b').textContent);
      if (had) cards[order[0]].focus({ preventScroll: true });
      busy = false;
    }, REDUCED ? 0 : 260);
  };
  let sx = 0, dx = 0, drag = null;
  pile.addEventListener('pointerdown', e => {
    const c = e.target.closest('.vt-st-card');
    if (!c || !c.classList.contains('is-top') || busy) return;
    drag = c; sx = e.clientX; dx = 0;
    c.setPointerCapture(e.pointerId);
  });
  pile.addEventListener('pointermove', e => {
    if (!drag) return;
    dx = e.clientX - sx;
    if (Math.abs(dx) > 4) drag.classList.add('is-drag');
    drag.style.setProperty('--dx', dx + 'px'); drag.style.setProperty('--dr', dx * .06 + 'deg');
  });
  const up = e => {
    if (!drag) return;
    const c = drag; drag = null;
    if (e.type === 'pointercancel') { c.classList.remove('is-drag'); c.style.removeProperty('--dx'); c.style.removeProperty('--dr'); return; }
    if (Math.abs(dx) > 70 || Math.abs(dx) < 5) next(dx < -70 ? -1 : 1);
    else { c.classList.remove('is-drag'); c.style.removeProperty('--dx'); c.style.removeProperty('--dr'); }
  };
  pile.addEventListener('pointerup', up);
  pile.addEventListener('pointercancel', up);
  pile.addEventListener('keydown', e => {
    if (!e.target.classList.contains('is-top')) return;
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); next(1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); next(-1); }
  });
  layout();
  return {
    replay() { order = cards.map((_, i) => i); layout(); vtSync(card, 'top', cards[0].querySelector('b').textContent); },
    still: layout,
    fields: [
      { k: 'top', t: 'text', l: 'Card do topo', v: TT[0], max: 26 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#8b3dff' },
      { k: 'depth', t: 'range', l: 'Profundidade', v: 100, min: 0, max: 220, step: 10, fmt: v => v + '%' },
      { k: 'fan', t: 'toggle', l: 'Leque', v: false }
    ],
    set(k, v) {
      if (k === 'top') { cards[order[0]].querySelector('b').textContent = v || ' '; name(); }
      else if (k === 'acc') vtAccent(card, v);
      else if (k === 'depth') card.style.setProperty('--vt-dp', (v / 100).toFixed(2));
      else if (k === 'fan') card.classList.toggle('is-fan', v);
    },
    reset() { cards.forEach((c, i) => { c.querySelector('b').textContent = TT[i]; }); order = cards.map((_, i) => i); layout(); name(); }
  };
};

/* ---------------------------------------------------------------- 16 · Chart Build + 15 · Data Highlight */
VT_DEMO.chart = (card, say) => {
  const plot = $('.vt-ch-plot', card), svg = $('.vt-ch-svg', card), tip = $('.vt-ch-tip', card), range = $('.vt-range', card), desc = $('title', svg);
  const Q = ['1T25', '2T25', '3T25', '4T25', '1T26', '2T26', '3T26', '4T26'];
  const R = [42, 48, 51, 57, 63, 70, 76, 84], M = [45, 48, 52, 55, 58, 62, 66, 70], LAST = R.length - 1, R0 = R[LAST];
  /* a descrição do gráfico acompanha o valor editado */
  const above = () => { let n = 0; for (let i = LAST; i >= 0 && R[i] >= M[i]; i--) n++; return n; };
  const describe = () => {
    const n = above();
    const qt = n === 1 ? 'no último trimestre' : `nos últimos ${['', '', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito'][n]} trimestres`;
    desc.textContent = `Receita trimestral vai de ${R[0]} a ${vtFmt(R[LAST])} milhões de reais entre o 1º trimestre de 2025 e o 4º de 2026, ${n ? 'acima' : 'abaixo'} da meta ${n ? qt : 'no último trimestre'}. Clique numa barra para destacá-la.`;
  };
  let g = null, prog = REDUCED ? 1 : 0, stop = null, dur = 2800, sel = -1, hov = -1;
  const ns = (t, a, parent) => { const n = svgEl(t, a); (parent || svg).append(n); return n; };
  const vs = i => { const d = Math.round((R[i] - M[i]) / M[i] * 100); return `${d >= 0 ? '+' : '−'}${Math.abs(d)}% vs. meta`; };
  const tipAt = (i, pin) => {
    if (!g || i < 0) { tip.hidden = true; return; }
    tip.hidden = false;
    tip.classList.toggle('is-pin', !!pin);
    tip.textContent = pin ? `${Q[i]} · Receita ${vtFmt(R[i])} · Meta ${M[i]} · ${vs(i)}` : `${Q[i]} · Receita ${vtFmt(R[i])} · Meta ${M[i]}`;
    tip.style.left = vtClamp(g.xc(i), pin ? 130 : 90, g.W - (pin ? 130 : 90)) + 'px';
    tip.style.top = g.y(Math.max(R[i], M[i])) - (pin ? 18 : 0) + 'px';
  };
  const paintSel = () => {
    if (!g) return;
    svg.classList.toggle('has-sel', sel >= 0);
    g.bars.forEach((r, i) => r.classList.toggle('is-sel', i === sel));
    g.vals.forEach((t, i) => t.classList.toggle('is-on', i === sel));
    g.hits.forEach((h, i) => h.setAttribute('aria-pressed', String(i === sel)));
    tipAt(hov >= 0 ? hov : sel, hov < 0 || hov === sel);
  };
  const pick = i => {
    sel = sel === i ? -1 : i; hov = -1; paintSel();
    if (sel >= 0 && g) vtKick(g.bars[sel], 'is-kick', 700);
    say(sel >= 0 ? `${Q[sel]} em destaque: receita ${vtFmt(R[sel])}, meta ${M[sel]}, ${vs(sel)}. As outras barras esmaeceram.` : 'Destaque desfeito: todas as barras à mostra.');
  };
  const build = () => {
    const W = plot.clientWidth, H = plot.clientHeight; if (!W || !H) return;
    [...svg.querySelectorAll(':scope > :not(title)')].forEach(n => n.remove());
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const L = 30, Rt = W - 58, T = 20, B = H - 22, band = (Rt - L) / Q.length, bw = Math.min(46, band * .58);
    const y = v => B - (v / 100) * (B - T), xc = i => L + band * i + band / 2;
    const uid = card.id + '-c';
    const defs = ns('defs');
    const clip = ns('clipPath', { id: uid }, defs); ns('rect', { x: 0, y: 0, width: W, height: B }, clip);
    const mask = ns('mask', { id: uid + 'm' }, defs);
    const lineD = M.map((v, i) => `${i ? 'L' : 'M'}${xc(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ');
    const mPath = ns('path', { d: lineD, fill: 'none', stroke: '#fff', 'stroke-width': 8, 'stroke-linecap': 'round' }, mask);
    const gridG = ns('g');
    [0, 25, 50, 75, 100].forEach(v => {
      ns('line', { x1: L, x2: Rt, y1: y(v), y2: y(v), class: v ? 'vt-ch-grid' : 'vt-ch-base' }, gridG);
    });
    const yl = ns('g', { class: 'vt-ch-axis' });
    [0, 50, 100].forEach(v => { const t = ns('text', { x: L - 8, y: y(v) + 4, 'text-anchor': 'end', class: 'vt-ch-lbl' }, yl); t.textContent = v; });
    const xl = ns('g', { class: 'vt-ch-axis' });
    Q.forEach((q, i) => { if (band < 44 && i % 2 === 0) return; const t = ns('text', { x: xc(i), y: H - 4, 'text-anchor': 'middle', class: 'vt-ch-lbl' }, xl); t.textContent = q; });
    const barsG = ns('g', { 'clip-path': `url(#${uid})` });
    const hits = [], vals = [];
    const bars = R.map((v, i) => {
      const hit = ns('rect', { x: xc(i) - band / 2, y: T, width: band, height: B - T, class: 'vt-ch-hit', tabindex: 0, role: 'button', 'aria-pressed': 'false', 'aria-label': `${Q[i]}: receita ${vtFmt(v)}, meta ${M[i]}. Destacar.` });
      const r = ns('rect', { x: xc(i) - bw / 2, width: bw, rx: 4, y: B, height: 0, class: 'vt-ch-bar' + (i === R.length - 1 ? ' is-hi' : '') }, barsG);
      hit.addEventListener('pointerenter', () => { hov = i; r.classList.add('is-hov'); tipAt(i, i === sel); });
      hit.addEventListener('pointerleave', () => { hov = -1; r.classList.remove('is-hov'); tipAt(sel, true); });
      hit.addEventListener('focus', () => { r.classList.add('is-hov'); r.classList.toggle('is-kf', hit.matches(':focus-visible')); if (sel < 0) tipAt(i, false); });
      hit.addEventListener('blur', () => { r.classList.remove('is-hov', 'is-kf'); tipAt(sel, true); });
      hit.addEventListener('click', () => pick(i));
      hit.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(i); }
        else if (e.key === 'Escape' && sel >= 0) { e.preventDefault(); pick(sel); }
      });
      hits.push(hit);
      return r;
    });
    const line = ns('path', { d: lineD, class: 'vt-ch-meta', mask: `url(#${uid}m)` });
    const len = line.getTotalLength();
    mPath.setAttribute('stroke-dasharray', len);
    const dots = M.map((v, i) => ns('circle', { cx: xc(i), cy: y(v), r: 4.5, class: 'vt-ch-dot' }));
    const labs = ns('g');
    R.forEach((v, i) => { const t = ns('text', { x: xc(i), y: y(v) - 8, 'text-anchor': 'middle', class: 'vt-ch-sv' }, labs); t.textContent = vtFmt(v); vals.push(t); });
    /* o rótulo do último trimestre sobe acima da barra; se a barra encosta na meta, ele entra na barra para não cobrir o ponto */
    const inBar = R[LAST] <= M[LAST] + 4 && B - y(R[LAST]) > 26;
    const v0 = ns('text', { x: xc(LAST), y: inBar ? y(R[LAST]) + 18 : y(R[LAST]) - 8, 'text-anchor': 'middle', class: 'vt-ch-val' + (inBar ? ' is-in' : '') }, labs); v0.textContent = vtFmt(R[LAST]);
    const v2 = ns('text', { x: xc(M.length - 1) + bw / 2 + 8, y: y(M[M.length - 1]) + 4, 'text-anchor': 'start', class: 'vt-ch-lbl vt-ch-ml' }, labs); v2.textContent = 'Meta ' + M[M.length - 1];
    g = { bars, hits, vals, mPath, len, dots, labs, xl, yl, y, B, xc, W };
    render(prog);
    paintSel();
  };
  const render = p => {
    prog = p; if (!g) return;
    const pb = vtClamp(p / .45);
    g.bars.forEach((r, i) => { const e = vtEase(vtClamp((pb - i * .07) / .51)); const h = (g.B - g.y(R[i])) * e; r.setAttribute('y', g.B - h); r.setAttribute('height', h + (h > 0 ? 4 : 0)); });
    g.mPath.setAttribute('stroke-dashoffset', g.len * (1 - vtEase(vtClamp((p - .45) / .3))));
    const pd = vtClamp((p - .68) / .17);
    g.dots.forEach((d, i) => { const e = vtClamp(pd * g.dots.length - i); d.setAttribute('r', (4.5 * vtEase(e)).toFixed(2)); d.style.opacity = e > 0 ? 1 : 0; });
    const pl = vtClamp((p - .84) / .16);
    [g.labs, g.xl, g.yl].forEach(n => { n.style.opacity = pl; });
    range.value = Math.round(p * 100);
    range.style.setProperty('--v', p * 100 + '%');
    range.setAttribute('aria-valuetext', p < .45 ? 'Barras crescendo' : p < .75 ? 'Meta se desenhando' : p < .9 ? 'Pontos surgindo' : 'Gráfico completo');
  };
  const play = () => { stop?.(); render(0); stop = vtTween(dur, p => render(p), () => { stop = null; }); };
  range.addEventListener('input', () => { stop?.(); stop = null; render(range.value / 100); });
  /* clicar no fundo do gráfico apaga o destaque */
  plot.addEventListener('click', e => { if (!e.target.closest('.vt-ch-hit') && sel >= 0) pick(sel); });
  new ResizeObserver(() => build()).observe(plot);
  let replayT = 0;
  return {
    start: play, replay: play, still: () => render(1),
    fields: [
      { k: 'val', t: 'number', l: 'Receita 4T26', v: R0, min: 0, max: 100, unit: 'R$ mi' },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'dur', t: 'range', l: 'Montagem', v: 2.8, min: 1, max: 6, step: .2, fmt: v => vtFmt(v, 1) + ' s' },
      { k: 'meta', t: 'toggle', l: 'Meta', v: true }
    ],
    set(k, v) {
      /* o último trimestre refaz a barra, o rótulo, o vs. meta e a descrição */
      if (k === 'val') { if (R[LAST] === v) return; R[LAST] = v; describe(); build(); if (g && prog >= 1 && !REDUCED) vtKick(g.bars[LAST], 'is-kick', 700); }
      else if (k === 'acc') vtAccent(card, v);
      else if (k === 'meta') card.classList.toggle('no-meta', !v);
      else if (k === 'labels') card.classList.toggle('no-lbl', !v);
      else if (k === 'dur') { dur = v * 1000; clearTimeout(replayT); if (!REDUCED && card.classList.contains('is-on')) replayT = setTimeout(play, 420); }
    },
    reset() { if (sel >= 0) pick(sel); }
  };
};

/* ---------------------------------------------------------------- 21 · Flip Card */
VT_DEMO.flip = card => {
  const box = $('.vt-fl', card), cs = $$('.vt-fl-card', card), all = $('.vt-fl-all', card);
  const c0 = cs[0], fB = $('.vt-fl-f b', c0), bB = $('.vt-fl-b b', c0), dS = $('.vt-fl-b em span', c0);
  let timers = [], A = 45, Bv = 12;
  const set = (c, on) => {
    c.setAttribute('aria-pressed', String(on));
    c.setAttribute('aria-label', `${c.dataset.k}. ${on ? 'Depois' : 'Antes'}: ${on ? c.dataset.b : c.dataset.a}`);
  };
  const clear = () => { timers.forEach(clearTimeout); timers = []; };
  cs.forEach(c => { set(c, false); c.addEventListener('click', () => { clear(); set(c, c.getAttribute('aria-pressed') !== 'true'); }); });
  all.addEventListener('click', () => { clear(); const on = cs.some(c => c.getAttribute('aria-pressed') !== 'true'); cs.forEach((c, i) => timers.push(setTimeout(() => set(c, on), i * 120))); });
  const intro = delay => { clear(); cs.forEach((c, i) => timers.push(setTimeout(() => set(c, true), delay + i * 260))); };
  const prazo = () => {
    const d = A ? Math.round((Bv - A) / A * 100) : 0;
    fB.textContent = `${vtFmt(A)} d`; bB.textContent = `${vtFmt(Bv)} d`;
    dS.textContent = `${d > 0 ? '+' : d < 0 ? '−' : ''}${Math.abs(d)}%`;
    c0.dataset.a = `${vtFmt(A)} dias`; c0.dataset.b = `${vtFmt(Bv)} dias`;
    set(c0, c0.getAttribute('aria-pressed') === 'true');
  };
  return {
    start: () => intro(600),
    replay() { clear(); cs.forEach(c => set(c, false)); intro(900); },
    still: () => cs.forEach(c => set(c, true)),
    fields: [
      { k: 'a', t: 'number', l: 'Prazo antes', v: 45, min: 1, max: 999, unit: 'dias' },
      { k: 'b', t: 'number', l: 'Prazo depois', v: 12, min: 0, max: 999, unit: 'dias' },
      { k: 'acc', t: 'color', l: 'Verso', v: '#8b3dff' },
      { k: 'axis', t: 'toggle', l: 'Giro vertical', v: false }
    ],
    set(k, v) {
      /* ao editar um lado, o primeiro card mostra esse lado */
      if (k === 'a') { A = v; prazo(); clear(); set(c0, false); }
      else if (k === 'b') { Bv = v; prazo(); clear(); set(c0, true); }
      else if (k === 'acc') vtAccent(card, v);
      else if (k === 'axis') box.classList.toggle('is-x', v);
    }
  };
};

/* ---------------------------------------------------------------- 37 · Before / After */
VT_DEMO.ba = card => {
  const box = $('.vt-ba-box', card), knob = $('.vt-ba-knob', box), big = $('.vt-ba-big', box), kk = $('.vt-ba-k', box);
  let p = 50, stop = null, drag = false;
  const set = v => {
    p = vtClamp(v, 0, 100);
    box.style.setProperty('--p', p.toFixed(2) + '%');
    const r = Math.round(p);
    knob.setAttribute('aria-valuenow', r);
    knob.setAttribute('aria-valuetext', r >= 100 ? 'Só o antes' : r <= 0 ? 'Só o depois' : `${r}% antes, ${100 - r}% depois`);
  };
  const fromX = x => { const r = box.getBoundingClientRect(); return (x - r.left) / r.width * 100; };
  box.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' && !e.target.closest('.vt-ba-knob')) return;
    stop?.(); stop = null; drag = true;
    box.setPointerCapture(e.pointerId); set(fromX(e.clientX));
  });
  box.addEventListener('pointermove', e => { if (drag) set(fromX(e.clientX)); });
  box.addEventListener('pointerup', () => { drag = false; });
  box.addEventListener('pointercancel', () => { drag = false; });
  knob.addEventListener('keydown', e => {
    const s = e.shiftKey ? 10 : 5;
    const v = { ArrowLeft: p - s, ArrowDown: p - s, ArrowRight: p + s, ArrowUp: p + s, Home: 0, End: 100 }[e.key];
    if (v == null) return;
    e.preventDefault(); stop?.(); stop = null; set(v);
  });
  const sweep = () => {
    stop?.(); set(100);
    stop = vtTween(1200, q => set(100 - 72 * vtEase(q)), () => { stop = vtTween(700, q => set(28 + 22 * vtEase(q)), () => { stop = null; }); });
  };
  set(REDUCED ? 50 : 100);
  /* ao editar o depois, o divisor abre espaço para ele aparecer */
  const reveal = () => { if (p > 45) { stop?.(); const a = p; stop = vtTween(500, q => set(a + (35 - a) * vtEase(q)), () => { stop = null; }); } };
  return {
    start: sweep, replay: sweep, still: () => set(50),
    fields: [
      { k: 'num', t: 'text', l: 'Número', v: big.textContent, max: 8 },
      { k: 'cap', t: 'text', l: 'Legenda', v: kk.textContent, max: 24 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'tags', t: 'toggle', l: 'Etiquetas', v: true }
    ],
    set(k, v) {
      if (k === 'num') { big.textContent = v || ' '; reveal(); }
      else if (k === 'cap') { kk.textContent = v || ' '; reveal(); }
      else if (k === 'acc') { vtAccent(card, v); reveal(); }
      else if (k === 'tags') card.classList.toggle('no-tags', !v);
    }
  };
};

/* ---------------------------------------------------------------- 35 · Interactive Matrix */
VT_DEMO.matrix = (card, say) => {
  const plot = $('.vt-mx-plot', card), leg = $('.vt-mx-leg', card), qs = $$('.vt-mx-q', plot), live = $('.vt-mx-live', card);
  const QN = ['Ganhos rápidos', 'Grandes apostas', 'Ajustes finos', 'Evitar'];
  const START = [['Painel', 22, 26], ['Capa nova', 36, 40], ['Treino', 72, 30], ['Migração', 78, 76], ['Relatório', 30, 74]];
  const MAXB = 9;
  const quad = (x, y) => (x >= 50 ? 1 : 0) + (y >= 50 ? 2 : 0);
  let focusQ = -1, drag = null;
  const lbs = QN.map((q, i) => {
    const b = el('button', 'vt-mx-lb'); b.type = 'button'; b.dataset.q = i; b.setAttribute('aria-pressed', 'false');
    b.append(el('span', '', q), el('b', '', '0'));
    leg.append(b); return b;
  });
  const place = b => {
    const x = +b.dataset.x, y = +b.dataset.y, q = quad(x, y);
    b.style.left = x + '%'; b.style.top = y + '%';
    b.classList.toggle('is-q0', q === 0);
    b.classList.toggle('is-out', focusQ >= 0 && q !== focusQ);
    b.setAttribute('aria-label', `${b.textContent}: ${QN[q]}. Use as setas para mover.`);
  };
  const tally = () => {
    const n = [0, 0, 0, 0];
    bs.forEach(b => n[quad(+b.dataset.x, +b.dataset.y)]++);
    lbs.forEach((l, i) => { l.querySelector('b').textContent = n[i]; l.setAttribute('aria-label', `${QN[i]}: ${n[i]}. ${focusQ === i ? 'Em destaque.' : 'Destacar.'}`); });
  };
  const hot = q => qs.forEach((d, i) => d.classList.toggle('is-hot', i === q));
  const focus = q => {
    focusQ = focusQ === q ? -1 : q;
    plot.classList.toggle('has-q', focusQ >= 0);
    qs.forEach((d, i) => d.classList.toggle('is-sel', i === focusQ));
    lbs.forEach((l, i) => l.setAttribute('aria-pressed', String(i === focusQ)));
    bs.forEach(place); tally();
    live.textContent = focusQ >= 0 ? `${QN[focusQ]} em destaque.` : 'Todos os quadrantes.';
  };
  const bind = b => {
    b.addEventListener('pointerdown', e => { drag = b; b.setPointerCapture(e.pointerId); b.classList.add('is-drag'); b.style.setProperty('--d', '0ms'); });
    b.addEventListener('pointermove', e => {
      if (drag !== b) return;
      const r = plot.getBoundingClientRect();
      b.dataset.x = vtClamp((e.clientX - r.left) / r.width * 100, 6, 94).toFixed(1);
      b.dataset.y = vtClamp((e.clientY - r.top) / r.height * 100, 8, 92).toFixed(1);
      place(b); hot(quad(+b.dataset.x, +b.dataset.y));
    });
    const end = () => { if (drag !== b) return; drag = null; b.classList.remove('is-drag'); hot(-1); bs.forEach(place); tally(); };
    b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
    b.addEventListener('keydown', e => {
      const s = e.shiftKey ? 15 : 5;
      const d = { ArrowLeft: [-s, 0], ArrowRight: [s, 0], ArrowUp: [0, -s], ArrowDown: [0, s] }[e.key];
      if (!d) return;
      e.preventDefault(); b.style.setProperty('--d', '0ms');
      b.dataset.x = vtClamp(+b.dataset.x + d[0], 6, 94); b.dataset.y = vtClamp(+b.dataset.y + d[1], 8, 92);
      place(b); tally();
    });
  };
  const mk = (name, x, y, i) => {
    const b = el('button', 'vt-mx-b', name);
    b.type = 'button'; b.dataset.x = x; b.dataset.y = y; b.style.setProperty('--d', i * 90 + 'ms');
    plot.append(b); bind(b); return b;
  };
  let bs = START.map(([name, x, y], i) => mk(name, x, y, i));
  /* ponto livre para uma bolha nova: num quadrante sorteado (depois nos outros), o ponto com mais folga
     em relação às outras bolhas e aos nomes dos quadrantes. Folga = distância livre no eixo mais
     afastado, já com uma margem de respiro; se nenhum quadrante tem folga, vale o de maior folga geral */
  const spot = b => {
    const r = plot.getBoundingClientRect(), W = r.width, H = r.height;
    if (!W || !H) return [25 + Math.random() * 50, 25 + Math.random() * 50];
    const bw = b.offsetWidth + 12, bh = b.offsetHeight + 8;
    const boxes = bs.filter(o => o !== b).map(o => [+o.dataset.x / 100 * W, +o.dataset.y / 100 * H, o.offsetWidth + 12, o.offsetHeight + 8]);
    if (!card.classList.contains('no-names')) qs.forEach(q => { const a = $('span', q).getBoundingClientRect(); boxes.push([a.left - r.left + a.width / 2, a.top - r.top + a.height / 2, a.width + 10, a.height + 8]); });
    const room = (x, y) => boxes.reduce((m, [ox, oy, ow, oh]) => Math.min(m, Math.max(Math.abs(x - ox) - (bw + ow) / 2, Math.abs(y - oy) - (bh + oh) / 2)), Infinity);
    const q0 = Math.floor(Math.random() * 4);
    let best = null;
    for (let t = 0; t < 4; t++) {
      const q = (q0 + t) % 4, qx = q % 2, qy = q >> 1;
      const x0 = qx * W / 2 + bw / 2, x1 = Math.max(x0, (qx + 1) * W / 2 - bw / 2), y0 = qy * H / 2 + bh / 2, y1 = Math.max(y0, (qy + 1) * H / 2 - bh / 2);
      let top = null;
      for (let i = 0; i <= 8; i++) for (let j = 0; j <= 6; j++) {
        const x = x0 + (x1 - x0) * i / 8, y = y0 + (y1 - y0) * j / 6, f = room(x, y);
        if (!top || f > top[2]) top = [x, y, f];
      }
      if (!best || top[2] > best[2]) best = top;
      if (top[2] >= 0) break;
    }
    return [vtClamp(best[0] / W * 100, 6, 94), vtClamp(best[1] / H * 100, 8, 92)];
  };
  lbs.forEach((l, i) => l.addEventListener('click', () => focus(i)));
  /* clicar num quadrante vazio também destaca */
  plot.addEventListener('click', e => {
    if (e.target.closest('.vt-mx-b')) return;
    const r = plot.getBoundingClientRect();
    focus(quad((e.clientX - r.left) / r.width * 100, (e.clientY - r.top) / r.height * 100));
  });
  const reset = () => { bs.forEach((b, i) => { if (i < START.length) { b.dataset.x = START[i][1]; b.dataset.y = START[i][2]; b.style.setProperty('--d', i * 90 + 'ms'); } place(b); }); tally(); };
  reset();
  return {
    replay: reset, still: reset,
    fields: [
      { k: 'add', t: 'add', l: 'Iniciativa', ph: 'Ex.: Portal', max: 14, full: `Máximo de ${MAXB} iniciativas` },
      { k: 'acc', t: 'color', l: 'Cor', v: '#a970ff' },
      { k: 'names', t: 'toggle', l: 'Rótulos', v: true },
      { k: 'axes', t: 'toggle', l: 'Eixos', v: true }
    ],
    set(k, v) {
      if (k === 'add') {
        if (bs.length >= MAXB) { say(`A matriz já tem ${MAXB} iniciativas.`); return false; }
        /* nasce no centro e voa até um ponto livre */
        const b = mk(v, 50, 50, 0);
        bs.push(b); place(b);
        const [x, y] = spot(b);
        void b.offsetWidth;
        b.dataset.x = x.toFixed(1); b.dataset.y = y.toFixed(1);
        place(b); tally(); vtKick(b, 'is-new', 700);
        say(`${v} entrou em ${QN[quad(+b.dataset.x, +b.dataset.y)]}. Arraste para mudar de quadrante.`);
        if (bs.length >= MAXB) vtSync(card, 'add', 'full');
        return true;
      }
      if (k === 'acc') vtAccent(card, v);
      else if (k === 'names') card.classList.toggle('no-names', !v);
      else if (k === 'axes') card.classList.toggle('no-axes', !v);
    },
    reset() {
      bs.slice(START.length).forEach(b => b.remove()); bs = bs.slice(0, START.length);
      if (focusQ >= 0) focus(focusQ);
      reset(); vtSync(card, 'add', '');
    }
  };
};

/* ---------------------------------------------------------------- 18 · Connector / Flow Line */
VT_DEMO.flow = (card, say) => {
  const box = $('.vt-fw-box', card), svg = $('.vt-fw-svg', card), cap = $('.vt-fw-cap', card);
  /* o nó central pode ser renomeado no painel: as legendas usam o nome atual (c) */
  const CORE = 'Motor';
  let core = CORE;
  const N = {
    dados: [58, 50, 'Dados', c => `Os dados alimentam: ${c}.`],
    crm: [58, 190, 'CRM', c => `O CRM alimenta: ${c}.`],
    motor: [200, 120, CORE, c => `${c} liga as fontes ao Painel e à Plateia.`],
    painel: [342, 50, 'Painel', c => `O Painel recebe de ${c} e mostra à Plateia.`],
    sala: [342, 190, 'Plateia', c => `A Plateia recebe de ${c} e do Painel.`]
  };
  const E = [['dados', 'motor'], ['crm', 'motor'], ['motor', 'painel'], ['motor', 'sala'], ['painel', 'sala']];
  const DEF = 'Clique num nó para ver as ligações';
  let curve = true, speed = 1;
  const path = (a, b) => {
    const [ax, ay] = N[a], [bx, by] = N[b];
    if (!curve) return `M${ax} ${ay} L${bx} ${by}`;
    return ax === bx ? `M${ax} ${ay} C${ax + 46} ${ay + 40}, ${bx + 46} ${by - 40}, ${bx} ${by}` : `M${ax} ${ay} C${(ax + bx) / 2} ${ay}, ${(ax + bx) / 2} ${by}, ${bx} ${by}`;
  };
  const links = E.map(([a, b]) => {
    const d = path(a, b);
    const base = svgEl('path', { d, class: 'vt-fw-base' }), flow = svgEl('path', { d, class: 'vt-fw-flow' });
    svg.append(base, flow);
    return { a, b, base, flow, len: 0 };
  });
  const pk = svgEl('g', { class: 'vt-fw-pk' }); svg.append(pk);
  let pinned = null, timers = [];
  const btns = {};
  Object.entries(N).forEach(([k, [x, y, name]], i) => {
    const b = el('button', 'vt-fw-n' + (k === 'motor' ? ' is-core' : ''), name);
    b.type = 'button'; b.style.left = x / 4 + '%'; b.style.top = y / 2.4 + '%'; b.style.setProperty('--i', i);
    b.setAttribute('aria-pressed', 'false');
    btns[k] = b; box.append(b);
  });
  const hi = k => {
    const on = !!k;
    svg.classList.toggle('is-dim', on); box.classList.toggle('is-dim', on);
    Object.entries(btns).forEach(([n, b]) => { b.classList.toggle('is-hi', n === k); b.classList.remove('is-nb'); });
    links.forEach(l => {
      const t = on && (l.a === k || l.b === k);
      l.base.classList.toggle('is-hi', t); l.flow.classList.toggle('is-hi', t);
      if (t) btns[l.a === k ? l.b : l.a].classList.add('is-nb');
    });
    cap.textContent = on ? N[k][3](core) : DEF;
  };
  /* pacotes de luz que saem do nó clicado e percorrem cada ligação */
  const send = k => {
    if (REDUCED) return;
    links.filter(l => l.a === k || l.b === k).forEach((l, i) => {
      const dot = svgEl('circle', { r: 4.5, class: 'vt-fw-dot' }); pk.append(dot);
      const len = l.base.getTotalLength(), rev = l.b === k, to = btns[rev ? l.a : l.b];
      setTimeout(() => vtTween(950 / speed, p => {
        const pt = l.base.getPointAtLength(len * (rev ? 1 - vtEase(p) : vtEase(p)));
        dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); dot.style.opacity = p < .9 ? 1 : (1 - p) * 10;
      }, () => { dot.remove(); vtKick(to, 'is-ping', 700); }), i * 90);
    });
  };
  Object.entries(btns).forEach(([k, b]) => {
    b.addEventListener('pointerenter', () => { if (!pinned) hi(k); });
    b.addEventListener('pointerleave', () => { if (!pinned) hi(null); });
    b.addEventListener('focus', () => { if (!pinned) hi(k); });
    b.addEventListener('blur', () => { if (!pinned) hi(null); });
    b.addEventListener('click', () => {
      pinned = pinned === k ? null : k;
      Object.entries(btns).forEach(([n, x]) => x.setAttribute('aria-pressed', String(n === pinned)));
      hi(pinned || k);
      if (pinned) send(k);
      say(pinned ? `${N[k][3](core)} Ligações em destaque.` : 'Todas as ligações à mostra.');
    });
  });
  const unpin = () => { pinned = null; Object.values(btns).forEach(x => x.setAttribute('aria-pressed', 'false')); hi(null); };
  const draw = () => {
    timers.forEach(clearTimeout); timers = [];
    links.forEach(l => {
      l.len = l.base.getTotalLength();
      l.base.style.transition = 'none'; l.base.style.strokeDasharray = l.len; l.base.style.strokeDashoffset = l.len;
      l.flow.style.transition = 'none'; l.flow.style.opacity = '0';
    });
    void svg.getBoundingClientRect();
    links.forEach((l, i) => {
      l.base.style.transition = `stroke-dashoffset 900ms var(--ease-halo) ${300 + i * 170}ms`;
      l.base.style.strokeDashoffset = '0';
      l.flow.style.transition = `opacity 600ms var(--ease-halo) ${1100 + i * 170}ms`;
      l.flow.style.opacity = '';
    });
    timers.push(setTimeout(() => links.forEach(l => { l.base.style.transition = ''; l.base.style.strokeDasharray = ''; l.base.style.strokeDashoffset = ''; l.flow.style.transition = ''; }), 2400));
  };
  if (!REDUCED) links.forEach(l => { l.len = l.base.getTotalLength(); l.base.style.strokeDasharray = l.len; l.base.style.strokeDashoffset = l.len; l.flow.style.opacity = '0'; });
  return {
    start: draw,
    replay() { unpin(); draw(); },
    fields: [
      { k: 'core', t: 'text', l: 'Nó central', v: CORE, max: 14 },
      { k: 'acc', t: 'color', l: 'Cor', v: '#c9a6ff' },
      { k: 'speed', t: 'range', l: 'Velocidade', v: 100, min: 25, max: 300, step: 25, fmt: v => v + '%' },
      { k: 'curve', t: 'toggle', l: 'Curvas', v: true }
    ],
    set(k, v) {
      if (k === 'core') {
        core = String(v).trim() || CORE;
        btns.motor.textContent = core;
        if (pinned) cap.textContent = N[pinned][3](core);
      }
      else if (k === 'acc') vtAccent(card, v);
      else if (k === 'speed') { speed = v / 100; card.style.setProperty('--vt-fs', speed.toFixed(2)); }
      else if (k === 'flow') card.classList.toggle('no-flow', !v);
      else if (k === 'curve') {
        if (curve === v) return;
        curve = v;
        links.forEach(l => { const d = path(l.a, l.b); l.base.setAttribute('d', d); l.flow.setAttribute('d', d); l.len = l.base.getTotalLength(); });
      }
    },
    /* o padrão: nenhum nó fixado, palco sem escurecer */
    reset: unpin
  };
};
