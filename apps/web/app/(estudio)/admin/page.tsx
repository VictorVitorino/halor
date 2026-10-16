import type { Metadata } from 'next';
import StudioAdmin from '@/components/studio/StudioAdmin';
import StudioAdminEngine from '@/components/studio/StudioAdminEngine';

export const metadata: Metadata = { title: 'Administração' };

export default function Page() {
  return (
    <>
      <StudioAdmin />
      <StudioAdminEngine />
    </>
  );
}
