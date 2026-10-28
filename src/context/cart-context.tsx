'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { clampQuantity, cartSubtotal } from '@/lib/cart-utils';

export type CartItem = { key: string; productId: string; name: string; slug: string; image: string | null; price: number | null; quantity: number; variation: string | null; selection:Record<string,string>; stock: number | null; available?: boolean };
type StockSnapshot={id:string;name:string;slug:string;images:string[];price:number|null;sale_price:number|null;stock:number|null;is_available:boolean;variants:Product['variants']};
type CartApi = { items: CartItem[]; count: number; subtotal: number; ready: boolean; hasUnavailable:boolean; add: (product: Product, variation?: string | null, stock?: number | null,selection?:Record<string,string>,quantity?:number) => void; remove: (key: string) => void; setQuantity: (key: string, quantity: number) => void; reconcile: (products:StockSnapshot[])=>void; clear: () => void };
const CartContext = createContext<CartApi | null>(null);
const storageKey = 'moustache-quote-cart-v1';
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]); const [ready, setReady] = useState(false);
  useEffect(() => { try { const value = localStorage.getItem(storageKey); if (value) setItems(JSON.parse(value) as CartItem[]); } catch { localStorage.removeItem(storageKey); } setReady(true); }, []);
  useEffect(() => { if (ready) localStorage.setItem(storageKey, JSON.stringify(items)); }, [items, ready]);
  const add = useCallback((product: Product, variation: string | null = null, stock: number | null = null,selection:Record<string,string> = {}, quantity = 1) => {
    const key = `${product.id}:${variation ?? ''}`;
    setItems((current) => { const found = current.find((item) => item.key === key); if (found) return current.map((item) => item.key === key ? { ...item, quantity: clampQuantity(item.quantity + quantity, stock ?? item.stock) } : item);
      const safeQuantity = clampQuantity(quantity, stock ?? product.stock); if (safeQuantity < 1) return current;
      return [...current, { key, productId: product.id, name: product.name, slug: product.slug, image: product.images?.[0] ?? null, price: product.sale_price ?? product.price, quantity: safeQuantity, variation, selection, stock, available:product.is_available&&stock!==0 }]; });
  }, []);
  const remove = useCallback((key: string) => setItems((current) => current.filter((item) => item.key !== key)), []);
  const setQuantity = useCallback((key: string, quantity: number) => setItems((current) => current.flatMap((item) => item.key !== key ? [item] : clampQuantity(quantity,item.stock)<=0 ? [] : [{ ...item, quantity: clampQuantity(quantity,item.stock) }])), []);
  const reconcile=useCallback((products:StockSnapshot[])=>setItems((current)=>current.map((item)=>{const fresh=products.find((product)=>product.id===item.productId);if(!fresh)return{...item,available:false};const hasSelection=Object.keys(item.selection??{}).length>0;const hasCombos=fresh.variants?.some((v)=>Object.keys(v.attributes??{}).length>1);let stock=fresh.stock;let variantAvailable=true;if(hasSelection){if(!fresh.variants?.length)variantAvailable=false;else{const selected=hasCombos?fresh.variants.filter((v)=>Object.entries(item.selection).every(([key,value])=>v.attributes?.[key]===value)):Object.entries(item.selection).flatMap(([key,value])=>fresh.variants.filter((v)=>v.name===key&&v.value===value));if(hasCombos){const combo=selected.find((v)=>Object.keys(v.attributes??{}).length===Object.keys(item.selection).length);stock=combo?.stock??null;variantAvailable=!!combo&&combo.available!==false;}else{const counts=selected.map((v)=>v.stock).filter((n):n is number=>typeof n==='number');if(counts.length)stock=Math.min(...counts);variantAvailable=selected.length>0&&selected.every((v)=>v.available!==false&&v.stock!==0);}}}const price=fresh.sale_price??fresh.price;return{...item,name:fresh.name,slug:fresh.slug,image:fresh.images?.[0]??null,price,stock,quantity:stock==null?item.quantity:Math.min(item.quantity,Math.max(stock,1)),available:fresh.is_available&&stock!==0&&variantAvailable};})),[]);
  const clear = useCallback(() => setItems([]), []);
  const value = useMemo(() => ({ items, count: items.reduce((n, i) => n + i.quantity, 0), subtotal: cartSubtotal(items), ready, hasUnavailable:items.some((i)=>i.available===false), add, remove, setQuantity, reconcile, clear }), [items, ready, add, remove, setQuantity, reconcile, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const context = useContext(CartContext); if (!context) throw new Error('useCart deve ser usado dentro de CartProvider'); return context; }
