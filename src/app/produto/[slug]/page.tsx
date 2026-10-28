import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product/product-detail';
import { ProductCard } from '@/components/product/product-card';
import { getProduct, getProducts } from '@/lib/store-data';
import { products } from '@/data/products';
import { storeConfig } from '@/config/store';

export function generateStaticParams() { return products.map((product) => ({ slug: product.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: 'Produto não encontrado', robots: { index: false, follow: false } };
  return { title: product.name, description: `${product.name} — produto demonstrativo da Moustache.`, robots: product.is_demo ? { index: false, follow: true } : undefined, alternates: storeConfig.siteUrl ? { canonical: `/produto/${product.slug}` } : undefined, openGraph: { title: `${product.name} | Moustache`, description: product.description ?? 'Item demonstrativo.', images: product.images[0] ? [product.images[0]] : undefined } };
}

export default async function Produto({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();
  const related = (await getProducts({ categoryId: product.category_id ?? undefined })).filter((item) => item.id !== product.id).slice(0, 4);
  const structuredData = !product.is_demo ? { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.description, image: product.images, offers: product.price != null ? { '@type': 'Offer', priceCurrency: 'BRL', price: product.sale_price ?? product.price, availability: product.is_available ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' } : undefined } : null;
  return <main className="product-page"><p className="eyebrow breadcrumb"><Link href="/catalogo">MOUSTACHE / CATÁLOGO</Link> / {product.name}</p>{structuredData && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}/>}<ProductDetail product={product}/>{related.length > 0 && <section className="related-products"><div className="section-heading"><p className="eyebrow">DA MESMA CATEGORIA</p><h2>Mais para <em>descobrir.</em></h2></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item}/>)}</div></section>}</main>;
}
