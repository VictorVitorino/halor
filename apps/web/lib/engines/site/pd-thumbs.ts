/* ==========================================================================
   SITE · Produto · miniaturas dos modelos prontos. Cada uma é um slide 16:9
   de verdade com o efeito vivo montado em CSS/SVG (Motion Graphics, Icon
   Motion, Glow / Light Sweep, Hologram 3D Cards, Reveal / Mask Reveal,
   Progress Motion, Data Highlight, BPMN Flow Motion, Connector / Flow Line e
   Animated Shader). Renderizador próprio, independente de lib/slides.ts.
   Porte literal de prototype/src/js/36-produto.js (pdThumbHTML): mesmas strings.
   Puro: sem DOM, roda no servidor (pré-renderização) e no cliente.
   ========================================================================== */
import type { PdThumbId } from './data';

/* curvas de nível onduladas do "shader" (fechadas, suavizadas por Catmull-Rom; geradas uma vez e congeladas) */
export const PD_SH_PATHS: readonly string[] = [
  'M259.6 92C261.1 93.9 263.3 96.7 263 98.7C262.7 100.7 260.1 102.9 257.8 104.1C255.6 105.3 251.9 105.5 249.4 106.1C246.9 106.7 244.9 107.2 242.6 107.6C240.4 108.1 238.2 108.7 236 108.7C233.8 108.7 231.6 108.1 229.4 107.6C227.1 107.2 225.1 106.7 222.6 106.1C220.1 105.5 216.4 105.3 214.2 104.1C211.9 102.9 209.3 100.7 209 98.7C208.7 96.7 210.9 93.9 212.4 92C213.9 90.1 216.9 89.1 218.1 87.6C219.3 86 219 84.7 219.6 82.9C220.2 81.2 220.3 78.5 221.7 76.9C223.1 75.4 225.7 74.1 228.1 73.4C230.5 72.7 233.4 72.7 236 72.7C238.6 72.7 241.5 72.7 243.9 73.4C246.3 74.1 248.9 75.4 250.3 76.9C251.7 78.5 251.8 81.2 252.4 82.9C253 84.7 252.7 86 253.9 87.6C255.1 89.1 258.1 90.1 259.6 92Z',
  'M283.9 92C285.3 95.9 288 100.8 287 104.6C286.1 108.5 282.5 113.2 278.1 115.3C273.6 117.4 265.4 117 260.2 117.4C255.1 117.9 251 116.6 247 117.8C243 119 240.5 122.7 236 124.6C231.5 126.5 225.2 129.4 220.1 129.3C215.1 129.2 209.6 126.4 205.7 123.8C201.9 121.2 199.4 117.1 197 113.6C194.5 110.2 191.9 106.8 191 103.1C190.2 99.5 190.4 95.4 191.8 92C193.3 88.6 197.5 85.9 199.5 83C201.5 80 202.5 77.8 203.6 74C204.7 70.3 203.6 64.5 206.1 60.6C208.6 56.8 213.6 52.1 218.6 51C223.5 50 231 52.5 236 54.4C241 56.3 244.6 60.4 248.6 62.5C252.5 64.6 256 65.4 259.8 67C263.6 68.6 268.3 69.9 271.4 72.4C274.6 74.8 276.5 78.2 278.6 81.5C280.6 84.7 282.5 88.1 283.9 92Z',
  'M311.6 92C309.5 97.8 304.1 103 300.4 108C296.7 112.9 293.9 117.8 289.4 121.6C284.8 125.4 278.8 128.6 273 130.8C267.1 133 260.4 132.8 254.2 134.7C248 136.7 243.2 139.8 236 142.4C228.8 145 219.1 150.5 211.1 150.6C203 150.6 192.7 147.3 187.8 142.5C183 137.8 183.1 128 182.2 121.8C181.4 115.6 184 110.2 182.8 105.2C181.5 100.2 176.8 96.9 174.7 92C172.6 87.1 169.6 81 170.2 75.7C170.9 70.4 174.9 65.1 178.6 60.2C182.3 55.3 187 50.5 192.5 46.4C198.1 42.2 204.7 36.8 211.9 35.4C219.2 34 229.1 35.4 236 38C242.9 40.6 248 47.9 253.4 51.3C258.7 54.6 261.7 56.6 268.3 58.1C274.9 59.6 285.5 58 292.9 60.4C300.4 62.9 309.8 67.7 312.9 72.9C316 78.2 313.7 86.2 311.6 92Z',
  'M337.7 92C332.9 99.4 318.4 105.2 311.2 110.6C304 116 298.6 118.6 294.5 124.4C290.5 130.3 291.7 139.1 287 145.6C282.3 152 274.9 159.8 266.4 163.4C257.9 166.9 246.1 166.7 236 166.7C225.9 166.6 215.4 165.3 205.8 163C196.2 160.6 185 157.8 178.5 152.4C171.9 147 168.3 137.8 166.5 130.5C164.6 123.3 169.1 115.4 167.3 109C165.6 102.6 160.8 98.9 156 92C151.1 85.1 139.8 76 138.3 67.8C136.9 59.6 140.5 48.7 147.5 43C154.5 37.2 169.7 35.3 180.2 33.4C190.7 31.5 200.9 32.4 210.2 31.6C219.5 30.7 227.4 28.1 236 28.1C244.6 28 253.7 29.1 261.9 31.1C270.1 33.2 276.7 37.3 285.3 40.3C293.9 43.2 304.3 44.7 313.5 49.1C322.6 53.4 336.1 59 340.2 66.2C344.2 73.3 342.5 84.6 337.7 92Z',
  'M349.8 92C347.2 100.6 338.3 108.8 331.8 115.8C325.4 122.7 316.4 126.2 311.3 133.7C306.3 141.2 307.1 151.3 301.5 160.8C296 170.3 289 185.5 278.1 190.9C267.2 196.3 248.6 196.7 236 193.3C223.4 189.9 212.1 177.3 202.6 170.4C193.1 163.6 187.4 157.2 178.9 152C170.4 146.7 159.3 144.5 151.5 138.8C143.6 133.1 136.5 125.6 131.7 117.8C127 110 125.8 101.2 123.2 92C120.6 82.8 115.6 72.3 116.4 62.4C117.2 52.4 119.4 39.1 128 32.2C136.7 25.3 155 21.9 168.4 21C181.7 20.1 196.8 26.6 208.1 26.5C219.4 26.5 225.3 23.9 236 20.5C246.7 17.1 259.9 7.5 272.6 6.1C285.3 4.7 301.7 7 312.1 12.2C322.4 17.4 328.9 28.6 334.8 37.3C340.6 46 344.7 55.3 347.2 64.4C349.7 73.6 352.3 83.4 349.8 92Z'
];

/* miniatura de cada modelo: um slide 16:9 de verdade, com o efeito vivo */
export function pdThumbHTML(id: PdThumbId): string {
  const foot = (dark: number, n: string) => `<div class="pd-th-ft"><b><svg aria-hidden="true"><use href="${dark ? '#hl-mark' : '#hl-mark-paper'}"/></svg>halor</b><span>${n}</span></div>`;
  switch (id) {
    case 'mg': return `<div class="pd-th pd-th-dark pd-th-mg"><span class="pd-th-grid"></span>
<div class="pd-mg-orb"><svg viewBox="0 0 100 100" aria-hidden="true"><circle class="pd-mg-c1" cx="50" cy="50" r="45" pathLength="1"/><circle class="pd-mg-c2" cx="50" cy="50" r="35"/></svg><b>KICKOFF</b><i class="pd-mg-sq"></i></div>
<div class="pd-mg-copy"><p class="pd-th-k"><i></i>Capítulo 01 · Kickoff</p><p class="pd-th-h"><span>Do kickoff à</span> <span>entrega em</span> <em>12 semanas.</em></p><span class="pd-mg-rule"></span>
<div class="pd-mg-kpis"><div><b>12</b><span>semanas</span><i></i></div><div><b>4</b><span>frentes</span><i></i></div><div><b>1</b><span>time</span><i></i></div></div></div>
<div class="pd-mg-track"><i></i><i></i><i></i><i></i></div>${foot(1, '01')}</div>`;
    case 'ic': {
      const ic: [string, string, string][] = [
        ['Ver', 'O olhar decide rápido', '<path class="pd-ic-eye" pathLength="1" d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle class="pd-ic-pupil" pathLength="1" cx="12" cy="12" r="3"/>'],
        ['Sentir', 'A emoção segura a atenção', '<path class="pd-ic-heart" pathLength="1" d="M12 19.5s-7.5-4.6-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.4-7.5 10-7.5 10z"/>'],
        ['Lembrar', 'A imagem fica na memória', '<path pathLength="1" d="M9 17.5h6M10 20.5h4"/><path pathLength="1" d="M12 3.5a5.5 5.5 0 0 0-3.2 10c.7.5 1.2 1.3 1.2 2.2v.3h4v-.3c0-.9.5-1.7 1.2-2.2A5.5 5.5 0 0 0 12 3.5z"/><path class="pd-ic-ray" pathLength="1" d="M3 9.5h1.5M19.5 9.5H21M5.2 3.6l1 1M18.8 3.6l-1 1"/>']
      ];
      return `<div class="pd-th pd-th-light pd-th-ic"><span class="pd-th-grid"></span><p class="pd-th-k">Aula 4 · Design de atenção</p><p class="pd-th-h">Três ideias para levar.</p>
<div class="pd-ic-row">${ic.map((t, i) => `<div class="pd-ic-t" style="--i:${i}"><span class="pd-ic-i"><svg viewBox="0 0 24 24" aria-hidden="true">${t[2]}</svg></span><b>${t[0]}</b><small>${t[1]}</small></div>`).join('')}</div>${foot(0, '04')}</div>`;
    }
    case 'gl': return `<div class="pd-th pd-th-light pd-th-gl"><span class="pd-th-grid"></span><p class="pd-th-k">Relatório executivo · 3º trimestre</p><p class="pd-th-h">O trimestre em um número.</p>
<div class="pd-gl-kpi"><small>Leitura completa</small><b class="pd-gl-n"><span class="pd-gl-cnt"></span>%</b><span class="pd-gl-sub">+32 pontos sobre o trimestre anterior</span><i class="pd-gl-bar"><i></i></i><span class="pd-gl-sweep"></span></div>
<div class="pd-gl-tiles"><div style="--v:62%"><small>Tempo médio</small><b>7 min</b><i></i></div><div style="--v:78%"><small>Votos na sala</small><b>1.240</b><i></i></div><div style="--v:68%"><small>Adoção</small><b>68%</b><i></i></div><div style="--v:45%"><small>Compartilhado</small><b>312×</b><i></i></div></div>${foot(0, '07')}</div>`;
    case 'ho': return `<div class="pd-th pd-th-dark pd-th-ho"><span class="pd-th-grid"></span><span class="pd-ho-floor"></span>
<span class="pd-ho-note n1">Prazo</span><span class="pd-ho-note n2">Cliente</span><span class="pd-ho-note n3">Dados</span>
<div class="pd-ho-scene"><div class="pd-ho-card pd-ho-b2"></div><div class="pd-ho-card pd-ho-b1"></div>
<div class="pd-ho-card pd-ho-front"><p class="pd-ho-k">Workshop · Ideação<i></i></p><p class="pd-ho-h">O que não pode faltar?</p>
<div class="pd-ho-stats"><div><b>24</b><span>ideias</span></div><div><b>6</b><span>grupos</span></div><div><b>10</b><span>minutos</span></div></div>
<p class="pd-ho-ft"><span>Votação aberta</span><span>Rodada 2</span></p><span class="pd-ho-sheen"></span></div></div></div>`;
    case 'rv': return `<div class="pd-th pd-th-light pd-th-rv"><span class="pd-th-grid"></span><div class="pd-rv-copy"><p class="pd-th-k">Quem somos</p>
<p class="pd-th-h"><span><i>Uma história</i></span><span><i>que se vê.</i></span></p><p class="pd-rv-p">Missão, números e pessoas em poucos slides.</p>
<div class="pd-rv-nums"><div><b>12</b><span>anos</span></div><div><b>340</b><span>pessoas</span></div><div><b>9</b><span>cidades</span></div></div></div>
<div class="pd-rv-img"><span class="pd-rv-pic a"></span><span class="pd-rv-pic b"><i></i><i></i><i></i></span><span class="pd-rv-cur"></span><span class="pd-rv-cap">Nossa casa</span></div>${foot(0, '02')}</div>`;
    case 'pg': {
      const bars: [string, number][] = [['Conhecer o time', 100], ['Ferramentas', 80], ['Primeira entrega', 60], ['Feedback', 30]];
      return `<div class="pd-th pd-th-light pd-th-pg"><span class="pd-th-grid"></span><p class="pd-th-k">Boas-vindas · semana 1</p><p class="pd-th-h">Sua primeira semana.</p>
<div class="pd-pg-gauge"><span class="pd-pg-ring"></span><b><span class="pd-pg-cnt"></span>%</b><small>da trilha</small></div>
<div class="pd-pg-bars">${bars.map((b, i) => `<div style="--v:${b[1]}%;--i:${i}"><span>${b[0]}</span><b>${b[1]}%</b><i><i></i></i></div>`).join('')}</div>${foot(0, '05')}</div>`;
    }
    case 'dh': {
      const bars: [string, number][] = [['Design', 38], ['Dados', 32], ['Vendas', 22], ['RH', 16], ['TI', 12], ['Jurídico', 8]];
      return `<div class="pd-th pd-th-light pd-th-dh"><span class="pd-th-grid"></span><p class="pd-th-k"><i></i>Pesquisa ao vivo · 128 votos</p><p class="pd-th-h">A sala respondeu.</p>
<div class="pd-dh-chart">${bars.map((b, i) => `<div class="pd-dh-b${i < 3 ? ' top' : ''}${i === 5 ? ' low' : ''}" style="--h:${Math.round(b[1] / 38 * 100)};--i:${i}"><em>${b[1]}</em><i></i><span>${b[0]}</span></div>`).join('')}
<span class="pd-dh-brk"></span><div class="pd-dh-call a"><b>3 frentes somam 72%</b><span>Design, Dados e Vendas</span></div><div class="pd-dh-call b"><b>Jurídico pede atenção</b><span>só 6% dos votos</span></div></div>${foot(0, '09')}</div>`;
    }
    case 'bp': return `<div class="pd-th pd-th-light pd-th-bp"><span class="pd-th-grid"></span><p class="pd-th-k">Processo · atendimento</p><p class="pd-th-h">Do pedido à entrega.</p>
<div class="pd-bp-st"><span class="s0">Pedido recebido</span><span class="s1">Elegível? Sim</span><span class="s2">Em análise</span><span class="s3">Entregue</span></div>
<svg class="pd-bp-svg" viewBox="0 0 320 180" aria-hidden="true"><defs><marker id="pd-bp-ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5 0 10z" fill="#9b8fc4"/></marker></defs>
<rect class="pd-bp-pool" x="12" y="58" width="296" height="100" rx="6"/><path class="pd-bp-lane" d="M18 58H30V158H18A6 6 0 0 1 12 152V64A6 6 0 0 1 18 58Z"/><line class="pd-bp-sep" x1="30" y1="108" x2="308" y2="108"/>
<text class="pd-bp-ll" transform="translate(23.5 83) rotate(-90)">CLIENTE</text><text class="pd-bp-ll" transform="translate(23.5 133) rotate(-90)">OPERAÇÃO</text>
<path class="pd-bp-no" d="M150 72V65H92V71"/>
<path class="pd-bp-f f0" d="M51 83H65"/><path class="pd-bp-f f1" d="M118 83H138"/><path class="pd-bp-f f2" d="M150 94V133H165"/><path class="pd-bp-f f3" d="M218 133H229"/><path class="pd-bp-f f4" d="M282 133H288"/>
<g class="pd-bp-n n0"><circle cx="44" cy="83" r="7"/></g>
<g class="pd-bp-n n1"><rect x="66" y="71" width="52" height="24" rx="5"/><text x="92" y="86">Pedido</text></g>
<g class="pd-bp-n n2"><path d="M150 72L161 83 150 94 139 83z"/><text x="150" y="86">?</text></g>
<g class="pd-bp-n n3"><rect x="166" y="121" width="52" height="24" rx="5"/><text x="192" y="136">Análise</text></g>
<g class="pd-bp-n n4"><rect x="230" y="121" width="52" height="24" rx="5"/><text x="256" y="136">Entrega</text></g>
<g class="pd-bp-n n5"><circle cx="296" cy="133" r="7"/></g>
<text class="pd-bp-yes" x="155" y="106">sim</text><text class="pd-bp-yes" x="100" y="63.5">ajustar</text>
<circle class="pd-bp-tok" r="5.5" cx="0" cy="0"/>
</svg>${foot(0, '06')}</div>`;
    case 'cn': {
      const P = ['M64 108C78 108 74 80 88 80', 'M64 108C78 108 74 136 88 136', 'M140 80C154 80 154 108 168 108', 'M140 136C154 136 154 108 168 108', 'M220 108H252'];
      const nodes: [string, string, number, number][] = [['T1', 'Base', 12, 96], ['T2', 'Escala', 88, 68], ['T2', 'Pessoas', 88, 124], ['T3', 'Dados', 168, 96], ['T4', 'IA', 252, 96]];
      return `<div class="pd-th pd-th-dark pd-th-cn"><span class="pd-th-grid"></span><p class="pd-th-k">Roadmap 2027</p><p class="pd-th-h">Quatro ondas, um ano.</p>
<svg class="pd-cn-svg" viewBox="0 0 320 180" aria-hidden="true">
${P.map((d, i) => `<path class="pd-cn-l" style="--i:${i}" pathLength="1" d="${d}"/><path class="pd-cn-flow" style="--i:${i}" d="${d}"/>`).join('')}
${P.map((d, i) => `<circle class="pd-cn-pk" style="--i:${i}" r="2.4"><animateMotion dur="${(2 + i * .25).toFixed(2)}s" begin="${(i * .35).toFixed(2)}s" repeatCount="indefinite" path="${d}"/></circle>`).join('')}
${nodes.map((n, i) => `<g class="pd-cn-n${i === 4 ? ' end' : ''}" style="--i:${i}"><rect x="${n[2]}" y="${n[3]}" width="52" height="24" rx="6"/><text class="pd-cn-t" x="${n[2] + 7}" y="${n[3] + 10}">${n[0]}</text><text x="${n[2] + 7}" y="${n[3] + 19}">${n[1]}</text></g>`).join('')}
</svg>${foot(1, '03')}</div>`;
    }
    case 'sh': return `<div class="pd-th pd-th-dark pd-th-sh"><div class="pd-sh-fx"><span class="pd-sh-blob a"></span><span class="pd-sh-blob b"></span><span class="pd-sh-blob c"></span>
<svg class="pd-sh-lines" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><g>${PD_SH_PATHS.map((d, i) => `<path class="pd-sh-base" d="${d}"/><path class="pd-sh-hot" style="--i:${i}" pathLength="1" d="${d}"/>`).join('')}</g></svg></div>
<div class="pd-sh-copy"><p class="pd-th-k">Evento 2027 · Abertura</p><p class="pd-th-h">Bem-vindos ao próximo capítulo.</p><span class="pd-sh-rule"></span><p class="pd-sh-sub"><i></i>Auditório principal · 9h</p></div>${foot(1, '01')}</div>`;
  }
  return '';
}
