import type { Metadata, Viewport } from 'next';
import { HalorSprite } from '@halor/ui';
import CoreRuntime from '@/components/shell/CoreRuntime';
import ProtoBar from '@/components/shell/ProtoBar';
import Toast from '@/components/shell/Toast';
import { instrument, jetbrains, sora } from './fonts';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://halor.app'),
  title: { default: 'Halor · Faça cada olhar render.', template: '%s · Halor' },
  description: 'Halor é um programa de apresentações lúdicas em HTML. Prende o olhar, põe a plateia para participar e abre em qualquer navegador.',
  applicationName: 'Halor',
  icons: {
    icon: [{ url: '/brand/favicon.svg', type: 'image/svg+xml' }, { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' }],
    apple: [{ url: '/brand/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/manifest.webmanifest',
  openGraph: {
    type: 'website', locale: 'pt_BR', siteName: 'Halor', title: 'Halor · Faça cada olhar render.',
    description: 'Apresentações vivas, que prendem o olhar do começo ao fim. Sem código.',
    images: [{ url: '/brand/og.png', width: 1200, height: 630, alt: 'Halor' }],
  },
  twitter: { card: 'summary_large_image', title: 'Halor · Faça cada olhar render.', images: ['/brand/og.png'] },
};

export const viewport: Viewport = { themeColor: '#07040f', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${sora.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <body>
        <a className="skip" href="#conteudo">Pular para o conteúdo</a>
        <HalorSprite />
        <ProtoBar />
        <Toast />
        {children}
        <CoreRuntime />
      </body>
    </html>
  );
}
