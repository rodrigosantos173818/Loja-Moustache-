import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";
import type { Product } from "@/lib/types";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories }] = await Promise.all([
    supabase
      .from("products")
      .select("*, category:categories(id, name, slug), product_images(*), product_variants(*)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("categories").select("*").order("order_index"),
  ]);

  if (!product) notFound();

  return (
    <div>
      <h1 className="font-display text-2xl text-carvao">Editar produto</h1>
      <div className="mt-6">
        <ProductForm categories={categories ?? []} product={product as unknown as Product} />
      </div>
    </div>
  );
}
