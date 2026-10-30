import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import Instagram from "@/components/ui/InstagramIcon";
import type { InstagramPost } from "@/lib/types";
import { INSTAGRAM_HANDLE, STORE_NAME } from "@/lib/brand";
export default function InstagramSection({ posts, instagramUrl }: { posts: InstagramPost[]; instagramUrl: string }) {
  return <section className="instagram-section page-width section-space"><div className="section-heading"><div><p className="eyebrow">INSPIRAÇÃO ALÉM DO GUARDA-ROUPA</p><h2>Seu próximo look começa aqui.</h2></div><a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-link"><Instagram size={17} /> {INSTAGRAM_HANDLE} <ArrowUpRight size={16} /></a></div>{posts.length ? <div className="instagram-grid">{posts.map(post => <a key={post.id} href={post.permalink || instagramUrl} target="_blank" rel="noopener noreferrer"><Image src={post.image_url} alt={post.caption || `${STORE_NAME} no Instagram`} fill sizes="(max-width: 640px) 50vw, 25vw" className="object-cover" /></a>)}</div> : <div className="instagram-invite"><Instagram size={30} strokeWidth={1} /><p>Novidades, combinações e o dia a dia da {STORE_NAME}.<br /><span>Acompanhe tudo no nosso Instagram.</span></p><a className="button button-outline" href={instagramUrl} target="_blank" rel="noopener noreferrer">Conhecer o perfil <ArrowUpRight size={16} /></a></div>}</section>;
}
