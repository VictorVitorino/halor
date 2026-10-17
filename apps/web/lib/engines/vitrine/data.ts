/* ==========================================================================
   VITRINE · dados dos 40 efeitos
   Porte de VT_INTENT e VT_FX (prototype/src/js/37-vitrine.js). Módulo puro:
   serve ao catálogo renderizado no servidor e ao motor no navegador.
   ========================================================================== */

export type VtIntent =
  | 'abertura' | 'ritmo' | 'foco' | 'detalhe' | 'relacao'
  | 'magnitude' | 'tempo' | 'comparacao' | 'processo';

/** Rótulo de cada intenção, igual ao texto do chip. */
export const VT_INTENT: Record<VtIntent, string> = {
  abertura: 'Abrir com impacto', ritmo: 'Dar ritmo', foco: 'Focar o olhar', detalhe: 'Mostrar detalhe', relacao: 'Relacionar',
  magnitude: 'Dar peso a números', tempo: 'Contar no tempo', comparacao: 'Comparar', processo: 'Explicar processo'
};

export type VtDose = 1 | 2 | 3;
/** [número, nome, família, intenções (separadas por espaço), dose de movimento (1 a 3), resumo] */
export type VtFx = readonly [n: number, name: string, family: string, intents: string, dose: VtDose, summary: string];

export const VT_FX: readonly VtFx[] = [
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

/** Itens do catálogo à mostra antes de abrir; o botão + mostra os outros ali mesmo. */
export const VT_SHOW = 8;

/**
 * Efeitos com demonstração ao vivo e editável no palco. Espelha o `data-fx` dos cards em
 * components/site/Vitrine.tsx: no catálogo esses itens ganham o selo "Ao vivo" e levam até o card.
 */
export const VT_LIVE: ReadonlySet<number> = new Set([30, 3, 4, 11, 12, 6, 24, 33, 16, 15, 21, 37, 35, 18]);

/** Texto e rótulo do botão + do catálogo para N itens filtrados (aberto ou não). */
export const vtMoreText = (n: number, open: boolean) => open ? 'Mostrar menos' : `${n - VT_SHOW} efeitos`;
export const vtMoreLabel = (n: number, open: boolean) => open ? 'Mostrar menos efeitos no catálogo' : `Ver mais ${n - VT_SHOW} efeitos no catálogo`;

/* · O que o clique numa prévia fez, dito ao leitor de tela (a prévia é decorativa) ·
   Espelha VT_MINI_SAY do protótipo. cyc: um texto por estado · pick/net: (índice, aceso?, vizinhos) => texto ·
   os demais: um texto. Sem entrada: "a prévia rodou de novo". */
const ord = (i: number) => ['primeiro', 'segundo', 'terceiro', 'quarto'][i] || `${i + 1}º`;
type MiniSay = string | readonly string[] | ((i: number, on: boolean, nb: number) => string);
export const VT_MINI_SAY: Readonly<Record<number, MiniSay>> = {
  4: ['camadas juntas', 'camadas afastadas, com mais profundidade'],
  5: (i, on) => on ? `${ord(i)} card elevado` : 'todos os cards no chão',
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
  36: (i, on) => on ? `${ord(i)} detalhe aberto` : 'detalhes fechados',
  38: ['marco 1 de 4', 'marco 2 de 4', 'marco 3 de 4', 'marco 4 de 4'],
  39: (i, on, nb) => on ? `nó ${i + 1} aceso com ${nb} vizinhos` : 'rede em repouso'
};
export function vtMiniSay(n: number, name: string, s = 0, on = false, nb = 0) {
  const t = VT_MINI_SAY[n];
  const what = typeof t === 'function' ? t(s, on, nb) : Array.isArray(t) ? t[s] : (t as string | undefined) || 'a prévia rodou de novo';
  return `${name}: ${what}.`;
}
