'use client';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/cart-context';
export function CartCount() { const { count } = useCart(); return <Link className="bag-link" href="/sacola" aria-label={`Sacola de orçamento, ${count} itens`}><ShoppingBag size={17}/><span>Sacola</span>{count > 0 && <b className="bag-count">{count}</b>}</Link>; }
