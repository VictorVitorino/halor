/* Gerado a partir de prototype/src/html com conversão fiel (regras de tools/html-to-tsx.mjs).
   A marcação é idêntica à do protótipo; o comportamento é ligado pelos motores em lib/engines/site.
   A gravação do Estúdio e os modelos prontos vivem em ProdutoRec e ProdutoModels. */
import type { CSSProperties } from 'react';
import Link from 'next/link';
import ProdutoModels from './ProdutoModels';
import ProdutoRec from './ProdutoRec';

export default function Produto() {
  return (
    <section className="s-sec s-prod" id="produto">
      <div className="wrap">
        <div className="s-head">
          <p className="eyebrow">Produto</p>
          <h2 className="display">Apresentações em HTML, vivas e interativas.</h2>
          <p className="lede">
            Você monta como sempre montou e a apresentação já sai em HTML: se move, responde e chama a plateia para participar. Sem escrever uma linha de código.
          </p>
        </div>
        <div className="pd-what">
          <article>
            <p className="pd-k mono">O que é</p>
            <h3>Um estúdio de apresentações no navegador</h3>
            <p>Você cria, apresenta, edita e compartilha no mesmo lugar. Nada para instalar.</p>
          </article>
          <article>
            <p className="pd-k mono">O que faz</p>
            <h3>Transforma slide em experiência</h3>
            <p>
              Modelos no seu kit de marca, + de 40 efeitos e componentes lúdicos. Importa e exporta em HTML, PDF e PPT.
            </p>
          </article>
          <article className="pd-gain">
            <p className="pd-k mono">O ganho principal</p>
            <h3>Animação e interação sem programar</h3>
            <p>
              O que antes exigia código, agora é{' '}
              <span className="neon-band">de todo mundo!</span>
              {' '}Quem cria não programa, e quem recebe só abre no navegador.
            </p>
          </article>
        </div>
        <ProdutoRec />
        <ProdutoModels />
        <ul className="feat-grid pd-feats">
          <li data-rv="up" style={{ "--rv-i": "0" } as CSSProperties}>
            <span className="pd-ico pd-ico-layers">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path pathLength="1" d="M12 4l8.5 4.5L12 13 3.5 8.5z" />
                <path className="pi-m" pathLength="1" d="M3.5 12.5L12 17l8.5-4.5" />
                <path className="pi-b" pathLength="1" d="M3.5 16.5L12 21l8.5-4.5" />
              </svg>
            </span>
            <h3>Estúdio no navegador</h3>
            <p>Faixa de inserção, camadas, atalhos e salvamento na nuvem.</p>
          </li>
          <li data-rv="up" style={{ "--rv-i": "1" } as CSSProperties}>
            <span className="pd-ico pd-ico-palette">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g className="pi-rot">
                  <path pathLength="1" d="M12 4a8 8 0 1 0 0 16c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.5-1-2.6 0-1 .8-1.7 1.8-1.7H17a3 3 0 0 0 3-3C20 7 16.4 4 12 4z" />
                  <circle className="pi-fill" cx="8" cy="11" r="1" />
                  <circle className="pi-fill" cx="11" cy="7.5" r="1" />
                  <circle className="pi-fill" cx="15.5" cy="8" r="1" />
                </g>
              </svg>
            </span>
            <h3>Modelos e kit de marca</h3>
            <p>Cores, fontes e logo travados. Todo slide nasce na sua identidade.</p>
          </li>
          <li data-rv="up" style={{ "--rv-i": "2" } as CSSProperties}>
            <span className="pd-ico pd-ico-wand">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="pi-stick" pathLength="1" d="M4 20L15 9M13.5 7.5l3 3" />
                <path className="pi-spk" pathLength="1" d="M17 3v3M15.5 4.5h3" />
                <path className="pi-spk pi-spk2" pathLength="1" d="M20 8v2M19 9h2" />
                <path className="pi-spk pi-spk3" pathLength="1" d="M9 3.5v2M8 4.5h2" />
              </svg>
            </span>
            <h3>+ de 40 efeitos categorizados</h3>
            <p>
              Movimento, 3D, dados, interface, interatividade, processos e narrativa. Veja todos na vitrine abaixo.
            </p>
          </li>
          <li data-rv="up" style={{ "--rv-i": "3" } as CSSProperties}>
            <span className="pd-ico pd-ico-cards">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect className="pi-l" pathLength="1" x="3.5" y="6" width="7.5" height="12" rx="1.5" />
                <rect className="pi-r" pathLength="1" x="13" y="6" width="7.5" height="12" rx="1.5" />
              </svg>
            </span>
            <h3>Componentes lúdicos</h3>
            <p>Votação, post-its, formulário e cronômetro dentro do slide.</p>
          </li>
          <li data-rv="up" style={{ "--rv-i": "0" } as CSSProperties}>
            <span className="pd-ico pd-ico-target">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle className="pi-o" pathLength="1" cx="12" cy="12" r="8.5" />
                <circle className="pi-i" pathLength="1" cx="12" cy="12" r="5" />
                <circle className="pi-fill" cx="12" cy="12" r="1.5" />
              </svg>
            </span>
            <h3>Raio Halor</h3>
            <p>Mostra por onde o olhar de quem assiste vai passar, antes de você apresentar.</p>
          </li>
          <li data-rv="up" style={{ "--rv-i": "1" } as CSSProperties}>
            <span className="pd-ico pd-ico-up">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="pi-arw" pathLength="1" d="M12 15V4M7.5 8.5L12 4l4.5 4.5" />
                <path pathLength="1" d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14" />
              </svg>
            </span>
            <h3>Importa o que você já tem</h3>
            <p>PDF, PPT e até HTML viram slides editáveis no seu kit de marca.</p>
          </li>
          <li data-rv="up" style={{ "--rv-i": "2" } as CSSProperties}>
            <span className="pd-ico pd-ico-down">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path className="pi-arw" pathLength="1" d="M12 4v11M7.5 10.5L12 15l4.5-4.5" />
                <path pathLength="1" d="M4 14v4.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V14" />
              </svg>
            </span>
            <h3>Exporta para tudo</h3>
            <p>HTML interativo, PDF e PowerPoint editável ou idêntico.</p>
          </li>
          <li className="pd-feat-paw" data-rv="up" style={{ "--rv-i": "3" } as CSSProperties}>
            <span className="pd-ico pd-ico-paw">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <g className="pi-hop">
                  <ellipse className="pi-toe" pathLength="1" cx="6.2" cy="10.2" rx="1.9" ry="2.4" />
                  <ellipse className="pi-toe" pathLength="1" cx="10" cy="6.6" rx="2" ry="2.6" />
                  <ellipse className="pi-toe" pathLength="1" cx="14.4" cy="6.6" rx="2" ry="2.6" />
                  <ellipse className="pi-toe" pathLength="1" cx="18" cy="10.4" rx="1.9" ry="2.4" />
                  <path className="pi-pad" pathLength="1" d="M12.2 11.4c2.4 0 5.4 3.6 5.4 5.8 0 1.8-1.4 2.6-3 2.3-1-.2-1.6-.6-2.4-.6s-1.4.4-2.4.6c-1.6.3-3-.5-3-2.3 0-2.2 3-5.8 5.4-5.8z" />
                </g>
              </svg>
            </span>
            <h3>Animais lúdicos com efeito Halor</h3>
            <p>
              Mascotes que vivem no slide: apontam, comemoram e conduzem a plateia, com o brilho do halo.
            </p>
          </li>
        </ul>
        <div className="p-cta">
          <Link className="btn btn-ghost" href="/estudio">
            Abrir o Estúdio{' '}
            <svg aria-hidden="true">
              <use href="#i-arrow" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
