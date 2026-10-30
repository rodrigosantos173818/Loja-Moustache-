"use client";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, RotateCcw } from "lucide-react";
import ProductsGrid from "./ProductsGrid";
import Dialog from "@/components/ui/Dialog";
import { filterProducts } from "@/lib/catalog";
import type { Category, Product } from "@/lib/types";

export type CatalogFilters = { busca?: string; categoria?: string };
export default function Catalog({ products, categories, initial }: { products: Product[]; categories: Category[]; initial: CatalogFilters }) {
  const [query, setQuery] = useState(initial.busca || "");
  const [category, setCategory] = useState(initial.categoria || "");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [available, setAvailable] = useState(false);
  const [sort, setSort] = useState("curated");
  const [limit, setLimit] = useState(12);
  const [filterOpen, setFilterOpen] = useState(false);
  const sizes = [...new Set(products.flatMap(p => p.product_variants?.map(v => v.size).filter((s): s is string => !!s) || []))];
  const colors = [...new Set(products.flatMap(p => p.product_variants?.map(v => v.color).filter((s): s is string => !!s) || []))];
  const filterCount = [category, size, color, maxPrice, available].filter(Boolean).length;
  const filtered = useMemo(() => filterProducts(products, { query, category, size, color, maxPrice, available, sort }), [products, query, category, size, color, maxPrice, available, sort]);
  function reset() { setQuery(""); setCategory(""); setSize(""); setColor(""); setMaxPrice(""); setAvailable(false); setLimit(12); }
  return <>
    <div className="search-input catalog-search"><Search size={19} /><label className="sr-only" htmlFor="catalog-query">Buscar no catálogo</label><input id="catalog-query" type="search" placeholder="Encontre seu próximo essencial…" value={query} onChange={e => { setQuery(e.target.value); setLimit(12); }} /></div>
    <div className="product-tabs" role="group" aria-label="Categorias"><button className={!category ? "selected" : ""} aria-pressed={!category} onClick={() => { setCategory(""); setLimit(12); }}>Todos</button>{categories.map(c => <button key={c.id} className={category === c.slug ? "selected" : ""} aria-pressed={category === c.slug} onClick={() => { setCategory(c.slug); setLimit(12); }}>{c.name}</button>)}</div>
    <div className="catalog-toolbar"><button className="filter-trigger" onClick={() => setFilterOpen(true)}><SlidersHorizontal size={16} /> Filtros {filterCount > 0 && <span>({filterCount})</span>}</button><span role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? "peça encontrada" : "peças encontradas"}</span><label>Ordenar por <select aria-label="Ordenar produtos" value={sort} onChange={e => setSort(e.target.value)}><option value="curated">Sele??o da loja</option><option value="new">Mais recentes</option><option value="name">Nome: A–Z</option><option value="price-up">Menor preço</option><option value="price-down">Maior preço</option></select></label></div>
    {products.some(p => p.is_demo) && <p className="demo-caption">Modo demonstração · peças e estoques ilustrativos. Preços reais ainda não cadastrados.</p>}
    {filtered.length ? <ProductsGrid products={filtered.slice(0, limit)} /> : <div className="empty-state"><Search size={29} strokeWidth={1} /><h2>Vamos tentar de outro jeito?</h2><p>Nenhuma peça corresponde à sua busca. Experimente outros filtros.</p><button className="button button-outline" onClick={reset}><RotateCcw size={15} /> Limpar filtros</button></div>}
    <div className="catalog-bottom">{filtered.length > limit ? <button className="button button-outline" onClick={() => setLimit(l => l + 12)}>Carregar mais peças</button> : <span className="demo-caption">{filtered.length > 0 ? "Você viu todas as peças desta seleção." : ""}</span>}</div>
    {filterOpen && <Dialog label="Filtrar catálogo" onClose={() => setFilterOpen(false)} className="search-dialog"><div className="dialog-heading"><h2>Encontre o seu estilo.</h2><button className="icon-button" aria-label="Fechar filtros" onClick={() => setFilterOpen(false)}><X /></button></div><div className="filter-fields">
      <label>Categoria<select value={category} onChange={e => setCategory(e.target.value)}><option value="">Todas</option>{categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}</select></label>
      <label>Tamanho<select value={size} onChange={e => setSize(e.target.value)}><option value="">Todos</option>{sizes.map(s => <option key={s}>{s}</option>)}</select></label>
      <label>Cor<select value={color} onChange={e => setColor(e.target.value)}><option value="">Todas</option>{colors.map(c => <option key={c}>{c}</option>)}</select></label>
      <label>Preço máximo (R$)<input type="number" min="0" step="0.01" placeholder="Sem limite" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} /></label>
      <label className="check-label"><input type="checkbox" checked={available} onChange={e => setAvailable(e.target.checked)} /> Apenas disponíveis</label>
    </div><div className="filter-actions"><button className="text-link" onClick={reset}>Limpar filtros</button><button className="button button-dark" onClick={() => { setLimit(12); setFilterOpen(false); }}>Ver {filtered.length} peças</button></div></Dialog>}
  </>;
}
