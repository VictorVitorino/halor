import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://halor.app';

export default function robots(): MetadataRoute.Robots {
  /* as telas do estúdio são do produto logado: fora do índice */
  return { rules: [{ userAgent: '*', allow: '/', disallow: ['/estudio/', '/editor/', '/painel/', '/apresentar/', '/admin/'] }], sitemap: `${SITE}/sitemap.xml` };
}
