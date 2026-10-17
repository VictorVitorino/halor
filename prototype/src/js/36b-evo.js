/* Linha do tempo · viagem no tempo: um palco mostra como a apresentação era em cada
   época, o trilho avança sozinho enquanto a seção está à vista e para quando a pessoa escolhe */
const EVO = [
  { yr: '2016', y: '2016', t: 'Slides estáticos', d: 'Tópicos em sequência e PDF por e-mail. Quem recebe lê sozinho.', who: 'Lê sozinho', a: .16 },
  { yr: '2018', y: '2018', t: 'Na nuvem', d: 'Várias pessoas editam ao mesmo tempo. O arquivo vira link.', who: 'Comenta', a: .28 },
  { yr: '2020', y: '2020', t: 'Tela compartilhada', d: 'Tudo por vídeo. A atenção disputa espaço com dez abas abertas.', who: 'Divide a atenção', a: .2 },
  { yr: '2022', y: '2022', t: 'Modelos prontos', d: 'Design em minutos, mas muita apresentação com a mesma cara.', who: 'Reconhece o modelo', a: .34 },
  { yr: '2024', y: '2024', t: 'Gerado por IA', d: 'Slides a partir de um texto. Rápido, porém ainda parado.', who: 'Recebe pronto', a: .42 },
  { yr: '2026', y: '2026', t: 'HTML vivo e lúdico', d: 'Com o Halor, a apresentação se move, responde e convida a participar. Sem código.', who: 'Participa', a: .88, now: true },
  { yr: 'Próximos', y: 'Próximos anos', t: 'Apresentação que conversa', d: 'Ela se adapta a quem assiste, tira dúvidas e mede a atenção ao vivo.', who: 'Conversa', a: 1, next: true }
];
function bootEvo() {
  const ev = $('#ev'); if (!ev) return;
  const rail = $('.ev-rail', ev), inner = $('.ev-rail-in', ev), scenes = $$('.ev-scene', ev), info = $('.ev-info', ev);
  const track = $('.ev-track', ev), fut = $('.ev-fut', ev), fill = $('.ev-fill', ev), prog = $('.ev-prog', ev), att = $('.ev-att b', ev);
  const N = EVO.length, NOW = EVO.findIndex(e => e.now);
  const tabs = EVO.map((e, i) => {
    const b = el('button', 'ev-stop' + (e.now ? ' is-now' : '') + (e.next ? ' is-next' : ''));
    b.type = 'button'; b.id = 'ev-tab-' + i; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'ev-panel');
    b.innerHTML = `<i></i><span class="mono">${e.yr}${e.now ? ' <em>hoje</em>' : ''}</span><b>${e.t}</b>`;
    b.addEventListener('click', () => { user = true; go(i); });
    inner.appendChild(b); return b;
  });
  let cur = -1, timer = 0, visible = false, hold = false, user = false, seen = false, P = [];
  const layout = () => {
    P = tabs.map(b => { const d = $('i', b); return [b.offsetLeft + d.offsetLeft + d.offsetWidth / 2, b.offsetTop + d.offsetTop + d.offsetHeight / 2]; });
    if (!P.length || !P[0][0]) return;
    const y = P[0][1] - 1.5 + 'px', seg = (el, x0, x1) => { el.style.left = x0 + 'px'; el.style.width = Math.max(0, x1 - x0) + 'px'; el.style.top = y; };
    seg(track, P[0][0], P[NOW][0]); seg(fut, P[NOW][0], P[N - 1][0]);
    seg(fill, P[0][0], P[Math.max(0, cur)][0]);
    if (cur >= 0 && cur < N - 1) seg(prog, P[cur][0], P[cur + 1][0]); else prog.style.width = '0px';
  };
  /* leitor de tela: anuncia a época quando a pessoa escolhe ou pausa; no avanço automático fica em silêncio */
  const live = () => info.setAttribute('aria-live', REDUCED || !visible || hold || user ? 'polite' : 'off');
  const go = i => {
    live();
    cur = i; ev.dataset.i = String(i);
    tabs.forEach((b, k) => { b.setAttribute('aria-selected', String(k === i)); b.tabIndex = k === i ? 0 : -1; b.classList.toggle('past', k < i); });
    scenes.forEach((s, k) => s.classList.toggle('on', k === i));
    $('#ev-panel').setAttribute('aria-labelledby', tabs[i].id);
    const e = EVO[i];
    $('#ev-y').textContent = e.y; $('#ev-t').textContent = e.t; $('#ev-d').textContent = e.d; $('#ev-who').textContent = e.who;
    att.style.setProperty('--a', e.a);
    info.classList.remove('swap'); void info.offsetWidth; info.classList.add('swap');
    layout();
    const t = tabs[i], left = t.offsetLeft - (rail.clientWidth - t.offsetWidth) / 2;
    if (rail.scrollWidth > rail.clientWidth) rail.scrollTo({ left, behavior: REDUCED ? 'auto' : 'smooth' });
    schedule();
  };
  const schedule = () => {
    clearTimeout(timer); ev.classList.remove('ticking'); live();
    if (REDUCED || !visible || hold || user || cur < 0) return;
    const dur = cur === NOW ? 6500 : cur === N - 1 ? 5200 : 4300;
    ev.style.setProperty('--dur', dur + 'ms'); void ev.offsetWidth; ev.classList.add('ticking');
    timer = setTimeout(() => go((cur + 1) % N), dur);
  };
  inner.addEventListener('keydown', e => {
    const k = e.key; let n = cur;
    if (k === 'ArrowRight' || k === 'ArrowDown') n = (cur + 1) % N; else if (k === 'ArrowLeft' || k === 'ArrowUp') n = (cur - 1 + N) % N;
    else if (k === 'Home') n = 0; else if (k === 'End') n = N - 1; else return;
    e.preventDefault(); user = true; go(n); tabs[n].focus();
  });
  ev.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') { hold = true; schedule(); } });
  ev.addEventListener('pointerleave', () => { hold = false; schedule(); });
  ev.addEventListener('focusin', () => { hold = true; schedule(); });
  ev.addEventListener('focusout', e => { if (!ev.contains(e.relatedTarget)) { hold = false; schedule(); } });
  new IntersectionObserver(es => {
    visible = es[0].isIntersecting;
    if (visible) { if (!seen) { seen = true; go(cur); } else schedule(); } else { clearTimeout(timer); ev.classList.remove('ticking'); user = false; }
  }, { threshold: .35 }).observe(ev);
  document.addEventListener('visibilitychange', () => { if (document.hidden) { clearTimeout(timer); ev.classList.remove('ticking'); } else schedule(); });
  new ResizeObserver(layout).observe(inner);
  go(0); clearTimeout(timer);
}
