import type { Campaign, Category, Product, StoreSettings } from '@/lib/types';
import { categories, products } from '@/data/products';
import { storeConfig } from '@/config/store';

export async function getProducts(options: { featured?: boolean; limit?: number; categoryId?: string } = {}): Promise<Product[]> {
  let result = [...products];
  if (options.featured) result = result.filter((product) => product.is_featured).sort((a, b) => a.sort_order - b.sort_order);
  else result.sort((a, b) => Date.parse(b.created_at) - Date.parse(a.created_at));
  if (options.categoryId) result = result.filter((product) => product.category_id === options.categoryId);
  return options.limit ? result.slice(0, options.limit) : result;
}

export async function getProduct(slug: string): Promise<Product | null> { return products.find((product) => product.slug === slug) ?? null; }
export async function getCategories(): Promise<Category[]> { return categories; }
export async function getStoreSettings(): Promise<StoreSettings> {
  return { whatsapp: storeConfig.whatsappNumber, instagram: storeConfig.instagramUrl, hero_title: 'Vista a sua\npresença.', hero_text: 'Moda masculina para acompanhar o seu ritmo. Explore a seleção da Moustache.', hero_image: '/catalog/photo-editorial.webp', about: 'Uma curadoria demonstrativa de moda masculina, criada para apresentar a experiência digital da Moustache.' };
}
export async function getCampaigns(): Promise<Campaign[]> { return []; }
