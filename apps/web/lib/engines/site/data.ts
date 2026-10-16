/* ==========================================================================
   SITE · dados do Produto (modelos prontos e gravação do Estúdio) e da
   Linha do tempo. Porte de prototype/src/js/36-produto.js.
   Puro: sem DOM, serve à marcação pré-renderizada e aos motores.
   ========================================================================== */
import type { Slide } from '@/lib/slides';

export interface ProductModel {
  /** nome do modelo */
  n: string;
  /** cor de destaque do cartão */
  ac: string;
  /** efeitos que o modelo já traz */
  fx: string[];
  /** slide de capa mostrado na miniatura */
  s: Slide;
}

export const PD_MODELS: ProductModel[] = [
  { n: 'Kickoff de projeto', ac: '#8b3dff', fx: ['Timeline Motion', 'Reveal'], s: { type: 'tl', k: 'Kickoff', h: 'Do kickoff à entrega.', ms: [['S1', 'Kickoff', .1], ['S4', 'Desenho', .37], ['S8', 'Piloto', .63], ['S12', 'Entrega', .9]] } },
  { n: 'Aula e treinamento', ac: '#a970ff', fx: ['Animated Typography', 'Votação'], s: { type: 'steps', k: 'Aula 4', h: 'Três ideias para levar.', s: [['01', 'Ver', 'O olhar decide rápido'], ['02', 'Sentir', 'A emoção segura'], ['03', 'Lembrar', 'A imagem fica']] } },
  { n: 'Relatório executivo', ac: '#6420cc', fx: ['Counter', 'Chart Build'], s: { type: 'kpi', k: 'Resultados', h: 'O trimestre em um número.', big: '+32%', cap: 'de leitura completa dos materiais', unit: '%', bars: [[41, 'T1'], [52, 'T2'], [61, 'T3'], [68, 'T4']] } },
  { n: 'Workshop', ac: '#b791ff', fx: ['Post-its', 'Cronômetro'], s: { type: 'next', k: 'Workshop', h: 'O que não pode faltar?', items: ['Escreva um post-it', 'Vote nas três melhores', 'Combine o próximo passo'], cta: '10 min no cronômetro' } },
  { n: 'Apresentação institucional', ac: '#7a33eb', fx: ['Parallax', 'Glow'], s: { type: 'text', k: 'Quem somos', h: 'Uma história que se vê.', p: ['Missão, números e pessoas em poucos slides.', 'Imagem dominante em cada página.'] } },
  { n: 'Abertura de evento', ac: '#c9a6ff', fx: ['Particle System', 'Shader'], s: { type: 'cover', k: 'Evento 2027', h: 'Bem-vindos.', sub: 'Abertura · auditório principal' } },
  { n: 'Roadmap do ano', ac: '#8752f5', fx: ['Connector', 'Spotlight'], s: { type: 'tl', k: 'Roadmap', h: 'Quatro ondas, um ano.', ms: [['T1', 'Base', .1], ['T2', 'Escala', .37], ['T3', 'Dados', .63], ['T4', 'IA', .9]] } },
  { n: 'Onboarding de time', ac: '#9f70ff', fx: ['Card Stack', 'Flip Card'], s: { type: 'steps', k: 'Boas-vindas', h: 'Sua primeira semana.', s: [['01', 'Conhecer', 'Pessoas e rituais'], ['02', 'Fazer', 'Primeira entrega'], ['03', 'Contar', 'O que aprendeu']] } },
  { n: 'Pesquisa ao vivo', ac: '#5a35a8', fx: ['Votação', 'Counter'], s: { type: 'kpi', k: 'Ao vivo', h: 'A sala respondeu.', big: '87%', cap: 'votaram pela frente de design', unit: '%', bars: [[22, 'A'], [48, 'B'], [87, 'C'], [35, 'D']] } },
  { n: 'Retrospectiva', ac: '#cfb3ff', fx: ['Post-its', 'Matriz'], s: { type: 'next', k: 'Retro', h: 'O que levamos daqui?', items: ['O que funcionou', 'O que mudar', 'Quem puxa o quê'], cta: 'Votação em 3 min' } },
];

/* Gravação do Estúdio: trilho com os quatro primeiros modelos, o terceiro aberto no palco */
export const REC_RAIL = PD_MODELS.slice(0, 4);
export const REC_OPEN = 2;
/** resultado da importação ("depois") na terceira cena da gravação */
export const REC_AFTER: Slide = { type: 'cover', k: 'Plano 2027', h: 'Plano 2027 em 12 semanas.', sub: 'Importado de apresentacao-antiga.pptx' };
/** endereço mostrado na barra do navegador em cada cena */
export const REC_URLS = ['estudio.halor · Kickoff 2027', 'estudio.halor · Salvar como', 'estudio.halor · Importar arquivo'] as const;

/* Linha do tempo · como a apresentação era em cada época */
export interface EvoStop {
  /** rótulo curto no trilho */
  yr: string;
  /** ano por extenso no palco */
  y: string;
  t: string;
  d: string;
  /** o que quem assiste faz */
  who: string;
  /** atenção da plateia, de 0 a 1 */
  a: number;
  now?: boolean;
  next?: boolean;
}

export const EVO: EvoStop[] = [
  { yr: '2016', y: '2016', t: 'Slides estáticos', d: 'Tópicos em sequência e PDF por e-mail. Quem recebe lê sozinho.', who: 'Lê sozinho', a: .16 },
  { yr: '2018', y: '2018', t: 'Na nuvem', d: 'Várias pessoas editam ao mesmo tempo. O arquivo vira link.', who: 'Comenta', a: .28 },
  { yr: '2020', y: '2020', t: 'Tela compartilhada', d: 'Tudo por vídeo. A atenção disputa espaço com dez abas abertas.', who: 'Divide a atenção', a: .2 },
  { yr: '2022', y: '2022', t: 'Modelos prontos', d: 'Design em minutos, mas muita apresentação com a mesma cara.', who: 'Reconhece o modelo', a: .34 },
  { yr: '2024', y: '2024', t: 'Gerado por IA', d: 'Slides a partir de um texto. Rápido, porém ainda parado.', who: 'Recebe pronto', a: .42 },
  { yr: '2026', y: '2026', t: 'HTML vivo e lúdico', d: 'Com o Halor, a apresentação se move, responde e convida a participar. Sem código.', who: 'Participa', a: .88, now: true },
  { yr: 'Próximos', y: 'Próximos anos', t: 'Apresentação que conversa', d: 'Ela se adapta a quem assiste, tira dúvidas e mede a atenção ao vivo.', who: 'Conversa', a: 1, next: true },
];
