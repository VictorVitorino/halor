// Conversão fiel do HTML do protótipo (prototype/src/html) para componentes TSX.
// Uso: node tools/html-to-tsx.mjs <repo> (precisa de parse5: npm i -D parse5)
import { parseFragment } from 'parse5';
import fs from 'fs';
import path from 'path';

const REPO = process.argv[2] || '/home/user/halor';
const SRC = path.join(REPO, 'prototype/src/html/');
const WEB = path.join(REPO, 'apps/web/components/');
const UI = path.join(REPO, 'packages/ui/src/');
const html = fs.readdirSync(SRC).sort().map(f => fs.readFileSync(SRC + f, 'utf8')).join('');
const root = parseFragment(html);

const at = (n, k) => (n.attrs || []).find(a => a.name === k)?.value;
const kids = n => (n.childNodes || []).filter(c => c.nodeName[0] !== '#');
const find = (n, pred) => { if (pred(n)) return n; for (const c of n.childNodes || []) { const r = find(c, pred); if (r) return r; } return null; };
const byId = id => find(root, n => at(n, 'id') === id);

const ROUTES = { site: '/', entrar: '/entrar', assinar: '/assinar', estudio: '/estudio', editor: '/editor', painel: '/painel', apresentar: '/apresentar', admin: '/admin', marca: '/marca', '404': '/404' };
const SITE_IDS = new Set();
(function collect(n, inSite) {
  const id = at(n, 'id'); const site = inSite || id === 'v-site';
  if (site && id) SITE_IDS.add(id);
  for (const c of n.childNodes || []) collect(c, site);
})(root, false);

const ATTR = {
  class: 'className', for: 'htmlFor', tabindex: 'tabIndex', autocomplete: 'autoComplete', inputmode: 'inputMode',
  maxlength: 'maxLength', minlength: 'minLength', novalidate: 'noValidate', spellcheck: 'spellCheck', readonly: 'readOnly',
  colspan: 'colSpan', rowspan: 'rowSpan', enterkeyhint: 'enterKeyHint', crossorigin: 'crossOrigin', srcset: 'srcSet',
  'stroke-width': 'strokeWidth', 'stroke-linecap': 'strokeLinecap', 'stroke-linejoin': 'strokeLinejoin', 'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset', 'stroke-miterlimit': 'strokeMiterlimit', 'stroke-opacity': 'strokeOpacity', 'fill-opacity': 'fillOpacity',
  'fill-rule': 'fillRule', 'clip-rule': 'clipRule', 'clip-path': 'clipPath', 'stop-color': 'stopColor', 'stop-opacity': 'stopOpacity',
  'text-anchor': 'textAnchor', 'font-size': 'fontSize', 'font-weight': 'fontWeight', 'font-family': 'fontFamily', 'letter-spacing': 'letterSpacing',
  'dominant-baseline': 'dominantBaseline', 'xlink:href': 'xlinkHref', 'xmlns:xlink': 'xmlnsXlink', 'color-interpolation-filters': 'colorInterpolationFilters',
  'flood-color': 'floodColor', 'flood-opacity': 'floodOpacity', 'vector-effect': 'vectorEffect',
};
const BOOL = new Set(['hidden', 'disabled', 'multiple', 'open', 'novalidate', 'readonly', 'required', 'autofocus', 'selected', 'checked']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);

const camel = p => p.startsWith('--') ? p : p.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
const jsStr = s => JSON.stringify(s);
function styleObj(css) {
  const parts = [];
  for (const decl of css.split(';')) {
    const i = decl.indexOf(':'); if (i < 0) continue;
    const k = decl.slice(0, i).trim(), v = decl.slice(i + 1).trim(); if (!k) continue;
    const key = camel(k);
    parts.push(`${/^[A-Za-z_$][\w$]*$/.test(key) ? key : jsStr(key)}: ${jsStr(v)}`);
  }
  return `{{ ${parts.join(', ')} } as CSSProperties}`;
}
const escText = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\{/g, '&#123;').replace(/\}/g, '&#125;').replace(/\u00a0/g, '&nbsp;');

function mapHref(v, inSite) {
  if (!v.startsWith('#') || v === '#') return v;
  const key = decodeURIComponent(v.slice(1));
  if (ROUTES[key]) return ROUTES[key];
  if (SITE_IDS.has(key)) return inSite ? v : '/' + v;
  return v; // âncora local (dentro da mesma tela) ou referência de sprite
}

let usesStyle = false;
function attrs(n, ctx) {
  const out = [];
  const tag = n.nodeName;
  for (const { name, value } of n.attrs || []) {
    if (ctx.strip && ctx.strip.includes(name)) continue;
    let k = ATTR[name] || name;
    if (name === 'style') { usesStyle = true; out.push(`style=${styleObj(value)}`); continue; }
    if (name === 'value' && (tag === 'input' || tag === 'textarea' || tag === 'select')) k = 'defaultValue';
    if (name === 'checked') { out.push('defaultChecked'); continue; }
    if (name === 'selected') continue; // tratado no <select>
    if (name === 'href' && (tag === 'a') ) { out.push(`href=${jsStr(mapHref(value, ctx.inSite))}`); continue; }
    if (BOOL.has(name) && (value === '' || value === name)) { out.push(k); continue; }
    if (['tabindex', 'maxlength', 'minlength', 'colspan', 'rowspan', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-level', 'aria-setsize', 'aria-posinset', 'aria-colcount', 'aria-rowcount'].includes(name)) {
      if (/^-?\d+(\.\d+)?$/.test(value)) { out.push(`${k}={${value}}`); continue; }
    }
    if (name === 'spellcheck') { out.push(`${k}={${value === 'true'}}`); continue; }
    out.push(`${k}=${jsStr(value)}`);
  }
  if (tag === 'select') {
    const sel = (n.childNodes || []).find(c => c.nodeName === 'option' && at(c, 'selected') != null);
    if (sel && !out.some(a => a.startsWith('defaultValue'))) {
      const val = at(sel, 'value') ?? (sel.childNodes || []).map(c => c.value || '').join('');
      out.push(`defaultValue=${jsStr(val)}`);
    }
  }
  return out.length ? ' ' + out.join(' ') : '';
}

function textJSX(t, pre) {
  if (pre) return `{${jsStr(t)}}`;
  /* só o espaço em branco do HTML colapsa; o espaço fixo (U+00A0, &nbsp;) é texto e fica */
  const WS = /[ \t\n\r\f]/;
  if (!t.replace(/[ \t\n\r\f]/g, '')) return `{' '}`;
  const lead = WS.test(t[0]), trail = WS.test(t[t.length - 1]);
  const body = escText(t.replace(/^[ \t\n\r\f]+|[ \t\n\r\f]+$/g, '').replace(/[ \t\n\r\f]+/g, ' '));
  return (lead ? `{' '}` : '') + body + (trail ? `{' '}` : '');
}

const BLOCK = new Set(['div', 'section', 'header', 'footer', 'main', 'nav', 'aside', 'article', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'dl', 'dt', 'dd', 'table', 'thead', 'tbody', 'tr', 'td', 'th', 'caption', 'form', 'figure', 'figcaption', 'details', 'summary', 'pre', 'fieldset', 'legend', 'select', 'option', 'defs', 'symbol', 'linearGradient', 'radialGradient', 'stop', 'filter', 'g']);
// espaço em branco que o HTML ignora: no começo, no fim ou encostado em elemento de bloco
function isGap(list, i) {
  const c = list[i]; if (c.nodeName === '#comment') return false;
  if (c.nodeName !== '#text' || c.value.replace(/[ \t\n\r\f]/g, '')) return false;
  if (i === 0 || i === list.length - 1) return true;
  const blk = n => n && n.tagName && BLOCK.has(n.tagName);
  return blk(list[i - 1]) || blk(list[i + 1]) || list[i - 1].nodeName === '#comment' || list[i + 1].nodeName === '#comment';
}
function node(n, ctx, ind) {
  const pad = '  '.repeat(ind);
  if (n.nodeName === '#text') return pad + textJSX(n.value, ctx.pre);
  if (n.nodeName === '#comment') return pad + `{/* ${n.data.trim().replace(/\*\//g, '* /')} */}`;
  const tag = n.tagName;
  const inSite = ctx.inSite || at(n, 'id') === 'v-site';
  const c2 = { ...ctx, inSite, pre: ctx.pre || tag === 'pre', strip: null };
  const a = attrs(n, ctx);
  const children = (tag === 'template' ? n.content.childNodes : n.childNodes) || [];
  if (VOID.has(tag) || !children.length) return `${pad}<${tag}${a} />`;
  // texto curto em uma linha
  if (children.length === 1 && children[0].nodeName === '#text' && !c2.pre && !/\n/.test(children[0].value) && children[0].value.length < 90)
    return `${pad}<${tag}${a}>${textJSX(children[0].value, false)}</${tag}>`;
  const inner = children.map((c, i) => (c2.pre || !isGap(children, i)) ? node(c, c2, ind + 1) : '').filter(Boolean).join('\n');
  return `${pad}<${tag}${a}>\n${inner}\n${pad}</${tag}>`;
}

function component(file, name, nodes, opts = {}) {
  usesStyle = false;
  const ctx = { inSite: !!opts.inSite, pre: false, strip: opts.strip || null };
  const body = nodes.map((n, i) => node(n, i === 0 && opts.stripRoot ? { ...ctx, strip: opts.stripRoot } : ctx, 2)).join('\n');
  const wrapped = nodes.length > 1 ? `    <>\n${body}\n    </>` : body.replace(/^ {4}/, '    ');
  const head = `/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
${usesStyle ? "import type { CSSProperties } from 'react';\n\n" : ''}`;
  const src = `${head}export default function ${name}() {\n  return (\n${wrapped}\n  );\n}\n`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, src);
  return file;
}

const sel = (n, fn) => kids(n).filter(fn);
const cls = (n, c) => (at(n, 'class') || '').split(/\s+/).includes(c);
const written = [];
const W = (rel, name, nodes, opts) => written.push(component(path.join(WEB, rel), name, nodes, opts));

// casca
const sprite = kids(root).find(n => n.nodeName === 'svg');
written.push(component(path.join(UI, 'HalorSprite.tsx'), 'HalorSprite', [sprite]));
W('shell/ProtoNav.tsx', 'ProtoNav', [kids(root).find(n => cls(n, 'proto'))]);
W('shell/Toast.tsx', 'Toast', [byId('toast')]);
W('shell/NotFoundView.tsx', 'NotFoundView', kids(byId('v-404')));

// site
const site = byId('v-site');
W('site/SiteNav.tsx', 'SiteNav', [byId('s-nav')], { inSite: true });
const topo = byId('topo');
W('site/Cover.tsx', 'Cover', [kids(topo).find(n => cls(n, 's-cover'))], { inSite: true });
W('film/Film.tsx', 'Film', [byId('filme')], { inSite: true });
W('site/Efeito.tsx', 'Efeito', [byId('efeito')], { inSite: true });
W('site/Produto.tsx', 'Produto', [byId('produto')], { inSite: true });
W('site/Timeline.tsx', 'Timeline', [byId('linha-do-tempo')], { inSite: true });
W('site/Vitrine.tsx', 'Vitrine', [byId('vitrine')], { inSite: true });
W('commerce/Planos.tsx', 'Planos', [byId('planos')], { inSite: true });
W('site/Faq.tsx', 'Faq', [byId('faq')], { inSite: true });
W('site/Final.tsx', 'Final', [find(site, n => cls(n, 's-final'))], { inSite: true });
W('site/SiteFooter.tsx', 'SiteFooter', [find(site, n => n.nodeName === 'footer')], { inSite: true });

// conta e checkout
W('commerce/AuthView.tsx', 'AuthView', kids(byId('v-auth')));
W('commerce/CheckoutView.tsx', 'CheckoutView', kids(byId('v-checkout')));

// estúdio
W('studio/StudioSidebar.tsx', 'StudioSidebar', [byId('side')]);
const mainEl = find(byId('v-studio'), n => cls(n, 'main'));
W('studio/StudioTopbar.tsx', 'StudioTopbar', [kids(mainEl).find(n => n.nodeName === 'header')]);
const subs = sel(mainEl, n => cls(n, 'sub'));
const SUBN = { inicio: 'StudioHome', editor: 'StudioEditor', painel: 'StudioPainel', apresentar: 'StudioStage', admin: 'StudioAdmin' };
for (const s of subs) { const k = at(s, 'data-subview'); const dir = k === 'painel' ? 'dash' : 'studio'; W(`${dir}/${SUBN[k]}.tsx`, SUBN[k], [s], { stripRoot: ['hidden'] }); }
W('studio/StudioModals.tsx', 'StudioModals', kids(root).filter(n => cls(n, 'modal')));

// marca
W('brand/BrandView.tsx', 'BrandView', kids(byId('v-brand')));

// atributos das views, para as páginas reproduzirem o invólucro
const views = kids(root).filter(n => cls(n, 'view')).map(n => ({ id: at(n, 'id'), className: at(n, 'class'), view: at(n, 'data-view') }));
const studioApp = byId('app');
fs.writeFileSync(path.join(REPO, 'apps/web/components/views.json'), JSON.stringify({ views, studioApp: { id: at(studioApp, 'id'), className: at(studioApp, 'class') }, studioMain: at(mainEl, 'class') }, null, 2));
console.log(written.map(f => path.relative(REPO, f)).join('\n'));
