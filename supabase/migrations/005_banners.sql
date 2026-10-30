-- 005_banners.sql

create table if not exists banners (
  id uuid primary key default gen_random_uuid(),
  title text,
  subtitle text,
  image_url text not null,
  button_text text,
  button_link text,
  is_active boolean not null default true,
  order_index int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_banners_active_order on banners (is_active, order_index);

create trigger trg_banners_updated_at
  before update on banners
  for each row execute function set_updated_at();
