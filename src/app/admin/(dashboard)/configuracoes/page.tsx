import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("store_settings").select("*").limit(1).maybeSingle();

  return (
    <div>
      <h1 className="font-display text-2xl text-carvao">Configurações</h1>
      <p className="mt-1 text-sm text-cinza">
        WhatsApp, Instagram e textos institucionais exibidos no catálogo público.
      </p>
      <div className="mt-6">
        {settings ? (
          <SettingsForm settings={settings} />
        ) : (
          <p className="text-sm text-red-700">
            Nenhuma configuração encontrada. Rode a migration 001_store_settings.sql e o seed
            008_seed.sql no Supabase.
          </p>
        )}
      </div>
    </div>
  );
}
