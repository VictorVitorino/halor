/* ==========================================================================
   VITRINE · editor das prévias do catálogo
   Porte de vtCatEditor() (prototype/src/js/37-vitrine.js). Todo item do catálogo tem
   Editar efeito. Nos ao vivo o botão leva ao card no palco e abre o painel dele; nos
   outros abre uma janela (dialog modal) com a prévia ampliada, que também responde ao
   clique e ao cursor, e os controles. Cor, Velocidade e Intensidade valem para todas
   as prévias: filtro de cor e brilho e ritmo do laço (--vm-k) na raiz da prévia. Quando
   o efeito tem um estado ou uma medida própria, um quarto controle mexe nela (VT_MINI_X).
   O que se muda fica na prévia do catálogo depois de fechar; Restaurar volta ao quadro
   original. A marcação do catálogo é fotografada pelo motor (snap), então a limpeza
   devolve as prévias como vieram do servidor.
   ========================================================================== */
import { el } from '../../core';
import { q, qa, reflow, vtAccent, vtClamp, vtFmt, type VtCtx, type VtField, type VtVal } from './ctx';
import { VT_FX } from './data';
import { vtMiniGet, vtMiniHit, vtMiniState, VT_MINI_VALS } from './vt-catalog';
import { vtFieldGrid, type VtCtl } from './vt-editor';

/** Cor da paleta Halor → filtro sobre a prévia (desenhada em violeta). */
const VT_MINI_TINT: Readonly<Record<string, string>> = {
  '#8b3dff': '', '#a970ff': 'saturate(1.35) brightness(1.1)', '#c9a6ff': 'saturate(.42) brightness(1.24)',
  '#ff9ad5': 'hue-rotate(58deg) saturate(1.1) brightness(1.06)', '#4fd69a': 'hue-rotate(-118deg) saturate(.9) brightness(1.04)', '#f7bd55': 'hue-rotate(148deg) saturate(1.5) brightness(1.12)',
};

/**
 * Quarto controle · k 's': estado da prévia que alterna (faixa 1..N ou chave 0/1) ·
 * k 'p': item aceso (0 = nenhum) · k 'pv': valor do progresso · k 'x': variável CSS da prévia (css).
 */
type MiniX = Omit<VtField, 'k'> & { k: 's' | 'p' | 'pv' | 'x'; css?: string; fromS?: (s: number) => number };
const ofN = (t: number) => (v: number) => `${v} de ${t}`;
const VT_MINI_X: Readonly<Record<number, MiniX>> = {
  2: { k: 'x', t: 'range', l: 'Espessura do traço', min: 1, max: 3.2, step: .2, v: 1.8, css: '--vm-sw', fmt: v => vtFmt(v, 1) + ' px' },
  4: { k: 's', t: 'toggle', l: 'Afastar as camadas' },
  5: { k: 'p', t: 'range', l: 'Card elevado', min: 0, max: 4, step: 1, fmt: v => v ? `${v} de 4` : 'nenhum' },
  7: { k: 's', t: 'toggle', l: 'Vidro nítido' },
  8: { k: 's', t: 'range', l: 'Paleta', min: 1, max: 3, step: 1, fmt: ofN(3) },
  9: { k: 'x', t: 'range', l: 'Profundidade', min: 0, max: 2, step: .1, v: 1, css: '--vm-z', fmt: v => vtFmt(v, 1) + '×' },
  13: { k: 'pv', t: 'range', l: 'Progresso', min: 5, max: 100, step: 1, fmt: v => v + '%', fromS: s => [72, 48, 94][s] },
  14: { k: 'p', t: 'range', l: 'Célula em destaque', min: 0, max: 24, step: 1, fmt: v => v ? `${v} de 24` : 'todas' },
  19: { k: 'x', t: 'range', l: 'Alcance do pulso', min: 1.6, max: 4, step: .1, v: 2.8, css: '--vm-r', fmt: v => vtFmt(v, 1) + '×' },
  20: { k: 's', t: 'toggle', l: 'Card selecionado' },
  22: { k: 's', t: 'range', l: 'Card aberto', min: 1, max: 3, step: 1, fmt: ofN(3) },
  23: { k: 's', t: 'toggle', l: 'Modal aberto' },
  25: { k: 'x', t: 'range', l: 'Força do ímã', min: 0, max: 2, step: .1, v: 1, css: '--vm-z', fmt: v => vtFmt(v, 1) + '×' },
  26: { k: 's', t: 'range', l: 'Resposta', min: 1, max: 4, step: 1, fmt: v => ['nenhuma', 'chave', 'marca', 'favorito'][v - 1] },
  28: { k: 's', t: 'range', l: 'Fase', min: 1, max: 4, step: 1, fmt: ofN(4) },
  29: { k: 's', t: 'range', l: 'Forma', min: 1, max: 3, step: 1, fmt: v => ['círculo', 'losango', 'rede'][v - 1] },
  31: { k: 's', t: 'toggle', l: 'Conteúdo carregado' },
  32: { k: 's', t: 'toggle', l: 'Órbita aberta' },
  34: { k: 's', t: 'range', l: 'Card no centro', min: 1, max: 4, step: 1, fmt: ofN(4) },
  36: { k: 'p', t: 'range', l: 'Detalhe aberto', min: 0, max: 3, step: 1, fmt: v => v ? `${v} de 3` : 'nenhum' },
  38: { k: 's', t: 'range', l: 'Marco', min: 1, max: 4, step: 1, fmt: ofN(4) },
  39: { k: 'p', t: 'range', l: 'Nó aceso', min: 0, max: 8, step: 1, fmt: v => v ? `nó ${v}` : 'nenhum' },
};

/** O que o clique na prévia ampliada faz, dito embaixo dela. */
const VT_MINI_HINT: Readonly<Record<string, string>> = {
  cyc: 'Clique na prévia para alternar o estado.', pick: 'Clique num item da prévia para destacá-lo.',
  net: 'Clique num nó para acender os vizinhos.', spawn: 'Clique em qualquer ponto para soltar um pulso.', '': 'Clique na prévia para repetir o efeito.',
};

/** Valor do quarto controle lido da prévia (a prévia é a fonte da verdade: o clique também a muda). */
function xGet(m: HTMLElement, X: MiniX): number | boolean {
  const s = vtMiniGet(m) ?? 0;
  if (X.k === 's') return X.t === 'toggle' ? s === 1 : s + 1;
  if (X.k === 'p') return s + 1;
  if (X.k === 'pv') { const v = m.style.getPropertyValue('--p0'); return v ? +v : X.fromS!(+(m.dataset.s || 0)); }
  const v = m.style.getPropertyValue(X.css || ''); return v ? +v : Number(X.v);
}
function xSet(m: HTMLElement, X: MiniX, v: VtVal) {
  if (X.k === 's') vtMiniState(m, X.t === 'toggle' ? (v ? 1 : 0) : Number(v) - 1);
  else if (X.k === 'p') vtMiniState(m, Number(v) - 1);
  else if (X.k === 'pv') {
    const n = Number(v), p = n / 100;
    [n, p, p * .64, Math.min(1, p * 1.19)].forEach((x, i) => m.style.setProperty(VT_MINI_VALS[i], i ? x.toFixed(3) : String(x)));
  } else if (X.css) m.style.setProperty(X.css, String(v));
}

/** Cor, velocidade e intensidade de uma prévia. */
interface Look { c: string; sp: number; it: number }
const LOOK0: Readonly<Look> = { c: '#8b3dff', sp: 1, it: 100 };
function vtMiniLook(m: HTMLElement, st: Look) {
  const it = st.it / 100;
  const f = `${VT_MINI_TINT[st.c] || ''}${it !== 1 ? ` brightness(${(.72 + .28 * it).toFixed(2)}) saturate(${it.toFixed(2)})` : ''}`.trim();
  if (f) m.style.filter = f; else m.style.removeProperty('filter');
  if (st.sp !== 1) m.style.setProperty('--vm-k', (1 / st.sp).toFixed(3)); else m.style.removeProperty('--vm-k');
}

const DLG_HTML = `<div class="vt-dlg-in">
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

interface Open { n: number; name: string; X?: MiniX; st: Look; m0: HTMLElement; m1: HTMLElement; ctl: VtCtl; ed: HTMLElement | null; opener: HTMLElement }

export function vtCatEditor(sec: HTMLElement, live: Record<number, HTMLElement>, ctx: VtCtx) {
  const looks = new WeakMap<HTMLElement, Look>(), s0 = new WeakMap<HTMLElement, number | null>();
  /* o estado original de cada prévia, para Restaurar */
  qa('#vt-cat .vt-mini', sec).forEach(m => s0.set(m, vtMiniGet(m)));

  const dlg = ctx.own(el('dialog', 'vt-dlg'));
  dlg.id = 'vt-dlg';
  dlg.setAttribute('aria-labelledby', 'vt-dlg-t'); dlg.setAttribute('aria-describedby', 'vt-dlg-s vt-dlg-note');
  dlg.innerHTML = DLG_HTML;
  sec.append(dlg);
  const stage = q<HTMLButtonElement>('.vt-dlg-stage', dlg), hint = q('.vt-dlg-hint span', dlg), box = q('.vt-dlg-ed', dlg);
  let cur: Open | null = null;
  /* os controles de cada abertura têm sinal próprio: saem junto com a grade */
  let oc: AbortController | null = null;
  const onOpen: VtCtx['on'] = (target, type, fn, opts) => { target.addEventListener(type, fn as EventListener, { ...opts, signal: oc!.signal }); };
  ctx.defer(() => { oc?.abort(); if (dlg.open) dlg.close(); });

  /* ao vivo: leva ao card no palco e abre o painel Editar efeito dele */
  const pings = new Map<HTMLElement, number>();
  qa<HTMLButtonElement>('#vt-cat .vt-item-ed', sec).forEach(ed => {
    const n = +(ed.dataset.n || 0), card = live[n];
    if (!card) { ctx.on(ed, 'click', () => open(n, ed)); return; }
    ctx.on(ed, 'click', () => {
      card.scrollIntoView({ behavior: ctx.reduced ? 'auto' : 'smooth', block: 'center' });
      const b = card.querySelector<HTMLButtonElement>('.vt-edit');
      if (b && !b.hidden && b.getAttribute('aria-expanded') !== 'true') b.click();
      const f = card.querySelector<HTMLElement>('.vt-ed input, .vt-ed button');
      if (f) f.focus({ preventScroll: true }); else { card.setAttribute('tabindex', '-1'); card.focus({ preventScroll: true }); }
      card.classList.remove('is-ping'); reflow(card); card.classList.add('is-ping');
      ctx.cancel(pings.get(card) || 0);
      pings.set(card, ctx.later(() => card.classList.remove('is-ping'), 1800));
    });
  });

  function open(n: number, opener: HTMLElement) {
    const it = sec.querySelector<HTMLElement>(`#vt-cat .vt-item[data-n="${n}"]`), m0 = it?.querySelector<HTMLElement>('.vt-mini');
    const fx = VT_FX.find(f => f[0] === n);
    if (!m0 || !fx) return;
    const [, name, fam, , dose, sum] = fx;
    const X = VT_MINI_X[n], st = looks.get(m0) || { ...LOOK0 };
    q('#vt-dlg-n', dlg).textContent = String(n).padStart(2, '0');
    q('#vt-dlg-c', dlg).textContent = fam;
    qa('.vt-dose i', dlg).forEach((d, i) => d.classList.toggle('on', i < dose));
    q('#vt-dlg-t', dlg).textContent = name;
    q('#vt-dlg-s', dlg).textContent = sum;
    /* a prévia ampliada é uma cópia viva da do catálogo: as duas mudam juntas */
    const m1 = m0.cloneNode(true) as HTMLElement;
    m1.classList.remove('is-play', 'is-ptr', 'is-hit');
    m1.style.removeProperty('--mx'); m1.style.removeProperty('--my');
    qa('.vm-sp', m1).forEach(x => x.remove());
    stage.replaceChildren(m1);
    stage.setAttribute('aria-label', `Prévia de ${name}`);
    hint.textContent = VT_MINI_HINT[m1.dataset.k || ''] || VT_MINI_HINT[''];
    if (!ctx.reduced) m1.classList.add('is-play');
    /* os controles: cor, velocidade, intensidade e o do efeito */
    const fields: VtField[] = [{ k: 'c', t: 'color', l: 'Cor', v: st.c }];
    if (!ctx.reduced) fields.push({ k: 'sp', t: 'range', l: 'Velocidade', min: .4, max: 2, step: .1, v: st.sp, fmt: v => vtFmt(v, 1) + '×' });
    fields.push({ k: 'it', t: 'range', l: 'Intensidade', min: 40, max: 160, step: 5, v: st.it, fmt: v => v + '%' });
    if (X) fields.push({ ...X, k: 'x', v: xGet(m0, X) });
    const ms = [m0, m1], ed = sec.querySelector<HTMLElement>(`#vt-cat .vt-item-ed[data-n="${n}"]`);
    const set = (k: string, v: VtVal) => {
      if (k === 'x') { if (X) ms.forEach(m => xSet(m, X, v)); }
      else {
        if (k === 'c') { st.c = String(v); vtAccent(dlg, st.c); }
        else if (k === 'sp') st.sp = Number(v);
        else if (k === 'it') st.it = Number(v);
        looks.set(m0, st); ms.forEach(m => vtMiniLook(m, st));
      }
      ed?.classList.add('is-mod');
    };
    oc?.abort(); oc = new AbortController();
    const { grid, ctl } = vtFieldGrid('vt-dlg-' + n, fields, set, onOpen);
    box.replaceChildren(grid);
    vtAccent(dlg, st.c);
    cur = { n, name, X, st, m0, m1, ctl, ed, opener };
    dlg.showModal();
    /* o foco começa nos controles (a cor escolhida), não no Fechar */
    grid.querySelector<HTMLElement>('[aria-checked="true"]')?.focus();
  }

  /* clique na prévia ampliada: o mesmo que no catálogo, nas duas cópias */
  ctx.on(stage, 'click', e => {
    if (!cur) return;
    const { m0, m1, n, name, X, ctl } = cur;
    if (!ctx.reduced) { m1.classList.remove('is-play'); reflow(m1); m1.classList.add('is-play'); }
    const s = vtMiniHit(m1, e, e.detail === 0, n, name, ctx);
    if (s == null) return;
    VT_MINI_VALS.forEach(v => m0.style.removeProperty(v));
    vtMiniState(m0, s);
    if (X) ctl.x?.(xGet(m1, X));
  });
  ctx.on(stage, 'pointermove', e => {
    if (!cur || e.pointerType !== 'mouse') return;
    const r = cur.m1.getBoundingClientRect();
    cur.m1.style.setProperty('--mx', vtClamp((e.clientX - r.left) / r.width, -.2, 1.2).toFixed(3));
    cur.m1.style.setProperty('--my', vtClamp((e.clientY - r.top) / r.height, -.2, 1.2).toFixed(3));
    cur.m1.classList.add('is-ptr');
  });
  ctx.on(stage, 'pointerleave', () => {
    if (!cur) return;
    cur.m1.classList.remove('is-ptr'); cur.m1.style.removeProperty('--mx'); cur.m1.style.removeProperty('--my');
  });
  ctx.on(q('.vt-dlg-rst', dlg), 'click', () => {
    if (!cur) return;
    const { m0, m1, X, ctl, ed, name } = cur;
    Object.assign(cur.st, LOOK0); looks.delete(m0);
    const first = s0.get(m0);
    [m0, m1].forEach(m => {
      ['filter', '--vm-k', '--vm-sw', '--vm-z', '--vm-r', ...VT_MINI_VALS].forEach(p => m.style.removeProperty(p));
      if (first != null) vtMiniState(m, first);
    });
    ctl.c?.(LOOK0.c); ctl.sp?.(LOOK0.sp); ctl.it?.(LOOK0.it); if (X) ctl.x?.(xGet(m0, X));
    vtAccent(dlg, LOOK0.c);
    ed?.classList.remove('is-mod');
    ctx.say(`${name} voltou ao padrão.`);
  });
  const shut = () => dlg.close();
  ctx.on(q('.vt-dlg-x', dlg), 'click', shut);
  ctx.on(q('.vt-dlg-ok', dlg), 'click', shut);
  /* clique no fundo escurecido fecha (o diálogo ocupa só a caixa; fora dela o alvo é o próprio dialog) */
  ctx.on(dlg, 'click', e => {
    if (e.target !== dlg) return;
    const r = dlg.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) shut();
  });
  ctx.on(dlg, 'close', () => {
    if (!cur) return;
    const { opener, name } = cur;
    cur.m1.remove(); cur = null;
    oc?.abort(); oc = null;
    ctx.say(`Editor de ${name} fechado. A prévia do catálogo guarda o que você mudou.`);
    opener.focus({ preventScroll: true });
  });
}
