"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { createProduct, updateProduct, type ProductInput } from "@/app/admin/actions";
import { slugify } from "@/lib/slugify";
import type { Category, Product } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import { validateProduct } from "@/lib/validation";

type ImageRow = { url: string; alt: string };
type VariantRow = { size: string; color: string; stock: number; sku?: string };

function toForm(product?: Product): ProductInput {
  return {
    sku: product?.sku ?? "",
    order_index: product?.order_index ?? 0,
    size_guide: product?.size_guide ?? "",
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    category_id: product?.category_id ?? null,
    price: product?.price ?? 0,
    sale_price: product?.sale_price ?? null,
    featured: product?.featured ?? false,
    is_new: product?.is_new ?? false,
    is_active: product?.is_active ?? true,
    stock: product?.stock ?? 0,
    images:
      product?.product_images
        ?.slice()
        .sort((a, b) => a.order_index - b.order_index)
        .map((img) => ({ url: img.url, alt: img.alt ?? "" })) ?? [],
    variants:
      product?.product_variants?.map((v) => ({
        size: v.size ?? "",
        color: v.color ?? "",
        stock: v.stock,
        sku: v.sku || "",
      })) ?? [],
  };
}

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: Product;
}) {
  const router = useRouter();
  const isEdit = !!product;
  const [form, setForm] = useState<ProductInput>(toForm(product));
  const [images, setImages] = useState<ImageRow[]>(toForm(product).images);
  const [variants, setVariants] = useState<VariantRow[]>(toForm(product).variants);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    setError(null);
    if (!form.name.trim() || !form.slug.trim()) {
      setError("Preencha nome e slug.");
      return;
    }
    if (form.price <= 0) {
      setError("Informe um preço válido.");
      return;
    }
    const payload: ProductInput = { ...form, images, variants };
    const validation = validateProduct(payload);
    if (validation) { setError(validation); return; }

    startTransition(async () => {
      const result = isEdit
        ? await updateProduct(product!.id, payload)
        : await createProduct(payload);
      if (result?.error) {
        setError(result.error);
        return;
      }
      router.push("/admin/produtos");
      router.refresh();
    });
  }

  return (
    <div className="flex max-w-3xl flex-col gap-8">
      <Section title="Informações principais">
        <div className="grid grid-cols-2 gap-4"><Field label="SKU do produto"><input className="admin-input" value={form.sku} onChange={e => set("sku", e.target.value)} /></Field><Field label="Posição no catálogo"><input className="admin-input" type="number" value={form.order_index} onChange={e => set("order_index", Number(e.target.value))} /></Field></div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Nome">
            <input
              className="admin-input"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                set("name", name);
                if (!isEdit) set("slug", slugify(name));
              }}
            />
          </Field>
          <Field label="Slug (URL)">
            <input className="admin-input" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
          </Field>
        </div>
        <Field label="Descrição">
          <textarea
            className="admin-input"
            rows={3}
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>
        <Field label="Categoria">
          <select
            className="admin-input"
            value={form.category_id ?? ""}
            onChange={(e) => set("category_id", e.target.value || null)}
          >
            <option value="">Sem categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </Field>
      </Section>

      <Section title="Preço e estoque">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Preço (R$)">
            <input
              type="number"
              min={0}
              step="0.01"
              className="admin-input"
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
            />
          </Field>
          <Field label="Preço promocional (R$)" hint="Deixe vazio se não houver promoção.">
            <input
              type="number"
              min={0}
              step="0.01"
              className="admin-input"
              value={form.sale_price ?? ""}
              onChange={(e) => set("sale_price", e.target.value === "" ? null : Number(e.target.value))}
            />
          </Field>
          <Field label="Estoque geral" hint="Usado quando o produto não tem variações.">
            <input
              type="number"
              min={0}
              className="admin-input"
              value={form.stock}
              onChange={(e) => set("stock", Number(e.target.value))}
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-6">
          <Checkbox label="Ativo" checked={form.is_active} onChange={(v) => set("is_active", v)} />
          <Checkbox label="Destaque" checked={form.featured} onChange={(v) => set("featured", v)} />
          <Checkbox label="Novidade" checked={form.is_new} onChange={(v) => set("is_new", v)} />
        </div>
      </Section>

      <Section title="Imagens" description="A primeira imagem é a principal. Reordene removendo e adicionando as URLs na ordem desejada.">
        <ImageUpload onUploaded={urls => setImages(current => [...current, ...urls.map(url => ({ url, alt: form.name }))])} />
        {images.map((img, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              className="admin-input"
              placeholder="URL da imagem"
              value={img.url}
              onChange={(e) => {
                const next = [...images];
                next[i] = { ...next[i], url: e.target.value };
                setImages(next);
              }}
            />
            <input
              className="admin-input"
              placeholder="Texto alternativo (SEO)"
              value={img.alt}
              onChange={(e) => {
                const next = [...images];
                next[i] = { ...next[i], alt: e.target.value };
                setImages(next);
              }}
            />
            <button
              type="button"
              onClick={() => setImages(images.filter((_, idx) => idx !== i))}
              className="flex items-center justify-center rounded-sm border border-carvao/15 px-3 text-carvao/60 hover:text-red-700"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setImages([...images, { url: "", alt: "" }])}
          className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-wide-plus text-carvao/70 hover:text-dourado"
        >
          <Plus size={14} /> Adicionar imagem
        </button>
      </Section>

      <Section title="Guia de medidas" description="Preencha apenas com medidas verificadas. Deixe vazio para não exibir."><textarea rows={5} className="admin-input" value={form.size_guide} onChange={e => set("size_guide", e.target.value)} placeholder="Tamanho / tórax / comprimento (cm)" /></Section>
      <Section
        title="Variações (tamanho / cor / estoque)"
        description="Deixe em branco se o produto não tiver variações — o estoque geral acima será usado."
      >
        {variants.map((v, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_120px_auto]">
            <input aria-label="SKU da variação" placeholder="SKU da variação" className="admin-input sm:col-span-4" value={v.sku || ""} onChange={e => setVariants(current => current.map((row, index) => index === i ? { ...row, sku: e.target.value } : row))} />
            <input
              className="admin-input"
              placeholder="Tamanho (ex.: M)"
              value={v.size}
              onChange={(e) => {
                const next = [...variants];
                next[i] = { ...next[i], size: e.target.value };
                setVariants(next);
              }}
            />
            <input
              className="admin-input"
              placeholder="Cor (ex.: Preto)"
              value={v.color}
              onChange={(e) => {
                const next = [...variants];
                next[i] = { ...next[i], color: e.target.value };
                setVariants(next);
              }}
            />
            <input
              type="number"
              min={0}
              className="admin-input"
              placeholder="Estoque"
              value={v.stock}
              onChange={(e) => {
                const next = [...variants];
                next[i] = { ...next[i], stock: Number(e.target.value) };
                setVariants(next);
              }}
            />
            <button
              type="button"
              onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
              className="flex items-center justify-center rounded-sm border border-carvao/15 px-3 text-carvao/60 hover:text-red-700"
            >
              <Trash2 size={15} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => setVariants([...variants, { size: "", color: "", stock: 0 }])}
          className="inline-flex w-fit items-center gap-2 text-xs uppercase tracking-wide-plus text-carvao/70 hover:text-dourado"
        >
          <Plus size={14} /> Adicionar variação
        </button>
      </Section>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="w-fit rounded-sm bg-carvao px-6 py-3.5 text-xs uppercase tracking-wide-plus text-offwhite hover:bg-carvao-soft hover:text-offwhite transition-colors disabled:opacity-50"
      >
        {isPending ? "Salvando…" : isEdit ? "Salvar alterações" : "Criar produto"}
      </button>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-sm border border-carvao/10 bg-white p-5">
      <h2 className="font-display text-lg text-carvao">{title}</h2>
      {description && <p className="mt-1 text-xs text-cinza">{description}</p>}
      <div className="mt-4 flex flex-col gap-3">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide-plus text-carvao/70">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-cinza">{hint}</span>}
    </label>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-carvao">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}
