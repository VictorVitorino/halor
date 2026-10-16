import StudioModals from '@/components/studio/StudioModals';
import StudioShellEngine from '@/components/studio/StudioShellEngine';
import StudioSidebar from '@/components/studio/StudioSidebar';
import StudioTopbar from '@/components/studio/StudioTopbar';

/* Casca do Estúdio: barra lateral, barra superior e modais compartilhados pelas sub-telas. */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="view theme-paper" id="v-studio" data-view="estudio">
        <div className="app" id="app">
          <StudioSidebar />
          <div className="side-scrim" id="side-scrim" hidden />
          <div className="main">
            <StudioTopbar />
            {children}
          </div>
        </div>
      </div>
      <StudioModals />
      <StudioShellEngine />
    </>
  );
}
