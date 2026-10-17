/* ==========================================================================
   Núcleo · utilitários de DOM, toast, cópia, modais e o ciclo de vida das telas.
   Porte de prototype/src/js/00-core.js sem o roteador por hash: no Next cada tela
   é uma rota, e os motores de cada tela ligam e desligam com ela (useEngine).
   Nada aqui toca em window ou document no carregamento do módulo, porque os
   componentes também são pré-renderizados no servidor durante o build.
   ========================================================================== */

export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document): T | null => r.querySelector<T>(s);
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document): T[] => Array.from(r.querySelectorAll<T>(s));

/** Movimento reduzido. No navegador já vale desde o carregamento do módulo (antes de qualquer efeito);
    no servidor fica `false`. Os módulos leem o valor vivo, que acompanha a preferência do sistema. */
export let REDUCED = typeof window !== 'undefined' && typeof window.matchMedia === 'function'
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

export const fmtBRL = (v: number) => 'R$ ' + v.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const fmtNum = (v: number, d = 0) => v.toFixed(d).replace('.', ',');

export function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string | null, text?: string | number | null): HTMLElementTagNameMap[K];
export function el(tag: string, cls?: string | null, text?: string | number | null): HTMLElement;
export function el(tag: string, cls?: string | null, text?: string | number | null): HTMLElement {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = String(text);
  return n;
}

export function svgEl<K extends keyof SVGElementTagNameMap>(tag: K, attrs: Record<string, string | number> = {}): SVGElementTagNameMap[K] {
  const n = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const k in attrs) n.setAttribute(k, String(attrs[k]));
  return n;
}

/* · Toast · */
let toastT: ReturnType<typeof setTimeout> | undefined;
export function toast(msg: string) {
  const t = $('#toast'); if (!t) return;
  const span = $('span', t); if (span) span.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('on'), 2600);
}

/* · Copiar, com recuo para execCommand e, por fim, para a seleção do texto · */
export function copyText(text: string, node?: Element | null, label?: string) {
  const done = () => toast(label || 'Copiado');
  const legacy = () => {
    const ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
    document.body.appendChild(ta); ta.select();
    let ok = false; try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove(); return ok;
  };
  const fallback = () => {
    if (legacy()) return done();
    if (!node) return toast('Não deu para copiar aqui. Selecione o texto e use Ctrl+C');
    const r = document.createRange(); r.selectNodeContents(node);
    const s = getSelection(); s?.removeAllRanges(); s?.addRange(r);
    toast('Texto selecionado. Use Ctrl+C');
  };
  try { navigator.clipboard.writeText(text).then(done, fallback); } catch { fallback(); }
}

/* · Modais · */
let lastFocus: Element | null = null;
export const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
export function openModal(id: string) {
  const m = document.getElementById(id); if (!m) return;
  lastFocus = document.activeElement;
  m.hidden = false;
  const f = m.querySelector<HTMLElement>('input, button:not([data-close]), a[href]') || m.querySelector<HTMLElement>('button');
  setTimeout(() => f?.focus(), 30);
}
export function closeModal(m: HTMLElement) {
  m.hidden = true;
  if (lastFocus instanceof HTMLElement) lastFocus.focus();
}

/* · Telas · */
/** Id da tela à vista (ex.: 'v-site', 'v-studio'). Os motores usam para pausar laços fora da tela. */
export let currentView: string | null = null;
/** Sub-tela do estúdio à vista ('inicio', 'editor', 'painel', 'apresentar', 'admin'). */
export let currentSub: string | null = null;

/** Chamado pela tela ao montar: avisa os motores, como o roteador do protótipo fazia. */
export function enterView(id: string, sub: string | null = null) {
  currentView = id; currentSub = sub;
  document.dispatchEvent(new CustomEvent('halor:view', { detail: id }));
  if (sub) document.dispatchEvent(new CustomEvent('halor:sub', { detail: sub }));
}
export function leaveView(id: string) {
  if (currentView === id) { currentView = null; currentSub = null; }
}

/* · Comportamentos globais por delegação (copiar, toast, modais, senha, atalho de conteúdo, barra do site) · */
let installed = false;
export function initCore(): () => void {
  if (installed) return () => {};
  installed = true;
  const ac = new AbortController(), o = { signal: ac.signal };
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  REDUCED = mq.matches;
  mq.addEventListener('change', e => { REDUCED = e.matches; }, o);

  document.addEventListener('click', e => {
    const tg = e.target as Element | null; if (!tg || !tg.closest) return;
    const c = tg.closest<HTMLElement>('[data-copy]');
    if (c) { const n = $(c.dataset.copy!); if (n) copyText(n.textContent || '', n); }
    const ct = tg.closest<HTMLElement>('[data-copy-text]');
    if (ct) copyText(ct.dataset.copyText || '', null, ct.dataset.copyLabel);
    const tt = tg.closest<HTMLElement>('[data-toast]');
    if (tt) toast(tt.dataset.toast || '');
    const op = tg.closest<HTMLElement>('[data-open]');
    if (op) { e.preventDefault(); openModal(op.dataset.open!); }
    const cl = tg.closest('[data-close]');
    if (cl) { const m = cl.closest<HTMLElement>('.modal'); if (m) closeModal(m); }
    const rv = tg.closest<HTMLElement>('[data-reveal]');
    if (rv) {
      const inp = document.getElementById(rv.dataset.reveal!) as HTMLInputElement | null;
      if (inp) {
        const show = inp.type === 'password';
        inp.type = show ? 'text' : 'password';
        rv.setAttribute('aria-pressed', String(show));
        rv.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
        $('use', rv)?.setAttribute('href', show ? '#i-eye-off' : '#i-eye');
      }
    }
    /* "Pular para o conteúdo": fora do site, leva ao conteúdo da tela atual */
    const sk = tg.closest('a.skip');
    if (sk) {
      const v = currentView ? document.getElementById(currentView) : null;
      if (v && !v.contains(document.getElementById('conteudo'))) {
        const shown = (q: string, r: ParentNode) => $$(q, r).find(n => n.getClientRects().length);
        const sub = $$('.sub', v).find(x => !x.hidden);
        const t = (sub && (shown('[data-skip]', sub) || shown('h1, h2', sub) || sub)) || shown('[data-skip]', v) || shown('main, h1', v) || v;
        e.preventDefault();
        if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1');
        t.focus({ preventScroll: true });
        const tr = t.getBoundingClientRect();
        if (tr.top < 72 || tr.top > innerHeight * .6) t.scrollIntoView({ block: 'start', behavior: REDUCED ? 'auto' : 'smooth' });
      }
    }
  }, o);

  document.addEventListener('keydown', e => {
    const m = $$('.modal').find(x => !x.hidden); if (!m) return;
    if (e.key === 'Escape') { e.preventDefault(); closeModal(m); return; }
    if (e.key === 'Tab') {
      const f = $$(FOCUSABLE, m).filter(n => n.offsetParent !== null && !n.closest('.sr-only'));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || !m.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !m.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
    }
  }, o);

  window.addEventListener('scroll', () => { $('#s-nav')?.classList.toggle('scrolled', window.scrollY > 12); }, { passive: true, signal: ac.signal });

  return () => { ac.abort(); installed = false; };
}
