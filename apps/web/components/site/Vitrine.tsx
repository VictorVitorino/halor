/* Gerado a partir de prototype/src/html com conversão fiel (tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento vem de lib/engines/vitrine,
   ligado por <VitrineEngine />: demos ao vivo, painel Editar efeito em cada card, ripple
   e as prévias do catálogo. O catálogo nasce no estado do filtro "Todos" (8 de 40). */
import type { CSSProperties } from 'react';
import VitrineCatalog from '@/components/vitrine/VitrineCatalog';
import VitrineEngine from '@/components/vitrine/VitrineEngine';

export default function Vitrine() {
  return (
    <section className="s-sec theme-night vt-sec" id="vitrine" aria-labelledby="vt-h">
      <div className="wrap">
        <div className="s-head">
          <p className="eyebrow">Vitrine de efeitos</p>
          <h2 className="display" id="vt-h">40 efeitos que prendem o&nbsp;olhar.</h2>
          <p className="lede">
            Cada efeito já entra na apresentação com a marca de quem usa: suas cores, sua fonte, seu logo. Os doze abaixo estão ao vivo e são editáveis: clique, arraste, mude textos, cores e&nbsp;intensidade.
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
        {/* PALCO · demonstrações ao vivo e editáveis */}
        <div className="vt-stage" id="vt-stage">
          {/* 30 · Particle System */}
          <article className="vt-card vt-w4 vt-hero" id="vt-d-particle" data-demo="particle" data-fx="30" data-intents="abertura relacao" aria-labelledby="vt-t-particle">
            <div className="vt-demo vt-pa" role="button" tabIndex={0} aria-label="Campo de partículas ao vivo. Pressione Enter para soltar um pulso de luz.">
              <canvas className="vt-pa-cv" aria-hidden="true" />
              <div className="vt-pa-cover" aria-hidden="true">
                <p className="vt-pa-k">Capítulo 1</p>
                <p className="vt-pa-t">A virada começa&nbsp;aqui.</p>
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">30</span>
                  3D
                </p>
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-particle">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Particle System">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-particle">Particle System</h3>
              <p className="vt-what">
                Um campo vivo de partículas que se ligam por proximidade. O fundo de capa que já começa respirando.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-spark" />
                </svg>
                Mova o cursor · clique para um pulso de luz
              </p>
            </div>
          </article>
          {/* 03 e 04 · Hologram 3D Card e 3D Tilt */}
          <article className="vt-card vt-w2 vt-hero" id="vt-d-tilt" data-demo="tilt" data-fx="3 4" data-intents="detalhe abertura foco" aria-labelledby="vt-t-tilt">
            <div className="vt-demo vt-ti">
              <div className="vt-ti-card" tabIndex={0} role="button" aria-pressed="false" aria-label="Cartão holográfico com a marca do cliente: crescimento de 38% no ano. Enter vira o cartão e mostra o detalhe; as setas inclinam.">
                <div className="vt-ti-front" aria-hidden="true">
                  <div className="vt-ti-bg" />
                  <div className="vt-ti-l1">
                    <span className="vt-ti-brand">
                      <i />
                      Sua marca
                    </span>
                    {' '}
                    <span className="vt-ti-yr mono">2027</span>
                  </div>
                  <div className="vt-ti-l2">
                    <b>+38%</b>
                    {' '}
                    <span>Crescimento no ano</span>
                  </div>
                  <div className="vt-ti-l3">
                    <i style={{ "--h": ".42" } as CSSProperties} />
                    <i style={{ "--h": ".58" } as CSSProperties} />
                    <i style={{ "--h": ".5" } as CSSProperties} />
                    <i style={{ "--h": ".74" } as CSSProperties} />
                    <i style={{ "--h": "1" } as CSSProperties} />
                  </div>
                  <div className="vt-ti-sheen" />
                </div>
                <div className="vt-ti-back" aria-hidden="true">
                  <p className="vt-ti-bk mono">De onde veio</p>
                  <p className="vt-ti-bt">
                    Como chegamos a{' '}
                    <b>+38%</b>
                  </p>
                  <ul className="vt-ti-bl">
                    <li style={{ "--w": ".55" } as CSSProperties}>
                      <span>Novos clientes</span>
                      <b>+21%</b>
                    </li>
                    <li style={{ "--w": ".29" } as CSSProperties}>
                      <span>Recompra</span>
                      <b>+11%</b>
                    </li>
                    <li style={{ "--w": ".16" } as CSSProperties}>
                      <span>Preço médio</span>
                      <b>+6%</b>
                    </li>
                  </ul>
                  <p className="vt-ti-bf mono">Clique para voltar</p>
                </div>
              </div>
              <p className="sr-only vt-ti-live" aria-live="polite" />
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">03 · 04</span>
                  3D
                </p>
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-tilt">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir 3D Tilt e Hologram Card">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-tilt">3D Tilt · Hologram Card</h3>
              <p className="vt-what">
                Camadas com profundidade real que inclinam com o cursor e devolvem um reflexo holográfico. No verso, o detalhe.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-spark" />
                </svg>
                Mova o cursor · clique para virar
              </p>
            </div>
          </article>
          {/* 11 · Animated Typography */}
          <article className="vt-card vt-w3" id="vt-d-type" data-demo="type" data-fx="11" data-intents="abertura foco" aria-labelledby="vt-t-type">
            <div className="vt-demo vt-ty">
              <div className="vt-ty-in">
                <p className="vt-ty-k mono">Resultado do ano</p>
                <p className="sr-only vt-ty-sr">Receita recorrente cresceu 38% em doze meses.</p>
                <p className="vt-ty-h" role="toolbar" aria-label="Palavras do título: escolha a palavra-chave">
                  <button className="w" type="button" style={{ "--i": "0" } as CSSProperties} aria-pressed="false">Receita</button>
                  {' '}
                  <button className="w" type="button" style={{ "--i": "1" } as CSSProperties} aria-pressed="false" tabIndex={-1}>recorrente</button>
                  {' '}
                  <button className="w vt-ty-u" type="button" style={{ "--i": "2" } as CSSProperties} aria-pressed="true" tabIndex={-1}>cresceu</button>
                  {' '}
                  <button className="w vt-ty-n" type="button" style={{ "--i": "4" } as CSSProperties} aria-pressed="false" tabIndex={-1}>38%</button>
                  {' '}
                  <button className="w" type="button" style={{ "--i": "5" } as CSSProperties} aria-pressed="false" tabIndex={-1}>em</button>
                  {' '}
                  <button className="w" type="button" style={{ "--i": "6" } as CSSProperties} aria-pressed="false" tabIndex={-1}>doze</button>
                  {' '}
                  <button className="w" type="button" style={{ "--i": "7" } as CSSProperties} aria-pressed="false" tabIndex={-1}>meses.</button>
                </p>
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">11</span>
                  Movimento
                </p>
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-type">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Animated Typography">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-type">Animated Typography</h3>
              <p className="vt-what">
                O título entra palavra a palavra, a palavra-chave ganha um sublinhado de luz e o número pousa por último.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-text" />
                </svg>
                Clique numa palavra para torná-la a palavra-chave
              </p>
            </div>
          </article>
          {/* 12 · Counter Animation */}
          <article className="vt-card vt-w3" id="vt-d-count" data-demo="count" data-fx="12" data-intents="magnitude" aria-labelledby="vt-t-count">
            <div className="vt-demo vt-co">
              <ul className="vt-co-list">
                <li>
                  <button className="vt-co-i" type="button" aria-pressed="false">
                    <span className="vt-co-k">Receita no ano</span>
                    <b className="vt-co-v" data-to="12.8" data-dec="1" data-pre="R$ " data-suf=" mi" data-goal="14.9">R$ 12,8 mi</b>
                    <i className="vt-co-bar" style={{ "--w": ".86" } as CSSProperties} />
                  </button>
                </li>
                <li>
                  <button className="vt-co-i" type="button" aria-pressed="false">
                    <span className="vt-co-k">Crescimento</span>
                    <b className="vt-co-v" data-to="38" data-pre="+" data-suf="%" data-goal="59">+38%</b>
                    <i className="vt-co-bar" style={{ "--w": ".64" } as CSSProperties} />
                  </button>
                </li>
                <li>
                  <button className="vt-co-i" type="button" aria-pressed="false">
                    <span className="vt-co-k">Novos clientes</span>
                    <b className="vt-co-v" data-to="1240" data-goal="1240">1.240</b>
                    <i className="vt-co-bar" style={{ "--w": "1" } as CSSProperties} />
                  </button>
                </li>
              </ul>
              <p className="vt-co-det" aria-live="polite">
                <span className="vt-co-hint">Clique num indicador para ver o detalhe.</span>
              </p>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">12</span>
                  Dados
                </p>
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-count">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Counter Animation">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-count">Counter Animation</h3>
              <p className="vt-what">
                Números que sobem do zero ao valor final. A plateia sente o tamanho do resultado antes de ler.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-chart" />
                </svg>
                Clique num indicador: a barra pulsa e o detalhe aparece
              </p>
            </div>
          </article>
          {/* 06 · Glow / Light Sweep */}
          <article className="vt-card vt-w2" id="vt-d-glow" data-demo="glow" data-fx="6" data-intents="foco abertura" aria-labelledby="vt-t-glow">
            <div className="vt-demo vt-gl">
              <div className="vt-gl-main" tabIndex={0} role="img" aria-label="Indicador em destaque: margem bruta de 41%, mais 6 pontos no ano.">
                <div className="vt-gl-in" aria-hidden="true">
                  <span className="vt-gl-k">Margem bruta</span>
                  {' '}
                  <b className="vt-gl-v">41%</b>
                  {' '}
                  <span className="vt-gl-d">+6 p.p. no ano</span>
                </div>
              </div>
              <div className="vt-gl-side" role="group" aria-label="Indicadores secundários. Clique para pôr em destaque.">
                <button className="vt-gl-s" type="button" data-i="1">
                  <span>Custo</span>
                  <b>−12%</b>
                </button>
                {' '}
                <button className="vt-gl-s" type="button" data-i="2">
                  <span>Prazo</span>
                  <b>18 dias</b>
                </button>
              </div>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">06</span>
                  Movimento
                </p>
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-glow">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Glow e Light Sweep">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-glow">Glow / Light Sweep</h3>
              <p className="vt-what">O número principal ganha anel de luz e varredura. Os outros ficam quietos até a sua vez.</p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-spark" />
                </svg>
                Clique num indicador para pô-lo em destaque
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
                  <div className="vt-sp-node" data-step="4">
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
                <button type="button" data-go="4" aria-pressed="false">4</button>
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
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-spot">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Spotlight">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-spot">Spotlight / Focus</h3>
              <p className="vt-what">Um foco de luz apaga o resto e conduz o olhar, passo a passo, até o ponto que importa.</p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-target" />
                </svg>
                Clique num bloco ou nos passos · Livre segue o cursor
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
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-stack">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Card Stack">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
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
          <article className="vt-card vt-w4" id="vt-d-chart" data-demo="chart" data-fx="16 15" data-intents="magnitude tempo" aria-labelledby="vt-t-chart">
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
                <svg className="vt-ch-svg" viewBox="0 0 640 220" role="group" aria-labelledby="vt-ch-desc">
                  <title id="vt-ch-desc">
                    Receita trimestral sobe de 42 para 84 milhões de reais entre o 1º trimestre de 2025 e o 4º de 2026, acima da meta nos últimos cinco trimestres. Clique numa barra para destacá-la.
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
                  <span className="mono">16 · 15</span>
                  Dados
                </p>
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-chart">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Chart Build Animation">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-chart">Chart Build · Data Highlight</h3>
              <p className="vt-what">
                O gráfico se monta em etapas: as barras crescem, a meta se desenha, os pontos surgem e os rótulos fecham a leitura. Um clique acende só a barra que sustenta a mensagem.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-chart" />
                </svg>
                Clique numa barra · arraste a linha do tempo
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
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-flip">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Flip Card">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
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
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-ba">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Before e After Slider">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-ba">Before / After Slider</h3>
              <p className="vt-what">
                Um divisor arrastável mostra o slide de antes e o de depois no mesmo lugar. A diferença fala sozinha.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-arrowline" />
                </svg>
                Arraste ou clique no quadro · setas no teclado
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
              <div className="vt-mx-leg" role="group" aria-label="Quadrantes: clique para destacar" />
              <p className="sr-only vt-mx-live" aria-live="polite" />
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">35</span>
                  Interatividade
                </p>
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-matrix">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Interactive Matrix">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-matrix">Interactive Matrix</h3>
              <p className="vt-what">
                Impacto contra esforço. Cada iniciativa troca de quadrante na frente da sala e a contagem se refaz.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-grid" />
                </svg>
                Arraste as bolhas · clique num quadrante
              </p>
            </div>
          </article>
          {/* 18 · Connector / Flow Line */}
          <article className="vt-card vt-w2" id="vt-d-flow" data-demo="flow" data-fx="18" data-intents="processo relacao" aria-labelledby="vt-t-flow">
            <div className="vt-demo vt-fw">
              <div className="vt-fw-box">
                <svg className="vt-fw-svg" viewBox="0 0 400 240" aria-hidden="true" focusable="false" />
              </div>
              <p className="vt-fw-cap mono" aria-live="polite">Clique num nó para ver as ligações</p>
            </div>
            <div className="vt-meta">
              <div className="vt-meta-row">
                <p className="vt-kick">
                  <span className="mono">18</span>
                  Processos
                </p>
                <div className="vt-acts">
                  <button className="btn btn-ghost btn-xs vt-edit" type="button" aria-expanded="false" aria-controls="vt-ed-flow">
                    <svg aria-hidden="true">
                      <use href="#i-sliders" />
                    </svg>
                    <span>Editar efeito</span>
                  </button>
                  <button className="btn btn-ghost btn-xs vt-replay" type="button" aria-label="Repetir Connector e Flow Line">
                    <svg aria-hidden="true">
                      <use href="#i-replay" />
                    </svg>
                    Repetir
                  </button>
                </div>
              </div>
              <h3 id="vt-t-flow">Connector / Flow Line</h3>
              <p className="vt-what">
                As linhas se desenham entre os nós e passam a fluir. O caminho é entendido antes de ser lido.
              </p>
              <p className="vt-how">
                <svg aria-hidden="true">
                  <use href="#i-arrowline" />
                </svg>
                Clique num nó: a luz percorre as ligações
              </p>
            </div>
          </article>
        </div>
        <p className="vt-empty" id="vt-empty" hidden />
        {/* CATÁLOGO · os 40 efeitos, cada um com uma prévia que responde ao cursor e ao clique */}
        <div className="vt-cat-head">
          <div>
            <p className="eyebrow">Catálogo completo</p>
            <h3 className="vt-cat-h">Os 40 efeitos, por número</h3>
            <p className="vt-cat-sub">Passe o cursor numa prévia para ela rodar. Clique para mexer no efeito.</p>
          </div>
          <p className="vt-count mono" id="vt-count">8 de 40</p>
        </div>
        <VitrineCatalog />
        <div className="vt-cat-foot" data-rv="up">
          <button className="vt-plus-pill" id="vt-more" type="button" aria-controls="vt-cat" aria-expanded="false" aria-label="Ver mais 32 efeitos no catálogo">
            <span aria-hidden="true">+</span>
            <b>32 efeitos</b>
          </button>
          {' '}
          <a className="vt-cat-plan" href="/assinar">
            Liberar todos num plano{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </a>
        </div>
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
      <VitrineEngine />
    </section>
  );
}
