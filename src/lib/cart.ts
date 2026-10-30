import type { CartItem } from "./types";

export function restoreCart(raw: string | null): CartItem[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data)) return [];
    return data.filter((item): item is CartItem => {
      if (!item || typeof item !== "object") return false;
      const stock = item.maxStock ?? 99;
      return typeof item.productId === "string" && typeof item.slug === "string" && typeof item.name === "string" && typeof item.image === "string" && /^(\/[^/]|https:\/\/)/.test(item.image) && (item.size == null || typeof item.size === "string") && (item.color == null || typeof item.color === "string") && Number.isFinite(item.price) && item.price >= 0 && Number.isInteger(stock) && stock > 0 && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= Math.min(stock, 99) && (item.isDemo == null || typeof item.isDemo === "boolean");
    });
  } catch { return []; }
}
