import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Product } from '@/lib/types';

export function money(value: number | null | undefined) { return typeof value === 'number' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value) : null; }
export function productUnavailable(product: Product) { return !product.is_available || product.stock === 0 || (product.variants?.length > 0 && product.variants.every((variant) => variant.available === false || variant.stock === 0)); }

export function ProductCard({ product, label }: { product: Product; label?: string }) {
  const price = money(product.sale_price ?? product.price);
  const hasValidSale = product.sale_price != null && product.price != null && product.sale_price > 0 && product.sale_price < product.price;
  const unavailable = productUnavailable(product);
  return <article className="product-card"><Link href={`/produto/${product.slug}`} className="product-card-link" aria-label={`Ver ${product.name}`}><div className="product-photo">{product.images?.[0] ? <Image src={product.images[0]} alt={`${product.name} — foto editorial ilustrativa`} fill sizes="(max-width: 720px) 50vw, 25vw" className="product-image"/> : <span className="image-placeholder">FOTO ILUSTRATIVA</span>}<span className="product-label">{label ?? (product.is_demo ? 'DEMO' : product.is_featured ? 'DESTAQUE' : 'MOUSTACHE')}</span>{hasValidSale && <span className="sale-label">OFERTA DEMO</span>}{unavailable && <span className="product-label product-unavailable">Indisponível</span>}<span className="product-open"><ArrowUpRight size={16}/></span></div><div className="product-card-copy"><span className="product-category">{product.categories?.name ?? 'MOUSTACHE'}</span><h3>{product.name}</h3><div className="product-price">{hasValidSale && <del>{money(product.price)}</del>}<span>{price ?? 'Consulte'}</span></div><span className="product-disclaimer">Foto de referência · item e valor demonstrativos</span></div></Link></article>;
}
