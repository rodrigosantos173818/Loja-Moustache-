"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import ProductsGrid from "@/components/product/ProductsGrid";
import type { Product } from "@/lib/types";
export default function NewArrivals({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState("Todos");
  const categories = ["Todos", ...new Set(products.map(p => p.category?.name).filter((name): name is string => !!name))];
  const visible = selected === "Todos" ? products.slice(0, 4) : products.filter(p => p.category?.name === selected).slice(0, 4);
  return <section id="novidades" className="arrivals-section"><div className="page-width section-space">
    <div className="section-heading"><div><p className="eyebrow">ESCOLHAS QUE FAZEM A DIFERENÇA</p><h2>Para renovar o seu estilo.</h2></div><Link href="/catalogo" className="text-link">Explorar catálogo <ArrowUpRight size={16} /></Link></div>
    <div className="product-tabs" role="group" aria-label="Filtrar destaques">{categories.map(c => <button key={c} aria-pressed={selected === c} onClick={() => setSelected(c)} className={selected === c ? "selected" : ""}>{c}</button>)}</div>
    {products.some(p => p.is_demo) && <p className="demo-caption">Seleção demonstrativa · imagens ilustrativas, sem preços ou estoque comercial.</p>}
    <ProductsGrid products={visible} emptyMessage="Nossa próxima seleção está a caminho. Converse com a loja para conhecer as peças disponíveis." />
  </div></section>;
}
