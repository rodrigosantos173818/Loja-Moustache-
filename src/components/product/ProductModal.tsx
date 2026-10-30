"use client";
import { X } from "lucide-react";
import ProductDetails from "./ProductDetails";
import Dialog from "@/components/ui/Dialog";
import type { Product } from "@/lib/types";
export default function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return <Dialog label={product.name} onClose={onClose}><div className="flex justify-end mb-3"><button className="icon-button" onClick={onClose} aria-label="Fechar produto"><X size={22} /></button></div><ProductDetails product={product} onAdded={onClose} /></Dialog>;
}
