import type { CartItem } from '@/context/cart-context';

export function clampQuantity(quantity: number, stock: number | null) { if (!Number.isFinite(quantity)) return 0; const whole = Math.max(0, Math.floor(quantity)); return stock == null ? whole : Math.min(whole, Math.max(0, stock)); }
export function foldSearch(value: string) { return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR'); }
export function cartSubtotal(items: Pick<CartItem, 'price' | 'quantity'>[]) { return items.reduce((sum, item) => sum + (item.price ?? 0) * item.quantity, 0); }
export function hasUnknownPrice(items: Pick<CartItem, 'price'>[]) { return items.some((item) => item.price == null); }
export function hasKnownPrice(items: Pick<CartItem, 'price'>[]) { return items.some((item) => item.price != null); }
export function isValidWhatsAppNumber(value: string) { const digits = value.replace(/\D/g, ''); return digits.length >= 10 && digits.length <= 15; }
export function buildQuoteMessage(items: CartItem[], customerName = '') {
  const subtotal = cartSubtotal(items);
  const partial = hasUnknownPrice(items) && hasKnownPrice(items);
  const subtotalText = hasKnownPrice(items) ? `${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(subtotal)}${partial ? ' (parcial)' : ''}` : 'A confirmar';
  return [`Olá! Gostaria de solicitar um orçamento na MOUSTACHE.${customerName.trim() ? ` Meu nome é ${customerName.trim()}.` : ''}`, '', ...items.map((item) => `• ${item.name}${item.variation ? ` (${item.variation})` : ''} — ${item.quantity} un.${item.price != null ? ` — ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)} cada` : ' — valor a confirmar'}`), '', `Subtotal estimado: ${subtotalText}`, `Total estimado: ${subtotalText}`, '', 'Itens e valores desta versão demonstrativa devem ser confirmados pela loja.'].join('\n');
}
