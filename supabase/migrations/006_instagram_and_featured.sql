-- 006_instagram_and_featured.sql

create table if not exists instagram_posts (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  caption text,
  permalink text,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_instagram_posts_active_order on instagram_posts (is_active, order_index);

-- Permite ao administrador curar manualmente a ordem de exibição das
-- vitrines "Novidades" e "Destaques" na home, além das flags is_new/featured
-- do próprio produto.
create table if not exists featured_products (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  section text not null default 'featured' check (section in ('featured', 'new')),
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  unique (product_id, section)
);

create index if not exists idx_featured_products_section on featured_products (section, order_index);
