import type { Metadata } from 'next';
import StudioPainel from '@/components/dash/StudioPainel';
import PainelEngine from '@/components/dash/PainelEngine';

export const metadata: Metadata = { title: 'Painel Halor' };

export default function Page() {
  return (
    <>
      <StudioPainel />
      <PainelEngine />
    </>
  );
}
