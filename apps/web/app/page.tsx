import Film from '@/components/film/Film';
import Planos from '@/components/commerce/Planos';
import Cover from '@/components/site/Cover';
import Efeito from '@/components/site/Efeito';
import Faq from '@/components/site/Faq';
import Final from '@/components/site/Final';
import Produto from '@/components/site/Produto';
import SiteEngine from '@/components/site/SiteEngine';
import SiteFooter from '@/components/site/SiteFooter';
import SiteNav from '@/components/site/SiteNav';
import Timeline from '@/components/site/Timeline';
import Vitrine from '@/components/site/Vitrine';

export default function SitePage() {
  return (
    <div className="view theme-night" id="v-site" data-view="site">
      <SiteNav />
      <main id="conteudo">
        <section className="s-hero" id="topo">
          <Cover />
          <Film />
        </section>
        <Efeito />
        <Produto />
        <Timeline />
        <Vitrine />
        <Planos />
        <Faq />
        <Final />
      </main>
      <SiteFooter />
      <SiteEngine />
    </div>
  );
}
