"use client";

import { useState, useTransition } from "react";
import { updateStoreSettings, type StoreSettingsInput } from "@/app/admin/actions";
import type { StoreSettings } from "@/lib/types";
import ImageUpload from "@/components/admin/ImageUpload";

export default function SettingsForm({ settings }: { settings: StoreSettings }) {
  const [form, setForm] = useState<StoreSettingsInput>({
    logo_url: settings.logo_url || "",
    hero_image_url: settings.hero_image_url || "",
    about_image_url: settings.about_image_url || "",
    commercial_info: settings.commercial_info || "",
    privacy_policy: settings.privacy_policy || "",
    store_name: settings.store_name,
    store_description: settings.store_description,
    whatsapp_number: settings.whatsapp_number,
    instagram_url: settings.instagram_url,
    address: settings.address ?? "",
    business_hours: settings.business_hours ?? "",
    hero_title: settings.hero_title,
    hero_subtitle: settings.hero_subtitle,
    about_title: settings.about_title,
    about_text: settings.about_text,
    meta_title: settings.meta_title,
    meta_description: settings.meta_description,
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof StoreSettingsInput>(key: K, value: StoreSettingsInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const result = await updateStoreSettings(settings.id, form);
      if (result?.error) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Configurações salvas com sucesso." });
      }
    });
  }

  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <Section title="Identidade da loja">
        <Field label="Logo oficial" hint="Envie o arquivo oficial, preservando suas proporções."><input aria-label="URL da logo oficial" className="admin-input" value={form.logo_url} onChange={e => set("logo_url", e.target.value)} /></Field><ImageUpload multiple={false} onUploaded={urls => set("logo_url", urls[0])} />
        <Field label="Imagem principal"><input aria-label="URL da imagem principal" className="admin-input" value={form.hero_image_url} onChange={e => set("hero_image_url", e.target.value)} /></Field><ImageUpload multiple={false} onUploaded={urls => set("hero_image_url", urls[0])} />
        <Field label="Fotografia da loja"><input aria-label="URL da fotografia da loja" className="admin-input" value={form.about_image_url} onChange={e => set("about_image_url", e.target.value)} /></Field><ImageUpload multiple={false} onUploaded={urls => set("about_image_url", urls[0])} />
        <Field label="Nome da loja">
          <input className="admin-input" value={form.store_name} onChange={(e) => set("store_name", e.target.value)} />
        </Field>
        <Field label="Descrição curta">
          <input
            className="admin-input"
            value={form.store_description}
            onChange={(e) => set("store_description", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Contato">
        <Field label="WhatsApp (formato 55DDDNUMERO, só números)" hint="Ex.: 5511987654321">
          <input
            className="admin-input"
            value={form.whatsapp_number}
            onChange={(e) => set("whatsapp_number", e.target.value.replace(/\D/g, ""))}
          />
        </Field>
        <Field label="URL do Instagram">
          <input className="admin-input" value={form.instagram_url} onChange={(e) => set("instagram_url", e.target.value)} />
        </Field>
        <Field label="Endereço">
          <input className="admin-input" value={form.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="Horário de funcionamento">
          <input
            className="admin-input"
            value={form.business_hours}
            onChange={(e) => set("business_hours", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Textos da home">
        <Field label="Título do hero" hint="Use quebra de linha para separar as duas linhas do título.">
          <textarea className="admin-input" rows={2} value={form.hero_title} onChange={(e) => set("hero_title", e.target.value)} />
        </Field>
        <Field label="Subtítulo do hero">
          <textarea
            className="admin-input"
            rows={2}
            value={form.hero_subtitle}
            onChange={(e) => set("hero_subtitle", e.target.value)}
          />
        </Field>
        <Field label="Título da seção Sobre">
          <input className="admin-input" value={form.about_title} onChange={(e) => set("about_title", e.target.value)} />
        </Field>
        <Field label="Texto da seção Sobre">
          <textarea className="admin-input" rows={4} value={form.about_text} onChange={(e) => set("about_text", e.target.value)} />
        </Field>
      </Section>

      <Section title="SEO">
        <Field label="Informações comerciais e políticas"><textarea rows={5} className="admin-input" value={form.commercial_info} onChange={e => set("commercial_info", e.target.value)} /></Field>
        <Field label="Política de privacidade"><textarea rows={5} className="admin-input" value={form.privacy_policy} onChange={e => set("privacy_policy", e.target.value)} /></Field>
        <Field label="Meta title">
          <input className="admin-input" value={form.meta_title} onChange={(e) => set("meta_title", e.target.value)} />
        </Field>
        <Field label="Meta description">
          <textarea
            className="admin-input"
            rows={2}
            value={form.meta_description}
            onChange={(e) => set("meta_description", e.target.value)}
          />
        </Field>
      </Section>

      {message && (
        <p className={message.type === "success" ? "text-sm text-green-700" : "text-sm text-red-700"}>
          {message.text}
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="w-fit rounded-sm bg-carvao px-6 py-3.5 text-xs uppercase tracking-wide-plus text-offwhite hover:bg-carvao-soft hover:text-offwhite transition-colors disabled:opacity-50"
      >
        {isPending ? "Salvando…" : "Salvar configurações"}
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-sm border border-carvao/10 bg-white p-5">
      <h2 className="mb-4 font-display text-lg text-carvao">{title}</h2>
      <div className="flex flex-col gap-4">{children}</div>
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
