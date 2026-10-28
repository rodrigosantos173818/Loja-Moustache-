import Link from 'next/link';
export default function NotFound(){return <main className="simple-page"><p className="eyebrow">MOUSTACHE / 404</p><h1>Não encontramos<br/><em>essa página.</em></h1><p>O endereço pode ter mudado ou a página não está disponível.</p><Link className="button button-dark" href="/catalogo">Voltar ao catálogo</Link></main>}
