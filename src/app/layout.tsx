import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { getStoreSettings } from "@/lib/queries";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import WhatsappFloatButton from "@/components/layout/WhatsappFloatButton";
import CartDrawer from "@/components/cart/CartDrawer";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { DEFAULT_LOGO_URL, STORE_NAME } from "@/lib/brand";
import { getSiteUrl } from "@/lib/site";

const playfair = localFont({
  src: "./fonts/playfair-latin.woff2",
  variable: "--font-playfair",
  weight: "400 900",
  display: "swap",
});

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  variable: "--font-inter",
  weight: "100 900",
  display: "swap",
});

const siteUrl = getSiteUrl();

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  const title = settings?.meta_title ?? `${STORE_NAME} | Moda Masculina`;
  const description =
    settings?.meta_description ??
    `Descubra a coleção ${STORE_NAME}. Moda masculina com estilo e personalidade.`;

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: title,
      template: `%s | ${STORE_NAME}`,
    },
    description,
    keywords: ["moda masculina", "roupas masculinas", STORE_NAME, "camisas", "calças", "moda masculina"],
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: settings?.store_name ?? STORE_NAME,
      locale: "pt_BR",
      type: "website",
      images: [{ url: "/images/editorial-hero.webp", width: 1536, height: 1024, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    icons: {
      icon: settings?.logo_url || DEFAULT_LOGO_URL,
      apple: settings?.logo_url || DEFAULT_LOGO_URL,
    },
    robots: {
      index: isSupabaseConfigured(),
      follow: true,
    },
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const settings = await getStoreSettings();

  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-offwhite text-carvao">
        <CartProvider>
          <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:bg-white focus:p-3">Pular para o conteúdo</a>
          <Header settings={settings} />
          <main id="main-content" tabIndex={-1} className="flex-1">{children}</main>
          <Footer settings={settings} />
          <WhatsappFloatButton settings={settings} />
          <CartDrawer settings={settings} />
        </CartProvider>
      </body>
    </html>
  );
}
