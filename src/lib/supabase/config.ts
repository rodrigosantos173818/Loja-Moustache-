/** Configuration presence is not proof of a successful backend connection. */
export function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  return /^https:\/\//.test(url) && key.length > 30 && !/your[-_]|placeholder|xxxxx|seu[-_]|sua[-_]/i.test(url + key);
}
