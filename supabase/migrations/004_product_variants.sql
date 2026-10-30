-- 004_product_variants.sql
-- Variações de tamanho/cor com estoque próprio por combinação.

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  size text,
  color text,
  stock int not null default 0 check (stock >= 0),
  sku text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, size, color)
);

create index if not exists idx_product_variants_product on product_variants (product_id);

create trigger trg_product_variants_updated_at
  before update on product_variants
  for each row execute function set_updated_at();
