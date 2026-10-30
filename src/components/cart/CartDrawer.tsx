"use client";
import Image from "next/image";
import Link from "next/link";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowUpRight } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/format";
import { buildWhatsappOrderLink } from "@/lib/whatsapp";
import type { StoreSettings } from "@/lib/types";
import Dialog from "@/components/ui/Dialog";

export default function CartDrawer({ settings }: { settings: StoreSettings | null }) {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();
  const demo = items.some(item => item.isDemo);
  if (!isOpen) return null;
  const whatsappLink = settings?.whatsapp_number && !demo && items.length ? buildWhatsappOrderLink(settings.whatsapp_number, items) : null;
  return <Dialog label="Sua sacola de orçamento" onClose={closeCart} className="cart-dialog"><div className="cart-content"><div className="dialog-heading"><h2>Sua sacola<span className="ml-2 text-sm">({items.length})</span></h2><button onClick={closeCart} className="icon-button" aria-label="Fechar sacola"><X size={21} /></button></div>
    {items.length === 0 ? <div className="empty-state"><ShoppingBag size={36} strokeWidth={1} /><h2>Espaço para o seu estilo.</h2><p>Sua sacola ainda está vazia.<br />Explore o catálogo e escolha suas peças favoritas.</p><Link href="/catalogo" onClick={closeCart} className="button button-dark">Explorar catálogo <ArrowUpRight size={16} /></Link></div> : <>
      <ul className="cart-items">{items.map(item => <li className="cart-item" key={`${item.productId}-${item.size}-${item.color}`}><div className="cart-item-image"><Image src={item.image} alt={item.name} fill sizes="82px" className="object-cover" /></div><div className="cart-item-info"><div><Link href={`/produto/${item.slug}`} onClick={closeCart}>{item.name}</Link><button className="icon-button" aria-label={`Remover ${item.name}`} onClick={() => removeItem(item.productId, item.size, item.color)}><Trash2 size={15} /></button></div><p>{[item.size, item.color].filter(Boolean).join(" / ")}</p><p>{item.isDemo ? "Peça ilustrativa · sem preço comercial" : formatPrice(item.price * item.quantity)}</p><div className="cart-quantity"><button aria-label={`Diminuir quantidade de ${item.name}`} disabled={item.quantity <= 1} onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}><Minus size={13} /></button><span>{item.quantity}</span><button disabled={item.quantity >= (item.maxStock || 99)} aria-label={`Aumentar quantidade de ${item.name}`} onClick={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}><Plus size={13} /></button></div></div></li>)}</ul>
      <div className="cart-summary"><div><span>Subtotal estimado</span><strong>{demo ? "A consultar" : formatPrice(totalPrice)}</strong></div><p>Orçamento sujeito à confirmação de preços e disponibilidade pela loja.</p>{whatsappLink ? <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="button button-dark">Consultar pelo WhatsApp <ArrowUpRight size={16} /></a> : <><button className="button button-dark" disabled>Consultar pelo WhatsApp</button><p role="status">{demo ? "Esta sacola contém peças de demonstração. O envio estará disponível com o catálogo oficial." : "WhatsApp ainda não configurado. A loja precisa cadastrar o número no painel."}</p></>}</div>
    </>}
  </div></Dialog>;
}
