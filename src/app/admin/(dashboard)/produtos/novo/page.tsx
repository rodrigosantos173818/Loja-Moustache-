import { createClient } from "@/lib/supabase/server";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase.from("categories").select("*").order("order_index");

  return (
    <div>
      <h1 className="font-display text-2xl text-carvao">Novo produto</h1>
      <div className="mt-6">
        <ProductForm categories={categories ?? []} />
      </div>
    </div>
  );
}
