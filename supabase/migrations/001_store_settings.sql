-- 001_store_settings.sql
-- Configuração global da loja (singleton) + função utilitária de updated_at.

create extension if not exists pgcrypto;

-- Função reutilizada por todas as tabelas com coluna updated_at.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists store_settings (
  id uuid primary key default gen_random_uuid(),
  is_singleton boolean not null default true unique, -- garante uma única linha
  store_name text not null default 'Moustache',
  store_description text not null default 'Moda masculina com estilo, personalidade e elegância.',
  whatsapp_number text not null default '', -- formato: 55DDDNUMERO (somente dígitos)
  instagram_url text not null default 'https://www.instagram.com/lojamoustache/',
  address text,
  business_hours text,
  hero_title text not null default E'ESTILO QUE REPRESENTA\nQUEM VOCÊ É.',
  hero_subtitle text not null default 'Moda masculina para quem valoriza presença, personalidade e autenticidade.',
  about_title text not null default 'MAIS QUE MODA. IDENTIDADE.',
  about_text text not null default 'A Moustache representa um estilo masculino autêntico, moderno e confiante. Uma seleção pensada para homens que valorizam qualidade, personalidade e presença em cada detalhe.',
  meta_title text not null default 'Moustache | Moda Masculina',
  meta_description text not null default 'Descubra a coleção Moustache. Moda masculina com estilo, personalidade e elegância.',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger trg_store_settings_updated_at
  before update on store_settings
  for each row execute function set_updated_at();
