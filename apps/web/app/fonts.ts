import localFont from 'next/font/local';

/* Sora (títulos e logo), Instrument Sans (interface e texto) e JetBrains Mono (dados e rótulos),
   servidas pelo próprio site: sem chamada externa e com pré-carregamento.
   Só o subconjunto latino: cobre todo o português (acentos, cedilha, ·, ×) e evita
   que dois arquivos sem unicode-range disputem os mesmos caracteres.
   O next/font exige valores literais, por isso a lista é escrita por extenso. */
export const sora = localFont({
  variable: '--font-sora',
  display: 'swap',
  src: [
    { path: './fonts/sora-latin-wght-normal.woff2', weight: '100 800', style: 'normal' },
  ],
});

export const instrument = localFont({
  variable: '--font-instrument',
  display: 'swap',
  src: [
    { path: './fonts/instrument-sans-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/instrument-sans-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/instrument-sans-latin-600-normal.woff2', weight: '600', style: 'normal' },
    { path: './fonts/instrument-sans-latin-700-normal.woff2', weight: '700', style: 'normal' },
  ],
});

export const jetbrains = localFont({
  variable: '--font-jetbrains',
  display: 'swap',
  src: [
    { path: './fonts/jetbrains-mono-latin-400-normal.woff2', weight: '400', style: 'normal' },
    { path: './fonts/jetbrains-mono-latin-500-normal.woff2', weight: '500', style: 'normal' },
    { path: './fonts/jetbrains-mono-latin-600-normal.woff2', weight: '600', style: 'normal' },
  ],
});
