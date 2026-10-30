"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Menu, Search, ShoppingBag, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useCart } from "@/context/CartContext";
import type { StoreSettings } from "@/lib/types";
import Dialog from "@/components/ui/Dialog";
import { INSTAGRAM_URL, STORE_NAME } from "@/lib/brand";

const links = [{ label: "Início", href: "/" }, { label: "Coleções", href: "/#colecoes" }, { label: "Catálogo", href: "/catalogo" }, { label: "Sobre", href: "/#sobre" }, { label: "Contato", href: "/#contato" }];
export default function Header({ settings }: { settings: StoreSettings | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  if (pathname.startsWith("/admin")) return null;
  return <>
    <div className="announcement"><span>Estilo que acompanha quem você é.</span><a href={settings?.instagram_url || INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Conheça a {STORE_NAME} <ArrowUpRight size={12} /></a></div>
    <header className="site-header"><div className="page-width header-inner">
      <Logo logoUrl={settings?.logo_url} />
      <nav className="desktop-nav" aria-label="Navegação principal">{links.map((link) => <Link key={link.href} className={pathname === link.href ? "active" : ""} href={link.href}>{link.label}</Link>)}</nav>
      <div className="header-tools"><button className="icon-button" onClick={() => setSearchOpen(true)} aria-label="Buscar produtos"><Search size={20} strokeWidth={1.5} /></button><span className="tool-divider" /><button onClick={openCart} className="bag-button" aria-label={`Abrir sacola, ${totalItems} itens`}><ShoppingBag size={20} strokeWidth={1.5} /><span className="bag-label">Sacola</span><span className="bag-count">{String(totalItems).padStart(2, "0")}</span></button><button className="icon-button mobile-menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><Menu size={23} /></button></div>
    </div></header>
    {menuOpen && <Dialog onClose={() => setMenuOpen(false)} label="Menu principal" className="mobile-navigation"><div className="dialog-heading"><Logo logoUrl={settings?.logo_url} /><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu"><X /></button></div><nav>{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}<ArrowUpRight size={19} /></Link>)}</nav><p>SEU ESTILO. SUA IDENTIDADE.</p></Dialog>}
    {searchOpen && <Dialog onClose={() => setSearchOpen(false)} label="Buscar no catálogo" className="search-dialog"><div className="dialog-heading"><h2>O que você procura?</h2><button className="icon-button" onClick={() => setSearchOpen(false)} aria-label="Fechar busca"><X /></button></div><form action="/catalogo" onSubmit={event => { event.preventDefault(); const query = new FormData(event.currentTarget).get("busca"); setSearchOpen(false); router.push(`/catalogo?busca=${encodeURIComponent(String(query || ""))}`); }}><label className="sr-only" htmlFor="header-search">Nome do produto</label><div className="search-input"><Search size={20} /><input id="header-search" name="busca" placeholder="Camisetas, polos, jeans…" required /><button className="button button-dark" type="submit">Buscar <ArrowUpRight size={16} /></button></div></form><p>Encontre as peças que combinam com você.</p></Dialog>}
  </>;
}
