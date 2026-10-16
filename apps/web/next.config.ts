import type { NextConfig } from 'next';

/* Site estático: cada rota vira um HTML em out/ e pode ser hospedada em qualquer lugar.
   NEXT_DIST_DIR permite rodar várias instâncias de dev em paralelo sem disputar a pasta .next. */
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: { unoptimized: true },
  transpilePackages: ['@halor/ui', '@halor/brand'],
  reactStrictMode: true,
  devIndicators: false,
  /* testes automatizados acessam o dev por 127.0.0.1 */
  allowedDevOrigins: ['127.0.0.1'],
};

export default config;
