import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buildWhatsappContactLink } from "@/lib/whatsapp";
import type { StoreSettings } from "@/lib/types";
export default function FinalCTA({ settings }: { settings: StoreSettings | null }) {
  return <section className="final-cta"><div className="page-width"><div><p className="eyebrow">VISTA O QUE FAZ SENTIDO PARA VOCÊ.</p><h2>O próximo capítulo<br /><em>do seu estilo.</em></h2></div><div><p>Explore, escolha e encontre a sua identidade.</p><Link className="button button-light" href="/catalogo">Encontrar meu estilo <ArrowRight size={17} /></Link>{settings?.whatsapp_number && <a href={buildWhatsappContactLink(settings.whatsapp_number)} target="_blank" rel="noopener noreferrer" className="text-link">Prefere conversar? Fale com a loja <ArrowRight size={15} /></a>}</div></div></section>;
}
