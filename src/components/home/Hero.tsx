import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import { buildWhatsappContactLink } from "@/lib/whatsapp";
import { INSTAGRAM_URL, STORE_NAME } from "@/lib/brand";
import type { StoreSettings } from "@/lib/types";

export default function Hero({ settings }: { settings: StoreSettings | null }) {
  const lines = (settings?.hero_title || "Seu estilo.\nSua identidade.").split("\n");
  const contact = settings?.whatsapp_number ? buildWhatsappContactLink(settings.whatsapp_number) : INSTAGRAM_URL;
  return <section className="editorial-hero" aria-labelledby="hero-title">
    <Image src={settings?.hero_image_url || "/images/editorial-hero.webp"} alt="Editorial ilustrativo: polo preta e alfaiataria em tons naturais" fill preload sizes="100vw" className="hero-photo" />
    <div className="hero-shade" />
    <div className="hero-content page-width">
      <p className="eyebrow"><span className="tiny-line" /> MENOS EXCESSO. MAIS VOCÊ.</p>
      <h1 id="hero-title">{lines.map((line, i) => <span key={line} className={i === 1 ? "hero-serif" : ""}>{line}</span>)}</h1>
      <p className="hero-description">{settings?.hero_subtitle || "O essencial ganha personalidade. Descubra uma nova forma de vestir quem você é."}</p>
      <div className="hero-actions"><Link href="/catalogo" className="button button-dark">Explorar coleção <ArrowRight size={17} /></Link><a href={contact} target="_blank" rel="noopener noreferrer" className="text-link">Falar com a loja <ArrowRight size={15} /></a></div>
      <div className="hero-note"><span>CASUAL POR NATUREZA.</span><span>AUTÊNTICO POR ESCOLHA.</span></div>
    </div>
    <div className="hero-bottom page-width"><span>{STORE_NAME.toUpperCase()} — MODA COM IDENTIDADE</span><a href="#colecoes" aria-label="Descobrir coleções">DESCUBRA <ArrowDownRight size={18} /></a></div>
    <span className="editorial-credit">IMAGEM EDITORIAL ILUSTRATIVA</span>
  </section>;
}
