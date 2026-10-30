"use client";
import Link from "next/link";
import { INSTAGRAM_URL, STORE_NAME } from "@/lib/brand";
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return <div className="page-width empty-state"><p className="eyebrow justify-center">{STORE_NAME.toUpperCase()}</p><h2>Não conseguimos carregar esta seleção.</h2><p>Confira sua conexão e tente novamente. Você também pode conversar com a loja no Instagram.</p><div className="flex flex-wrap gap-3 justify-center"><button className="button button-dark" onClick={reset}>Tentar novamente</button><Link href="/" className="button button-outline">Voltar ao início</Link><a className="button button-outline" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">Falar com a loja</a></div></div>;
}
