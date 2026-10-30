export default function Loading() {
  return <div className="page-width py-16" role="status" aria-label="Carregando conteúdo"><div className="h-5 w-36 bg-carvao/10 mb-5" /><div className="h-12 w-3/4 max-w-lg bg-carvao/10 mb-10" /><div className="grid grid-cols-2 md:grid-cols-4 gap-5">{[1,2,3,4].map(item => <div key={item}><div className="aspect-[4/5] bg-carvao/5" /><div className="h-4 w-3/4 mt-4 bg-carvao/10" /><div className="h-3 w-1/2 mt-3 bg-carvao/5" /></div>)}</div><span className="sr-only">Carregando a seleção…</span></div>;
}
