import type { Metadata } from 'next';
import BrandEngine from '@/components/brand/BrandEngine';
import BrandView from '@/components/brand/BrandView';

export const metadata: Metadata = { title: 'Manual da marca' };

export default function MarcaPage() {
  return (
    <div className="view theme-paper" id="v-brand" data-view="marca">
      <BrandView />
      <BrandEngine />
    </div>
  );
}
