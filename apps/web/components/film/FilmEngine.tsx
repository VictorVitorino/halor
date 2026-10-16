'use client';
import { useEngine } from '@/lib/hooks/useEngine';
import { bootFilm } from '@/lib/engines/film/engine';

/* Motor do filme (#film) na tela do site: liga ao montar e desliga ao sair. Não renderiza nada. */
export default function FilmEngine() {
  useEngine('v-site', () => bootFilm(document.getElementById('filme') ?? document));
  return null;
}
