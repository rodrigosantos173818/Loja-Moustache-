import type { Product } from '@/lib/types';
import { foldSearch } from './cart-utils.ts';

export type CatalogFilters = { query?: string; categoryId?: string; availableOnly?: boolean; attributes?: Record<string, string>; maxPrice?: number | null; sort?: string };

function hasAttribute(product: Product, key: string, value: string) {
  const raw = product.attributes?.[key];
  if (Array.isArray(raw) && raw.includes(value)) return true;
  if (raw === value) return true;
  return product.variants?.some((variant) => (variant.name === key && variant.value === value) || variant.attributes?.[key] === value) ?? false;
}

function available(product: Product) { return product.is_available && product.stock !== 0 && !(product.variants?.length && product.variants.every((variant) => variant.available === false || variant.stock === 0)); }

export function filterCatalogProducts(products: Product[], filters: CatalogFilters) {
  const query = foldSearch(filters.query?.trim() ?? '');
  return products.filter((product) => {
    const price = product.sale_price ?? product.price;
    const text = foldSearch(`${product.name} ${product.description ?? ''} ${product.sku ?? ''} ${product.categories?.name ?? ''}`);
    return (!query || text.includes(query)) && (!filters.categoryId || product.category_id === filters.categoryId) && (!filters.availableOnly || available(product)) && (filters.maxPrice == null || price == null || price <= filters.maxPrice) && Object.entries(filters.attributes ?? {}).every(([key, value]) => !value || hasAttribute(product, key, value));
  }).sort((a, b) => {
    if (filters.sort === 'relevance' && query) {
      const score = (product: Product) => { const name = foldSearch(product.name); return name === query ? 3 : name.startsWith(query) ? 2 : name.includes(query) ? 1 : 0; };
      return score(b) - score(a) || Date.parse(b.created_at) - Date.parse(a.created_at);
    }
    if (filters.sort === 'name') return a.name.localeCompare(b.name, 'pt-BR');
    if (filters.sort === 'price-asc') return (a.sale_price ?? a.price ?? Infinity) - (b.sale_price ?? b.price ?? Infinity);
    if (filters.sort === 'price-desc') return (b.sale_price ?? b.price ?? -Infinity) - (a.sale_price ?? a.price ?? -Infinity);
    return Date.parse(b.created_at) - Date.parse(a.created_at);
  });
}
