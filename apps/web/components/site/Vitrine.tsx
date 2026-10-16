/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines. */
import type { CSSProperties } from 'react';

export default function Vitrine() {
  return (
    <section className="s-sec theme-night vt-sec" id="vitrine" aria-labelledby="vt-h">
      <div className="wrap">
        <div className="s-head">
          <p className="eyebrow">Vitrine de efeitos</p>
          <h2 className="display" id="vt-h">40 efeitos que prendem o olhar.</h2>
          <p className="lede">
            Cada efeito já entra na apresentação com a marca de quem usa: suas cores, sua fonte, seu logo. Os doze abaixo estão ao vivo. Toque, arraste e experimente.
          </p>
        </div>
        <div className="vt-filter" role="group" aria-labelledby="vt-filter-l">
          <p className="vt-filter-l" id="vt-filter-l">O que você quer comunicar?</p>
          <div className="vt-chips" id="vt-chips">
            <button className="vt-chip" type="button" data-intent="todos" aria-pressed="true">Todos</button>
            {' '}
            <button className="vt-chip" type="button" data-intent="abertura" aria-pressed="false">Abrir com impacto</button>
            {' '}
            <button className="vt-chip" type="button" data-intent="ritmo" aria-pressed="false">Dar ritmo</button>
            {' '}
            <button className="vt-chip" type="button" data-intent="foco" aria-pressed="false">Focar o olhar</button>
            {' '}
            <button className="vt-chip" type="button" data-intent="detalhe" aria-pressed="false">Mostrar detalhe</button>
            {' '}
            <button className="vt-chip" type="button" data-intent="relacao" aria-pressed="false">Relacionar</button>
            {' '}
            <button className="vt-chip" type="button" data-intent="magnitude" aria-pressed="false">Dar peso a números</button>
            {' '}
            <button className="vt-chip" type="button" data-intent="tempo" aria-pressed="false">Contar no tempo</button>
            {' '}
            <button className="vt-chip" type="button" data-intent="comparacao" aria-pressed="false">Comparar</button>
            {' '}
            <button className="vt-chip" type="button" data-intent="processo" aria-pressed="false">Explicar processo</button>
          </div>
        </div>
        <p className="sr-only" id="vt-status" aria-live="polite" />
        {/* PALCO · demonstrações ao vivo */}
        <div className="vt-stage" id="vt-stage">
          {/* 30 · Particle System */}
          <article className="vt-card vt-w4 vt-hero" id="vt-d-particle" data-demo="particle" data-fx="30" data-intents="abertura relacao" aria-labelledby="vt-t-particle">
            <div className="vt-demo vt-pa" role="button" tabIndex={0} aria-label="Campo de partículas ao vivo. Pressione Enter para soltar um pulso de luz.">
              <canvas className="vt-pa-cv" aria-hidden="true" />
              <div className="vt-pa-cover" aria-hidden="true">
                <p className="vt-pa-k">Capítulo 1</p>
                <p className="vt-pa-t">A virada começa aqui.</p>
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">30</span>
                  3D
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Particle System">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-particle">Particle System</h3>
              <p className="vt-what">
                Um campo vivo de partículas que se ligam por proximidade. O fundo de capa que já começa respirando.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-spark" />
                </svg>
                Mova o cursor · clique para um pulso
              </p>
            </div>
          </article>
          {/* 03 e 04 · Hologram 3D Card e 3D Tilt */}
          <article className="vt-card vt-w2 vt-hero" id="vt-d-tilt" data-demo="tilt" data-fx="3 4" data-intents="detalhe abertura foco" aria-labelledby="vt-t-tilt">
            <div className="vt-demo vt-ti">
              <div className="vt-ti-card" tabIndex={0} role="img" aria-label="Cartão holográfico com a marca do cliente: crescimento de 38% no ano. Ele inclina com o cursor e reflete a luz.">
                <div className="vt-ti-bg" aria-hidden="true" />
                <div className="vt-ti-l1" aria-hidden="true">
                  <span className="vt-ti-brand">
                    <i />
                    Sua marca
                  </span>
                  {' '}
                  <span className="vt-ti-yr mono">2027</span>
                </div>
                <div className="vt-ti-l2" aria-hidden="true">
                  <b>+38%</b>
                  {' '}
                  <span>Crescimento no ano</span>
                </div>
                <div className="vt-ti-l3" aria-hidden="true">
                  <i style={{ "--h": ".42" } as CSSProperties} />
                  <i style={{ "--h": ".58" } as CSSProperties} />
                  <i style={{ "--h": ".5" } as CSSProperties} />
                  <i style={{ "--h": ".74" } as CSSProperties} />
                  <i style={{ "--h": "1" } as CSSProperties} />
                </div>
                <div className="vt-ti-sheen" aria-hidden="true" />
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">03 · 04</span>
                  3D
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir 3D Tilt e Hologram Card">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-tilt">3D Tilt · Hologram Card</h3>
              <p className="vt-what">
                Camadas com profundidade real que inclinam com o cursor e devolvem um reflexo holográfico.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-spark" />
                </svg>
                Mova o cursor sobre o cartão
              </p>
            </div>
          </article>
          {/* 11 · Animated Typography */}
          <article className="vt-card vt-w3" id="vt-d-type" data-demo="type" data-fx="11" data-intents="abertura foco" aria-labelledby="vt-t-type">
            <div className="vt-demo vt-ty">
              <div className="vt-ty-in">
                <p className="vt-ty-k mono" aria-hidden="true">Resultado do ano</p>
                <p className="sr-only">Receita recorrente cresceu 38% em doze meses.</p>
                <p className="vt-ty-h" aria-hidden="true">
                  <span className="w" style={{ "--i": "0" } as CSSProperties}>Receita</span>
                  {' '}
                  <span className="w" style={{ "--i": "1" } as CSSProperties}>recorrente</span>
                  {' '}
                  <span className="w vt-ty-u" style={{ "--i": "2" } as CSSProperties}>cresceu</span>
                  {' '}
                  <span className="w vt-ty-n" style={{ "--i": "4" } as CSSProperties}>38%</span>
                  {' '}
                  <span className="w" style={{ "--i": "5" } as CSSProperties}>em</span>
                  {' '}
                  <span className="w" style={{ "--i": "6" } as CSSProperties}>doze</span>
                  {' '}
                  <span className="w" style={{ "--i": "7" } as CSSProperties}>meses.</span>
                </p>
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">11</span>
                  Movimento
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Animated Typography">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-type">Animated Typography</h3>
              <p className="vt-what">
                O título entra palavra a palavra, a palavra-chave ganha um sublinhado de luz e o número pousa por último.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-play" />
                </svg>
                Automático · toque em Repetir
              </p>
            </div>
          </article>
          {/* 12 · Counter Animation */}
          <article className="vt-card vt-w3" id="vt-d-count" data-demo="count" data-fx="12" data-intents="magnitude" aria-labelledby="vt-t-count">
            <div className="vt-demo vt-co">
              <ul className="vt-co-list">
                <li>
                  <span className="vt-co-k">Receita no ano</span>
                  <b className="vt-co-v" data-to="12.8" data-dec="1" data-pre="R$ " data-suf=" mi">R$ 12,8 mi</b>
                  <i className="vt-co-bar" style={{ "--w": ".86" } as CSSProperties} />
                </li>
                <li>
                  <span className="vt-co-k">Crescimento</span>
                  <b className="vt-co-v" data-to="38" data-pre="+" data-suf="%">+38%</b>
                  <i className="vt-co-bar" style={{ "--w": ".64" } as CSSProperties} />
                </li>
                <li>
                  <span className="vt-co-k">Novos clientes</span>
                  <b className="vt-co-v" data-to="1240">1.240</b>
                  <i className="vt-co-bar" style={{ "--w": "1" } as CSSProperties} />
                </li>
              </ul>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">12</span>
                  Dados
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Counter Animation">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-count">Counter Animation</h3>
              <p className="vt-what">
                Números que sobem do zero ao valor final. A plateia sente o tamanho do resultado antes de ler.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-play" />
                </svg>
                Automático · toque em Repetir
              </p>
            </div>
          </article>
          {/* 06 · Glow / Light Sweep */}
          <article className="vt-card vt-w2" id="vt-d-glow" data-demo="glow" data-fx="6" data-intents="foco abertura" aria-labelledby="vt-t-glow">
            <div className="vt-demo vt-gl">
              <div className="vt-gl-main" tabIndex={0} role="img" aria-label="Indicador principal em destaque: margem bruta de 41%, mais 6 pontos.">
                <div className="vt-gl-in" aria-hidden="true">
                  <span className="vt-gl-k">Margem bruta</span>
                  {' '}
                  <b className="vt-gl-v">41%</b>
                  {' '}
                  <span className="vt-gl-d">+6 p.p. no ano</span>
                </div>
              </div>
              <div className="vt-gl-side" aria-label="Indicadores secundários">
                <p>
                  <span>Custo</span>
                  <b>−12%</b>
                </p>
                <p>
                  <span>Prazo</span>
                  <b>18 dias</b>
                </p>
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">06</span>
                  Movimento
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Glow e Light Sweep">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-glow">Glow / Light Sweep</h3>
              <p className="vt-what">O número principal ganha anel de luz e varredura. Os outros ficam quietos.</p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-spark" />
                </svg>
                Passe o cursor para intensificar
              </p>
            </div>
          </article>
          {/* 24 · Spotlight / Focus */}
          <article className="vt-card vt-w2" id="vt-d-spot" data-demo="spot" data-fx="24" data-intents="foco" aria-labelledby="vt-t-spot">
            <div className="vt-demo vt-sp">
              <div className="vt-sp-slide" aria-hidden="true">
                <p className="vt-sp-title">Onde a margem se perde</p>
                <div className="vt-sp-row">
                  <div className="vt-sp-node" data-step="1">
                    <span>Compra</span>
                    <b>100</b>
                  </div>
                  <i className="vt-sp-ar" />
                  <div className="vt-sp-node" data-step="2">
                    <span>Estoque</span>
                    <b>−4</b>
                  </div>
                  <i className="vt-sp-ar" />
                  <div className="vt-sp-node vt-sp-hot" data-step="3">
                    <span>Frete</span>
                    <b>−9</b>
                  </div>
                  <i className="vt-sp-ar" />
                  <div className="vt-sp-node">
                    <span>Venda</span>
                    <b>87</b>
                  </div>
                </div>
              </div>
              <div className="vt-sp-mask" aria-hidden="true" />
              <p className="vt-sp-cap" aria-live="polite" />
              <div className="vt-sp-ctl" role="group" aria-label="Passos do foco">
                <button type="button" data-go="1" aria-pressed="false">1</button>
                {' '}
                <button type="button" data-go="2" aria-pressed="false">2</button>
                {' '}
                <button type="button" data-go="3" aria-pressed="false">3</button>
                {' '}
                <button type="button" data-go="free" aria-pressed="false">Livre</button>
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">24</span>
                  Narrativa
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Spotlight">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-spot">Spotlight / Focus</h3>
              <p className="vt-what">Um foco de luz apaga o resto e conduz o olhar, passo a passo, até o ponto que importa.</p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-target" />
                </svg>
                Passos 1, 2, 3 · Livre segue o cursor
              </p>
            </div>
          </article>
          {/* 33 · Card Stack */}
          <article className="vt-card vt-w2" id="vt-d-stack" data-demo="stack" data-fx="33" data-intents="detalhe ritmo" aria-labelledby="vt-t-stack">
            <div className="vt-demo vt-st">
              <div className="vt-st-pile">
                <div className="vt-st-card">
                  <span className="mono">01 / 04</span>
                  <b>O problema</b>
                  <p>Três semanas para fechar um relatório.</p>
                </div>
                <div className="vt-st-card">
                  <span className="mono">02 / 04</span>
                  <b>A virada</b>
                  <p>Um painel que se atualiza sozinho.</p>
                </div>
                <div className="vt-st-card">
                  <span className="mono">03 / 04</span>
                  <b>O número</b>
                  <p>De 21 dias para 2.</p>
                </div>
                <div className="vt-st-card">
                  <span className="mono">04 / 04</span>
                  <b>O próximo passo</b>
                  <p>Levar para as outras cinco áreas.</p>
                </div>
              </div>
              <p className="sr-only vt-st-live" aria-live="polite" />
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">33</span>
                  Interatividade
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Card Stack">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-stack">Card Stack</h3>
              <p className="vt-what">Uma pilha com profundidade. O card do topo sai e vai para o fundo, um capítulo por vez.</p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-cards" />
                </svg>
                Arraste ou clique o card do topo
              </p>
            </div>
          </article>
          {/* 16 · Chart Build Animation */}
          <article className="vt-card vt-w4" id="vt-d-chart" data-demo="chart" data-fx="16" data-intents="magnitude tempo" aria-labelledby="vt-t-chart">
            <div className="vt-demo vt-ch">
              <div className="vt-ch-head">
                <p className="vt-ch-t">
                  Receita por trimestre{' '}
                  <span className="mono">R$ mi</span>
                </p>
                <p className="vt-ch-leg" aria-hidden="true">
                  <span className="vt-ch-lb">Receita</span>
                  <span className="vt-ch-ll">Meta</span>
                </p>
              </div>
              <div className="vt-ch-plot">
                <svg className="vt-ch-svg" viewBox="0 0 640 220" role="img" aria-labelledby="vt-ch-desc">
                  <title id="vt-ch-desc">
                    Receita trimestral sobe de 42 para 84 milhões de reais entre o 1º trimestre de 2025 e o 4º de 2026, acima da meta nos últimos cinco trimestres.
                  </title>
                </svg>
                <div className="vt-ch-tip" role="status" hidden />
              </div>
              <div className="vt-ch-scrub">
                <label className="sr-only" htmlFor="vt-ch-range">Etapa da construção do gráfico</label>
                {' '}
                <input className="vt-range" id="vt-ch-range" type="range" min="0" max="100" step="1" defaultValue="100" aria-valuetext="Gráfico completo" />
                <p className="vt-ch-steps mono" aria-hidden="true">
                  <span>Barras</span>
                  <span>Linha</span>
                  <span>Pontos</span>
                  <span>Rótulos</span>
                </p>
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">16</span>
                  Dados
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Chart Build Animation">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-chart">Chart Build Animation</h3>
              <p className="vt-what">
                O gráfico se monta em etapas: as barras crescem, a meta se desenha, os pontos surgem e os rótulos fecham a leitura.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-chart" />
                </svg>
                Automático · arraste a linha do tempo
              </p>
            </div>
          </article>
          {/* 21 · Flip Card */}
          <article className="vt-card vt-w2" id="vt-d-flip" data-demo="flip" data-fx="21" data-intents="comparacao detalhe" aria-labelledby="vt-t-flip">
            <div className="vt-demo vt-fl">
              <div className="vt-fl-row">
                <button className="vt-fl-card" type="button" aria-pressed="false" data-k="Prazo" data-a="45 dias" data-b="12 dias">
                  <span className="vt-fl-in" aria-hidden="true">
                    <span className="vt-fl-f">
                      <small>Prazo</small>
                      <b>45 d</b>
                      <em>Antes</em>
                    </span>
                    {' '}
                    <span className="vt-fl-b">
                      <small>Prazo</small>
                      <b>12 d</b>
                      <em>
                        Depois
                        <span>−73%</span>
                      </em>
                    </span>
                  </span>
                </button>
                {' '}
                <button className="vt-fl-card" type="button" aria-pressed="false" data-k="Erros" data-a="18%" data-b="3%">
                  <span className="vt-fl-in" aria-hidden="true">
                    <span className="vt-fl-f">
                      <small>Erros</small>
                      <b>18%</b>
                      <em>Antes</em>
                    </span>
                    {' '}
                    <span className="vt-fl-b">
                      <small>Erros</small>
                      <b>3%</b>
                      <em>
                        Depois
                        <span>−83%</span>
                      </em>
                    </span>
                  </span>
                </button>
                {' '}
                <button className="vt-fl-card" type="button" aria-pressed="false" data-k="Retrabalho" data-a="9 horas" data-b="1 hora">
                  <span className="vt-fl-in" aria-hidden="true">
                    <span className="vt-fl-f">
                      <small>Retrabalho</small>
                      <b>9 h</b>
                      <em>Antes</em>
                    </span>
                    {' '}
                    <span className="vt-fl-b">
                      <small>Retrabalho</small>
                      <b>1 h</b>
                      <em>
                        Depois
                        <span>−89%</span>
                      </em>
                    </span>
                  </span>
                </button>
              </div>
              <button className="btn btn-quiet btn-xs vt-fl-all" type="button">Virar todos</button>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">21</span>
                  Interatividade
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Flip Card">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-flip">Flip Card</h3>
              <p className="vt-what">O card gira em 3D e mostra o verso. Antes na frente, depois atrás, no mesmo lugar.</p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-cards" />
                </svg>
                Clique em um card para virar
              </p>
            </div>
          </article>
          {/* 37 · Before / After Slider */}
          <article className="vt-card vt-w2" id="vt-d-ba" data-demo="ba" data-fx="37" data-intents="comparacao" aria-labelledby="vt-t-ba">
            <div className="vt-demo vt-ba">
              <div className="vt-ba-box">
                <div className="vt-ba-after" aria-hidden="true">
                  <span className="vt-ba-tag vt-ba-tag-r">Depois</span>
                  <p className="vt-ba-k">Receita no ano</p>
                  <b className="vt-ba-big">+38%</b>
                  <div className="vt-ba-bars">
                    <i style={{ "--h": ".38" } as CSSProperties} />
                    <i style={{ "--h": ".5" } as CSSProperties} />
                    <i style={{ "--h": ".62" } as CSSProperties} />
                    <i style={{ "--h": "1" } as CSSProperties} />
                  </div>
                </div>
                <div className="vt-ba-before" aria-hidden="true">
                  <span className="vt-ba-tag">Antes</span>
                  <div className="vt-ba-txt">
                    <p className="vt-ba-h">Resultados consolidados do exercício</p>
                    <ul>
                      <li>Receita bruta de R$ 12,8 mi, alta de 38% sobre o ano anterior</li>
                      <li>Margem estável, ver anexo B por região</li>
                      <li>Custos logísticos com variação de 4,1%</li>
                      <li>Base ativa de 1.240 clientes, ver apêndice</li>
                    </ul>
                  </div>
                  <table>
                    <tbody>
                      <tr>
                        <th>Tri</th>
                        <th>Receita</th>
                        <th>Var.</th>
                      </tr>
                      <tr>
                        <td>1T</td>
                        <td>2,4</td>
                        <td>3,1%</td>
                      </tr>
                      <tr>
                        <td>2T</td>
                        <td>2,9</td>
                        <td>4,0%</td>
                      </tr>
                      <tr>
                        <td>3T</td>
                        <td>3,3</td>
                        <td>2,2%</td>
                      </tr>
                      <tr>
                        <td>4T</td>
                        <td>4,2</td>
                        <td>5,8%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="vt-ba-line" aria-hidden="true" />
                <div className="vt-ba-knob" role="slider" tabIndex={0} aria-label="Divisor entre antes e depois" aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} aria-valuetext="Metade antes, metade depois">
                  <svg aria-hidden="true">
                    <use href="#i-chev" />
                  </svg>
                  <svg aria-hidden="true">
                    <use href="#i-chev-r" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">37</span>
                  Interatividade
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Before e After Slider">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-ba">Before / After Slider</h3>
              <p className="vt-what">
                Um divisor arrastável mostra o slide de antes e o de depois no mesmo lugar. A diferença fala sozinha.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-arrowline" />
                </svg>
                Arraste o divisor · setas no teclado
              </p>
            </div>
          </article>
          {/* 35 · Interactive Matrix */}
          <article className="vt-card vt-w2" id="vt-d-matrix" data-demo="matrix" data-fx="35" data-intents="comparacao foco" aria-labelledby="vt-t-matrix">
            <div className="vt-demo vt-mx">
              <div className="vt-mx-plot">
                <div className="vt-mx-q" data-q="0" aria-hidden="true">
                  <span>Ganhos rápidos</span>
                </div>
                <div className="vt-mx-q" data-q="1" aria-hidden="true">
                  <span>Grandes apostas</span>
                </div>
                <div className="vt-mx-q" data-q="2" aria-hidden="true">
                  <span>Ajustes finos</span>
                </div>
                <div className="vt-mx-q" data-q="3" aria-hidden="true">
                  <span>Evitar</span>
                </div>
                <span className="vt-mx-ax vt-mx-ay" aria-hidden="true">Impacto</span>
                {' '}
                <span className="vt-mx-ax vt-mx-axx" aria-hidden="true">Esforço</span>
              </div>
              <p className="vt-mx-leg mono" aria-live="polite" />
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">35</span>
                  Interatividade
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Interactive Matrix">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-matrix">Interactive Matrix</h3>
              <p className="vt-what">
                Impacto contra esforço. Cada iniciativa troca de quadrante na frente da sala e a contagem se refaz.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-grid" />
                </svg>
                Arraste as bolhas · setas no teclado
              </p>
            </div>
          </article>
          {/* 18 · Connector / Flow Line */}
          <article className="vt-card vt-w2" id="vt-d-flow" data-demo="flow" data-fx="18" data-intents="processo relacao" aria-labelledby="vt-t-flow">
            <div className="vt-demo vt-fw">
              <div className="vt-fw-box">
                <svg className="vt-fw-svg" viewBox="0 0 400 240" aria-hidden="true" focusable="false" />
              </div>
              <p className="vt-fw-cap mono" aria-live="polite">Toque num nó para ver as ligações</p>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">18</span>
                  Processos
                </p>
                <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Connector e Flow Line">
                  <svg aria-hidden="true">
                    <use href="#i-replay" />
                  </svg>
                  Repetir
                </button>
              </div>
              <h3 id="vt-t-flow">Connector / Flow Line</h3>
              <p className="vt-what">
                As linhas se desenham entre os nós e passam a fluir. O caminho é entendido antes de ser lido.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-arrowline" />
                </svg>
                Passe o cursor num nó · clique fixa
              </p>
            </div>
          </article>
        </div>
        <p className="vt-empty" id="vt-empty" hidden />
        {/* CATÁLOGO · os 40 efeitos */}
        <div className="vt-cat-head">
          <div>
            <p className="eyebrow">Catálogo completo</p>
            <h3 className="vt-cat-h">Os 40 efeitos, por número</h3>
          </div>
          <p className="vt-count mono" id="vt-count">40 de 40</p>
        </div>
        <ul className="vt-cat" id="vt-cat" aria-label="Catálogo de efeitos" />
        <button className="btn btn-ghost btn-sm vt-more" id="vt-more" type="button" aria-controls="vt-cat" aria-expanded="false">Ver os 40 efeitos</button>
        {/* VALOR · o que entra na apresentação */}
        <div className="vt-value">
          <ul className="vt-stats">
            <li>
              <b className="display">40</b>
              <span>efeitos prontos para entrar no slide</span>
            </li>
            <li>
              <b className="display">7</b>
              <span>famílias: movimento, dados, 3D, interface, interatividade, processos e narrativa</span>
            </li>
            <li>
              <b className="display">1</b>
              <span>arquivo HTML que abre em qualquer navegador, sem instalar nada</span>
            </li>
          </ul>
          <ul className="vt-prin">
            <li>
              <p className="eyebrow">Compreensão</p>
              <h4>Reduzir esforço</h4>
              <p>
                O movimento explica sequência, causa e efeito. Um fluxo que se desenha é entendido antes de ser lido.
              </p>
            </li>
            <li>
              <p className="eyebrow">Hierarquia</p>
              <h4>Dirigir o olhar</h4>
              <p>Foco, brilho e destaque dizem onde olhar primeiro. O resto recua para o insight aparecer.</p>
            </li>
            <li>
              <p className="eyebrow">Narrativa</p>
              <h4>Dar ritmo</h4>
              <p>
                Cada revelação marca o tempo da fala e mantém a sala com você do primeiro ao último slide.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
