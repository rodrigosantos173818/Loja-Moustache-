import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductsTable from "./ProductsTable";
import type { Product } from "@/lib/types";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(id, name, slug)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-carvao">Produtos</h1>
        <Link
          href="/admin/produtos/novo"
          className="inline-flex items-center gap-2 rounded-sm bg-carvao px-4 py-2.5 text-xs uppercase tracking-wide-plus text-offwhite hover:bg-carvao-soft hover:text-offwhite transition-colors"
        >
          <Plus size={15} /> Novo produto
        </Link>
      </div>
      <div className="mt-6">
        <ProductsTable products={(data ?? []) as unknown as Product[]} />
      </div>
    </div>
  );
}
