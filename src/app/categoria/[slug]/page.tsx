import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import ProductsGrid from "@/components/product/ProductsGrid";
import { getActiveCategories, getActiveProducts, getCategoryBySlug } from "@/lib/queries";

export const revalidate = 60;

export async function generateStaticParams() {
  const categories = await getActiveCategories();
  return categories.map((category) => ({ slug: category.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Categoria não encontrada" };

  return {
    title: category.name,
    description:
      category.description ?? `Confira a coleção de ${category.name.toLowerCase()} da Moustache.`,
    alternates: { canonical: `/categoria/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const products = await getActiveProducts({ categorySlug: slug });

  return (
    <div className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
      <Reveal>
        <div className="mb-12 text-center md:mb-16">
          <span className="text-xs uppercase tracking-wide-plus text-dourado-deep">Categoria</span>
          <h1 className="mt-3 font-display text-4xl text-carvao md:text-6xl">{category.name}</h1>
          {category.description && (
            <p className="mx-auto mt-4 max-w-xl text-sm text-carvao/75">{category.description}</p>
          )}
        </div>
      </Reveal>

      <ProductsGrid
        products={products}
        emptyMessage="Nenhum produto disponível nesta categoria no momento."
      />
    </div>
  );
}
