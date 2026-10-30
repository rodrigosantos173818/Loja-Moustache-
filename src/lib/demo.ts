import type { Category, Product, StoreSettings } from "./types";
import { DEFAULT_LOGO_URL, INSTAGRAM_URL, STORE_NAME } from "./brand";

// Local illustration data. Never inserted into the production database.
export const demoSettings: StoreSettings = {
  id: "demo", store_name: STORE_NAME, store_description: "Moda masculina com personalidade.",
  whatsapp_number: "", instagram_url: INSTAGRAM_URL,
  address: null, business_hours: null,
  hero_title: "Seu estilo.\nSua identidade.", hero_subtitle: "O essencial ganha personalidade. Descubra uma nova forma de vestir quem você é.",
  about_title: "Estilo com personalidade.", about_text: "A Moustache é uma loja de moda masculina. Conheça a seleção e encontre peças que combinam com você.",
  meta_title: "Moustache | Moda Masculina", meta_description: "Conheça a Moustache e explore o catálogo de moda masculina.",
  logo_url: DEFAULT_LOGO_URL, hero_image_url: "/images/editorial-hero.webp", about_image_url: null,
};
export const demoCategories: Category[] = [
  { id: "demo-camisetas", name: "Camisetas", slug: "camisetas", description: "O ponto de partida de um bom look.", image_url: "/images/camiseta.webp", is_active: true, order_index: 0 },
  { id: "demo-polos", name: "Polos", slug: "polos", description: "Presença em cada detalhe.", image_url: "/images/polo.webp", is_active: true, order_index: 1 },
  { id: "demo-camisas", name: "Camisas", slug: "camisas", description: "Leveza para os seus dias.", image_url: "/images/camisa.webp", is_active: true, order_index: 2 },
  { id: "demo-jeans", name: "Jeans", slug: "jeans", description: "Autêntico em qualquer ocasião.", image_url: "/images/jeans.webp", is_active: true, order_index: 3 },
];
export const demoProducts: Product[] = [
  { name: "Camiseta Essential", slug: "camiseta-essential", color: "Off-white", image: "camiseta", category: 0 },
  { name: "Polo Texturizada", slug: "polo-texturizada", color: "Preto", image: "polo", category: 1 },
  { name: "Camisa de Linho", slug: "camisa-de-linho", color: "Areia", image: "camisa", category: 2 },
  { name: "Jeans Reto", slug: "jeans-reto", color: "Azul", image: "jeans", category: 3 },
].map((item, index) => {
  const id = `demo-${index}`;
  const cat = demoCategories[item.category];
  return {
    id, name: item.name, slug: item.slug, description: "Peça ilustrativa para explorar a experiência do catálogo. Imagem gerada por IA; não representa um produto oficial da loja. Preço, composição e disponibilidade serão cadastrados pela equipe.",
    category_id: cat.id, price: 0, sale_price: null, featured: true, is_new: index < 2,
    is_active: true, stock: 12, created_at: "2026-01-01T00:00:00Z", updated_at: "2026-01-01T00:00:00Z", is_demo: true,
    category: { id: cat.id, name: cat.name, slug: cat.slug },
    product_images: [{ id: `${id}-image`, product_id: id, url: `/images/${item.image}.webp`, alt: `${item.name} — imagem ilustrativa`, order_index: 0, is_primary: true }],
    product_variants: (index === 3 ? ["38", "40", "42", "44"] : ["P", "M", "G", "GG"]).map((size, i) => ({ id: `${id}-${size}`, product_id: id, size, color: item.color, stock: i === 3 ? 0 : 4, sku: null })),
  };
});
