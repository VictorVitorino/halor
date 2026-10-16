import type { Metadata } from 'next';
import StudioHome from '@/components/studio/StudioHome';
import StudioHomeEngine from '@/components/studio/StudioHomeEngine';

export const metadata: Metadata = { title: 'Estúdio' };

export default function Page() {
  return (
    <>
      <StudioHome />
      <StudioHomeEngine />
    </>
  );
}
