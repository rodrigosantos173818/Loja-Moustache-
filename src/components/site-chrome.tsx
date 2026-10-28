import Link from 'next/link';
import { ArrowUpRight, Instagram, Menu, Search } from 'lucide-react';
import { CartCount } from '@/components/cart-count';
import { storeConfig } from '@/config/store';

function Brand({ footer = false }: { footer?: boolean }) { return <Link className={`brand ${footer ? 'brand-footer' : ''}`} href="/" aria-label="Moustache — início"><span className="brand-wordmark">MOUSTACHE<span>®</span></span></Link>; }

export function SiteHeader() {
  return <header className="site-header"><Brand/><nav className="desktop-nav" aria-label="Navegação principal"><Link href="/">Início</Link><Link href="/catalogo">Catálogo</Link><Link href="/catalogo?sort=newest">Novidades</Link><Link href="/#sobre">Sobre</Link><Link href="/#contato">Contato</Link></nav><div className="header-actions"><Link className="search-link" href="/catalogo#busca" aria-label="Buscar produtos"><Search size={18}/></Link><CartCount/><details className="mobile-menu"><summary aria-label="Abrir menu"><Menu size={21}/></summary><nav><Link href="/">Início</Link><Link href="/catalogo">Catálogo</Link><Link href="/catalogo?sort=newest">Novidades</Link><Link href="/#sobre">Sobre</Link><Link href="/#contato">Contato</Link></nav></details></div></header>;
}

export function SiteFooter() {
  return <footer className="site-footer" id="contato"><div className="footer-main"><div className="footer-brand"><Brand footer/><p>Moda masculina.<br/>Estilo em movimento.</p><span className="footer-demo">CATÁLOGO DE DEMONSTRAÇÃO</span></div><div className="footer-col"><span>NAVEGUE</span><Link href="/catalogo">Catálogo <ArrowUpRight size={13}/></Link><Link href="/sacola">Sacola de orçamento <ArrowUpRight size={13}/></Link><Link href="/#sobre">Sobre a Moustache <ArrowUpRight size={13}/></Link></div><div className="footer-col"><span>CONTATO</span>{storeConfig.instagramUrl && <a href={storeConfig.instagramUrl} target="_blank" rel="noreferrer"><Instagram size={14}/> Instagram</a>}{storeConfig.demoCatalog ? <span className="contact-pending">Contato comercial indisponível na demonstração</span> : storeConfig.whatsappNumber ? <a href={`https://wa.me/${storeConfig.whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a> : <span className="contact-pending">WhatsApp aguardando configuração</span>}</div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Moustache</span><span>Valores e itens demonstrativos · Solicitação sujeita à confirmação</span></div></footer>;
}
