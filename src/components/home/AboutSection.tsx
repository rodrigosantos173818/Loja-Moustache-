import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { StoreSettings } from "@/lib/types";
import { INSTAGRAM_URL, STORE_NAME } from "@/lib/brand";
export default function AboutSection({ settings }: { settings: StoreSettings | null }) {
  return <section id="sobre" className="about-section page-width section-space"><div className="about-image"><Image src={settings?.about_image_url || "/images/editorial-hero.webp"} alt={settings?.about_image_url ? `A ${STORE_NAME}` : "Editorial ilustrativo de moda masculina"} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />{!settings?.about_image_url && <span>EDITORIAL ILUSTRATIVO</span>}</div><div className="about-copy"><p className="eyebrow">MUITO PRAZER, {STORE_NAME.toUpperCase()}</p><h2>{settings?.about_title || "Estilo com personalidade."}</h2><p>{settings?.about_text || "Moda masculina para expressar a sua identidade. Conheça a nossa seleção e encontre o seu estilo."}</p>{settings?.address && <p className="about-address"><MapPin size={16} />{settings.address}</p>}<a href={settings?.instagram_url || INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="text-link">Mais perto de você <ArrowUpRight size={16} /></a></div></section>;
}
