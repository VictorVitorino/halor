import type { Metadata } from 'next';
import CheckoutEngine from '@/components/commerce/CheckoutEngine';
import CheckoutView from '@/components/commerce/CheckoutView';

export const metadata: Metadata = { title: 'Assinar' };

export default function AssinarPage() {
  return (
    <div className="view theme-paper" id="v-checkout" data-view="assinar">
      <CheckoutView />
      <CheckoutEngine />
    </div>
  );
}
