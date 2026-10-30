-- Apply after 001–008. Authorization is explicit; signup never grants admin.
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admin_users enable row level security;
create policy "admins read own authorization" on public.admin_users
  for select to authenticated using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admin_users where user_id = (select auth.uid())); $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- Replace ALL old broad authenticated policies, including installations
-- where 007 has already run. Preserve public active-record read policies.
do $$
declare item text;
begin
  foreach item in array array['store_settings','categories','products','product_images','product_variants','banners','instagram_posts','featured_products'] loop
    execute format('drop policy if exists %I on public.%I', 'admin manage ' || item, item);
    execute format('create policy %I on public.%I for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', 'authorized admin manage ' || item, item);
  end loop;
end $$;

alter table public.store_settings
  add column if not exists logo_url text,
  add column if not exists hero_image_url text,
  add column if not exists about_image_url text,
  add column if not exists commercial_info text,
  add column if not exists privacy_policy text;
alter table public.products
  add column if not exists sku text,
  add column if not exists order_index integer not null default 0,
  add column if not exists size_guide text;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('catalog-images', 'catalog-images', true, 8388608, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do nothing;
create policy "catalog image uploads by admins" on storage.objects for insert to authenticated
  with check (bucket_id = 'catalog-images' and (select public.is_admin()));
create policy "catalog image changes by admins" on storage.objects for update to authenticated
  using (bucket_id = 'catalog-images' and (select public.is_admin()))
  with check (bucket_id = 'catalog-images' and (select public.is_admin()));
create policy "catalog image removal by admins" on storage.objects for delete to authenticated
  using (bucket_id = 'catalog-images' and (select public.is_admin()));
create policy "catalog image metadata readable" on storage.objects for select to authenticated
  using (bucket_id = 'catalog-images' and (select public.is_admin()));

-- Save a product, images and variants in one transaction. A constraint or
-- authorization failure rolls back the complete write, retaining old data.
create or replace function public.save_catalog_product(p_id uuid, p_data jsonb)
returns uuid language plpgsql security invoker set search_path = ''
as $$
declare result_id uuid;
begin
  if not public.is_admin() then raise exception 'Administrator authorization required'; end if;
  if p_id is null then
    insert into public.products (name, slug, description, category_id, price, sale_price, featured, is_new, is_active, stock, sku, order_index, size_guide)
    values (p_data->>'name', p_data->>'slug', p_data->>'description', nullif(p_data->>'category_id','')::uuid, (p_data->>'price')::numeric, (p_data->>'sale_price')::numeric, (p_data->>'featured')::boolean, (p_data->>'is_new')::boolean, (p_data->>'is_active')::boolean, (p_data->>'stock')::integer, p_data->>'sku', coalesce((p_data->>'order_index')::integer,0), p_data->>'size_guide')
    returning id into result_id;
  else
    update public.products set name=p_data->>'name', slug=p_data->>'slug', description=p_data->>'description', category_id=nullif(p_data->>'category_id','')::uuid, price=(p_data->>'price')::numeric, sale_price=(p_data->>'sale_price')::numeric, featured=(p_data->>'featured')::boolean, is_new=(p_data->>'is_new')::boolean, is_active=(p_data->>'is_active')::boolean, stock=(p_data->>'stock')::integer, sku=p_data->>'sku', order_index=coalesce((p_data->>'order_index')::integer,0), size_guide=p_data->>'size_guide'
    where id=p_id returning id into result_id;
    if result_id is null then raise exception 'Product not found'; end if;
  end if;
  delete from public.product_images where product_id=result_id;
  insert into public.product_images (product_id,url,alt,order_index,is_primary)
  select result_id, img->>'url', img->>'alt', (idx-1)::integer, idx=1
    from jsonb_array_elements(coalesce(p_data->'images','[]'::jsonb)) with ordinality as t(img,idx)
    where length(trim(img->>'url')) > 0;
  delete from public.product_variants where product_id=result_id;
  insert into public.product_variants (product_id,size,color,stock,sku)
  select result_id, nullif(trim(v->>'size'),''), nullif(trim(v->>'color'),''), (v->>'stock')::integer, nullif(v->>'sku','')
    from jsonb_array_elements(coalesce(p_data->'variants','[]'::jsonb)) as t(v);
  return result_id;
end $$;
revoke all on function public.save_catalog_product(uuid,jsonb) from public, anon;
grant execute on function public.save_catalog_product(uuid,jsonb) to authenticated;
