import type { MetadataRoute } from 'next';
import { products } from '@/data/products';
import { storeConfig } from '@/config/store';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = storeConfig.siteUrl;
  if (!base || storeConfig.demoCatalog) return [];
  const publicProducts = storeConfig.demoCatalog ? [] : products.filter((product) => !product.is_demo);
  return [{ url: base }, { url: `${base}/catalogo` }, ...publicProducts.map((product) => ({ url: `${base}/produto/${product.slug}`, lastModified: new Date(product.updated_at ?? product.created_at) }))];
}
