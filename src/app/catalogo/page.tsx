import type { Metadata } from 'next';
import { CatalogBrowser } from '@/components/product/catalog-browser';
import { getCategories, getProducts } from '@/lib/store-data';
import { storeConfig } from '@/config/store';

export const metadata: Metadata = { title: 'Catálogo', description: 'Explore o catálogo demonstrativo da Moustache.', robots: storeConfig.demoCatalog ? { index: false, follow: true } : undefined, alternates: storeConfig.siteUrl ? { canonical: '/catalogo' } : undefined };

export default async function Catalogo({ searchParams }: { searchParams: Promise<{ q?: string; sort?: string; category?: string }> }) {
  const [products, categories, params] = await Promise.all([getProducts(), getCategories(), searchParams]);
  return <main className="catalog-page"><header className="catalog-top"><p className="eyebrow">MOUSTACHE / CATÁLOGO</p><h1>Peças para<br/><em>o seu momento.</em></h1><p>Explore a seleção masculina demonstrativa. Preços, itens e disponibilidade são fictícios e devem ser substituídos pelos dados confirmados da loja.</p></header><div className="catalog-disclaimer" role="note"><span className="demo-dot"/> CATÁLOGO DE DEMONSTRAÇÃO <span>—</span> ITENS, IMAGENS E VALORES FICTÍCIOS</div><CatalogBrowser products={products} categories={categories} initialQuery={params.q ?? ''} initialSort={params.sort ?? 'newest'} initialCategory={params.category ?? ''}/></main>;
}
