-- 007_rls.sql
-- Row Level Security: o catálogo público só pode LER dados ativos.
-- Qualquer usuário autenticado (conta de administrador criada manualmente
-- no painel do Supabase — não há cadastro público) pode gerenciar tudo.
--
-- Importante: contas de admin devem ser criadas em
-- Supabase Studio > Authentication > Users (convite manual), nunca via
-- self sign-up. O frontend público usa somente a chave anon.

alter table store_settings enable row level security;
alter table categories enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_variants enable row level security;
alter table banners enable row level security;
alter table instagram_posts enable row level security;
alter table featured_products enable row level security;

-- store_settings: leitura pública (necessária para montar o link do WhatsApp
-- e textos institucionais no site), escrita restrita ao admin.
create policy "public read store_settings" on store_settings
  for select using (true);
create policy "admin manage store_settings" on store_settings
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- categories
create policy "public read active categories" on categories
  for select using (is_active = true);
create policy "admin manage categories" on categories
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- products
create policy "public read active products" on products
  for select using (is_active = true);
create policy "admin manage products" on products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- product_images (segue a visibilidade do produto pai)
create policy "public read images of active products" on product_images
  for select using (
    exists (select 1 from products p where p.id = product_images.product_id and p.is_active = true)
  );
create policy "admin manage product_images" on product_images
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- product_variants
create policy "public read variants of active products" on product_variants
  for select using (
    exists (select 1 from products p where p.id = product_variants.product_id and p.is_active = true)
  );
create policy "admin manage product_variants" on product_variants
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- banners
create policy "public read active banners" on banners
  for select using (is_active = true);
create policy "admin manage banners" on banners
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- instagram_posts
create policy "public read active instagram_posts" on instagram_posts
  for select using (is_active = true);
create policy "admin manage instagram_posts" on instagram_posts
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- featured_products (segue a visibilidade do produto pai)
create policy "public read featured_products of active products" on featured_products
  for select using (
    exists (select 1 from products p where p.id = featured_products.product_id and p.is_active = true)
  );
create policy "admin manage featured_products" on featured_products
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
