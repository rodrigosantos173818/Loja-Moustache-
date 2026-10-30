/** Canonical production origin, with a local fallback for development. */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const productionDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (configured && !(productionDomain && /^https?:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/i.test(configured))) return configured.replace(/\/$/, "");
  return productionDomain ? `https://${productionDomain}` : configured || "http://localhost:3000";
}
