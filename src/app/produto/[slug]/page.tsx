import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getActiveProducts, getProductBySlug, getStoreSettings } from "@/lib/queries";
import ProductsGrid from "@/components/product/ProductsGrid";
import ProductDetails from "@/components/product/ProductDetails";
import { effectivePrice } from "@/lib/format";

export const revalidate = 60;

// Pré-renderiza todos os produtos ativos no build (SSG); novos produtos
// cadastrados depois são gerados sob demanda no primeiro acesso e então
// cacheados (ISR), sem precisar de novo deploy.
export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((product) => ({ slug: product.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const image = product.product_images?.[0]?.url;
  return {
    robots: product.is_demo ? { index: false, follow: false } : undefined,
    title: product.name,
    description: product.description ?? `${product.name} — Moustache, moda masculina.`,
    alternates: { canonical: `/produto/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: image ? [{ url: image, width: 800, height: 1000, alt: product.name }] : undefined,
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [settings, allRelated] = await Promise.all([getStoreSettings(), getActiveProducts({ categorySlug: product.category?.slug, limit: 5 })]);
  const related = allRelated.filter(item => item.id !== product.id).slice(0, 4);

  const price = effectivePrice(product.price, product.sale_price);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    image: product.product_images?.map((img) => img.url),
    offers: {
      "@type": "Offer",
      priceCurrency: "BRL",
      price: price.toFixed(2),
      availability:
        (product.product_variants?.length ? product.product_variants.some(v => v.stock > 0) : product.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <article className="mx-auto max-w-6xl px-5 py-12 md:px-8 md:py-16">
      {!product.is_demo && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />}

      <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-1.5 text-xs text-cinza">
        <Link href="/" className="hover:text-dourado transition-colors">
          Início
        </Link>
        <ChevronRight size={12} />
        {product.category && (
          <>
            <Link
              href={`/categoria/${product.category.slug}`}
              className="hover:text-dourado transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight size={12} />
          </>
        )}
        <span className="text-carvao">{product.name}</span>
      </nav>

      <ProductDetails product={product} whatsappNumber={settings?.whatsapp_number} />
      {related.length > 0 && <section className="mt-20 border-t border-carvao/15 pt-10"><div className="section-heading"><div><p className="eyebrow">CONTINUE A SUA SELEÇÃO</p><h2>Também combina com você.</h2></div></div><ProductsGrid products={related} /></section>}
    </article>
  );
}
