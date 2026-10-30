// Tipos alinhados ao schema definido em /supabase/migrations.

export type StoreSettings = {
  logo_url?: string | null;
  hero_image_url?: string | null;
  about_image_url?: string | null;
  commercial_info?: string | null;
  privacy_policy?: string | null;
  id: string;
  store_name: string;
  store_description: string;
  whatsapp_number: string;
  instagram_url: string;
  address: string | null;
  business_hours: string | null;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
  meta_title: string;
  meta_description: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
  order_index: number;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  order_index: number;
  is_primary: boolean;
};

export type ProductVariant = {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  stock: number;
  sku: string | null;
};

export type Product = {
  is_demo?: boolean;
  sku?: string | null;
  order_index?: number;
  size_guide?: string | null;
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  price: number;
  sale_price: number | null;
  featured: boolean;
  is_new: boolean;
  is_active: boolean;
  stock: number;
  created_at: string;
  updated_at: string;
  category?: Pick<Category, "id" | "name" | "slug"> | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
};

export type Banner = {
  id: string;
  title: string | null;
  subtitle: string | null;
  image_url: string;
  button_text: string | null;
  button_link: string | null;
  is_active: boolean;
  order_index: number;
};

export type InstagramPost = {
  id: string;
  image_url: string;
  caption: string | null;
  permalink: string | null;
  order_index: number;
  is_active: boolean;
};

/** Item guardado no carrinho (localStorage). */
export type CartItem = {
  isDemo?: boolean;
  maxStock?: number;
  productId: string;
  name: string;
  slug: string;
  image: string;
  size: string | null;
  color: string | null;
  quantity: number;
  price: number; // preço unitário já considerando promoção
};
