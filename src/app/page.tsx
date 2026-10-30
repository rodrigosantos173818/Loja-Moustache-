import {
  getActiveBanners,
  getActiveCategories,
  getActiveInstagramPosts,
  getActiveProducts,
  getStoreSettings,
} from "@/lib/queries";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import PromoBanners from "@/components/home/PromoBanners";
import NewArrivals from "@/components/home/NewArrivals";
import InstagramSection from "@/components/home/InstagramSection";
import AboutSection from "@/components/home/AboutSection";
import FinalCTA from "@/components/home/FinalCTA";
import ServiceStrip from "@/components/home/ServiceStrip";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { INSTAGRAM_URL } from "@/lib/brand";

// Revalida a home a cada 60s: o catálogo reflete mudanças feitas no admin
// sem precisar de um novo deploy.
export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, banners, products, instagramPosts] = await Promise.all([
    getStoreSettings(),
    getActiveCategories(),
    getActiveBanners(),
    getActiveProducts({ featuredOnly: true, limit: 12 }),
    getActiveInstagramPosts(),
  ]);

  return (
    <>
      <Hero settings={settings} />
      <ServiceStrip />
      {!isSupabaseConfigured() && <div className="demo-notice">PRÉVIA DA LOJA <span>Produtos e imagens ilustrativos. Catálogo oficial em preparação.</span></div>}
      <Categories categories={categories} />
      <NewArrivals products={products} />
      <PromoBanners banners={banners} />
      <AboutSection settings={settings} />
      <InstagramSection
        posts={instagramPosts}
        instagramUrl={settings?.instagram_url ?? INSTAGRAM_URL}
      />
      <FinalCTA settings={settings} />
    </>
  );
}
