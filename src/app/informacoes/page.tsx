import type { Metadata } from "next";
import { getStoreSettings } from "@/lib/queries";
export const metadata: Metadata = { title: "Informações da loja" };
export default async function InformationPage() {
  const settings = await getStoreSettings();
  return <article className="page-width py-16"><p className="eyebrow">MOUSTACHE / INFORMAÇÕES</p><h1 className="font-display text-4xl mt-5 mb-10">Informações da loja.</h1>{settings?.commercial_info && <section className="max-w-3xl mb-10"><h2 className="font-display text-2xl mb-5">Informações comerciais</h2><p className="whitespace-pre-wrap text-sm leading-loose text-cinza">{settings.commercial_info}</p></section>}{settings?.privacy_policy && <section className="max-w-3xl"><h2 className="font-display text-2xl mb-5">Política de privacidade</h2><p className="whitespace-pre-wrap text-sm leading-loose text-cinza">{settings.privacy_policy}</p></section>}{!settings?.commercial_info && !settings?.privacy_policy && <p className="text-sm text-cinza">As informações comerciais serão publicadas pela loja. Entre em contato pelo Instagram para tirar suas dúvidas.</p>}</article>;
}
