"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProduct, toggleProductField } from "@/app/admin/actions";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleToggle(id: string, field: "is_active" | "featured" | "is_new", value: boolean) {
    startTransition(async () => {
      setError(null);
      const result = await toggleProductField(id, field, value);
      if (result?.error) { setError(result.error); return; }
      router.refresh();
    });
  }

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Excluir "${name}"? Essa ação não pode ser desfeita.`)) return;
    startTransition(async () => {
      setError(null);
      const result = await deleteProduct(id);
      if (result?.error) { setError(result.error); return; }
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto rounded-sm border border-carvao/10 bg-white">
      {error && <p role="alert" className="p-4 text-sm text-red-700">{error}</p>}
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-carvao/10 text-left text-xs uppercase tracking-wide-plus text-cinza">
            <th className="px-4 py-3">Produto</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Preço</th>
            <th className="px-4 py-3">Estoque</th>
            <th className="px-4 py-3">Ativo</th>
            <th className="px-4 py-3">Destaque</th>
            <th className="px-4 py-3">Novo</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className="border-b border-carvao/5 last:border-0">
              <td className="px-4 py-3 text-carvao">{product.name}</td>
              <td className="px-4 py-3 text-cinza">{product.category?.name ?? "—"}</td>
              <td className="px-4 py-3 text-cinza">{formatPrice(product.sale_price ?? product.price)}</td>
              <td className="px-4 py-3 text-cinza">{product.stock}</td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  disabled={isPending}
                  checked={product.is_active}
                  onChange={(e) => handleToggle(product.id, "is_active", e.target.checked)}
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  disabled={isPending}
                  checked={product.featured}
                  onChange={(e) => handleToggle(product.id, "featured", e.target.checked)}
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  disabled={isPending}
                  checked={product.is_new}
                  onChange={(e) => handleToggle(product.id, "is_new", e.target.checked)}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <Link href={`/admin/produtos/${product.id}`} className="text-carvao/60 hover:text-dourado">
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    className="text-carvao/60 hover:text-red-700"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-10 text-center text-cinza">
                Nenhum produto cadastrado ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
