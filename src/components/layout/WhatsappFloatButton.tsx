"use client";

import { MessageCircle } from "lucide-react";
import { buildWhatsappContactLink } from "@/lib/whatsapp";
import type { StoreSettings } from "@/lib/types";

/** Botão flutuante discreto — some quando o carrinho está aberto (via CSS z-index inferior). */
export default function WhatsappFloatButton({ settings }: { settings: StoreSettings | null }) {
  if (!settings?.whatsapp_number) return null;

  const link = buildWhatsappContactLink(
    settings.whatsapp_number,
    "Olá, Moustache! Gostaria de saber mais sobre os produtos."
  );

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 md:bottom-7 md:right-7 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-carvao/20 transition-transform hover:scale-105 active:scale-95"
    >
      <MessageCircle size={26} strokeWidth={1.75} fill="white" className="text-[#25D366]" />
    </a>
  );
}
