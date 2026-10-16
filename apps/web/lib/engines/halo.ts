/* ==========================================================================
   Arcos de luz neon em canvas, a assinatura visual da marca.
   Cada arco tem três passes: névoa larga, brilho médio e filamento branco.
   Usado pelo filme (abertura e fecho). Porte de prototype/src/js/10-halo.js.
   ========================================================================== */

export interface Star { x: number; y: number; r: number; p: number; s: number }
export interface HaloArc {
  /** raios em unidades de R, rotação da elipse, início, comprimento (rad), espessura, velocidade e opacidade */
  rx: number; ry: number; rot: number; s: number; len: number; w: number; sp: number; o: number;
  dx?: number; dy?: number;
}

export function makeStars(n: number): Star[] {
  const a: Star[] = [];
  for (let i = 0; i < n; i++) a.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.1 + .2, p: Math.random() * 6.28, s: Math.random() * .8 + .2 });
  return a;
}

export function drawHaloArc(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number, a: HaloArc, t: number, paper = false) {
  const s = a.s + t * a.sp, len = a.len, rx = a.rx * R, ry = a.ry * R;
  ctx.save();
  ctx.translate(cx, cy); ctx.rotate(a.rot);
  let stroke: string | CanvasGradient = 'rgba(169,112,255,.85)';
  if (ctx.createConicGradient) {
    const g = ctx.createConicGradient(s, 0, 0), f = Math.min(len / (Math.PI * 2), .999);
    if (paper) {
      g.addColorStop(0, 'rgba(196,166,255,0)'); g.addColorStop(f * .3, 'rgba(139,61,255,.55)'); g.addColorStop(f * .72, 'rgba(122,46,240,.95)');
      g.addColorStop(f * .86, 'rgba(201,166,255,.7)'); g.addColorStop(f, 'rgba(196,166,255,0)'); g.addColorStop(1, 'rgba(196,166,255,0)');
    } else {
      g.addColorStop(0, 'rgba(90,53,168,0)'); g.addColorStop(f * .3, 'rgba(139,61,255,.85)'); g.addColorStop(f * .72, 'rgba(255,255,255,1)');
      g.addColorStop(f * .86, 'rgba(201,166,255,.85)'); g.addColorStop(f, 'rgba(139,61,255,0)'); g.addColorStop(1, 'rgba(139,61,255,0)');
    }
    stroke = g;
  }
  ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, s, s + len);
  ctx.lineCap = 'round'; ctx.strokeStyle = stroke;
  ctx.globalAlpha = (paper ? .1 : .12) * a.o; ctx.lineWidth = a.w * 16; ctx.stroke();
  ctx.globalAlpha = (paper ? .25 : .4) * a.o; ctx.lineWidth = a.w * 4.5; ctx.shadowColor = paper ? 'rgba(169,112,255,.6)' : 'rgba(139,61,255,1)'; ctx.shadowBlur = 26; ctx.stroke();
  ctx.globalAlpha = a.o; ctx.lineWidth = a.w; ctx.shadowColor = paper ? 'rgba(201,166,255,.8)' : 'rgba(244,238,255,.9)'; ctx.shadowBlur = 6; ctx.stroke();
  if (paper) { ctx.restore(); return; }
  // ponto quente (o "flare")
  const th = s + len * .72, hx = rx * Math.cos(th), hy = ry * Math.sin(th), hr = a.w * 22;
  const rg = ctx.createRadialGradient(hx, hy, 0, hx, hy, hr);
  rg.addColorStop(0, 'rgba(255,255,255,.9)'); rg.addColorStop(.25, 'rgba(201,166,255,.45)'); rg.addColorStop(1, 'rgba(139,61,255,0)');
  ctx.shadowBlur = 0; ctx.globalAlpha = a.o; ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}
