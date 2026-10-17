/* ==========================================================================
   VITRINE · contexto de execução
   Tudo o que o motor liga passa por aqui (ouvintes, timers, quadros, observadores
   e nós criados), para que a limpeza desfaça cada um. O React monta duas vezes
   em dev e a navegação entre rotas monta e desmonta a tela.
   ========================================================================== */

/** Controles de uma demo. start: primeira entrada na tela · resume/pause: entra e sai da tela ·
 *  replay: botão Repetir · still: quadro final para quem pede menos movimento. */
export interface VtDemo {
  start?(): void;
  resume?(): void;
  pause?(): void;
  replay?(): void;
  still?(): void;
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
  /** Interpolação curta (0 a 1) com rAF; devolve a função que cancela. */
  tween(dur: number, fn: (p: number) => void, done?: () => void): () => void;
  /** ResizeObserver desligado na limpeza. */
  resize(target: Element, fn: () => void): void;
  /** Nó criado pelo motor: sai do DOM na limpeza. */
  own<T extends Node>(n: T): T;
  /** Função extra para a limpeza (roda em ordem inversa). */
  defer(fn: () => void): void;
}

export function createCtx(reduced: boolean): { ctx: VtCtx; dispose: () => void } {
  const ac = new AbortController();
  const timers = new Set<number>(), frames = new Set<number>();
  const observers: ResizeObserver[] = [], owned: Node[] = [], later: (() => void)[] = [];

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
