import type { Metadata } from 'next';
import StudioEditor from '@/components/studio/StudioEditor';
import StudioEditorEngine from '@/components/studio/StudioEditorEngine';

export const metadata: Metadata = { title: 'Editor' };

export default function Page() {
  return (
    <>
      <StudioEditor />
      <StudioEditorEngine />
    </>
  );
}
