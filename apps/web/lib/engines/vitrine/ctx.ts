/* ==========================================================================
   VITRINE · contexto de execução
   Tudo o que o motor liga passa por aqui (ouvintes, timers, quadros, observadores
   e nós criados), para que a limpeza desfaça cada um. O React monta duas vezes
   em dev e a navegação entre rotas monta e desmonta a tela.
   snap(raiz) fotografa a marcação pré-renderizada (filhos, atributos e textos) e
   a devolve intacta na limpeza: classes, estilos, rótulos e nós criados saem juntos.
   ========================================================================== */

/** Valor de um campo do painel Editar efeito. */
export type VtVal = string | number | boolean;

/** Campo do painel Editar efeito (mesmo formato de demo.fields no protótipo). */
export interface VtField {
  k: string;
  t: 'text' | 'number' | 'range' | 'color' | 'toggle' | 'add';
  l: string;
  v?: VtVal;
  min?: number; max?: number; step?: number; dec?: number;
  unit?: string; ph?: string;
  /** Campo 'add': rótulo que aparece quando não cabe mais nada (o campo se apaga). */
  full?: string;
  fmt?: (v: number) => string;
}

/** Controles de uma demo. start: primeira entrada na tela · resume/pause: entra e sai da tela ·
 *  replay: botão Repetir · still: quadro final para quem pede menos movimento ·
 *  fields/set: painel Editar efeito (set devolve false quando recusa) · reset: o que os campos não cobrem. */
export interface VtDemo {
  start?(): void;
  resume?(): void;
  pause?(): void;
  replay?(): void;
  still?(): void;
  fields?: VtField[];
  set?(k: string, v: VtVal): boolean | void;
  reset?(): void;
}

export interface VtCtx {
  /** Movimento reduzido, lido uma vez na partida (como no protótipo). */
  readonly reduced: boolean;
  /** Sinal dos ouvintes: abortado na limpeza. */
  readonly signal: AbortSignal;
  /** Atalho para addEventListener com o sinal da limpeza. */
  on<K extends keyof HTMLElementEventMap>(target: HTMLElement | SVGElement, type: K, fn: (e: HTMLElementEventMap[K]) => void, opts?: AddEventListenerOptions): void;
  /** setTimeout rastreado. */
  later(fn: () => void, ms: number): number;
  /** clearTimeout que também esquece o timer. Aceita 0. */
  cancel(id: number): void;
  /** requestAnimationFrame rastreado. */
  frame(fn: FrameRequestCallback): number;
  /** cancelAnimationFrame que também esquece o quadro. Aceita 0. */
  unframe(id: number): void;
  /** Interpolação curta (0 a 1) com rAF; devolve a função que cancela. Com movimento reduzido, vai direto ao fim. */
  tween(dur: number, fn: (p: number) => void, done?: () => void): () => void;
  /** ResizeObserver desligado na limpeza. */
  resize(target: Element, fn: () => void): void;
  /** Nó criado pelo motor: sai do DOM na limpeza. */
  own<T extends Node>(n: T): T;
  /** Função extra para a limpeza (roda em ordem inversa). */
  defer(fn: () => void): void;
  /** Reinicia uma classe de animação de uso único; com ms, ela sai sozinha depois. */
  kick(n: Element, cls: string, ms?: number): void;
  /** Fotografa a marcação da raiz e a restaura na limpeza. */
  snap(root: Element | null): void;
  /** Aviso para leitor de tela (região viva da seção). */
  say(text: string): void;
}

export function createCtx(reduced: boolean, speak: (t: string) => void = () => {}): { ctx: VtCtx; dispose: () => void } {
  const ac = new AbortController();
  const timers = new Set<number>(), frames = new Set<number>();
  const observers: ResizeObserver[] = [], owned: Node[] = [], later: (() => void)[] = [];
  const kicks = new WeakMap<Element, Record<string, number>>();

  const ctx: VtCtx = {
    reduced,
    signal: ac.signal,
    on(target, type, fn, opts) {
      target.addEventListener(type, fn as EventListener, { ...opts, signal: ac.signal });
    },
    later(fn, ms) {
      const id = window.setTimeout(() => { timers.delete(id); fn(); }, ms);
      timers.add(id);
      return id;
    },
    cancel(id) { if (!id) return; clearTimeout(id); timers.delete(id); },
    frame(fn) {
      const id = requestAnimationFrame(t => { frames.delete(id); fn(t); });
      frames.add(id);
      return id;
    },
    unframe(id) { if (!id) return; cancelAnimationFrame(id); frames.delete(id); },
    tween(dur, fn, done) {
      if (reduced) { fn(1); done?.(); return () => {}; }
      let raf = 0; const t0 = performance.now();
      const tick = (t: number) => {
        const p = vtClamp((t - t0) / dur);
        fn(p);
        if (p < 1) raf = ctx.frame(tick); else if (done) done();
      };
      raf = ctx.frame(tick);
      return () => ctx.unframe(raf);
    },
    resize(target, fn) {
      const ro = new ResizeObserver(() => fn());
      ro.observe(target);
      observers.push(ro);
    },
    own(n) { owned.push(n); return n; },
    defer(fn) { later.push(fn); },
    kick(n, cls, ms) {
      n.classList.remove(cls); reflow(n); n.classList.add(cls);
      const m = kicks.get(n) || {};
      ctx.cancel(m[cls] || 0);
      if (ms) m[cls] = ctx.later(() => n.classList.remove(cls), ms);
      kicks.set(n, m);
    },
    snap(root) {
      if (!root) return;
      const els = [root, ...Array.from(root.querySelectorAll('*'))];
      const rec = els.map(e => ({ e, kids: Array.from(e.childNodes), at: Array.from(e.attributes).map(a => [a.name, a.value] as const) }));
      const texts: [Text, string][] = [];
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      while (w.nextNode()) texts.push([w.currentNode as Text, (w.currentNode as Text).data]);
      ctx.defer(() => {
        rec.forEach(({ e, kids }) => {
          const cur = e.childNodes;
          if (cur.length !== kids.length || kids.some((k, i) => cur[i] !== k)) e.replaceChildren(...kids);
        });
        rec.forEach(({ e, at }) => {
          Array.from(e.attributes).forEach(a => { if (!at.some(([n]) => n === a.name)) e.removeAttribute(a.name); });
          at.forEach(([n, v]) => { if (e.getAttribute(n) !== v) e.setAttribute(n, v); });
        });
        texts.forEach(([t, d]) => { if (t.data !== d) t.data = d; });
      });
    },
    say: speak,
  };

  const dispose = () => {
    ac.abort();
    timers.forEach(id => clearTimeout(id)); timers.clear();
    frames.forEach(id => cancelAnimationFrame(id)); frames.clear();
    observers.forEach(o => o.disconnect()); observers.length = 0;
    for (let i = later.length - 1; i >= 0; i--) later[i]();
    later.length = 0;
    owned.forEach(n => n.parentNode?.removeChild(n)); owned.length = 0;
  };
  return { ctx, dispose };
}

export const vtClamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const vtEase = (p: number) => 1 - Math.pow(1 - p, 3);

/** querySelector para nós que a marcação garante (o protótipo também assumia que existiam). */
export const q = <T extends Element = HTMLElement>(s: string, r: ParentNode): T => r.querySelector<T>(s)!;
export const qa = <T extends Element = HTMLElement>(s: string, r: ParentNode): T[] => Array.from(r.querySelectorAll<T>(s));

/** Força o layout para reiniciar uma transição ou animação CSS. */
export const reflow = (n: Element) => { void (n as HTMLElement).offsetWidth; };

/** Reinicia as transições CSS de um card: estado inicial sem transição, depois o final com transição. */
export function vtRestart(card: HTMLElement) {
  card.classList.add('vt-reset');
  card.classList.remove('is-on');
  reflow(card);
  card.classList.remove('vt-reset');
  card.classList.add('is-on');
}

/** Paleta Halor das amostras de cor do painel. */
export const VT_SW: readonly (readonly [name: string, hex: string])[] = [
  ['Violeta', '#8b3dff'], ['Neon', '#a970ff'], ['Lilás', '#c9a6ff'], ['Rosa', '#ff9ad5'], ['Verde', '#4fd69a'], ['Âmbar', '#f7bd55']
];
export const vtRgb = (hex: string) => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
/** Cor de destaque do card: --vt-acc e --vt-rgb (para as transparências). */
export function vtAccent(card: HTMLElement, hex: string) {
  card.style.setProperty('--vt-acc', hex);
  card.style.setProperty('--vt-rgb', vtRgb(hex).join(' '));
}
/** Avisa o painel de um valor que mudou por fora (ex.: o card do topo trocou). */
export const vtSync = (card: HTMLElement, k: string, v: VtVal) => card.dispatchEvent(new CustomEvent('vt-sync', { detail: { k, v } }));
export const vtFmt = (v: number, d = 0) => v.toLocaleString('pt-BR', { minimumFractionDigits: d, maximumFractionDigits: d });
/** Número digitado em pt-BR ("1.240", "12,8") ou com ponto decimal ("12.8"). */
export function vtNum(s: string) {
  let t = String(s).trim().replace(/[−–]/g, '-').replace(/\s/g, '');
  if (t.includes(',')) t = t.replace(/\./g, '').replace(',', '.');
  else if (/^-?\d{1,3}(\.\d{3})+$/.test(t)) t = t.replace(/\./g, '');
  return parseFloat(t);
}
