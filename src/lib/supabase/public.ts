import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./config";

/**
 * Cliente Supabase "puro" (sem cookies), usado apenas em contextos que não
 * têm uma requisição HTTP associada — ex.: sitemap.xml e robots.txt, que o
 * Next.js pode gerar estaticamente durante o build. Usa somente a anon key.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!isSupabaseConfigured() || !url || !key) return null;
  return createSupabaseClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
