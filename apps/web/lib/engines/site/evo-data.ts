/* Linha do tempo · dados das épocas (separados de data.ts, que fica com o Produto). */
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
