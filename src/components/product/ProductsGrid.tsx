"use client";

import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import dynamic from "next/dynamic";
import Reveal from "@/components/ui/Reveal";
import type { Product } from "@/lib/types";
const ProductModal = dynamic(() => import("@/components/product/ProductModal"));

export default function ProductsGrid({
  products,
  emptyMessage = "Nenhum produto encontrado nesta seleção.",
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  const [quickAddProduct, setQuickAddProduct] = useState<Product | null>(null);

  if (products.length === 0) {
    return <p className="py-16 text-center text-sm text-cinza">{emptyMessage}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-7 md:gap-y-12 lg:grid-cols-4">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={(i % 4) * 60}>
            <ProductCard product={product} onQuickAdd={setQuickAddProduct} priority={i < 4} />
          </Reveal>
        ))}
      </div>

      {quickAddProduct && (
        <ProductModal product={quickAddProduct} onClose={() => setQuickAddProduct(null)} />
      )}
    </>
  );
}
