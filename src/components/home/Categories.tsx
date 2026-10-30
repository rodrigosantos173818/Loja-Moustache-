import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Category } from "@/lib/types";

export default function Categories({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;
  return <section id="colecoes" className="page-width section-space collections"><span id="categorias" className="anchor" />
    <div className="section-heading"><div><p className="eyebrow">UM ESTILO PARA CADA MOMENTO</p><h2>Encontre o seu essencial.</h2></div><Link href="/catalogo" className="text-link">Todas as coleções <ArrowUpRight size={16} /></Link></div>
    <div className="collection-grid">{categories.map((category, i) => <Link key={category.id} href={`/catalogo?categoria=${category.slug}`} className="collection-card"><div className="collection-image">{category.image_url && <Image src={category.image_url} alt={category.name} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" />}<span className="collection-index">0{i + 1}</span></div><div className="collection-label"><h3>{category.name}</h3><span className="round-arrow"><ArrowUpRight size={18} strokeWidth={1.3} /></span></div><p>{category.description}</p></Link>)}</div>
  </section>;
}
