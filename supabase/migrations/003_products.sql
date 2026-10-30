-- 003_products.sql
-- Produtos e suas imagens (uma linha por imagem, ordenável, com flag de imagem principal).

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references categories(id) on delete set null,
  price numeric(10,2) not null check (price >= 0),
  sale_price numeric(10,2) check (sale_price is null or (sale_price >= 0 and sale_price < price)),
  featured boolean not null default false,
  is_new boolean not null default false,
  is_active boolean not null default true,
  stock int not null default 0 check (stock >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_products_active on products (is_active);
create index if not exists idx_products_category on products (category_id);
create index if not exists idx_products_featured on products (featured) where featured = true;
create index if not exists idx_products_new on products (is_new) where is_new = true;

create trigger trg_products_updated_at
  before update on products
  for each row execute function set_updated_at();

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  alt text,
  order_index int not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_product_images_product on product_images (product_id, order_index);
