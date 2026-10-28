import type { MetadataRoute } from 'next';
import { storeConfig } from '@/config/store';

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/', disallow: ['/sacola'] }, sitemap: storeConfig.siteUrl ? `${storeConfig.siteUrl}/sitemap.xml` : undefined };
}
