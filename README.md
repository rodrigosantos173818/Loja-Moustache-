# Tribu’s Men — catálogo digital

Implementação no projeto existente: **Next.js 16.3, React 19, TypeScript, Tailwind CSS v4, Lucide e Supabase**. A arquitetura original foi preservada. Não há checkout de pagamento: a sacola prepara uma consulta de orçamento por WhatsApp.

## Executar

```powershell
npm install
# Se .env.local já existir, preserve seu conteúdo.
Copy-Item .env.example .env.local
npm run dev
```

Abra http://localhost:3000. As dependências já estão instaladas neste workspace.

Sem credenciais válidas, o catálogo usa exclusivamente os fixtures de [src/lib/demo.ts](src/lib/demo.ts). Produtos, imagens e estoque são identificados como ilustrativos. Não há preços comerciais inventados. A sacola de demonstração funciona no navegador, mas o envio é bloqueado. O painel não permite autenticação nem simula gravação.

## O que está implementado

- Home editorial: header fixo, busca, menu mobile, hero, coleções, vitrine filtrável, banners cadastrados, apresentação institucional, Instagram e rodapé.
- `/catalogo`: busca sem distinção de acentos, categoria, tamanho, cor, preço máximo, disponibilidade, ordenação e carregamento progressivo.
- `/produtos`: compatibilidade com a rota anterior.
- `/produto/[slug]`: galeria, ampliação, variações existentes, estoque por combinação, guia de medidas quando cadastrado, sacola e consulta direta quando o WhatsApp estiver configurado.
- Sacola persistida no localStorage, quantidades limitadas ao estoque conhecido, remoção, subtotal estimado e mensagem de orçamento.
- `/admin`: autorização explícita, produtos, categorias, uploads de imagens, SKU, estoque, ordenação, banners e configurações.
- Imagens WebP locais e fontes locais. Nenhum download do Google Fonts é necessário para executar o build.
- Metadados por rota, sitemap, robots, 404 e estados de carregamento/erro. Produtos de demonstração não recebem dados estruturados Product e não são indexados.
- Modais nativos com foco contido, Escape, restauração de foco e fundo inerte. Movimento reduzido e link para pular ao conteúdo.

## Configurar o Supabase

1. Preencha `.env.local` com `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `NEXT_PUBLIC_SITE_URL`. Use somente uma chave pública/anon. Nunca coloque uma chave `service_role` no frontend.
2. Execute **todas** as migrations em `supabase/migrations`, de 001 a 009, em ordem. Em instalações existentes, aplique a 009 após as anteriores.
3. A 008 agora cadastra somente as configurações iniciais, sem produtos, números de telefone, promoções ou posts fictícios. Os fixtures visuais ficam separados do banco.
4. A 009 cria a autorização administrativa, o bucket `catalog-images`, políticas de armazenamento, campos editoriais e a RPC transacional `save_catalog_product`.
5. Desative o cadastro público de usuários no Supabase Auth. Crie a conta administrativa manualmente em Authentication → Users.
6. Autorize o UUID da conta no SQL Editor, executando como proprietário do banco:

```sql
insert into public.admin_users (user_id)
values ('UUID-REAL-DA-CONTA')
on conflict do nothing;
```

Ter uma sessão autenticada não concede acesso de administrador. A autorização é verificada no proxy, layout, Server Actions, RPC e RLS. Não existe gravação pública em `admin_users`. Para revogar uma conta, remova sua linha dessa tabela pelo SQL Editor.

7. Entre em `/admin/login`. Cadastre a logo oficial, o WhatsApp com código do país, imagens reais, produtos, variações, preços, categorias e banners.
8. Cadastre as informações comerciais e a política de privacidade em Configurações. O link público só aparece depois que houver conteúdo.

Os uploads aceitam JPG, PNG, WebP e AVIF, até 8 MB. Salvar um produto e substituir suas imagens/variações acontece numa transação: se uma operação falhar, os dados anteriores são preservados.

Referências técnicas: [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Database Functions](https://supabase.com/docs/guides/database/functions), [Storage Access Control](https://supabase.com/docs/guides/storage/security/access-control).

### Instalações com o seed antigo

Nenhum banco externo foi alterado nesta tarefa. Se a versão anterior da 008 já foi executada, os produtos, telefones, preços e banners fictícios que ela inseriu precisam ser revisados e removidos/desativados pela equipe antes de disponibilizar a loja. A nova migration não apaga dados existentes automaticamente.

## Materiais e configuração ainda necessários

- **Logo oficial:** SVG ou PNG transparente de boa resolução. O nome tipográfico atual é provisório; nenhum símbolo oficial foi redesenhado.
- **Fotografias reais:** produtos, variações e loja, com autorização de uso.
- **Dados comerciais:** nomes, descrições, composição, SKU, preços, estoque, tamanhos, cores e medidas reais.
- **WhatsApp real:** cadastrar no painel; não foi inventado um número.
- **Supabase:** URL, chave pública, migrations aplicadas e conta incluída em `admin_users`.
- **Conteúdo institucional:** horários, políticas, informações comerciais e política de privacidade aprovados.
- **Domínio final:** configurar em `NEXT_PUBLIC_SITE_URL` antes da publicação.
- **Conferência visual e de integração:** validar no navegador em 375, 768, 1024 e 1440 px e executar os fluxos autenticados com o Supabase real.

O endereço e o Instagram vieram da referência enviada pelo usuário. O Instagram oficial não estava acessível pela consulta externa. Não foi simulado um feed integrado.

## Verificações

```powershell
npm test
npm run lint
npm run typecheck
npm run build

# Testes HTTP contra um build de demonstração:
npm run start -- -p 3002
# Em outro terminal:
npm run test:routes
```

Os testes HTTP verificam rotas públicas e assets, redirecionamento administrativo, 404 de produto inexistente, ausência de ofertas estruturadas para demonstração e links da home. Os testes de regras cobrem combinações de variações, estoque, filtros, preços promocionais, restauração da sacola, validação e formatação do WhatsApp.

Na entrega, 13 testes de regras e 5 testes HTTP passaram, assim como lint, TypeScript e build de produção. A automação visual no Windows foi interrompida pelo controle do navegador por não conseguir confirmar a URL com segurança; **não se afirma validação visual dos quatro tamanhos**. Auth, RLS, uploads e RPC estão preparados, mas precisam ser executados contra um Supabase conectado para validação de integração.

## Estrutura

```text
src/app/                 Rotas públicas e administrativas
src/components/home/     Seções da landing page
src/components/product/  Catálogo, cards, modal e detalhes
src/components/cart/     Sacola de orçamento
src/components/admin/    Upload de imagens
src/components/ui/       Nome/logo, modais e ícones
src/context/             Estado persistente da sacola
src/hooks/               Seleção de variações
src/lib/                 Consultas, fixtures, validação e regras
supabase/migrations/     Schema, autorização, storage e transação
public/images/           Imagens ilustrativas em WebP
src/app/fonts/           Fontes locais e licença
tests/                   Testes de regras e HTTP
```

Veja [DESIGN.md](DESIGN.md) para tokens, tratamento de imagem e origem dos assets. O projeto não foi publicado nem conectado a um banco externo nesta tarefa.

