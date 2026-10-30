import type { ProductInput } from "@/app/admin/actions";

export function isSafeUrl(value: string, optional = true): boolean {
  if (!value.trim()) return optional;
  return /^\/(?!\/)/.test(value) || /^https:\/\/[^\s]+$/i.test(value);
}
export function validateProduct(input: ProductInput): string | null {
  if (!input.name.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug)) return "Informe nome e slug válidos.";
  if (!Number.isFinite(input.price) || input.price <= 0) return "Informe um preço maior que zero.";
  if (input.sale_price != null && (!Number.isFinite(input.sale_price) || input.sale_price < 0 || input.sale_price >= input.price)) return "O preço promocional deve ser menor que o preço original.";
  if (!Number.isInteger(input.stock) || input.stock < 0) return "O estoque deve ser um número inteiro não negativo.";
  if (!Number.isInteger(input.order_index ?? 0)) return "A posição deve ser um número inteiro.";
  if (input.images.some(img => !isSafeUrl(img.url))) return "As imagens precisam usar uma URL HTTPS ou um caminho local válido.";
  const keys = new Set<string>();
  for (const variant of input.variants) {
    if ((!variant.size.trim() && !variant.color.trim()) || !Number.isInteger(variant.stock) || variant.stock < 0) return "Preencha tamanho ou cor e um estoque inteiro válido para cada variação.";
    const key = `${variant.size.trim()}|${variant.color.trim()}`;
    if (keys.has(key)) return "Há variações repetidas de tamanho e cor.";
    keys.add(key);
  }
  return null;
}
