-- 002_categories.sql

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_categories_active_order on categories (is_active, order_index);

create trigger trg_categories_updated_at
  before update on categories
  for each row execute function set_updated_at();
