export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Menor preço efetivo (promocional quando existir). */
export function effectivePrice(price: number, salePrice: number | null): number {
  return salePrice != null && salePrice < price ? salePrice : price;
}

export function discountPercent(price: number, salePrice: number | null): number | null {
  if (salePrice == null || salePrice >= price || price <= 0) return null;
  return Math.round(((price - salePrice) / price) * 100);
}
