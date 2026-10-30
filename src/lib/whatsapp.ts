import type { CartItem } from "./types";
import { formatPrice } from "./format";

/** Remove tudo que não for dígito — aceita número já formatado ou não. */
export function sanitizeWhatsappNumber(number: string): string {
  return number.replace(/\D/g, "");
}

/**
 * Monta a mensagem organizada do pedido e retorna o link wa.me pronto para
 * abrir o WhatsApp com o texto pré-preenchido.
 */
export function buildWhatsappOrderLink(whatsappNumber: string, items: CartItem[]): string {
  const digits = sanitizeWhatsappNumber(whatsappNumber);
  const message = buildWhatsappOrderMessage(items);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsappOrderMessage(items: CartItem[]): string {
  const lines: string[] = ["Olá, Moustache! 👋", "", "Gostaria de fazer o seguinte pedido:", ""];

  items.forEach((item, index) => {
    const subtotal = item.price * item.quantity;
    lines.push(`${index + 1}. ${item.name}`);
    if (item.size) lines.push(`   Tamanho: ${item.size}`);
    if (item.color) lines.push(`   Cor: ${item.color}`);
    lines.push(`   Quantidade: ${item.quantity}`);
    lines.push(`   Valor: ${item.isDemo ? "Ilustrativo, sem preço comercial" : formatPrice(subtotal)}`);
    lines.push("");
  });

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  lines.push(`SUBTOTAL ESTIMADO: ${items.some(item => item.isDemo) ? "A consultar" : formatPrice(total)}`);
  lines.push("");
  lines.push("Podem confirmar os valores e a disponibilidade destas peças?");

  return lines.join("\n");
}

/** Link simples para "Falar no WhatsApp" fora do fluxo de carrinho. */
export function buildWhatsappContactLink(whatsappNumber: string, text?: string): string {
  const digits = sanitizeWhatsappNumber(whatsappNumber);
  const base = `https://wa.me/${digits}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
