import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Shirt, Tags, Image as ImageIcon, Settings, LogOut, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/admin/actions";
import Logo from "@/components/ui/Logo";

const NAV = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/produtos", label: "Produtos", icon: Shirt },
  { href: "/admin/categorias", label: "Categorias", icon: Tags },
  { href: "/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defesa extra além do middleware.
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (isAdmin !== true) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-offwhite">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-carvao/10 bg-white px-5 py-6 md:flex">
        <Logo />
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-carvao/80 transition-colors hover:bg-offwhite hover:text-dourado"
              >
                <Icon size={17} strokeWidth={1.5} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/"
          target="_blank"
          className="mb-2 flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-carvao/60 transition-colors hover:text-dourado"
        >
          <ExternalLink size={17} strokeWidth={1.5} />
          Ver catálogo
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-carvao/60 transition-colors hover:text-red-700"
          >
            <LogOut size={17} strokeWidth={1.5} />
            Sair
          </button>
        </form>
        <p className="mt-4 truncate px-3 text-xs text-cinza">{user.email}</p>
      </aside>

      <div className="flex-1">
        {/* Header mobile simples */}
        <div className="flex items-center justify-between border-b border-carvao/10 bg-white px-5 py-4 md:hidden">
          <Logo />
          <form action={signOut}>
            <button type="submit" aria-label="Sair" className="text-carvao/60 hover:text-red-700">
              <LogOut size={19} strokeWidth={1.5} />
            </button>
          </form>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-b border-carvao/10 bg-white px-5 py-3 md:hidden">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="whitespace-nowrap text-xs text-carvao/70">
              {item.label}
            </Link>
          ))}
        </nav>

        <section className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-10">{children}</section>
      </div>
    </div>
  );
}
