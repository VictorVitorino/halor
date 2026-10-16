import type { Metadata } from 'next';
import AuthEngine from '@/components/commerce/AuthEngine';
import AuthView from '@/components/commerce/AuthView';

export const metadata: Metadata = { title: 'Entrar' };

export default function EntrarPage() {
  return (
    <div className="view theme-paper" id="v-auth" data-view="entrar">
      <AuthView />
      <AuthEngine />
    </div>
  );
}
