import type { Metadata } from "next";
import { getActiveCategories, getActiveProducts } from "@/lib/queries";
import Catalog, { type CatalogFilters } from "@/components/product/Catalog";
export const metadata: Metadata = { title: "Catálogo", description: "Explore camisetas, polos, camisas e jeans. Encontre o seu estilo na Moustache.", alternates: { canonical: "/catalogo" } };
export default async function CatalogPage({ searchParams }: { searchParams: Promise<CatalogFilters> }) {
  const [products, categories, filters] = await Promise.all([getActiveProducts(), getActiveCategories(), searchParams]);
  return <div className="page-width"><div className="catalog-intro"><p className="eyebrow">MOUSTACHE / CATÁLOGO</p><h1>O essencial é ser você.</h1><p>Explore a seleção. Encontre suas peças. Vista a sua identidade.</p></div><Catalog key={JSON.stringify(filters)} products={products} categories={categories} initial={filters} /></div>;
}
