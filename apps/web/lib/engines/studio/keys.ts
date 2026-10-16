/* ==========================================================================
   Estúdio · atalhos de teclado numa ordem fixa.
   No protótipo os ouvintes eram registrados em sequência (menu lateral, editor,
   atalhos gerais, palco) e cada um respeitava o que o anterior já tinha tratado.
   Aqui cada tela registra o seu ao montar e remove ao sair; um único ouvinte
   chama todos na ordem original, independente da ordem de montagem do React.
   ========================================================================== */

export type KeySlot = 'side' | 'editor' | 'studio' | 'stage';
type KeyHandler = (e: KeyboardEvent) => void;
const ORDER: KeySlot[] = ['side', 'editor', 'studio', 'stage'];
const handlers: Partial<Record<KeySlot, KeyHandler>> = {};
let ac: AbortController | null = null;

export function onStudioKey(slot: KeySlot, fn: KeyHandler): () => void {
  handlers[slot] = fn;
  if (!ac) {
    ac = new AbortController();
    document.addEventListener('keydown', e => { for (const s of ORDER) handlers[s]?.(e); }, { signal: ac.signal });
  }
  return () => {
    if (handlers[slot] === fn) delete handlers[slot];
    if (!ORDER.some(s => handlers[s]) && ac) { ac.abort(); ac = null; }
  };
}
