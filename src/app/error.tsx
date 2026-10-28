'use client';
export default function ErrorPage({reset}:{error:Error&{digest?:string};reset:()=>void}){return <main className="simple-page error-page"><p className="eyebrow">MOUSTACHE / OPS</p><h1>Não foi<br/><em>possível carregar.</em></h1><p>Ocorreu um erro ao carregar esta página.</p><button className="button button-dark" onClick={()=>reset()}>Tentar novamente</button></main>}
