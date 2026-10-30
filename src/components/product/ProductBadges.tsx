import { discountPercent } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductBadges({ product }: { product: Product }) {
  const percent = discountPercent(product.price, product.sale_price);

  return (
    <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
      {product.is_new && (
        <span className="rounded-full bg-carvao px-2.5 py-1 text-[10px] font-semibold tracking-wide-plus uppercase text-offwhite">
          Novo
        </span>
      )}
      {percent != null && (
        <span className="rounded-full bg-dourado px-2.5 py-1 text-[10px] font-semibold tracking-wide-plus uppercase text-carvao">
          Oferta {percent}% off
        </span>
      )}
    </div>
  );
}
