import type { Metadata } from 'next';
import './globals.css';
import { SiteHeader, SiteFooter } from '@/components/site-chrome';
import { CartProvider } from '@/context/cart-context';
import { storeConfig } from '@/config/store';

export const metadata: Metadata = {
  title: { default: 'MOUSTACHE — Moda masculina', template: '%s | MOUSTACHE' },
  description: storeConfig.description,
  metadataBase: storeConfig.siteUrl ? new URL(storeConfig.siteUrl) : undefined,
  alternates: storeConfig.siteUrl ? { canonical: '/' } : undefined,
  robots: storeConfig.demoCatalog ? { index: false, follow: true } : undefined,
  openGraph: { title: 'MOUSTACHE — Moda masculina', description: storeConfig.description, type: 'website' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body><CartProvider><SiteHeader/>{children}<SiteFooter/></CartProvider></body></html>;
}
