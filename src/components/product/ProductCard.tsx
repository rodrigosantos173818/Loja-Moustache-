"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { effectivePrice, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

const swatches: Record<string, string> = { "Preto": "#252525", "Off-white": "#e3dfd5", "Areia": "#b6a58e", "Azul": "#596e85", "Branco": "#ffffff", "Cinza": "#818181" };
export default function ProductCard({ product, onQuickAdd, priority = false }: { product: Product; onQuickAdd: (product: Product) => void; priority?: boolean }) {
  const image = product.product_images?.find(i => i.is_primary) || product.product_images?.[0];
  const colors = [...new Set(product.product_variants?.map(v => v.color).filter((c): c is string => !!c))];
  return <article className="product-card">
    <div className="product-card-image"><Link href={`/produto/${product.slug}`} aria-label={`Ver ${product.name}`}>{image && <Image src={image.url} alt={image.alt || product.name} fill loading={priority ? "eager" : "lazy"} sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />}</Link>
    {(product.is_demo || product.is_new) && <span className="product-tag">{product.is_demo ? "ILUSTRATIVO" : "NOVIDADE"}</span>}
    <button className="quick-add" onClick={() => onQuickAdd(product)} aria-label={`Escolher opções de ${product.name}`}><Plus size={18} strokeWidth={1.4} /></button></div>
    <div className="product-meta"><span>{product.category?.name}</span><div className="swatches" aria-label={`Cores: ${colors.join(", ")}`}>{colors.map(color => <span key={color} title={color} style={{ background: swatches[color] || "#aaa" }} />)}</div></div>
    <Link href={`/produto/${product.slug}`} className="product-name"><h3>{product.name}</h3><ArrowUpRight size={15} /></Link>
    <p className="product-price">{product.is_demo ? "Preço a cadastrar" : formatPrice(effectivePrice(product.price, product.sale_price))}{!product.is_demo && product.sale_price != null && product.sale_price < product.price && <del>{formatPrice(product.price)}</del>}</p>
  </article>;
}
