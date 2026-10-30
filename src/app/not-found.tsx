import Link from "next/link";
export default function NotFound() { return <div className="page-width empty-state"><p className="eyebrow justify-center">404 / MOUSTACHE</p><h2>Essa peça não está por aqui.</h2><p>A página pode ter mudado ou o produto não está mais disponível.</p><Link className="button button-dark" href="/catalogo">Explorar o catálogo</Link></div>; }
