"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBanner, deleteBanner, updateBanner, type BannerInput } from "@/app/admin/actions";
import type { Banner } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";
import Dialog from "@/components/ui/Dialog";

const EMPTY: BannerInput = {
  title: "",
  subtitle: "",
  image_url: "",
  button_text: "",
  button_link: "",
  is_active: true,
  order_index: 0,
};

export default function BannersManager({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Banner | "new" | null>(null);
  const [form, setForm] = useState<BannerInput>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function openNew() {
    setForm({ ...EMPTY, order_index: banners.length + 1 });
    setEditing("new");
    setError(null);
  }

  function openEdit(banner: Banner) {
    setForm({
      title: banner.title ?? "",
      subtitle: banner.subtitle ?? "",
      image_url: banner.image_url,
      button_text: banner.button_text ?? "",
      button_link: banner.button_link ?? "",
      is_active: banner.is_active,
      order_index: banner.order_index,
    });
    setEditing(banner);
    setError(null);
  }

  function handleSave() {
    startTransition(async () => {
      const result =
        editing === "new" ? await createBanner(form) : await updateBanner((editing as Banner).id, form);
      if (result?.error) {
        setError(result.error);
        return;
      }
      setEditing(null);
      router.refresh();
    });
  }

  function handleDelete(id: string) {
    if (!window.confirm("Excluir este banner?")) return;
    startTransition(async () => {
      const result = await deleteBanner(id);
      if (result?.error) { setError(result.error); return; }
      router.refresh();
    });
  }

  return (
    <div>
      {error && !editing && <p role="alert" className="mb-4 text-sm text-red-700">{error}</p>}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-carvao">Banners</h1>
        <button
          type="button"
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-sm bg-carvao px-4 py-2.5 text-xs uppercase tracking-wide-plus text-offwhite hover:bg-carvao-soft hover:text-offwhite transition-colors"
        >
          <Plus size={15} /> Novo banner
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {banners.map((banner) => (
          <div key={banner.id} className="overflow-hidden rounded-sm border border-carvao/10 bg-white">
            <div className="relative aspect-video bg-cinza/10">
              {banner.image_url && (
                <Image src={banner.image_url} alt={banner.title ?? ""} fill className="object-cover" />
              )}
            </div>
            <div className="p-4">
              <p className="font-display text-carvao">{banner.title || "(sem título)"}</p>
              <p className="mt-1 text-xs text-cinza">{banner.is_active ? "Ativo" : "Inativo"}</p>
              <div className="mt-3 flex items-center gap-3">
                <button onClick={() => openEdit(banner)} className="text-carvao/60 hover:text-dourado">
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(banner.id)} className="text-carvao/60 hover:text-red-700">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <p className="col-span-full py-8 text-center text-cinza">Nenhum banner cadastrado.</p>
        )}
      </div>

      {editing && (
        <Dialog label="Editar banner" onClose={() => setEditing(null)} className="search-dialog">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-sm bg-offwhite p-6">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-display text-lg text-carvao">
                {editing === "new" ? "Novo banner" : "Editar banner"}
              </h2>
              <button onClick={() => setEditing(null)} className="text-carvao/60 hover:text-dourado">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <ImageUpload multiple={false} onUploaded={urls => setForm(current => ({ ...current, image_url: urls[0] }))} />
              <Field label="Título">
                <input
                  className="admin-input"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                />
              </Field>
              <Field label="Subtítulo">
                <input
                  className="admin-input"
                  value={form.subtitle}
                  onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
                />
              </Field>
              <Field label="URL da imagem">
                <input
                  className="admin-input"
                  value={form.image_url}
                  onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Texto do botão">
                  <input
                    className="admin-input"
                    value={form.button_text}
                    onChange={(e) => setForm((f) => ({ ...f, button_text: e.target.value }))}
                  />
                </Field>
                <Field label="Link do botão">
                  <input
                    className="admin-input"
                    value={form.button_link}
                    onChange={(e) => setForm((f) => ({ ...f, button_link: e.target.value }))}
                  />
                </Field>
              </div>
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
                  Ativo
                </label>
              </div>

              {error && <p className="text-sm text-red-700">{error}</p>}

              <button
                type="button"
                onClick={handleSave}
                disabled={isPending || !form.image_url}
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
