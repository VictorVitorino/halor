/* ==========================================================================
   Estúdio · exportar HTML interativo de verdade (um arquivo, abre offline)
   e entregar o arquivo gerado. Porte de prototype/src/js/50-studio.js.
   ========================================================================== */
import { $, el, toast } from '@/lib/core';
import { escHTML } from '@/lib/slides';
import { mountSlide } from './render';
import { STUDIO } from './store';
import { slugify } from './util';

/* As mesmas famílias do protótipo, servidas pelo Google Fonts no arquivo exportado
   (o site usa fontes próprias com nomes gerados, que não valem fora dele). */
const FONTS = 'https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Sora:wght@500;600;700&display=swap';

export function exportHTML() {
  const css: string[] = [];
  for (const sh of Array.from(document.styleSheets)) {
    let rules: CSSRuleList; try { rules = sh.cssRules; } catch { continue; }
    for (const r of Array.from(rules)) {
      if (r instanceof CSSStyleRule && /(^|[\s,>(])\.(slide(?![\w-])|sl-|ly(?![\w])|fx-(revelar|brilho|subir|halo))/.test(r.selectorText)) css.push(r.cssText);
      else if (r instanceof CSSKeyframesRule && /^fx(Revelar|Brilho|Subir|Halo)$/.test(r.name)) css.push(r.cssText);
    }
  }
  const sprite = document.getElementById('hl-mark')?.closest('svg')?.outerHTML || '';
  const fonts = $<HTMLLinkElement>('link[href*="fonts.googleapis.com/css"]')?.href || FONTS;
  const slides = STUDIO.deck.map((s, i) => { const b = el('div'); mountSlide(b, s, i + 1); return b.innerHTML; }).join('\n');
  const title = escHTML(STUDIO.title);
  const doc = `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>${fonts ? `<link rel="stylesheet" href="${fonts}">` : ''}
<style>
:root{--f-display:'Sora','Helvetica Neue',Arial,sans-serif;--f-ui:'Instrument Sans','Helvetica Neue',Arial,sans-serif;--f-mono:'JetBrains Mono',ui-monospace,monospace;--ease-halo:cubic-bezier(.22,.61,.36,1)}
*{box-sizing:border-box}html,body{margin:0;height:100%;background:#07040f;color:#f4eeff;font-family:var(--f-ui)}
main{height:100%;display:grid;place-items:center;padding:2vh 2vw}
main>.slide{display:none;width:min(96vw,170vh);border-radius:10px;box-shadow:0 30px 90px -30px rgba(139,61,255,.6)}
main>.slide.on{display:block}
.hud{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);font:12px/1 var(--f-mono);letter-spacing:.06em;color:#a69cc4;background:rgba(14,8,32,.8);border:1px solid rgba(201,166,255,.2);padding:8px 12px;border-radius:99px}
@media (prefers-reduced-motion: reduce){*{animation:none!important}}
${css.join('\n')}
</style></head><body>${sprite}<main id="d">${slides}</main><p class="hud" id="hud"></p>
<script>
var S=[].slice.call(document.querySelectorAll('#d>.slide')),i=0,hud=document.getElementById('hud');
function go(n){i=Math.max(0,Math.min(S.length-1,n));S.forEach(function(s,k){s.classList.toggle('on',k===i)});var h=S[i].querySelector('.sl-h,.sl-end p');if(h){h.classList.remove('fx-subir');void h.offsetWidth;h.classList.add('fx-subir')}hud.textContent=(i+1)+' / '+S.length+'  ·  ← →  ·  F tela cheia';}
addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown'){e.preventDefault();go(i+1)}if(e.key==='ArrowLeft'||e.key==='PageUp')go(i-1);if(e.key==='Home')go(0);if(e.key==='End')go(S.length-1);if(e.key==='f'||e.key==='F'){document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen&&document.documentElement.requestFullscreen()}});
document.getElementById('d').addEventListener('click',function(e){go(e.clientX>innerWidth/3?i+1:i-1)});go(0);
<\/script></body></html>`;
  void saveFile(slugify(STUDIO.title) + '.html', doc, 'text/html');
}

/* Runtime do visualizador de artifacts (opcional): window.claude.use('downloads') */
interface DownloadsCap { save: (o: { filename: string; data: Blob }) => Promise<unknown> }
interface ClaudeRuntime { use: (cap: string) => Promise<DownloadsCap | null> }
interface CapError { code?: string }

/* Entrega um arquivo gerado. Dentro do visualizador de artifacts usa o download
   permitido pela plataforma (a pessoa confirma); fora dele, um link comum. */
export async function saveFile(name: string, data: string, type: string) {
  const done = () => toast('HTML interativo baixado: ' + name);
  const w = window as Window & { claude?: Partial<ClaudeRuntime> };
  const cl = w.claude && typeof w.claude.use === 'function' ? (w.claude as ClaudeRuntime) : null;
  if (cl) {
    let dl: DownloadsCap | null = null;
    try { dl = await cl.use('downloads'); } catch { dl = null; }
    if (dl) {
      try { await dl.save({ filename: name, data: new Blob([data], { type }) }); done(); return; }
      catch (e) {
        const code = (e as CapError | null)?.code;
        if (code === 'declined') return;
        if (code === 'rate_limited') { toast('Já existe um download esperando sua confirmação'); return; }
      }
    }
  }
  const url = URL.createObjectURL(new Blob([data], { type }));
  const a = el('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
  done();
}
