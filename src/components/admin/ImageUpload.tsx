"use client";
import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function ImageUpload({ onUploaded, multiple = true }: { onUploaded: (urls: string[]) => void; multiple?: boolean }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [previews, setPreviews] = useState<string[]>([]);
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    if (!isSupabaseConfigured()) { setMessage("Supabase não configurado. Nenhum arquivo foi enviado."); return; }
    setPending(true); setMessage("");
    const urls: string[] = [];
    try {
      const supabase = createClient();
      const { data: authorized } = await supabase.rpc("is_admin");
      if (!authorized) throw new Error("Sua conta não está autorizada a enviar imagens.");
      for (const file of Array.from(files)) {
        const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/avif": "avif" } as Record<string, string>)[file.type];
        if (!extension || file.size > 8 * 1024 * 1024) throw new Error("Use JPG, PNG, WebP ou AVIF com até 8 MB por imagem.");
        const path = `${crypto.randomUUID()}.${extension}`;
        const { error } = await supabase.storage.from("catalog-images").upload(path, file, { contentType: file.type, upsert: false });
        if (error) throw new Error("Não foi possível enviar a imagem. Confira a conexão, a migration 009 e as permissões de armazenamento.");
        urls.push(supabase.storage.from("catalog-images").getPublicUrl(path).data.publicUrl);
      }
      setMessage(`${urls.length} imagem(ns) enviada(s). Salve o formulário para publicar.`);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Erro ao enviar imagem."); }
    finally { if (urls.length) { onUploaded(urls); setPreviews(urls); } setPending(false); }
  }
  return <div className="rounded-sm border border-dashed border-carvao/20 p-4"><label className="flex items-center gap-2 text-xs"><Upload size={16} />{pending ? "Enviando imagens…" : "Enviar imagens"}<input className="ml-auto max-w-[65%] text-[11px]" aria-label="Selecionar imagens para upload" type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={multiple} disabled={pending} onChange={e => { void upload(e.target.files); e.target.value = ""; }} /></label><p className="mt-2 text-[10px] text-cinza">JPG, PNG, WebP ou AVIF · até 8 MB por arquivo.</p>{message && <p role="status" className="mt-3 text-xs leading-relaxed">{message}</p>}{previews.length > 0 && <div className="flex gap-2 mt-3">{previews.map(url => <Image key={url} src={url} alt="Imagem enviada" width={60} height={75} className="object-cover" />)}</div>}</div>;
}
