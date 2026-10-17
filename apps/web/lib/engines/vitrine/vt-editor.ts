/* ==========================================================================
   VITRINE · painel Editar efeito
   Porte de vtEditor() (prototype/src/js/37-vitrine.js). Monta, dentro do card, os
   controles descritos em demo.fields (texto, número, faixa, cor da paleta Halor,
   liga/desliga e "adicionar"); cada mudança chama demo.set na hora. Restaurar volta
   ao padrão (o botão fica na linha de ações, no lugar de Repetir); Esc fecha e devolve o
   foco ao botão. O painel ocupa a mesma área do texto do card (mesma altura), então o
   efeito segue à vista e o card não cresce enquanto se mexe nele.
   ========================================================================== */
import { el } from '../../core';
import { q, vtClamp, vtFmt, vtNum, VT_SW, type VtCtx, type VtDemo, type VtField, type VtVal } from './ctx';

/** Por chave, a função que mostra no controle um valor que mudou por fora. */
export type VtCtl = Record<string, (v: VtVal) => void>;

/**
 * Monta a grade de controles a partir de fields; set(k, v) muda o efeito na hora (devolve false
 * quando recusa). Serve ao painel dos cards do palco e ao editor das prévias do catálogo.
 * `on` liga os ouvintes (o editor do catálogo usa um sinal próprio, renovado a cada abertura).
 */
export function vtFieldGrid(id: string, fields: VtField[], set: (k: string, v: VtVal) => boolean | void, on: VtCtx['on']) {
  const grid = el('div', 'vt-ed-grid');
  const ctl: VtCtl = {};

  fields.forEach(f => {
    const row = el('div', 'vt-ed-f vt-ef-' + f.t), fid = `${id}-${f.k}`;
    const lab = el(f.t === 'color' || f.t === 'toggle' ? 'span' : 'label', 'vt-ed-l', f.l);
    lab.id = fid + '-l';
    if (lab instanceof HTMLLabelElement) lab.htmlFor = fid;
    row.append(lab);
    if (f.t === 'text' || f.t === 'number') {
      const num = f.t === 'number', dec = f.dec || 0;
      const inp = el('input', 'vt-ed-in'); inp.id = fid; inp.type = 'text';
      inp.value = num ? vtFmt(Number(f.v), dec) : String(f.v ?? '');
      inp.autocomplete = 'off'; inp.spellcheck = false;
      if (num) { inp.inputMode = dec ? 'decimal' : 'numeric'; inp.classList.add('vt-ed-num'); }
      else if (f.max) inp.maxLength = f.max;
      on(inp, 'input', () => {
        if (!num) { set(f.k, inp.value); return; }
        const v = vtNum(inp.value);
        if (isFinite(v)) set(f.k, vtClamp(v, f.min ?? -Infinity, f.max ?? Infinity));
      });
      on(inp, 'blur', () => {
        if (!num) return;
        const v = vtNum(inp.value);
        inp.value = vtFmt(isFinite(v) ? vtClamp(v, f.min ?? -Infinity, f.max ?? Infinity) : Number(f.v), dec);
      });
      ctl[f.k] = v => { inp.value = num ? vtFmt(Number(v), dec) : String(v); };
      const box = el('span', 'vt-ed-box'); box.append(inp);
      if (f.unit) box.append(el('span', 'vt-ed-u', f.unit));
      row.append(box);
    } else if (f.t === 'range') {
      const min = f.min ?? 0, max = f.max ?? 100;
      const inp = el('input', 'vt-range vt-ed-rg'); inp.id = fid; inp.type = 'range';
      inp.min = String(min); inp.max = String(max); inp.step = String(f.step ?? 1); inp.value = String(f.v);
      const out = el('output', 'vt-ed-out'); out.setAttribute('for', fid); out.setAttribute('aria-hidden', 'true');
      const show = (v: number) => {
        const t = f.fmt ? f.fmt(v) : String(v);
        out.textContent = t; inp.setAttribute('aria-valuetext', t);
        inp.style.setProperty('--v', (v - min) / (max - min) * 100 + '%');
      };
      on(inp, 'input', () => { const v = +inp.value; show(v); set(f.k, v); });
      show(Number(f.v));
      ctl[f.k] = v => { inp.value = String(v); show(Number(v)); };
      const box = el('span', 'vt-ed-box'); box.append(inp, out);
      row.append(box);
    } else if (f.t === 'color') {
      const g = el('div', 'vt-ed-sw'); g.setAttribute('role', 'radiogroup'); g.setAttribute('aria-labelledby', lab.id);
      const bs = VT_SW.map(([nm, hex]) => {
        const b = el('button'); b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('aria-label', nm);
        b.style.setProperty('--c', hex); b.dataset.c = hex; g.append(b); return b;
      });
      const sel = (v: VtVal) => bs.forEach(b => { const on = b.dataset.c === v; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
      bs.forEach((b, i) => {
        on(b, 'click', () => { sel(b.dataset.c || ''); set(f.k, b.dataset.c || ''); });
        on(b, 'keydown', e => {
          const s = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
          if (!s) return;
          e.preventDefault();
          const nb = bs[(i + s + bs.length) % bs.length]; nb.focus(); nb.click();
        });
      });
      sel(f.v ?? ''); ctl[f.k] = sel; row.append(g);
    } else if (f.t === 'toggle') {
      const b = el('button', 'vt-ed-tg'); b.type = 'button'; b.id = fid;
      b.setAttribute('role', 'switch'); b.setAttribute('aria-labelledby', lab.id);
      const sel = (v: VtVal) => b.setAttribute('aria-checked', String(!!v));
      on(b, 'click', () => { const v = b.getAttribute('aria-checked') !== 'true'; sel(v); set(f.k, v); });
      sel(!!f.v); ctl[f.k] = sel; row.append(b);
    } else if (f.t === 'add') {
      const inp = el('input', 'vt-ed-in'); inp.id = fid; inp.type = 'text'; inp.placeholder = f.ph || ''; inp.maxLength = f.max || 20;
      inp.autocomplete = 'off'; inp.enterKeyHint = 'done';
      const add = el('button', 'btn btn-ghost btn-xs vt-ed-add'); add.type = 'button';
      add.innerHTML = '<svg aria-hidden="true"><use href="#i-plus"/></svg>Adicionar';
      const go = () => { const v = inp.value.trim(); if (!v) { inp.focus(); return; } if (set(f.k, v) !== false) inp.value = ''; };
      on(add, 'click', go);
      on(inp, 'keydown', e => { if (e.key === 'Enter') { e.preventDefault(); go(); } });
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

export function vtEditor(card: HTMLElement, d: VtDemo, ctx: VtCtx) {
  const btn = card.querySelector<HTMLButtonElement>('.vt-edit');
  if (!btn) return;
  if (!d.fields || !d.set) { btn.hidden = true; return; }
  const set = d.set.bind(d), fields = d.fields;
  const meta = q('.vt-meta', card), name = q('h3', card).textContent || '';
  const id = btn.getAttribute('aria-controls') || `${card.id}-ed`;
  const pan = ctx.own(el('div', 'vt-ed')); pan.id = id; pan.hidden = true;
  pan.setAttribute('role', 'group'); pan.setAttribute('aria-label', `Editar ${name}`);
  const { grid, ctl } = vtFieldGrid(id, fields, set, ctx.on.bind(ctx));

  /* Restaurar fica na linha de ações do card (no lugar de Repetir enquanto o painel está aberto),
     para o painel caber na área do texto que ele substitui sem mudar a altura do card */
  const rst = ctx.own(el('button', 'btn btn-ghost btn-xs vt-ed-reset')); rst.type = 'button'; rst.hidden = true;
  rst.setAttribute('aria-label', `Restaurar o padrão de ${name}`);
  rst.innerHTML = '<svg aria-hidden="true"><use href="#i-restore"/></svg>Restaurar';
  ctx.on(rst, 'click', () => {
    fields.forEach(f => { if (f.t === 'add') { ctl[f.k](''); return; } ctl[f.k](f.v ?? ''); set(f.k, f.v ?? ''); });
    d.reset?.();
    ctx.say(`${name} voltou ao padrão.`);
  });
  btn.after(rst);
  const note = el('p', 'sr-only', 'Cada controle muda o efeito na hora. Esc fecha o painel.'); note.id = id + '-note';
  pan.setAttribute('aria-describedby', note.id);
  pan.append(grid, note);
  meta.append(pan);
  card.addEventListener('vt-sync', e => { const { k, v } = (e as CustomEvent<{ k: string; v: VtVal }>).detail; ctl[k]?.(v); }, { signal: ctx.signal });

  const ico = btn.querySelector('use'), txt = btn.querySelector('span');
  const show = (on: boolean, kb?: boolean) => {
    btn.setAttribute('aria-expanded', String(on));
    card.classList.toggle('is-edit', on);
    pan.hidden = !on; rst.hidden = !on;
    if (txt) txt.textContent = on ? 'Concluir' : 'Editar efeito';
    ico?.setAttribute('href', on ? '#i-check' : '#i-sliders');
    if (on) {
      ctx.kick(pan, 'is-in');
      if (kb) grid.querySelector<HTMLElement>('input, button')?.focus({ preventScroll: true });
    }
  };
  ctx.on(btn, 'click', e => show(btn.getAttribute('aria-expanded') !== 'true', e.detail === 0));
  ctx.on(card, 'keydown', e => {
    if (e.key !== 'Escape' || !card.classList.contains('is-edit') || e.defaultPrevented) return;
    e.preventDefault(); show(false); btn.focus();
  });
}
