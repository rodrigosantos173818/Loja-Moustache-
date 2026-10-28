export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];
export type ProductVariant = { name?: string; value?: string; attributes?: Record<string,string>; stock?: number | null; available?: boolean };
export type Product = {
  id: string; name: string; slug: string; sku: string | null; description: string | null;
  price: number | null; sale_price: number | null; images: string[]; attributes: Record<string, Json>;
  variants: ProductVariant[]; stock: number | null; is_available: boolean; is_active: boolean;
  is_featured: boolean; sort_order: number; category_id: string | null; created_at: string; updated_at?: string;
  categories?: { id?: string; name: string; slug: string } | null;
  is_demo?: boolean;
};
export type Category = { id: string; name: string; slug: string; description: string | null; image_url: string | null; sort_order: number; is_active:boolean };
export type StoreSettings = { whatsapp?: string; instagram?: string; location?: string; hero_title?: string; hero_text?: string; hero_image?: string; hero_alignment?: 'left' | 'center' | 'right'; about?: string; logo_url?: string; favicon_url?: string };
export type Campaign = { id: string; name: string; description: string | null; image_url: string | null; cta_label: string | null; href: string; sort_order: number; is_active:boolean };
