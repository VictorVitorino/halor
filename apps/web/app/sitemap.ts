import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://halor.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['', 'entrar/', 'assinar/', 'marca/'].map((p, i) => ({ url: `${SITE}/${p}`, changeFrequency: 'weekly', priority: i === 0 ? 1 : .6 }));
}
