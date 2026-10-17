// Gera vt-minis.ts (prévias do catálogo do app) a partir de VT_MINI em
// prototype/src/js/37-vitrine.js, com o HTML já resolvido. As duas bases ficam iguais.
//
// Uso (a partir da raiz do repositório):
//   node apps/web/lib/engines/vitrine/vt-gen-minis.mjs           escreve vt-minis.ts
//   node apps/web/lib/engines/vitrine/vt-gen-minis.mjs --check   só confere; sai com 1 se o arquivo estiver velho
//
// Rode depois de mudar uma prévia no protótipo (VT_MINI ou vtMiniHTML).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');
const SRC = path.join(ROOT, 'prototype/src/js/37-vitrine.js');
const OUT = path.join(HERE, 'vt-minis.ts');

const src = fs.readFileSync(SRC, 'utf8');
const a = src.indexOf('const vtB = '), b = src.indexOf('function vtMiniHTML');
if (a < 0 || b < 0) { console.error('VT_MINI não encontrado em', SRC); process.exit(2); }
const VT_MINI = new Function(src.slice(a, b) + '\nreturn VT_MINI;')();
const esc = s => JSON.stringify(s);

let out = `/* ==========================================================================
   VITRINE · prévias do catálogo
   GERADO por vt-gen-minis.mjs a partir de VT_MINI em prototype/src/js/37-vitrine.js
   (HTML já resolvido). Não edite aqui: mude o protótipo e rode, na raiz do repositório,
     node apps/web/lib/engines/vitrine/vt-gen-minis.mjs
   (com --check, só confere se este arquivo está em dia).
   Cada prévia é um quadro estático; com o cursor ou o foco roda em laço (.is-play)
   e o clique faz o efeito acontecer. Modo do clique: 'cyc N I' alterna N estados a
   partir de I · 'pick' escolhe o item clicado · 'spawn' solta um pulso · 'net' acende
   os vizinhos do nó · '' repete. O HTML só usa elementos de frase (span, b, i, em, svg),
   porque a prévia mora dentro do botão do item. Módulo puro: serve ao servidor e ao navegador.
   ========================================================================== */

export const VT_MINI: Readonly<Record<number, readonly [mode: string, html: string]>> = {
`;
for (const [n, [m, h]] of Object.entries(VT_MINI)) out += `  ${n}: [${esc(m)}, ${esc(h)}],\n`;
out += `};

/** Atributos e HTML interno da raiz de uma prévia (a raiz guarda o modo e o estado inicial). */
export function vtMiniParts(n: number) {
  const [mode, html] = VT_MINI[n] || ['', ''];
  const [k = '', cnt, s0] = mode.split(' ');
  const pk = (k === 'pick' || k === 'net') && /is-pk/.test(html) ? ' has-pk' : '';
  return { className: \`vt-mini m\${n}\${pk}\`, k, n: k === 'cyc' ? cnt : undefined, s: k === 'cyc' ? s0 : undefined, html };
}
`;

/* nada de blocos dentro do botão do item */
const bad = Object.entries(VT_MINI).filter(([, [, h]]) => /<(div|p|ul|ol|li|h\d|section|article)\b/.test(h)).map(([n]) => n);
if (bad.length) { console.error('Prévias com elementos de bloco (o item é um botão):', bad.join(', ')); process.exit(2); }

if (process.argv.includes('--check')) {
  const cur = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (cur !== out) { console.error('vt-minis.ts está desatualizado: rode node apps/web/lib/engines/vitrine/vt-gen-minis.mjs'); process.exit(1); }
  console.log('vt-minis.ts em dia (' + Object.keys(VT_MINI).length + ' prévias)');
} else {
  fs.writeFileSync(OUT, out);
  console.log('vt-minis.ts gerado (' + Object.keys(VT_MINI).length + ' prévias)');
}
