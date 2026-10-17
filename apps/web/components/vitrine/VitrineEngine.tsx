'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootVitrine } from '@/lib/engines/vitrine';

/* Motor da vitrine (#vitrine na tela v-site): filtro, palco de demos ao vivo e editáveis, ripple e catálogo com prévias. */
export default function VitrineEngine() {
  useEngine('v-site', () => bootVitrine(document.getElementById('v-site') ?? document));
  return null;
}
