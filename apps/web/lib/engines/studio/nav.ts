/* ==========================================================================
   Estúdio · navegação entre as sub-telas pelo roteador do Next.
   No protótipo os motores trocavam location.hash; aqui pedem a rota ao roteador
   (registrado pela casca do Estúdio) para manter o estado do módulo vivo.
   ========================================================================== */

type Push = (href: string) => void;
let push: Push | null = null;
let pendingHref: string | null = null, pendingAt = 0;

/** A casca registra o roteador ao montar e remove ao sair. */
export function setNavigator(fn: Push | null) { push = fn; }

const norm = (p: string) => p.replace(/\/+$/, '') || '/';

/** Vai para uma rota do app. Na própria rota não faz nada, como trocar o hash para o mesmo valor. */
export function go(href: string) {
  if (norm(location.pathname) === norm(href)) return;
  if (pendingHref === href && performance.now() - pendingAt < 1500) return;
  pendingHref = href; pendingAt = performance.now();
  if (push) push(href); else location.href = href;
}
/** Chamado quando a rota muda: libera novas idas para o mesmo endereço. */
export function arrived() { pendingHref = null; }

/** Ações que esperam a próxima sub-tela montar (ex.: abrir a biblioteca no editor). */
export type PendingAction = 'biblioteca' | 'search-scroll';
let pending: PendingAction | null = null;
export function setPending(a: PendingAction | null) { pending = a; }
export const hasPending = (a: PendingAction) => pending === a;
export function takePending(a: PendingAction) { if (pending !== a) return false; pending = null; return true; }
