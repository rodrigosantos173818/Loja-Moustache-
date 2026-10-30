"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, MessageCircle, ArrowUpRight } from "lucide-react";
import Instagram from "@/components/ui/InstagramIcon";
import Logo from "@/components/ui/Logo";
import { buildWhatsappContactLink } from "@/lib/whatsapp";
import type { StoreSettings } from "@/lib/types";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL, STORE_NAME } from "@/lib/brand";
export default function Footer({ settings }: { settings: StoreSettings | null }) {
  const path = usePathname();
  if (path.startsWith("/admin")) return null;
  return <footer id="contato" className="site-footer"><div className="page-width"><div className="footer-grid"><div><Logo logoUrl={settings?.logo_url} /><p>{settings?.store_description || "Moda masculina com personalidade."}</p></div><div><h3>Explore</h3><nav aria-label="Navegação do rodapé"><Link href="/">Início</Link><Link href="/#colecoes">Coleções</Link><Link href="/catalogo">Catálogo</Link><Link href="/#sobre">Sobre a {STORE_NAME}</Link></nav></div><div><h3>Vamos conversar?</h3><ul><li><a href={settings?.instagram_url || INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"><Instagram size={14} /> {INSTAGRAM_HANDLE} <ArrowUpRight size={12} /></a></li>{settings?.whatsapp_number && <li><a href={buildWhatsappContactLink(settings.whatsapp_number)} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} />WhatsApp <ArrowUpRight size={12} /></a></li>}</ul></div><div><h3>Encontre a {STORE_NAME}</h3>{settings?.address && <p className="!mt-0">{settings.address}</p>}{settings?.address && <a className="text-link mt-3" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address)}`} target="_blank" rel="noopener noreferrer"><MapPin size={13} /> Como chegar <ArrowUpRight size={12} /></a>}{settings?.business_hours && <p>{settings.business_hours}</p>}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} {STORE_NAME}. Todos os direitos reservados.</span><span>FEITO PARA VESTIR A SUA IDENTIDADE.</span><Link href="/admin">Área da loja <ArrowUpRight size={10} className="inline ml-1" /></Link></div></div></footer>;
}
