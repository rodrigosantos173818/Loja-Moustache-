import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ count: productsCount }, { count: activeCount }, { count: categoriesCount }, { count: lowStockCount }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
      supabase.from("categories").select("*", { count: "exact", head: true }),
      supabase.from("products").select("*", { count: "exact", head: true }).lte("stock", 3),
    ]);

  const cards = [
    { label: "Produtos cadastrados", value: productsCount ?? 0, href: "/admin/produtos" },
    { label: "Produtos ativos", value: activeCount ?? 0, href: "/admin/produtos" },
    { label: "Categorias", value: categoriesCount ?? 0, href: "/admin/categorias" },
    { label: "Estoque baixo (≤ 3)", value: lowStockCount ?? 0, href: "/admin/produtos" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-carvao">Visão geral</h1>
      <p className="mt-1 text-sm text-cinza">Bem-vindo ao painel da Moustache.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-sm border border-carvao/10 bg-white p-5 transition-colors hover:border-dourado"
          >
            <span className="block text-3xl font-display text-carvao">{card.value}</span>
            <span className="mt-1 block text-xs text-cinza">{card.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-sm border border-carvao/10 bg-white p-6">
        <h2 className="font-display text-lg text-carvao">Próximos passos</h2>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-cinza">
          <li>Cadastre/edite produtos em Produtos.</li>
          <li>Organize as categorias exibidas na home em Categorias.</li>
          <li>Atualize banners promocionais em Banners.</li>
          <li>Configure WhatsApp, Instagram e textos institucionais em Configurações.</li>
        </ul>
      </div>
    </div>
  );
}
