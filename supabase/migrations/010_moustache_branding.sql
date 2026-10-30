-- Atualiza o catálogo existente para a identidade Moustache.
alter table public.store_settings
  alter column store_name set default 'Moustache',
  alter column instagram_url set default 'https://www.instagram.com/lojamoustache/',
  alter column meta_title set default 'Moustache | Moda Masculina',
  alter column meta_description set default 'Descubra a coleção Moustache. Moda masculina com estilo, personalidade e elegância.';

update public.store_settings
set
  store_name = 'Moustache',
  store_description = 'Moda masculina com personalidade.',
  instagram_url = 'https://www.instagram.com/lojamoustache/',
  address = null,
  logo_url = '/images/moustache-logo.svg',
  about_title = 'Estilo com personalidade.',
  about_text = 'A Moustache é uma loja de moda masculina. Conheça a seleção e encontre peças que combinam com você.',
  meta_title = 'Moustache | Moda Masculina',
  meta_description = 'Conheça a Moustache e explore o catálogo de moda masculina.'
where is_singleton = true;
