import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Halor · Faça cada olhar render.',
    short_name: 'Halor',
    description: 'Apresentações vivas, que prendem o olhar do começo ao fim.',
    lang: 'pt-BR',
    start_url: '/estudio/',
    display: 'standalone',
    background_color: '#07040f',
    theme_color: '#07040f',
    icons: [
      { src: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/brand/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/brand/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
