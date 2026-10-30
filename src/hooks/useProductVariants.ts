import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";

/**
 * Centraliza a lógica de seleção de tamanho/cor e cálculo de estoque
 * disponível para a combinação escolhida. Reaproveitada pelo modal de
 * adição rápida e pela página de produto.
 */
export function useProductVariants(product: Product) {
  const variants = useMemo(() => product.product_variants ?? [], [product.product_variants]);
  const hasVariants = variants.length > 0;
  const hasSizes = variants.some((v) => v.size);
  const hasColors = variants.some((v) => v.color);

  const sizes = useMemo(
    () => Array.from(new Set(variants.map((v) => v.size).filter((s): s is string => !!s))),
    [variants]
  );

  const [selectedSizeState, setSelectedSizeState] = useState<string | null>(null);
  const [selectedColorState, setSelectedColorState] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Quando existe apenas uma opção (ex.: um único tamanho, ou acessórios com
  // tamanho "Único"), ela já vem pré-selecionada — calculado durante o
  // render em vez de sincronizado via efeito, então não há re-render extra
  // nem risco de ficar dessincronizado.
  const selectedSize = selectedSizeState ?? (sizes.length === 1 ? sizes[0] : null);

  const colors = useMemo(() => {
    const pool = hasSizes && selectedSize ? variants.filter((v) => v.size === selectedSize) : variants;
    return Array.from(new Set(pool.map((v) => v.color).filter((c): c is string => !!c)));
  }, [variants, hasSizes, selectedSize]);

  const selectedColor = selectedColorState ?? (colors.length === 1 ? colors[0] : null);

  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    return (
      variants.find(
        (v) =>
          (!hasSizes || v.size === selectedSize) && (!hasColors || v.color === selectedColor)
      ) ?? null
    );
  }, [variants, hasVariants, hasSizes, hasColors, selectedSize, selectedColor]);

  const availableStock = hasVariants ? selectedVariant?.stock ?? 0 : product.stock;
  const selectionComplete = (!hasSizes || !!selectedSize) && (!hasColors || !!selectedColor);
  const canAdd = selectionComplete && availableStock > 0;

  function selectSize(size: string) {
    setSelectedSizeState(size);
    setSelectedColorState(null);
    setQuantity(1);
    setError(null);
  }

  function selectColor(color: string) {
    setSelectedColorState(color);
    setQuantity(1);
    setError(null);
  }

  function changeQuantity(next: number) {
    const clamped = Math.max(1, Math.min(next, Math.max(availableStock, 1)));
    setQuantity(clamped);
  }

  function validate(): boolean {
    if (hasSizes && !selectedSize) {
      setError("Selecione um tamanho.");
      return false;
    }
    if (hasColors && !selectedColor) {
      setError("Selecione uma cor.");
      return false;
    }
    if (availableStock <= 0) {
      setError("Produto sem estoque para essa combinação.");
      return false;
    }
    setError(null);
    return true;
  }

  return {
    hasVariants,
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
    canAdd,
    error,
    validate,
  };
}
