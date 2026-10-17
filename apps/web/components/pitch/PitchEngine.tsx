'use client';
import { bootPitch } from '@/lib/engines/pitch';
import { useEngine } from '@/lib/hooks/useEngine';

export default function PitchEngine() {
  useEngine('v-site', () => bootPitch(document));
  return null;
}
