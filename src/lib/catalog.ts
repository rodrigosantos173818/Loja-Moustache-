import type { Product } from "./types";
import { effectivePrice } from "./format";
export type Filters = { query: string; category: string; size: string; color: string; maxPrice: string; available: boolean; sort: string };
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
export function filterProducts(products: Product[], filters: Filters): Product[] {
  const { query, category, size, color, maxPrice, available, sort } = filters;
  return products.filter(product => {
    const variants = product.product_variants || [];
    const hasStock = variants.length ? variants.some(v => v.stock > 0) : product.stock > 0;
    const variantMatch = (!size && !color) || variants.some(v => (!size || v.size === size) && (!color || v.color === color) && (!available || v.stock > 0));
    return normalize(product.name + " " + (product.category?.name || "")).includes(normalize(query)) && (!category || product.category?.slug === category) && variantMatch && (!available || hasStock) && (!maxPrice || (!product.is_demo && effectivePrice(product.price, product.sale_price) <= Number(maxPrice)));
  }).sort((a, b) => sort === "name" ? a.name.localeCompare(b.name, "pt-BR") : sort === "price-up" ? effectivePrice(a.price, a.sale_price) - effectivePrice(b.price, b.sale_price) : sort === "price-down" ? effectivePrice(b.price, b.sale_price) - effectivePrice(a.price, a.sale_price) : sort === "new" ? b.created_at.localeCompare(a.created_at) : (a.order_index || 0) - (b.order_index || 0));
}
