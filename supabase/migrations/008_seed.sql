-- 008: production bootstrap only. Demonstration products live in src/lib/demo.ts.
-- No invented phone numbers, prices, promotions, feed posts or testimonials.
insert into public.store_settings (store_name, whatsapp_number, instagram_url, address, hero_title, hero_subtitle, about_title, about_text)
values ('Moustache', '', 'https://www.instagram.com/lojamoustache/', null, E'Seu estilo.\nSua identidade.', 'O essencial ganha personalidade. Descubra uma nova forma de vestir quem você é.', 'Estilo com personalidade.', 'A Moustache é uma loja de moda masculina. Diferentes estilos, uma mesma ideia: vestir a sua identidade.')
on conflict (is_singleton) do nothing;
