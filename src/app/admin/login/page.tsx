"use client";

import { useState, useTransition } from "react";
import Logo from "@/components/ui/Logo";
import { signIn } from "@/app/admin/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function AdminLoginPage() {
  const configured = isSupabaseConfigured();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signIn(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-carvao px-5">
      <div className="w-full max-w-sm rounded-sm bg-offwhite p-8 shadow-2xl">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>
        <h1 className="mb-1 text-center font-display text-xl text-carvao">Painel administrativo</h1>
        <p className="mb-6 text-center text-xs text-cinza">Acesso restrito à equipe Moustache.</p>
        {!configured && <p className="product-info-notice" role="status">Modo demonstração. O backend não está conectado e o painel está bloqueado. Configure as variáveis do Supabase e autorize sua conta administrativa para começar.</p>}

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-xs uppercase tracking-wide-plus text-carvao/70">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-sm border border-carvao/20 bg-white px-4 py-3 text-sm text-carvao outline-none transition-colors focus:border-dourado"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-xs uppercase tracking-wide-plus text-carvao/70">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-sm border border-carvao/20 bg-white px-4 py-3 text-sm text-carvao outline-none transition-colors focus:border-dourado"
            />
          </div>

          {error && <p className="text-sm text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={isPending || !configured}
            className="mt-2 inline-flex items-center justify-center rounded-sm bg-carvao px-6 py-3.5 text-xs uppercase tracking-wide-plus text-offwhite transition-colors hover:bg-carvao-soft hover:text-offwhite disabled:opacity-50"
          >
            {isPending ? "Entrando…" : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-cinza">
          Contas de administrador são criadas manualmente no Supabase Studio
          (Authentication → Users). Não há cadastro público.
        </p>
      </div>
    </div>
  );
}
