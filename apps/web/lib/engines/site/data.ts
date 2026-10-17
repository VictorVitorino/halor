/* ==========================================================================
   SITE · dados do Produto: modelos prontos (cada um com o efeito vivo da
   miniatura) e as cenas da gravação do Estúdio.
   Porte de prototype/src/js/36-produto.js (PD_MODELS e REC_SCENES).
   Puro: sem DOM, serve à marcação pré-renderizada e aos motores.
   ========================================================================== */

/** id da miniatura (renderizador em pd-thumbs.ts) */
export type PdThumbId = 'mg' | 'ic' | 'gl' | 'ho' | 'rv' | 'pg' | 'dh' | 'bp' | 'cn' | 'sh';

export interface ProductModel {
  /** miniatura (e efeito) do modelo */
  id: PdThumbId;
  /** nome do modelo */
  n: string;
  /** para que serve, em uma frase */
  d: string;
  /** efeito principal (primeiro chip) e, se houver, o complemento */
  fx: string[];
  /** cor de destaque do cartão */
  ac: string;
}

export const PD_MODELS: ProductModel[] = [
  { id: 'mg', n: 'Kickoff de projeto', d: 'Escopo, prazo e time numa abertura que se monta diante da sala.', fx: ['Motion Graphics'], ac: '#8b3dff' },
  { id: 'ic', n: 'Aula e treinamento', d: 'Cada ideia ganha um ícone que se desenha e reage.', fx: ['Icon Motion'], ac: '#a970ff' },
  { id: 'gl', n: 'Relatório executivo', d: 'O número que importa, com brilho e contador.', fx: ['Glow / Light Sweep', 'Contador'], ac: '#7a33eb' },
  { id: 'ho', n: 'Workshop', d: 'Cartões em 3D que chamam a sala para participar.', fx: ['Hologram 3D Cards'], ac: '#b791ff' },
  { id: 'rv', n: 'Apresentação institucional', d: 'A história se revela em camadas, no tempo da fala.', fx: ['Reveal / Mask Reveal'], ac: '#9f70ff' },
  { id: 'pg', n: 'Onboarding de time', d: 'A primeira semana em barras que avançam.', fx: ['Progress Motion'], ac: '#8752f5' },
  { id: 'dh', n: 'Pesquisa ao vivo', d: 'O resultado acende o que importa no gráfico.', fx: ['Data Highlight'], ac: '#c9a6ff' },
  { id: 'bp', n: 'Processo e operação', d: 'Um sinal percorre o processo, etapa por etapa.', fx: ['BPMN Flow Motion'], ac: '#7040d6' },
  { id: 'cn', n: 'Roadmap do ano', d: 'As ondas do ano ligadas por linhas de fluxo.', fx: ['Connector / Flow Line'], ac: '#9c6cff' },
  { id: 'sh', n: 'Abertura de evento', d: 'Uma abertura de palco com luz em movimento.', fx: ['Animated Shader'], ac: '#cfb3ff' },
];

export interface RecScene {
  /** endereço mostrado na barra do navegador */
  url: string;
  /** duração da cena em ms (igual à das animações em 28-produto.css) */
  d: number;
  /** descrição da cena para leitores de tela */
  a: string;
}

/** gravação do Estúdio: monte e edite na própria apresentação, baixe, importe um modelo */
export const REC_SCENES: RecScene[] = [
  { url: 'estudio.halor · kickoff-2027.html', d: 8600, a: 'Cena 1 de 3: a apresentação montada em HTML e editada ali mesmo, no modo apresentação.' },
  { url: 'estudio.halor · Baixar apresentação', d: 6400, a: 'Cena 2 de 3: a apresentação baixada em HTML, pronta para apresentar. Também sai em PDF ou PPT.' },
  { url: 'estudio.halor · Importar arquivo', d: 7800, a: 'Cena 3 de 3: um PDF, PPT ou HTML enviado vira uma apresentação Halor, do antes para o depois.' },
];
