'use client';

import { useMemo, useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Category, Product } from '@/lib/types';
import { ProductCard, productUnavailable } from '@/components/product/product-card';
import { money } from '@/components/product/product-card';
import { filterCatalogProducts } from '@/lib/catalog-utils';

function attributeOptions(products: Product[]) {
  const values = new Map<string, Set<string>>();
  const add = (key: string, value: string) => { if (!values.has(key)) values.set(key, new Set()); values.get(key)!.add(value); };
  for (const product of products) {
    for (const [key, raw] of Object.entries(product.attributes ?? {})) for (const value of Array.isArray(raw) ? raw : [raw]) if (typeof value === 'string') add(key, value);
    for (const variant of product.variants ?? []) { if (variant.name && variant.value) add(variant.name, variant.value); for (const [key, value] of Object.entries(variant.attributes ?? {})) add(key, value); }
  }
  return [...values].map(([key, set]) => [key, [...set].sort()] as const);
}

export function CatalogBrowser({ products, categories, initialQuery = '', initialSort = 'newest', initialCategory = '' }: { products: Product[]; categories: Category[]; initialQuery?: string; initialSort?: string; initialCategory?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState(false);
  const [sort, setSort] = useState(initialSort);
  const [limit, setLimit] = useState(12);
  const [attrs, setAttrs] = useState<Record<string, string>>({});
  const [priceCap, setPriceCap] = useState<number | null>(null);
  const options = useMemo(() => attributeOptions(products), [products]);
  const validCategories = categories.filter((item) => products.some((product) => product.category_id === item.id));
  const prices = products.map((product) => product.sale_price ?? product.price).filter((value): value is number => typeof value === 'number').sort((a, b) => a - b);
  const minPrice = prices[0] ?? 0;
  const maxPrice = prices.at(-1) ?? 0;

  const filtered = useMemo(() => filterCatalogProducts(products, { query, categoryId: category, availableOnly: availability, sort, attributes: attrs, maxPrice: priceCap }), [products, query, category, availability, sort, attrs, priceCap]);

  function resetFilters() { setQuery(''); setCategory(''); setAvailability(false); setSort('newest'); setAttrs({}); setPriceCap(null); setLimit(12); }
  const activeFilters = Number(!!query.trim()) + Number(!!category) + Number(availability) + Object.keys(attrs).filter((key) => !!attrs[key]).length + Number(priceCap !== null);

  return <><div className="catalog-tools catalog-tools-full" id="busca"><label className="search-box"><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar peça, categoria ou descrição" aria-label="Buscar no catálogo"/></label><div className="catalog-selects">{validCategories.length > 0 && <label><span>Categoria</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Todas</option>{validCategories.map((item) => <option value={item.id} key={item.id}>{item.name}</option>)}</select></label>}{options.map(([key, values]) => <label key={key}><span>{key}</span><select value={attrs[key] ?? ''} onChange={(event) => setAttrs((current) => ({ ...current, [key]: event.target.value }))}><option value="">Todas</option>{values.map((value) => <option key={value}>{value}</option>)}</select></label>)}{maxPrice > minPrice && <label className="price-filter"><span>Até {money(priceCap ?? maxPrice)}</span><input type="range" min={minPrice} max={maxPrice} step="1" value={priceCap ?? maxPrice} onChange={(event) => setPriceCap(Number(event.target.value))} aria-label="Preço máximo"/></label>}<label><span>Ordenar</span><select value={sort} onChange={(event) => setSort(event.target.value)}><option value="relevance">Relevância</option><option value="newest">Novidades</option><option value="name">Nome</option>{prices.length > 0 && <><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option></>}</select></label><label className="availability"><input type="checkbox" checked={availability} onChange={(event) => setAvailability(event.target.checked)}/><span>Disponíveis</span></label></div></div><div className="catalog-result-line"><span>{filtered.length} {filtered.length === 1 ? 'peça' : 'peças'} <span className="result-muted">encontradas</span></span><span className="filter-count"><SlidersHorizontal size={14}/> {activeFilters ? `${activeFilters} filtros ativos` : 'Todos os filtros'}</span></div>{activeFilters > 0 && <div className="active-filters"><span>FILTROS</span>{query.trim() && <button onClick={() => setQuery('')}>“{query}” <X size={12}/></button>}{category && <button onClick={() => setCategory('')}>{validCategories.find((item) => item.id === category)?.name} <X size={12}/></button>}{Object.entries(attrs).filter(([, value]) => value).map(([key, value]) => <button key={key} onClick={() => setAttrs((current) => ({ ...current, [key]: '' }))}>{key}: {value} <X size={12}/></button>)}{availability && <button onClick={() => setAvailability(false)}>Disponíveis <X size={12}/></button>}{priceCap !== null && <button onClick={() => setPriceCap(null)}>Até {money(priceCap)} <X size={12}/></button>}<button className="clear-filters" onClick={resetFilters}>Limpar tudo</button></div>}{filtered.length ? <><div className="product-grid">{filtered.slice(0, limit).map((product) => <ProductCard key={product.id} product={product} label={product.is_demo ? 'DEMO' : undefined}/>)}</div>{limit < filtered.length && <button className="button button-outline-dark load-more" onClick={() => setLimit((current) => current + 12)}>Carregar mais peças</button>}</> : <div className="empty-catalog"><span className="empty-rule"/><h2>Nenhuma peça encontrada.</h2><p>Tente outra busca ou remova alguns filtros para explorar a seleção demonstrativa.</p><button className="under-link reset-filters" onClick={resetFilters}>Limpar filtros</button></div>}</>;
}
