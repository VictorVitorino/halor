import type { Metadata } from 'next';
import NotFoundEngine from '@/components/shell/NotFoundEngine';
import NotFoundView from '@/components/shell/NotFoundView';

export const metadata: Metadata = { title: 'Página não encontrada' };

export default function NotFound() {
  return (
    <div className="view theme-night" id="v-404" data-view="404">
      <NotFoundView />
      <NotFoundEngine />
    </div>
  );
}
