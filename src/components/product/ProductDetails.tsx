"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { Minus, Plus, Check, X, ZoomIn, MessageCircle } from "lucide-react";
import Dialog from "@/components/ui/Dialog";
import { buildWhatsappContactLink } from "@/lib/whatsapp";
import { useCart } from "@/context/CartContext";
import { useProductVariants } from "@/hooks/useProductVariants";
import { effectivePrice, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ProductDetails({
  product,
  onAdded,
  whatsappNumber,
}: {
  product: Product;
  onAdded?: () => void;
  whatsappNumber?: string;
}) {
  const images = (product.product_images ?? []).slice().sort((a, b) => a.order_index - b.order_index);
  const [activeImage, setActiveImage] = useState(0);
  const [justAdded, setJustAdded] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const { addItem, openCart } = useCart();

  const {
    hasSizes,
    hasColors,
    sizes,
    colors,
    selectedSize,
    selectedColor,
    selectSize,
    selectColor,
    quantity,
    changeQuantity,
    availableStock,
    error,
    validate,
  } = useProductVariants(product);

  const price = effectivePrice(product.price, product.sale_price);
  const onSale = product.sale_price != null && product.sale_price < product.price;

  function handleAdd() {
    if (!validate()) return;
    addItem({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      image: images[0]?.url ?? "/images/product-placeholder.svg",
      size: selectedSize,
      color: selectedColor,
      quantity,
      price,
      isDemo: !!product.is_demo,
      maxStock: availableStock,
    });
    // Mostra a confirmação visual por um instante antes de abrir o carrinho
    // (e, se estivermos dentro do modal de produto, fechá-lo também) — dá
    // ao cliente um retorno claro de que o item entrou no pedido.
    setJustAdded(true);
    onAdded?.();
    openCart();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
      {/* Galeria */}
      <div>
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-cinza/10">
          {images[activeImage] && <button className="absolute bottom-4 right-4 z-10 icon-button bg-offwhite rounded-full" onClick={() => setZoomOpen(true)} aria-label="Ampliar imagem"><ZoomIn size={20} /></button>}
          {images[activeImage] ? (
            <Image
              src={images[activeImage].url}
              alt={images[activeImage].alt ?? product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-cinza text-sm">
              Sem imagem
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {images.map((img, i) => (
              <button
                key={img.id}
                type="button"
                onClick={() => setActiveImage(i)}
                aria-label={`Ver imagem ${i + 1}`}
                className={clsx(
                  "relative h-16 w-14 shrink-0 overflow-hidden rounded-sm border transition-colors",
                  i === activeImage ? "border-dourado" : "border-transparent opacity-70 hover:opacity-100"
                )}
              >
                <Image src={img.url} alt="" fill sizes="60px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Informações */}
      <div className="flex flex-col">
        {product.category?.name && (
          <span className="text-xs uppercase tracking-wide-plus text-cinza mb-2">
            {product.category.name}
          </span>
        )}
        <h1 className="font-display text-3xl md:text-4xl text-carvao text-balance">{product.name}</h1>

        <div className="mt-4 flex items-baseline gap-3">
          <span className="text-2xl font-medium text-carvao">{product.is_demo ? "Preço a cadastrar" : formatPrice(price)}</span>
          {!product.is_demo && onSale && (
            <span className="text-base text-cinza line-through">{formatPrice(product.price)}</span>
          )}
        </div>

        {product.is_demo && <p className="product-info-notice">Modo demonstração. Imagem e estoque ilustrativos; esta peça não representa o catálogo oficial da loja.</p>}
        {product.description && (
          <p className="mt-5 text-sm leading-relaxed text-carvao/75">{product.description}</p>
        )}

        {hasSizes && (
          <div className="mt-7">
            <span className="text-xs uppercase tracking-wide-plus text-carvao/70">Tamanho</span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => selectSize(size)}
                  disabled={!(product.product_variants || []).some(v => v.size === size && v.stock > 0)}
                  aria-pressed={selectedSize === size}
                  className={clsx(
                    "min-w-11 rounded-sm border px-3.5 py-2 text-sm transition-colors disabled:opacity-30 disabled:line-through",
                    selectedSize === size
                      ? "border-carvao bg-carvao text-offwhite"
                      : "border-carvao/20 text-carvao hover:border-carvao"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {hasColors && (
          <div className="mt-5">
            <span className="text-xs uppercase tracking-wide-plus text-carvao/70">Cor</span>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => selectColor(color)}
                  disabled={!(product.product_variants || []).some(v => v.color === color && (!selectedSize || v.size === selectedSize) && v.stock > 0)}
                  aria-pressed={selectedColor === color}
                  className={clsx(
                    "rounded-sm border px-3.5 py-2 text-sm transition-colors disabled:opacity-30",
                    selectedColor === color
                      ? "border-carvao bg-carvao text-offwhite"
                      : "border-carvao/20 text-carvao hover:border-carvao"
                  )}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6">
          <span className="text-xs uppercase tracking-wide-plus text-carvao/70">Quantidade</span>
          <div className="mt-2.5 inline-flex items-center rounded-sm border border-carvao/20">
            <button
              type="button"
              onClick={() => changeQuantity(quantity - 1)}
              aria-label="Diminuir quantidade"
              className="p-3 text-carvao hover:text-dourado transition-colors disabled:opacity-30"
              disabled={quantity <= 1}
            >
              <Minus size={15} />
            </button>
            <span className="w-10 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => changeQuantity(quantity + 1)}
              aria-label="Aumentar quantidade"
              className="p-3 text-carvao hover:text-dourado transition-colors disabled:opacity-30"
              disabled={availableStock === 0 || quantity >= availableStock}
            >
              <Plus size={15} />
            </button>
          </div>
          {(hasSizes ? selectedSize : true) && (hasColors ? selectedColor : true) && (
            <span className="ml-3 text-xs text-cinza">
              {availableStock > 0 ? `${availableStock} ${product.is_demo ? "unidades ilustrativas" : "em estoque"}` : "Indisponível"}
            </span>
          )}
        </div>

        {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}

        <button
          type="button"
          onClick={handleAdd}
          disabled={availableStock === 0 && (!hasSizes || !!selectedSize) && (!hasColors || !!selectedColor)}
          className={clsx(
            "mt-7 inline-flex items-center justify-center gap-2 rounded-sm px-6 py-4 text-xs uppercase tracking-wide-plus transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-carvao disabled:hover:text-offwhite",
            justAdded
              ? "bg-dourado text-carvao"
              : "bg-carvao text-offwhite hover:bg-carvao-soft hover:text-offwhite"
          )}
        >
          {justAdded ? (
            <>
              <Check size={16} /> Adicionado à sacola
            </>
          ) : (
            "Adicionar à sacola"
          )}
        </button>
        {!product.is_demo && whatsappNumber && <a href={buildWhatsappContactLink(whatsappNumber, `Olá! Gostaria de consultar ${product.name}. ${selectedSize ? `Tamanho: ${selectedSize}.` : ""} ${selectedColor ? `Cor: ${selectedColor}.` : ""}`)} target="_blank" rel="noopener noreferrer" className="button button-outline mt-3"><MessageCircle size={16} /> Consultar pelo WhatsApp</a>}
        <p className="mt-4 text-xs text-cinza leading-relaxed">Sua sacola é um pedido de orçamento. Valores e disponibilidade serão confirmados pela loja.</p>
        {product.size_guide && <details className="mt-6 border-t border-carvao/15 pt-4"><summary className="cursor-pointer text-xs font-medium">Guia de medidas</summary><p className="whitespace-pre-wrap mt-4 text-xs leading-relaxed text-cinza">{product.size_guide}</p></details>}
      </div>
      {zoomOpen && images[activeImage] && <Dialog label="Imagem ampliada do produto" onClose={() => setZoomOpen(false)} className="product-zoom"><div className="dialog-heading"><span>{product.name}</span><button className="icon-button" onClick={() => setZoomOpen(false)} aria-label="Fechar imagem ampliada"><X /></button></div><Image src={images[activeImage].url} alt={images[activeImage].alt || product.name} width={1200} height={1500} sizes="90vw" /></Dialog>}
    </div>
  );
}
