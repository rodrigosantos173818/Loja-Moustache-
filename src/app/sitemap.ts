import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { getSiteUrl } from "@/lib/site";

const siteUrl = getSiteUrl();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/catalogo`, changeFrequency: "daily", priority: 0.9 },
  ];

  const supabase = createPublicClient();
  if (!supabase) return staticRoutes; // Supabase ainda não configurado (.env)

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("slug").eq("is_active", true),
    supabase.from("products").select("slug, updated_at").eq("is_active", true),
  ]);

  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map((category) => ({
    url: `${siteUrl}/categoria/${category.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((product) => ({
    url: `${siteUrl}/produto/${product.slug}`,
    lastModified: product.updated_at,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
