"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { isSafeUrl, validateProduct } from "@/lib/validation";

async function requireAdminClient() {
  if (!isSupabaseConfigured()) throw new Error("Backend não configurado. Nenhuma alteração foi salva.");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Sessão de administrador expirada. Faça login novamente.");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) throw new Error("Acesso restrito a administradores autorizados.");
  return supabase;
}

/** Revalida todas as rotas públicas que dependem de dados do Supabase. */
function revalidatePublicRoutes() {
  revalidatePath("/", "layout");
  revalidatePath("/produtos");
  revalidatePath("/catalogo");
  revalidatePath("/categoria/[slug]", "page");
  revalidatePath("/produto/[slug]", "page");
}

// ---------- Auth ----------

export async function signIn(formData: FormData) {
  if (!isSupabaseConfigured()) return { error: "Modo demonstração: configure o Supabase para acessar o painel. Nenhuma sessão foi criada." };
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "E-mail ou senha inválidos." };
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) {
    await supabase.auth.signOut();
    return { error: "Esta conta não está autorizada a administrar a loja." };
  }
  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ---------- Store settings ----------

export type StoreSettingsInput = {
  logo_url?: string;
  hero_image_url?: string;
  about_image_url?: string;
  commercial_info?: string;
  privacy_policy?: string;
  store_name: string;
  store_description: string;
  whatsapp_number: string;
  instagram_url: string;
  address: string;
  business_hours: string;
  hero_title: string;
  hero_subtitle: string;
  about_title: string;
  about_text: string;
  meta_title: string;
  meta_description: string;
};

export async function updateStoreSettings(id: string, input: StoreSettingsInput) {
  const supabase = await requireAdminClient();
  if (![input.logo_url || "", input.hero_image_url || "", input.about_image_url || "", input.instagram_url].every(value => isSafeUrl(value))) return { error: "Utilize URLs HTTPS válidas nas imagens e no Instagram." };
  if (input.whatsapp_number && !/^\d{10,15}$/.test(input.whatsapp_number)) return { error: "Informe o WhatsApp com código do país e DDD, somente números." };
  const { error } = await supabase.from("store_settings").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePublicRoutes();
  return { success: true };
}

// ---------- Categories ----------

export type CategoryInput = {
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
  order_index: number;
};

export async function createCategory(input: CategoryInput) {
  const supabase = await requireAdminClient();
  if (!input.name.trim() || !/^[a-z0-9-]+$/.test(input.slug) || !isSafeUrl(input.image_url)) return { error: "Informe nome, slug e imagem válidos." };
  const { error } = await supabase.from("categories").insert(input);
  if (error) return { error: error.message };
  revalidatePublicRoutes();
  revalidatePath("/admin/categorias");
  return { success: true };
}

export async function updateCategory(id: string, input: CategoryInput) {
  const supabase = await requireAdminClient();
  if (!input.name.trim() || !/^[a-z0-9-]+$/.test(input.slug) || !isSafeUrl(input.image_url)) return { error: "Informe nome, slug e imagem válidos." };
  const { error } = await supabase.from("categories").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePublicRoutes();
  revalidatePath("/admin/categorias");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await requireAdminClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePublicRoutes();
  revalidatePath("/admin/categorias");
  return { success: true };
}

// ---------- Products ----------

export type ProductInput = {
  sku?: string;
  order_index?: number;
  size_guide?: string;
  name: string;
  slug: string;
  description: string;
  category_id: string | null;
  price: number;
  sale_price: number | null;
  featured: boolean;
  is_new: boolean;
  is_active: boolean;
  stock: number;
  images: { url: string; alt: string }[];
  variants: { size: string; color: string; stock: number; sku?: string }[];
};

export async function createProduct(input: ProductInput) {
  const supabase = await requireAdminClient();
  const validation = validateProduct(input);
  if (validation) return { error: validation };
  const { data: created, error } = await supabase.rpc("save_catalog_product", { p_id: null, p_data: input });
  if (error || !created) return { error: error?.message ?? "Erro ao criar produto." };

  revalidatePublicRoutes();
  revalidatePath("/admin/produtos");
  return { success: true, id: created as string };
}

export async function updateProduct(id: string, input: ProductInput) {
  const supabase = await requireAdminClient();
  const validation = validateProduct(input);
  if (validation) return { error: validation };
  const { error } = await supabase.rpc("save_catalog_product", { p_id: id, p_data: input });
  if (error) return { error: error.message };

  revalidatePublicRoutes();
  revalidatePath("/admin/produtos");
  revalidatePath(`/admin/produtos/${id}`);
  return { success: true };
}

export async function deleteProduct(id: string) {
  const supabase = await requireAdminClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePublicRoutes();
  revalidatePath("/admin/produtos");
  return { success: true };
}

export async function toggleProductField(
  id: string,
  field: "is_active" | "featured" | "is_new",
  value: boolean
) {
  const supabase = await requireAdminClient();
  const { error } = await supabase
    .from("products")
    .update({ [field]: value })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePublicRoutes();
  revalidatePath("/admin/produtos");
  return { success: true };
}

// ---------- Banners ----------

export type BannerInput = {
  title: string;
  subtitle: string;
  image_url: string;
  button_text: string;
  button_link: string;
  is_active: boolean;
  order_index: number;
};

export async function createBanner(input: BannerInput) {
  const supabase = await requireAdminClient();
  if (!isSafeUrl(input.image_url, false) || !isSafeUrl(input.button_link)) return { error: "Use uma URL de imagem válida e um link HTTPS ou uma rota local." };
  const { error } = await supabase.from("banners").insert(input);
  if (error) return { error: error.message };
  revalidatePublicRoutes();
  revalidatePath("/admin/banners");
  return { success: true };
}

export async function updateBanner(id: string, input: BannerInput) {
  const supabase = await requireAdminClient();
  if (!isSafeUrl(input.image_url, false) || !isSafeUrl(input.button_link)) return { error: "Use uma URL de imagem válida e um link HTTPS ou uma rota local." };
  const { error } = await supabase.from("banners").update(input).eq("id", id);
  if (error) return { error: error.message };
  revalidatePublicRoutes();
  revalidatePath("/admin/banners");
  return { success: true };
}

export async function deleteBanner(id: string) {
  const supabase = await requireAdminClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePublicRoutes();
  revalidatePath("/admin/banners");
  return { success: true };
}
