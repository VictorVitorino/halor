/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; as amostras de cor, a escala da cadeia, o botão de voltar e
   os modelos de slide são componentes (BrandSwatches, BrandBack, BrandSlides) e o resto do comportamento vem de lib/engines/brand. */
import type { CSSProperties } from 'react';
import Link from 'next/link';
import BrandBack from './BrandBack';
import BrandSlides from './BrandSlides';
import { ChainScale, Swatches } from './BrandSwatches';

export default function BrandView() {
  return (
    <>
    <header className="b-cover theme-night">
      <canvas className="halo-field halor-field" data-field="brand" aria-hidden="true" />
      <div className="wrap b-cover-in">
        <h1 className="sr-only">Manual da marca Halor</h1>
        <div className="b-cover-top">
          <BrandBack />
          <span className="mono b-ver">Manual da marca · v1.0 · outubro 2026</span>
        </div>
        <div className="b-hero-logo">
          <svg className="mk-glow" aria-hidden="true">
            <use href="#hl-mark" />
          </svg>
          <span className="wordmark">halor</span>
        </div>
        <p className="b-claim display">Faça cada olhar render.</p>
        <p className="lede">
          Identidade, cores, tipografia, componentes e regras de uso da Halor. Tudo que um time precisa para construir o site, o Estúdio e as apresentações com a mesma luz.
        </p>
      </div>
    </header>
    <div className="b-layout wrap">
      <nav className="b-toc" aria-label="Seções do manual">
        <Link href="#b-conceito">Conceito</Link>
        <Link href="#b-logo">Logo</Link>
        <Link href="#b-cores">Cores</Link>
        <Link href="#b-tipo">Tipografia</Link>
        <Link href="#b-comp">Componentes</Link>
        <Link href="#b-mov">Movimento</Link>
        <Link href="#b-voz">Voz</Link>
        <Link href="#b-apl">Aplicações</Link>
        <Link href="#b-mapa">Canteiro → Halor</Link>
        <Link href="#b-ondas">Próximas ondas</Link>
        <Link href="#b-tokens">Tokens</Link>
      </nav>
      <div className="b-content" data-skip="">
        {/* CONCEITO */}
        <section className="b-sec" id="b-conceito">
          <p className="eyebrow">01 · Conceito</p>
          <h2 className="b-h">Halo + valor = Halor.</h2>
          <div className="name-math" aria-label="Halo mais valor forma Halor">
            <span className="nm-w">
              <b>halo</b>
              <small>a primeira impressão que ilumina todo o resto</small>
            </span>
            {' '}
            <span className="nm-op">+</span>
            {' '}
            <span className="nm-w">
              <b>
                val
                <u>or</u>
              </b>
              <small>o resultado que essa luz gera</small>
            </span>
            {' '}
            <span className="nm-op">=</span>
            {' '}
            <span className="nm-w nm-res">
              <b>
                hal
                <u>or</u>
              </b>
              <small>o halo que vira valor</small>
            </span>
          </div>
          <p className="b-p">
            O nome junta o efeito halo, descrito por Edward Thorndike em 1920, com o valor que ele gera. A primeira impressão ilumina o julgamento de todo o resto, e a Halor existe para capturar essa atenção e mantê-la acesa do primeiro ao último slide: numa aula, num kickoff, numa abertura de evento ou numa reunião de time. O caminho é a experiência. Movimento com propósito guia o olhar, e a interação traz quem assiste para dentro. Por isso o logo é um halo aberto: o vão é a porta por onde a plateia entra.
          </p>
          <div className="persona">
            <div>
              <h3>Luminosa</h3>
              <p>
                <b>É</b>
                {' '}clara, viva, fácil de lembrar.
              </p>
              <p>
                <b>Não é</b>
                {' '}ofuscante nem exagerada.
              </p>
            </div>
            <div>
              <h3>Precisa</h3>
              <p>
                <b>É</b>
                {' '}medida, objetiva, baseada em dado.
              </p>
              <p>
                <b>Não é</b>
                {' '}fria nem técnica demais.
              </p>
            </div>
            <div>
              <h3>Próxima</h3>
              <p>
                <b>É</b>
                {' '}humana, direta, do lado de quem apresenta.
              </p>
              <p>
                <b>Não é</b>
                {' '}informal demais nem apelativa.
              </p>
            </div>
          </div>
          <h3 className="b-h3">Arquitetura da marca</h3>
          <div className="arch">
            <svg viewBox="0 0 560 300" role="img" aria-labelledby="arch-t" className="arch-svg">
              <title id="arch-t">Halor no centro, cercada por Estúdio, Raio, Link, Palco e Painel</title>
              {' '}
              <circle cx="280" cy="150" r="128" className="ar-o" />
              <circle cx="280" cy="150" r="82" className="ar-m" />
              {' '}
              <circle cx="280" cy="150" r="44" className="ar-c" />
              {' '}
              <text x="280" y="156" textAnchor="middle" className="ar-core">halor</text>
              <g className="ar-n">
                <circle cx="280" cy="22" r="6" />
                <text x="280" y="12" textAnchor="middle">Estúdio · criar</text>
              </g>
              <g className="ar-n">
                <circle cx="402" cy="110" r="6" />
                <text x="414" y="104">Raio · prever</text>
              </g>
              <g className="ar-n">
                <circle cx="355" cy="254" r="6" />
                <text x="367" y="274">Link · enviar</text>
              </g>
              <g className="ar-n">
                <circle cx="205" cy="254" r="6" />
                <text x="193" y="274" textAnchor="end">Palco · apresentar</text>
              </g>
              <g className="ar-n">
                <circle cx="158" cy="110" r="6" />
                <text x="146" y="104" textAnchor="end">Painel · medir</text>
              </g>
            </svg>
            <ul className="arch-list">
              <li>
                <b>Halor Estúdio</b>
                <span>Onde se constrói. Mundo Papel.</span>
              </li>
              <li>
                <b>Raio Halor</b>
                <span>IA que prevê o caminho do olhar antes do envio.</span>
              </li>
              <li>
                <b>Link Halor</b>
                <span>Envio medido: cada abertura vira sinal.</span>
              </li>
              <li>
                <b>Palco</b>
                <span>Modo apresentação com a plateia votando, escrevendo e respondendo ao vivo.</span>
              </li>
              <li>
                <b>Painel Halor</b>
                <span>Cada passo de aproximação, em números.</span>
              </li>
            </ul>
          </div>
        </section>
        {/* LOGO */}
        <section className="b-sec" id="b-logo">
          <p className="eyebrow">02 · Logo</p>
          <h2 className="b-h">Um halo aberto, um núcleo aceso.</h2>
          <div className="logo-stage">
            <div className="ls ls-night theme-night">
              <span className="logo logo-night ls-big">
                <svg className="mk-glow" aria-hidden="true">
                  <use href="#hl-mark" />
                </svg>
                <span className="wordmark">halor</span>
              </span>
              <span className="ls-cap mono">Principal · Noite</span>
            </div>
            <div className="ls ls-paper">
              <span className="logo ls-big">
                <svg aria-hidden="true">
                  <use href="#hl-mark-paper" />
                </svg>
                <span className="wordmark">halor</span>
              </span>
              <span className="ls-cap mono">Principal · Papel</span>
            </div>
          </div>
          <div className="anat">
            <div className="anat-fig">
              <svg viewBox="-58 -14 200 92" className="anat-svg" role="img" aria-labelledby="anat-t">
                <title id="anat-t">Anatomia da marca com grade de construção</title>
                <g className="grid-g">
                  <path d="M-8 0H72M-8 16H72M-8 32H72M-8 48H72M-8 64H72M0 -8V72M16 -8V72M32 -8V72M48 -8V72M64 -8V72" />
                </g>
                <circle cx="32" cy="32" r="26" className="guide" />
                <circle cx="32" cy="32" r="16.5" className="guide" />
                <circle cx="32" cy="32" r="8.5" className="guide" />
                {' '}
                <path d="M32 32L60 4M32 32L64 22" className="guide-a" />
                {' '}
                <use href="#hl-mark-paper" x="0" y="0" width="64" height="64" />
                <g className="callout">
                  <path d="M50.4 13.6L80 -4" />
                  <text x="81" y="-3">Faísca · o primeiro olhar</text>
                </g>
                <g className="callout">
                  <path d="M57 40L82 46" />
                  <text x="83" y="47">Halo aberto · atenção</text>
                </g>
                <g className="callout">
                  <path d="M18 22L-12 10" />
                  <text x="-13" y="9" textAnchor="end">Anel · confiança</text>
                </g>
                <g className="callout">
                  <path d="M28 36L-12 52" />
                  <text x="-13" y="54" textAnchor="end">Núcleo · valor</text>
                </g>
                <text x="62" y="18" className="ang">40°</text>
              </svg>
            </div>
            <dl className="anat-spec">
              <div>
                <dt>Grade</dt>
                <dd>64 × 64 unidades</dd>
              </div>
              <div>
                <dt>Halo</dt>
                <dd>raio 26, traço 5,5, abertura de 40° a 45° (canto superior direito)</dd>
              </div>
              <div>
                <dt>Anel</dt>
                <dd>raio 16,5, traço 1,6, opacidade 60%</dd>
              </div>
              <div>
                <dt>Núcleo</dt>
                <dd>raio 8,5, gradiente Lúmen → Violeta</dd>
              </div>
              <div>
                <dt>Palavra</dt>
                <dd>Sora SemiBold, caixa baixa, espaço -3%</dd>
              </div>
              <div>
                <dt>Área de respiro</dt>
                <dd>o diâmetro do núcleo em volta de tudo</dd>
              </div>
              <div>
                <dt>Tamanho mínimo</dt>
                <dd>marca 16 px · assinatura 96 px de largura</dd>
              </div>
            </dl>
          </div>
          <div className="versions">
            <figure>
              <div className="v-box v-icon">
                <svg aria-hidden="true">
                  <use href="#hl-mark" />
                </svg>
              </div>
              <figcaption>Ícone do app</figcaption>
            </figure>
            <figure>
              <div className="v-box v-violet">
                <svg aria-hidden="true">
                  <use href="#hl-mark-mono" />
                </svg>
              </div>
              <figcaption>Monocromática sobre violeta</figcaption>
            </figure>
            <figure>
              <div className="v-box v-ink">
                <svg aria-hidden="true">
                  <use href="#hl-mark-mono" />
                </svg>
              </div>
              <figcaption>Monocromática tinta</figcaption>
            </figure>
            <figure>
              <div className="v-box v-fav">
                <svg width="16" height="16" aria-hidden="true">
                  <use href="#hl-mark" />
                </svg>
                <svg width="24" height="24" aria-hidden="true">
                  <use href="#hl-mark" />
                </svg>
                <svg width="32" height="32" aria-hidden="true">
                  <use href="#hl-mark" />
                </svg>
              </div>
              <figcaption>Favicon 16 · 24 · 32</figcaption>
            </figure>
          </div>
          <h3 className="b-h3">Não faça</h3>
          <div className="misuse">
            <figure>
              <div className="mu-box">
                <svg style={{ transform: "scaleX(1.5)" } as CSSProperties} aria-hidden="true">
                  <use href="#hl-mark-paper" />
                </svg>
              </div>
              <figcaption>
                <svg aria-hidden="true">
                  <use href="#i-x" />
                </svg>
                Distorcer
              </figcaption>
            </figure>
            <figure>
              <div className="mu-box">
                <svg style={{ transform: "rotate(150deg)" } as CSSProperties} aria-hidden="true">
                  <use href="#hl-mark-paper" />
                </svg>
              </div>
              <figcaption>
                <svg aria-hidden="true">
                  <use href="#i-x" />
                </svg>
                Girar a abertura
              </figcaption>
            </figure>
            <figure>
              <div className="mu-box">
                <svg style={{ filter: "hue-rotate(120deg)" } as CSSProperties} aria-hidden="true">
                  <use href="#hl-mark-paper" />
                </svg>
              </div>
              <figcaption>
                <svg aria-hidden="true">
                  <use href="#i-x" />
                </svg>
                Trocar as cores
              </figcaption>
            </figure>
            <figure>
              <div className="mu-box mu-busy">
                <svg aria-hidden="true">
                  <use href="#hl-mark-paper" />
                </svg>
              </div>
              <figcaption>
                <svg aria-hidden="true">
                  <use href="#i-x" />
                </svg>
                Fundo poluído
              </figcaption>
            </figure>
          </div>
        </section>
        {/* CORES */}
        <section className="b-sec" id="b-cores">
          <p className="eyebrow">03 · Cores</p>
          <h2 className="b-h">Dois mundos, uma luz.</h2>
          <p className="b-p">
            A Noite é o palco da marca: site, apresentações e momentos de impacto. O Papel é onde se trabalha: o Estúdio de construção, limpo e claro. O violeta é o fio que liga os dois. Clique em uma cor para copiar o código.
          </p>
          <h3 className="b-h3">Núcleo · Noite</h3>
          <Swatches world="night" />
          <h3 className="b-h3">Estúdio · Papel</h3>
          <Swatches world="paper" />
          <h3 className="b-h3">Proporção de uso</h3>
          <div className="prop">
            <div className="prop-row">
              <span className="prop-l mono">Noite</span>
              <div className="prop-bar">
                <i style={{ flex: "70", background: "#07040f" } as CSSProperties}>
                  {'70\u00a0'}
                  <span>Vazio</span>
                </i>
                <i style={{ flex: "20", background: "#171030" } as CSSProperties}>
                  {'20\u00a0'}
                  <span>Crepúsculo</span>
                </i>
                <i style={{ flex: "8", background: "#8b3dff" } as CSSProperties}>8</i>
                <i style={{ flex: "2", background: "#f4eeff" } as CSSProperties} />
              </div>
            </div>
            <div className="prop-row">
              <span className="prop-l mono">Papel</span>
              <div className="prop-bar prop-paper">
                <i style={{ flex: "70", background: "#ffffff", color: "#17112b" } as CSSProperties}>
                  {'70\u00a0'}
                  <span>Branco</span>
                </i>
                <i style={{ flex: "20", background: "#f3eeff", color: "#17112b" } as CSSProperties}>
                  {'20\u00a0'}
                  <span>Lilás</span>
                </i>
                <i style={{ flex: "8", background: "#17112b" } as CSSProperties}>8</i>
                <i style={{ flex: "2", background: "#8b3dff" } as CSSProperties} />
              </div>
            </div>
          </div>
          <h3 className="b-h3">Escala da Cadeia Halor · dados</h3>
          <p className="b-p b-small">
            Um matiz só, do primeiro passo (Atenção) ao último (Valor). No Papel escurece; na Noite acende. Validada como rampa ordinal: luminosidade monotônica e passos visíveis.
          </p>
          <ChainScale world="paper" />
          <ChainScale world="night" />
          <h3 className="b-h3">Semântica</h3>
          <div className="sem">
            <span className="chip chip-ok">
              <svg aria-hidden="true">
                <use href="#i-check" />
              </svg>
              {' '}Sucesso #17845A
            </span>
            {' '}
            <span className="chip chip-warn">
              <svg aria-hidden="true">
                <use href="#i-alert" />
              </svg>
              {' '}Atenção #8F5A00
            </span>
            {' '}
            <span className="chip chip-danger">
              <svg aria-hidden="true">
                <use href="#i-x" />
              </svg>
              {' '}Erro #C22F4B
            </span>
            {' '}
            <span className="chip" style={{ background: "var(--info-wash)", color: "var(--info)" } as CSSProperties}>Informação #2D62C4</span>
          </div>
        </section>
        {/* TIPOGRAFIA */}
        <section className="b-sec" id="b-tipo">
          <p className="eyebrow">04 · Tipografia</p>
          <h2 className="b-h">Larga para chamar, precisa para ler.</h2>
          <div className="type-grid">
            <article className="ty ty-display theme-night">
              <p className="ty-k mono">Display · Sora</p>
              <p className="ty-spec" style={{ fontFamily: "var(--f-display)" } as CSSProperties}>Aa</p>
              <p className="ty-s" style={{ fontFamily: "var(--f-display)" } as CSSProperties}>Faça cada olhar render.</p>
              <p className="ty-use">Logo, títulos de impacto e números de capa. Nunca em texto corrido.</p>
            </article>
            <article className="ty">
              <p className="ty-k mono">Interface e texto · Instrument Sans</p>
              <p className="ty-spec">Aa</p>
              <p className="ty-s">Atenção gera interesse. Interesse gera curiosidade.</p>
              <p className="ty-use">Tudo que se lê e se clica: botões, parágrafos, tabelas e números de painel.</p>
            </article>
            <article className="ty">
              <p className="ty-k mono">Dados e rótulos · JetBrains Mono</p>
              <p className="ty-spec mono">Aa</p>
              <p className="ty-s mono">ÍNDICE HALOR · 86/100</p>
              <p className="ty-use">Sobretítulos, códigos, tempos e rótulos técnicos. Sempre pequena.</p>
            </article>
          </div>
          <div className="scale">
            <div>
              <span className="mono">Display</span>
              <p style={{ font: "600 56px/1 var(--f-display)", letterSpacing: "-.035em" } as CSSProperties}>Seja escolhido</p>
              <span className="mono">56-96 / 1,02 / -3,5%</span>
            </div>
            <div>
              <span className="mono">Título 1</span>
              <p style={{ font: "600 40px/1.05 var(--f-display)", letterSpacing: "-.03em" } as CSSProperties}>Atenção que fica</p>
              <span className="mono">30-48 / 1,04 / -3%</span>
            </div>
            <div>
              <span className="mono">Título 2</span>
              <p style={{ font: "600 26px/1.15 var(--f-ui)", letterSpacing: "-.01em" } as CSSProperties}>O visual vira número</p>
              <span className="mono">26 / 1,15</span>
            </div>
            <div>
              <span className="mono">Texto</span>
              <p style={{ font: "400 16px/1.55 var(--f-ui)" } as CSSProperties}>Cada passo de aproximação ganha um indicador.</p>
              <span className="mono">16 / 1,55</span>
            </div>
            <div>
              <span className="mono">Apoio</span>
              <p style={{ font: "400 13.5px/1.5 var(--f-ui)", color: "var(--mute)" } as CSSProperties}>Dados ilustrativos de um time de exemplo.</p>
              <span className="mono">13,5 / 1,5</span>
            </div>
            <div>
              <span className="mono">Sobretítulo</span>
              <p style={{ font: "500 11px/1 var(--f-mono)", letterSpacing: ".16em", textTransform: "uppercase", color: "var(--halor-violet-700)" } as CSSProperties}>Painel Halor</p>
              <span className="mono">11 / caixa-alta / +16%</span>
            </div>
          </div>
        </section>
        {/* COMPONENTES */}
        <section className="b-sec" id="b-comp">
          <p className="eyebrow">05 · Componentes</p>
          <h2 className="b-h">Os mesmos componentes nos dois mundos.</h2>
          <div className="comp-grid">
            <div className="comp theme-paper">
              <p className="comp-k mono">Papel</p>
              <div className="comp-row">
                <button className="btn btn-primary" type="button">Assinar Halo</button>
                <button className="btn btn-ghost" type="button">Ver modelos</button>
                <button className="btn btn-quiet" type="button">Cancelar</button>
              </div>
              <div className="comp-row">
                <div className="field" style={{ flex: "1", minWidth: "200px" } as CSSProperties}>
                  <label htmlFor="cmp-1">E-mail</label>
                  <input className="input" id="cmp-1" placeholder="voce@empresa.com.br" />
                </div>
              </div>
              <div className="comp-row">
                <span className="chip">Raio Halor</span>
                <span className="chip chip-ok">
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  {' '}Assinada
                </span>
                <span className="chip chip-warn">Revisar título</span>
                <span className="hscore">
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <circle cx="10" cy="10" r="8" fill="none" strokeWidth="3" className="trk" />
                    <circle cx="10" cy="10" r="8" fill="none" strokeWidth="3" className="val" style={{ strokeDasharray: "43 50" } as CSSProperties} />
                  </svg>
                  86
                </span>
              </div>
              <div className="comp-row">
                <div className="seg" role="group" aria-label="Exemplo">
                  <button type="button" aria-pressed="true">Mensal</button>
                  <button type="button" aria-pressed="false">Anual</button>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked aria-label="Exemplo de alternância" />
                  <span />
                </label>
              </div>
            </div>
            <div className="comp theme-night">
              <p className="comp-k mono">Noite</p>
              <div className="comp-row">
                <button className="btn btn-primary" type="button">Começar grátis</button>
                <button className="btn btn-ghost" type="button">Conheça o Halor</button>
                <button className="btn btn-lumen" type="button">Seja escolhido</button>
              </div>
              <div className="comp-row">
                <div className="field" style={{ flex: "1", minWidth: "200px" } as CSSProperties}>
                  <label htmlFor="cmp-2">E-mail</label>
                  <input className="input" id="cmp-2" placeholder="voce@empresa.com.br" />
                </div>
              </div>
              <div className="comp-row">
                <span className="chip">Raio Halor</span>
                <span className="chip chip-ok">
                  <svg aria-hidden="true">
                    <use href="#i-check" />
                  </svg>
                  {' '}Assinada
                </span>
                <span className="chip chip-warn">Revisar título</span>
                <span className="chip">
                  <i className="dot dot-live" />
                  {' '}Ao vivo
                </span>
              </div>
              <div className="comp-row">
                <div className="seg" role="group" aria-label="Exemplo">
                  <button type="button" aria-pressed="false">Antes</button>
                  <button type="button" aria-pressed="true">Com Halor</button>
                </div>
                <label className="switch">
                  <input type="checkbox" defaultChecked aria-label="Exemplo de alternância" />
                  <span />
                </label>
              </div>
            </div>
          </div>
          <dl className="tok-mini">
            <div>
              <dt>Raios</dt>
              <dd>
                <i style={{ borderRadius: "6px" } as CSSProperties} />
                6
                <i style={{ borderRadius: "8px" } as CSSProperties} />
                8
                <i style={{ borderRadius: "12px" } as CSSProperties} />
                12
                <i style={{ borderRadius: "18px" } as CSSProperties} />
                18
                <i style={{ borderRadius: "28px" } as CSSProperties} />
                28
                <i style={{ borderRadius: "99px" } as CSSProperties} />
                pílula
              </dd>
            </div>
            <div>
              <dt>Espaços</dt>
              <dd className="mono">4 · 8 · 12 · 16 · 24 · 32 · 48 · 72 · 112</dd>
            </div>
            <div>
              <dt>Foco</dt>
              <dd>anel de 2 px em Violeta (Papel) ou Brilho (Noite), afastado 3 px</dd>
            </div>
          </dl>
        </section>
        {/* MOVIMENTO */}
        <section className="b-sec" id="b-mov">
          <p className="eyebrow">06 · Movimento</p>
          <h2 className="b-h">A luz guia o olhar. Nunca o distrai.</h2>
          <div className="mov-grid">
            <div className="mov mov-field theme-night">
              <span className="mv-stage">
                <canvas className="halo-field halor-field" data-field="demo" aria-hidden="true" />
              </span>
              <b>Campo Halor</b>
              <small className="mono">partículas que respiram · o cursor reúne um halo · clique solta uma onda</small>
              <button className="btn btn-quiet btn-xs" type="button" data-field-replay="demo">
                <svg aria-hidden="true">
                  <use href="#i-replay" />
                </svg>
                {' '}Repetir entrada
              </button>
            </div>
            <button className="mov theme-night" type="button" data-replay="">
              <span className="mv-stage">
                <span className="mv-sweep">Atenção conquistada</span>
              </span>
              <b>Varredura de luz</b>
              <small className="mono">1400 ms · halo-out · uma vez por conquista</small>
            </button>
            {' '}
            <button className="mov theme-night" type="button" data-replay="">
              <span className="mv-stage">
                <span className="mv-reveal">
                  <i />
                  <i />
                  <i />
                </span>
              </span>
              <b>Revelação em cadeia</b>
              <small className="mono">240 ms por item · atraso 80 ms</small>
            </button>
          </div>
          <dl className="tok-mini">
            <div>
              <dt>Durações</dt>
              <dd className="mono">120 rápido · 240 base · 480 lento · 900 cinema</dd>
            </div>
            <div>
              <dt>Curvas</dt>
              <dd className="mono">halo-out cubic-bezier(.22,.61,.36,1) · faísca cubic-bezier(.34,1.56,.64,1)</dd>
            </div>
            <div>
              <dt>Regra</dt>
              <dd>
                Movimento só quando muda algo para o usuário. Com "reduzir movimento" ligado, tudo vira corte seco.
              </dd>
            </div>
          </dl>
        </section>
        {/* VOZ */}
        <section className="b-sec" id="b-voz">
          <p className="eyebrow">07 · Voz</p>
          <h2 className="b-h">Frases curtas. Verbos de ação. Números quando houver.</h2>
          <div className="voice">
            <div className="vc vc-yes">
              <p className="vc-k">
                <svg aria-hidden="true">
                  <use href="#i-check" />
                </svg>
                {' '}Assim
              </p>
              <p>“3 pessoas abriram sua apresentação desde ontem.”</p>
              <p>“Título com 11 palavras. Títulos de até 7 seguram mais o olhar.”</p>
              <p>“Assinatura ativa. Bem-vindo à órbita.”</p>
            </div>
            <div className="vc vc-no">
              <p className="vc-k">
                <svg aria-hidden="true">
                  <use href="#i-x" />
                </svg>
                {' '}Assim não
              </p>
              <p>“Revolucione suas vendas com o poder da neurociência!”</p>
              <p>“Erro: violação da heurística de legibilidade.”</p>
              <p>“Parabéns!!! Sua transação foi processada com sucesso!”</p>
            </div>
          </div>
        </section>
        {/* APLICAÇÕES */}
        <section className="b-sec" id="b-apl">
          <p className="eyebrow">08 · Aplicações</p>
          <h2 className="b-h">A marca viva em cada tela.</h2>
          <h3 className="b-h3">Modelos de slide</h3>
          <BrandSlides />
          <div className="apl-grid">
            <figure className="apl-post theme-night">
              <div className="post">
                <svg aria-hidden="true">
                  <use href="#hl-mark" />
                </svg>
                <p className="display">50 ms.</p>
                <span>É o tempo que a sua plateia leva para julgar o seu slide.</span>
                <b className="wordmark">halor</b>
              </div>
              <figcaption>Post 1:1 para redes</figcaption>
            </figure>
            <figure className="apl-card">
              <div className="bcard bc-front theme-night">
                <span className="logo logo-night">
                  <svg className="mk-glow" aria-hidden="true">
                    <use href="#hl-mark" />
                  </svg>
                  <span className="wordmark">halor</span>
                </span>
                <span className="bc-tag">Faça cada olhar render.</span>
              </div>
              <div className="bcard bc-back">
                <b>Helena Rocha</b>
                <span>Diretora de marca</span>
                <span className="mono">helena@halor.com.br</span>
                <svg aria-hidden="true">
                  <use href="#hl-mark-paper" />
                </svg>
              </div>
              <figcaption>Cartão de visita · frente e verso</figcaption>
            </figure>
            <figure className="apl-phone">
              <div className="phone">
                <div className="ph-screen">
                  <span className="ph-time mono">9:41</span>
                  <div className="ph-icons">
                    <i />
                    <i />
                    <span className="ph-app">
                      <svg aria-hidden="true">
                        <use href="#hl-mark" />
                      </svg>
                    </span>
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </div>
                  <div className="ph-notif">
                    <svg aria-hidden="true">
                      <use href="#hl-mark" />
                    </svg>
                    <div>
                      <b>{'Grupo Aurora está a 45\u00a0cm'}</b>
                      <span>Voltou e perguntou no slide 6</span>
                    </div>
                  </div>
                </div>
              </div>
              <figcaption>Ícone e notificação</figcaption>
            </figure>
          </div>
        </section>
        {/* MAPA CANTEIRO → HALOR */}
        <section className="b-sec" id="b-mapa">
          <p className="eyebrow">09 · De Canteiro para Halor</p>
          <h2 className="b-h">O que muda, tela a tela.</h2>
          <p className="b-p">
            O Canteiro usava a metáfora da obra. A Halor troca a obra pela luz e mantém tudo que já funcionava: editor, acervo, importação, exportação, comentários e administração.
          </p>
          <div className="ba" aria-label="Comparativo da página inicial: antes e depois">
            <figure className="ba-fig">
              <div className="ba-scr ba-old" aria-hidden="true">
                <span className="bo-top">
                  <b>A&amp;M</b>
                  <i />
                  <i />
                </span>
                {' '}
                <span className="bo-hi">Olá, vamos construir?</span>
                {' '}
                <span className="bo-title">
                  Canteiro
                  <em />
                </span>
                {' '}
                <span className="bo-tiles">
                  <i>Obra nova</i>
                  <i>Projetos prontos</i>
                  <i>Retomar obra</i>
                  <i>Abrir planta</i>
                  <i>Almoxarifado</i>
                  <i>Manual da obra</i>
                </span>
                {' '}
                <span className="bo-crane">
                  <i className="c1" />
                  <i className="c2" />
                  <i className="c3" />
                  <i className="c4" />
                </span>
              </div>
              <figcaption>
                <b>Antes</b>
                {' '}· capa do Canteiro: planta azul, laranja e a metáfora da obra
              </figcaption>
            </figure>
            <span className="ba-arrow" aria-hidden="true">
              <svg>
                <use href="#i-arrow" />
              </svg>
            </span>
            <figure className="ba-fig">
              <div className="ba-scr ba-new" aria-hidden="true">
                <span className="bn-side">
                  <svg>
                    <use href="#hl-mark-paper" />
                  </svg>
                  <i className="on" />
                  <i />
                  <i />
                  <i />
                </span>
                {' '}
                <span className="bn-main">
                  <span className="bn-hero">
                    <span className="bn-arc" />
                    <span className="bn-arc a2" />
                    <b>Bom dia, Marina.</b>
                    <small>3 pessoas olharam suas apresentações</small>
                    <span className="bn-ring">82</span>
                  </span>
                  {' '}
                  <span className="bn-tiles">
                    <i className="hot" />
                    <i />
                    <i />
                    <i />
                    <i />
                    <i />
                  </span>
                  {' '}
                  <span className="bn-cards">
                    <i />
                    <i />
                    <i />
                    <i className="sig" />
                  </span>
                </span>
              </div>
              <figcaption>
                <b>Depois</b>
                {' '}· Início do Halor Estúdio: papel limpo, halo lilás e sinais da cadeia
              </figcaption>
            </figure>
          </div>
          <div className="tbl-wrap map-wrap">
            <table className="tbl map">
              <thead>
                <tr>
                  <th scope="col">Item</th>
                  <th scope="col">Canteiro (hoje)</th>
                  <th scope="col">Halor (novo)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Metáfora</th>
                  <td>Obra, planta, almoxarifado</td>
                  <td>Luz, halo, órbita</td>
                </tr>
                <tr>
                  <th scope="row">Cores</th>
                  <td>
                    <span className="mini-sw" style={{ "--c": "#002a46" } as CSSProperties} />
                    Navy #002A46 ·{' '}
                    <span className="mini-sw" style={{ "--c": "#f78c16" } as CSSProperties} />
                    Laranja #F78C16
                  </td>
                  <td>
                    <span className="mini-sw" style={{ "--c": "#07040f" } as CSSProperties} />
                    Vazio #07040F ·{' '}
                    <span className="mini-sw" style={{ "--c": "#8b3dff" } as CSSProperties} />
                    Violeta #8B3DFF
                  </td>
                </tr>
                <tr>
                  <th scope="row">Fontes</th>
                  <td>Roboto Condensed + Inter</td>
                  <td>Sora + Instrument Sans</td>
                </tr>
                <tr>
                  <th scope="row">Tema escuro</th>
                  <td>Prancha (planta azul)</td>
                  <td>Noite (halo neon)</td>
                </tr>
                <tr>
                  <th scope="row">Tema claro</th>
                  <td>Claro (gelo e navy)</td>
                  <td>Papel (branco e lilás)</td>
                </tr>
                <tr>
                  <th scope="row">Capa</th>
                  <td>
                    Obra nova · Projetos prontos · Retomar obra · Abrir planta · Almoxarifado · Manual da obra
                  </td>
                  <td>Nova apresentação · Modelos · Retomar · Importar arquivo · Biblioteca · Guia da marca</td>
                </tr>
                <tr>
                  <th scope="row">Acervo</th>
                  <td>Minhas obras</td>
                  <td>Acervo: Todas · Minhas · Do time · Lixeira</td>
                </tr>
                <tr>
                  <th scope="row">Login</th>
                  <td>Mestre de obras com guindaste</td>
                  <td>O halo que observa (fecha o olho na senha)</td>
                </tr>
                <tr>
                  <th scope="row">Exportar</th>
                  <td>HTML, PDF, PowerPoint</td>
                  <td>Os mesmos + Link Halor medido</td>
                </tr>
                <tr>
                  <th scope="row">404</th>
                  <td>Peça fora do lugar</td>
                  <td>Esta página saiu da órbita</td>
                </tr>
                <tr>
                  <th scope="row">Novo</th>
                  <td>Não existia</td>
                  <td>Raio Halor, Vitrine de efeitos, Pulso da audiência, Planos e pagamento</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* PRÓXIMAS ONDAS */}
        <section className="b-sec" id="b-ondas">
          <p className="eyebrow">10 · Próximas ondas</p>
          <h2 className="b-h">Do incremento à disrupção.</h2>
          <div className="waves">
            <div className="wv">
              <p className="wv-k mono">Incremental · agora</p>
              <ul>
                <li>Raio Halor por slide</li>
                <li>Link medido em todo envio</li>
                <li>Kit de marca travado por time</li>
                <li>Modelos por setor</li>
                <li>PowerPoint editável sem perda</li>
              </ul>
            </div>
            <div className="wv">
              <p className="wv-k mono">Transformacional · 6 meses</p>
              <ul>
                <li>Coach de narrativa: reescreve títulos e ordena slides</li>
                <li>Mapa de atenção ao vivo, slide a slide</li>
                <li>Capas em teste A/B automático</li>
                <li>Órbita do mês: ranking do Índice Halor no time</li>
                <li>Reações da plateia que entram no slide na hora</li>
              </ul>
            </div>
            <div className="wv wv-hot theme-night">
              <p className="wv-k mono">Disruptiva · horizonte</p>
              <ul>
                <li>Apresentação viva: o deck se adapta a quem abre</li>
                <li>Agente que monta o deck a partir da reunião gravada</li>
                <li>Sala Halor: quem assistiu pergunta ao deck, 24 horas</li>
                <li>Índice Halor como referência de mercado</li>
                <li>Marketplace de modelos que prendem o olhar</li>
              </ul>
            </div>
          </div>
        </section>
        {/* TOKENS */}
        <section className="b-sec" id="b-tokens">
          <p className="eyebrow">11 · Tokens</p>
          <h2 className="b-h">Pronto para o front-end.</h2>
          <p className="b-p">
            Copie as variáveis ou use o arquivo{' '}
            <code>design-system/halor-tokens.css</code>
            {' '}do repositório. Os componentes usam só os papéis (
            <code>--bg</code>
            ,{' '}
            <code>--text</code>
            ,{' '}
            <code>--accent</code>
            …), então trocar de mundo é trocar uma classe:{' '}
            <code>.theme-night</code>
            {' '}ou{' '}
            <code>.theme-paper</code>
            .
          </p>
          <div className="code">
            <button className="btn btn-ghost btn-xs code-copy" type="button" data-copy="#tok-code">
              <svg aria-hidden="true">
                <use href="#i-copy" />
              </svg>
              {' '}Copiar
            </button>
            <pre id="tok-code">
              <code>
                {":root {\n  --halor-void:   #07040f;  /* Vazio */\n  --halor-violet: #8b3dff;  /* Violeta Halor */\n  --halor-neon:   #a970ff;  /* Neon (texto no escuro) */\n  --halor-glow:   #c9a6ff;  /* Brilho */\n  --halor-lumen:  #f4eeff;  /* Lúmen */\n  --paper: #ffffff;  --mist: #f8f6fe;  --lilac-50: #f3eeff;\n  --ink:   #17112b;  --ink-2: #4a4366; --line: #e8e3f4;\n  --f-display: 'Sora', 'Helvetica Neue', Arial, sans-serif;\n  --f-ui:      'Instrument Sans', 'Helvetica Neue', Arial, sans-serif;\n  --f-mono:    'JetBrains Mono', ui-monospace, monospace;\n  --r-sm: 8px; --r-md: 12px; --r-lg: 18px; --r-pill: 999px;\n  --ease-halo: cubic-bezier(.22, .61, .36, 1);\n}\n.theme-night { --bg: var(--halor-void);  --text: var(--halor-lumen); --accent: var(--halor-violet); }\n.theme-paper { --bg: var(--mist);        --text: var(--ink);         --accent: var(--halor-violet); }"}
              </code>
            </pre>
          </div>
        </section>
      </div>
    </div>
    </>
  );
}
