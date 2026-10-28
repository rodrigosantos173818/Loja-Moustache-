'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Check, MessageCircle, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import type { Product, ProductVariant } from '@/lib/types';
import { money } from '@/components/product/product-card';
import { useCart } from '@/context/cart-context';
import { storeConfig } from '@/config/store';
import { isValidWhatsAppNumber } from '@/lib/cart-utils';

function variantNames(variant: ProductVariant) { return variant.attributes ? Object.keys(variant.attributes) : variant.name ? [variant.name] : []; }
function variantValue(variant: ProductVariant, key: string) { return variant.attributes?.[key] ?? (variant.name === key ? variant.value : undefined); }

export function ProductDetail({ product }: { product: Product }) {
  const [image, setImage] = useState(0);
  const [selection, setSelection] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const lightbox = useRef<HTMLDialogElement>(null);
  const { add } = useCart();
  const variants = product.variants ?? [];
  const groups = [...new Set([...Object.keys(product.attributes ?? {}).filter((key) => Array.isArray(product.attributes[key])), ...variants.flatMap(variantNames)])];
  const ready = groups.every((name) => !!selection[name]);
  const hasCombinations = variants.some((variant) => Object.keys(variant.attributes ?? {}).length > 1);
  const matching = hasCombinations ? variants.filter((variant) => Object.entries(selection).every(([key, value]) => variantValue(variant, key) === value)) : Object.entries(selection).flatMap(([key, value]) => variants.filter((variant) => variantValue(variant, key) === value));
  const chosenVariant = ready ? matching.find((variant) => !hasCombinations || Object.keys(variant.attributes ?? {}).length === groups.length) : undefined;
  const matchedStocks = matching.map((variant) => variant.stock).filter((stock): stock is number => typeof stock === 'number');
  const variantStock = hasCombinations ? chosenVariant?.stock ?? null : matchedStocks.length ? Math.min(...matchedStocks) : product.stock;
  const unavailable = !product.is_available || product.stock === 0 || variantStock === 0 || (ready && hasCombinations && !chosenVariant) || matching.some((variant) => variant.available === false);
  const variantText = Object.entries(selection).map(([key, value]) => `${key}: ${value}`).join(', ');
  const whatsappText = encodeURIComponent(`Olá! Gostaria de consultar este item demonstrativo da Moustache: ${product.name}${variantText ? `\n${variantText}` : ''}${product.price != null ? `\nValor demonstrativo: ${money(product.sale_price ?? product.price)}` : '\nValor a confirmar'}`);
  const phone = isValidWhatsAppNumber(storeConfig.whatsappNumber) ? storeConfig.whatsappNumber : '';
  const validSale = product.sale_price != null && product.price != null && product.sale_price < product.price;

  useEffect(() => {
    const dialog = lightbox.current;
    if (zoom && dialog && !dialog.open) dialog.showModal();
    if (!zoom && dialog?.open) dialog.close();
  }, [zoom]);

  return <div className="product-detail"><div className="product-gallery"><button type="button" className="product-main-image" onClick={() => product.images?.[image] && setZoom(true)} aria-label="Ampliar foto de referência">{product.images?.[image] ? <Image src={product.images[image]} alt={`Foto editorial ilustrativa de ${product.name}`} fill priority sizes="(max-width: 760px) 100vw, 55vw"/> : <span className="image-placeholder">FOTO ILUSTRATIVA</span>}<span className="image-count">FOTO DE REFERÊNCIA</span></button>{product.images && product.images.length > 1 && <div className="product-thumbnails">{product.images.map((src, index) => <button type="button" key={`${src}-${index}`} aria-label={`Ver imagem ${index + 1}`} className={image === index ? 'selected' : ''} onClick={() => setImage(index)}><Image src={src} alt="" fill sizes="74px"/></button>)}</div>}</div>
    <div className="product-info"><p className="eyebrow">{product.categories?.name ?? 'MOUSTACHE'} / DEMONSTRAÇÃO</p><h1>{product.name}</h1><p className="demo-note">Produto, descrição, preço e estoque são fictícios.</p><div className="detail-price">{validSale && <del>{money(product.price)}</del>}<span>{money(product.sale_price ?? product.price) ?? 'Valor a consultar'}</span></div><p className={`availability-note ${unavailable ? 'unavailable' : ''}`}>{unavailable ? 'Indisponível' : 'Disponibilidade demonstrativa'}</p>{product.description && <div className="product-description">{product.description}</div>}
      {groups.length > 0 && <div className="variant-picker">{groups.map((name) => { const raw = product.attributes[name]; const values = Array.isArray(raw) ? raw.filter((value): value is string => typeof value === 'string') : [...new Set(variants.map((variant) => variantValue(variant, name)).filter((value): value is string => !!value))]; return <fieldset key={name}><legend>{name}{selection[name] && <b> · {selection[name]}</b>}</legend><div className="variant-options">{values.map((value) => { const candidate = { ...selection, [name]: value }; const possible = variants.filter((variant) => hasCombinations ? Object.entries(candidate).every(([key, choice]) => variantValue(variant, key) === choice) : variantValue(variant, name) === value); const disabled = variants.length > 0 && !possible.some((variant) => variant.available !== false && variant.stock !== 0); return <button type="button" disabled={disabled} aria-pressed={selection[name] === value} key={value} onClick={() => setSelection(candidate)}>{value}</button>; })}</div></fieldset>; })}</div>}
      <div className="quantity-control product-quantity"><span>Quantidade</span><button aria-label="Diminuir quantidade" disabled={quantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))}><Minus size={13}/></button><span>{quantity}</span><button aria-label="Aumentar quantidade" disabled={variantStock != null && quantity >= variantStock} onClick={() => setQuantity((value) => Math.min(variantStock ?? value + 1, value + 1))}><Plus size={13}/></button></div>
      <div className="product-actions"><button className="button button-light" disabled={unavailable || !ready} onClick={() => { add(product, variantText || null, variantStock, selection, quantity); setAdded(true); window.setTimeout(() => setAdded(false), 1800); }}>{added ? <Check size={16}/> : <ShoppingBag size={16}/>} {added ? 'Adicionado à sacola' : 'Adicionar à sacola'}</button>{storeConfig.demoCatalog ? <p className="config-hint">O contato comercial fica desativado enquanto o catálogo usar dados demonstrativos.</p> : phone ? <a className="button button-outline-dark" target="_blank" rel="noreferrer" href={`https://wa.me/${phone}?text=${whatsappText}`}><MessageCircle size={16}/> Consultar no WhatsApp</a> : <p className="config-hint">Configure um telefone comercial válido para ativar o contato pelo WhatsApp.</p>}</div>
      {product.attributes && Object.keys(product.attributes).filter((key) => !groups.includes(key)).length > 0 && <dl className="attribute-list">{Object.entries(product.attributes).filter(([key]) => !groups.includes(key)).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{Array.isArray(value) ? value.join(', ') : String(value)}</dd></div>)}</dl>}
    </div>{zoom && <dialog ref={lightbox} className="product-lightbox" aria-label={`Foto ilustrativa ampliada de ${product.name}`} onClose={() => setZoom(false)} onClick={(event) => { if (event.target === event.currentTarget) setZoom(false); }}><button type="button" aria-label="Fechar imagem ampliada" onClick={() => setZoom(false)}><X size={23}/></button><Image src={product.images[image]} alt={`Foto editorial ilustrativa de ${product.name}`} fill sizes="100vw"/></dialog>}</div>;
}
