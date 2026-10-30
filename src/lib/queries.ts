import { createPublicClient } from "@/lib/supabase/public";
import type { Banner, Category, InstagramPost, Product, StoreSettings } from "@/lib/types";
import { demoCategories, demoProducts, demoSettings } from "./demo";

// Todas as funções aqui usam o cliente público (sem cookies) porque
// alimentam o catálogo público, que não depende de sessão de usuário.
// Isso permite que as páginas sejam geradas estaticamente / com ISR
// (ver `export const revalidate` nas pages) em vez de renderizar 100% em
// tempo real a cada requisição.

const PRODUCT_SELECT =
  "*, category:categories(id, name, slug), product_images(*), product_variants(*)";

export async function getStoreSettings(): Promise<StoreSettings | null> {
  const supabase = createPublicClient();
  if (!supabase) return demoSettings;
  const { data } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();
  return data;
}

export async function getActiveCategories(): Promise<Category[]> {
  const supabase = createPublicClient();
  if (!supabase) return demoCategories;
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });
  if (error) throw new Error("Não foi possível carregar as coleções. Tente novamente.");
  return data ?? [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createPublicClient();
  if (!supabase) return demoCategories.find((category) => category.slug === slug) ?? null;
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data;
}

export async function getActiveProducts(options?: {
  categorySlug?: string;
  featuredOnly?: boolean;
  newOnly?: boolean;
  limit?: number;
}): Promise<Product[]> {
  const supabase = createPublicClient();
  if (!supabase) {
    return demoProducts.filter((product) => (!options?.categorySlug || product.category?.slug === options.categorySlug) && (!options?.featuredOnly || product.featured) && (!options?.newOnly || product.is_new)).slice(0, options?.limit);
  }

  let query = supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("order_index", { ascending: true })
    .order("created_at", { ascending: false });

  if (options?.categorySlug) {
    const { data: category } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.categorySlug)
      .maybeSingle();
    if (!category) return [];
    query = query.eq("category_id", category.id);
  }
  if (options?.featuredOnly) query = query.eq("featured", true);
  if (options?.newOnly) query = query.eq("is_new", true);
  if (options?.limit) query = query.limit(options.limit);

  const { data, error } = await query;
  if (error) throw new Error("Não foi possível carregar o catálogo. Confira a conexão e as migrations do Supabase.");
  return (data ?? []) as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  if (!supabase) return demoProducts.find((product) => product.slug === slug) ?? null;
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  return data as unknown as Product | null;
}

export async function getActiveBanners(): Promise<Banner[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });
  return data ?? [];
}

export async function getActiveInstagramPosts(limit = 6): Promise<InstagramPost[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("instagram_posts")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true })
    .limit(limit);
  return data ?? [];
}
