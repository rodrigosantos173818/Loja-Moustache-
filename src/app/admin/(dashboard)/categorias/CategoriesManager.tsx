"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createCategory, deleteCategory, updateCategory, type CategoryInput } from "@/app/admin/actions";
import { slugify } from "@/lib/slugify";
import type { Category } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import Dialog from "@/components/ui/Dialog";

const EMPTY: CategoryInput = {
  name: "",
  slug: "",
  description: "",
  image_url: "",
  is_active: true,
  order_index: 0,
};

export default function CategoriesManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [form, setForm] = useState<CategoryInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setForm({ ...EMPTY, order_index: categories.length + 1 });
    setEditing("new");
    setError(null);
  }

  function openEdit(cat: Category) {
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description ?? "",
      image_url: cat.image_url ?? "",
      is_active: cat.is_active,
      order_index: cat.order_index,
    });
    setEditing(cat);
    setError(null);
  }

  function handleSave() {
    startTransition(async () => {
      const result =
        editing === "new"
          ? await createCategory(form)
          : await updateCategory((editing as Category).id, form);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setEditing(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Excluir esta categoria? Produtos vinculados ficarão sem categoria.")) return;
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (result?.error) { setError(result.error); return; }
      router.refresh();
    });
  }

  return (
    <div>
      {error && !editing && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-carvao">Categorias</h1>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-sm bg-carvao px-4 py-2.5 text-xs uppercase tracking-wide-plus text-offwhite hover:bg-carvao-soft hover:text-offwhite transition-colors"
        >
          <Plus size={15} /> Nova categoria
        </button>
      </div>

      <div className="mt-6 overflow-x-auto rounded-sm border border-carvao/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-carvao/10 text-left text-xs uppercase tracking-wide-plus text-cinza">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Ordem</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-carvao/5 last:border-0">
                <td className="px-4 py-3 text-carvao">{cat.name}</td>
                <td className="px-4 py-3 text-cinza">{cat.slug}</td>
                <td className="px-4 py-3 text-cinza">{cat.order_index}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      cat.is_active ? "text-xs text-green-700" : "text-xs text-cinza"
                    }
                  >
                    {cat.is_active ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    <button onClick={() => openEdit(cat)} aria-label="Editar" className="text-carvao/60 hover:text-dourado">
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id)}
                      aria-label="Excluir"
                      className="text-carvao/60 hover:text-red-700"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-cinza">
                  Nenhuma categoria cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <Dialog label="Editar coleção" onClose={() => setEditing(null)} className="search-dialog">
          <div className="w-full max-w-lg rounded-sm bg-offwhite p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg text-carvao">
                {editing === "new" ? "Nova categoria" : "Editar categoria"}
              </h2>
              <button onClick={() => setEditing(null)} aria-label="Fechar" className="text-carvao/60 hover:text-dourado">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <ImageUpload multiple={false} onUploaded={urls => setForm(current => ({ ...current, image_url: urls[0] }))} />
              <Field label="Nome">
                <input
                  className="admin-input"
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setForm((f) => ({ ...f, name, slug: f.slug || slugify(name) }));
                  }}
                />
              </Field>
              <Field label="Slug (URL)">
                <input
                  className="admin-input"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                />
              </Field>
              <Field label="Descrição">
                <textarea
                  className="admin-input"
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
              </Field>
              <Field label="URL da imagem">
                <input
                  className="admin-input"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                />
              </Field>
              <div className="flex items-center gap-6">
                <Field label="Ordem">
                  <input
                    type="number"
                    className="admin-input"
                    value={form.order_index}
                    onChange={(e) => setForm((f) => ({ ...f, order_index: Number(e.target.value) }))}
                  />
                </Field>
                <label className="mt-6 flex items-center gap-2 text-sm text-carvao">
                  <input
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                  />
                  Ativa
                </label>
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}

              <button
                type="button"
                onClick={handleSave}
                disabled={isPending || !form.name || !form.slug}
                className="mt-2 rounded-sm bg-carvao px-5 py-3 text-xs uppercase tracking-wide-plus text-offwhite hover:bg-carvao-soft hover:text-offwhite transition-colors disabled:opacity-50"
              >
                {isPending ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-wide-plus text-carvao/70">{label}</span>
      {children}
    </label>
  );
}
