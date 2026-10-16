import type { Metadata } from 'next';
import StudioStage from '@/components/studio/StudioStage';
import StudioStageEngine from '@/components/studio/StudioStageEngine';

export const metadata: Metadata = { title: 'Apresentar' };

export default function Page() {
  return (
    <>
      <StudioStage />
      <StudioStageEngine />
    </>
  );
}
