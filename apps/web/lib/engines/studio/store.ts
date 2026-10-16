/* ==========================================================================
   Estúdio · estado compartilhado pelas sub-telas e dados de exemplo.
   O estado vive no módulo: navegar entre /estudio, /editor, /apresentar e /admin
   mantém a apresentação aberta, as edições e o histórico durante a sessão.
   Porte de prototype/src/js/50-studio.js (STUDIO, LAYOUTS, LAYER_KINDS, ACERVO, TPLS, SIGNALS, PEOPLE…).
   ========================================================================== */
import { DECK, type FontKey, type LayerKind, type Slide, type SlideType } from '@/lib/slides';
import { clone } from './util';

export type AcvFilter = 'todas' | 'minhas' | 'time' | 'lixeira';
export type AcvSort = 'recentes' | 'indice' | 'vistas' | 'titulo';
export type InspTab = 'design' | 'anim' | 'halor';
export type AdmTab = 'users' | 'invite' | 'audit' | 'config' | 'sum';

export interface StudioState {
  /** apresentação aberta, título, slide atual no editor e no palco */
  deck: Slide[]; title: string; cur: number; stage: number;
  /** seleção: 'title', id de camada ou nada */
  sel: string | null;
  undo: string[]; redo: string[];
  /** Raio Halor ligado */
  ray: boolean;
  /** acervo: aba, ordem e busca */
  acv: AcvFilter; sort: AcvSort; q: string;
  /** próximo id de camada */
  lid: number;
  /** memória de interface da sessão: aba do inspetor, aba da administração e notificações vistas */
  insp: InspTab; adm: AdmTab; bellSeen: boolean;
}

/** O Kickoff de exemplo: cópia do DECK, para que as edições no Estúdio não vazem para as prévias do site. */
export const KICKOFF: Slide[] = clone(DECK);

export const STUDIO: StudioState = {
  deck: KICKOFF, title: 'Kickoff 2027 · Time de produto', cur: 2, stage: 2, sel: 'title', undo: [], redo: [], ray: false,
  acv: 'todas', sort: 'recentes', q: '', lid: 1, insp: 'halor', adm: 'users', bellSeen: false,
};

export const curSlide = () => STUDIO.deck[STUDIO.cur];
export const selLayer = () => (STUDIO.sel && STUDIO.sel !== 'title') ? (curSlide().layers || []).find(l => l.id === STUDIO.sel) || null : null;

/* Moldes de slide para inserir */
export type LayoutKey = 'text' | 'kpi' | 'steps' | 'poll' | 'tl' | 'table' | 'next' | 'end';
export interface LayoutDef { n: string; ic: string; s: () => Slide }
export const LAYOUTS: Record<LayoutKey, LayoutDef> = {
  text: { n: 'Texto e imagem', ic: '#i-image', s: () => ({ type: 'text', k: 'Seção', h: 'Uma ideia por slide.', p: ['Escreva aqui o ponto principal.', 'Uma frase curta segura mais o olhar.'] }) },
  kpi: { n: 'Número em destaque', ic: '#i-bars', s: () => ({ type: 'kpi', k: 'Resultado', h: 'Um número que muda tudo.', big: '17 s', cap: 'de olhar médio por slide, antes eram 9 s', unit: ' s', bars: [[9, 'Antes'], [12, 'Mês 1'], [15, 'Mês 2'], [17, 'Agora']] }) },
  steps: { n: 'Cards em etapas', ic: '#i-cards', s: () => ({ type: 'steps', k: 'Em três passos', h: 'Ver, sentir, lembrar.', s: [['01', 'Ver', 'O olhar para'], ['02', 'Sentir', 'O olhar fica'], ['03', 'Lembrar', 'A ideia volta']] }) },
  poll: { n: 'Votação ao vivo', ic: '#i-vote', s: () => ({ type: 'poll', k: 'Votação ao vivo', h: 'O que a sala quer ver primeiro?', opts: [['Os números', 0], ['A história', 0], ['As pessoas', 0], ['O plano', 0]], code: 'H' + Math.floor(10 + Math.random() * 89) }) },
  tl: { n: 'Linha do tempo', ic: '#i-clock', s: () => ({ type: 'tl', k: 'Linha do tempo', h: 'Do primeiro olhar ao resultado.', ms: [['S1', 'Começo', .1], ['S4', 'Teste', .37], ['S8', 'Ajuste', .63], ['S12', 'Entrega', .9]] }) },
  table: { n: 'Tabela', ic: '#i-table', s: () => ({ type: 'table', k: 'Quem faz o quê', h: 'Cada frente com um dono.', head: ['Frente', 'Prazo', 'Quem'], rows: [['Conteúdo', '2 semanas', 'Marina'], ['Design', '3 semanas', 'Rafael'], ['Total', '5 semanas', '2 pessoas']] }) },
  next: { n: 'Lista com destaque', ic: '#i-check', s: () => ({ type: 'next', k: 'Para levar', h: 'Três coisas para lembrar.', items: ['Um destaque por slide', 'Uma pergunta para a sala', 'Um próximo passo claro'], cta: 'Próximo encontro em 15 dias' }) },
  end: { n: 'Encerramento', ic: '#i-spark', s: () => ({ type: 'end', h: 'Obrigado.', sub: 'marina@nortesistemas.com.br' }) },
};
export const isLayoutKey = (k: string): k is LayoutKey => k in LAYOUTS;

/* x e y: onde cada tipo nasce (em % do slide), longe do título e do rodapé */
export interface LayerKindDef { n: string; ic: string; w: number; h: number; x: number; y: number; fem?: boolean }
export const LAYER_KINDS: Record<LayerKind, LayerKindDef> = {
  text: { n: 'Texto', ic: '#i-text', w: 34, h: 11, x: 8, y: 76 },
  shape: { n: 'Forma', ic: '#i-shape', w: 13, h: 23.1, x: 80, y: 8, fem: true },
  arrow: { n: 'Seta', ic: '#i-arrowline', w: 18, h: 9, x: 46, y: 74, fem: true },
  image: { n: 'Imagem', ic: '#i-image', w: 26, h: 38, x: 68, y: 40, fem: true },
  icon: { n: 'Ícone', ic: '#i-spark', w: 7, h: 12.4, x: 70, y: 12 },
};
export const isLayerKind = (k: string): k is LayerKind => k in LAYER_KINDS;

export const PT_BASE: Partial<Record<SlideType, number>> = { cover: 56, end: 40 };
export const CQ_BASE: Partial<Record<SlideType, number>> = { cover: 5.6, end: 4 };
export const FONTS_K: Record<FontKey, string> = { ui: 'var(--f-ui)', display: 'var(--f-display)', mono: 'var(--f-mono)' };
export const SUGGEST: Record<string, string> = { 'Queremos dobrar a leitura completa dos nossos materiais até março.': 'Leitura completa em dobro.' };

/* ==========================================================================
   Início: acervo, modelos, sinais
   ========================================================================== */
export interface AcvItem {
  t: string; h: string; who: 'minhas' | 'time' | 'lixeira'; when: string; score: number; views: number;
  live?: boolean; key?: 'kickoff'; deck?: Slide[];
}
export const ACERVO: AcvItem[] = [
  { t: 'Kickoff 2027 · Time de produto', h: 'Plano 2027 em 12 semanas.', who: 'minhas', when: 'há 12 min', score: 86, views: 14, live: true, key: 'kickoff' },
  { t: 'Treinamento de líderes · Vale Verde', h: 'Liderar é dar ritmo.', who: 'minhas', when: 'ontem', score: 79, views: 9 },
  { t: 'Abertura do Summit · Atlas Energia', h: 'Energia que se vê.', who: 'time', when: 'há 2 dias', score: 91, views: 31 },
  { t: 'Status report executivo · Q3', h: 'Terceiro trimestre em uma página.', who: 'time', when: 'há 4 dias', score: 72, views: 6 },
  { t: 'Kickoff · Orion Varejo', h: 'Começamos segunda-feira.', who: 'minhas', when: 'semana passada', score: 84, views: 11 },
  { t: 'Aula aberta · Escola Aurora', h: 'Aprenda fazendo, em três rodadas.', who: 'time', when: 'semana passada', score: 88, views: 22 },
  { t: 'Rascunho antigo de workshop', h: 'Versão descartada.', who: 'lixeira', when: 'há 3 semanas', score: 41, views: 0 },
];

export interface Template { n: string; d: string; s: Slide }
export const TPLS: Template[] = [
  { n: 'Abertura de evento', d: '8 slides', s: { type: 'cover', k: 'Evento', h: 'Sua abertura, com luz própria.', sub: 'Auditório · data' } },
  { n: 'Workshop com votação', d: '10 slides', s: { type: 'poll', k: 'Votação ao vivo', h: 'Qual frente começa primeiro?', opts: [['Design', 23], ['Dados', 14], ['Treinamento', 9], ['Eventos', 4]], code: 'W12' } },
  { n: 'Status report executivo', d: '6 slides', s: { type: 'steps', k: 'Status', h: 'Onde estamos em três frentes.', s: [['01', 'No prazo', 'Frente de conteúdo'], ['02', 'Atenção', 'Frente técnica'], ['03', 'Concluído', 'Treinamento']] } },
  { n: 'Kickoff de projeto', d: '9 slides', s: { type: 'tl', k: 'Plano', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] } },
  { n: 'Aula e treinamento', d: '10 slides', s: { type: 'text', k: 'Aula 4', h: 'Aprenda fazendo, em três rodadas.', p: ['Pergunta, votação e post-its em cada bloco.'] } },
  { n: 'Em branco', d: 'com seu kit de marca', s: { type: 'end', h: 'Comece aqui.', sub: 'Kit de marca aplicado' } },
];

export interface Signal { r: number; h: string; w: string }
export const SIGNALS: Signal[] = [
  { r: 0, h: '<b>Grupo Aurora</b> abriu “Kickoff 2027” 3 vezes', w: 'há 12 min · Atenção' },
  { r: 1, h: 'O slide 3, Meta do trimestre, segurou o olhar por 41 s', w: 'há 40 min · Interesse' },
  { r: 2, h: '<b>Turma de líderes</b> votou 42 vezes na pergunta do slide 5', w: 'há 1 h · Curiosidade' },
  { r: 3, h: '<b>Vale Verde</b> comentou no slide 3: “Esse prazo inclui treinamento?”', w: 'há 2 h · Aproximação' },
  { r: 4, h: '<b>Grupo Aurora</b> compartilhou a apresentação com 2 pessoas', w: 'ontem · Confiança' },
  { r: 5, h: '<b>Atlas Energia</b> chamou você para apresentar de novo na terça', w: 'ontem · Parceria' },
];
export const SIG_FILL = ['#c4a6ff', '#b08aff', '#9c6cff', '#8b4ffa', '#7a33eb', '#6420cc', '#4a11a0'];
export const SIG_INK = ['#17112b', '#17112b', '#17112b', '#fff', '#fff', '#fff', '#fff'];

/* ==========================================================================
   Administração
   ========================================================================== */
export type PersonStatus = 'ativo' | 'convite' | 'suspenso';
export interface Person { n: string; m: string; role: string; st: PersonStatus; last: string; idx: number | null; av: string; sent?: string }
export const PEOPLE: Person[] = [
  { n: 'Marina Costa', m: 'marina@nortesistemas.com.br', role: 'Admin', st: 'ativo', last: 'agora', idx: 86, av: '' },
  { n: 'Rafael Lima', m: 'rafael@nortesistemas.com.br', role: 'Membro', st: 'ativo', last: 'há 1 h', idx: 81, av: 'av-2' },
  { n: 'Júlia Prado', m: 'julia@nortesistemas.com.br', role: 'Membro', st: 'ativo', last: 'ontem', idx: 77, av: 'av-3' },
  { n: 'Caio Mendes', m: 'caio@nortesistemas.com.br', role: 'Membro', st: 'convite', last: 'nunca entrou', idx: null, av: 'av-2' },
  { n: 'Beatriz Nunes', m: 'beatriz@nortesistemas.com.br', role: 'Membro', st: 'ativo', last: 'há 3 dias', idx: 69, av: 'av-3' },
  { n: 'Otávio Reis', m: 'otavio@nortesistemas.com.br', role: 'Membro', st: 'suspenso', last: 'há 2 meses', idx: 58, av: 'av-2' },
];
export const AUDIT: [string, string, string][] = [
  ['#i-palette', '<b>Marina Costa</b> travou o kit de marca do time', 'hoje, 09:40'],
  ['#i-download', '<b>Rafael Lima</b> baixou “Kickoff 2027” em HTML interativo', 'hoje, 08:15'],
  ['#i-present', '<b>Júlia Prado</b> apresentou “Aula aberta” para 38 pessoas', 'ontem, 19:30'],
  ['#i-lock', '<b>Otávio Reis</b> teve o acesso suspenso por Marina Costa', 'ontem, 18:02'],
  ['#i-mail', '<b>Caio Mendes</b> recebeu um convite para o time', 'ontem, 11:20'],
  ['#i-shield', 'Verificação em duas etapas ligada para todo o time', 'há 3 dias'],
];
/** nome, descrição e estado: o estado acompanha o que a pessoa liga e desliga na sessão */
export const CONFIG: [string, string, boolean][] = [
  ['Kit de marca travado', 'Ninguém troca cores e fontes fora do kit do time.', true],
  ['Plateia vota sem cadastro', 'Quem assiste entra com o código e vota na hora.', true],
  ['Verificação em duas etapas', 'Pede um código no celular a cada novo acesso.', true],
  ['Login único da empresa', 'Entrar com a conta Google ou Microsoft do time.', false],
  ['Links medidos expiram em 90 dias', 'Depois disso o endereço para de abrir sozinho.', false],
];
export const STATUS_CHIP: Record<PersonStatus, [string, string]> = { ativo: ['chip-ok', 'Ativo'], convite: ['chip-line', 'Convite pendente'], suspenso: ['chip-warn', 'Suspenso'] };

/* ==========================================================================
   Memória dos modais da casca (a casca some quando a pessoa sai do Estúdio)
   ========================================================================== */
export interface ShareInvite { ini: string; name: string; mail: string; perm: string }
export interface ImportItem { name: string; ok: boolean; pages: number; p: number }
export const SESSION: { shareOn: boolean; invites: ShareInvite[]; imports: ImportItem[]; added: number; exp: string } = {
  shareOn: true, invites: [], imports: [], added: 0, exp: 'link',
};
