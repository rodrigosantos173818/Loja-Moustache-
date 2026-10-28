# MOUSTACHE — catálogo digital demonstrativo

Vitrine de moda masculina feita com Next.js 16.4.3, React 19, TypeScript, Tailwind CSS v4 e Lucide. A direção visual editorial em preto e grafite foi construída para este projeto. Não há `DESIGN.md` ou referência de identidade oficial no workspace.

## Estado atual e limites

- O catálogo usa fixtures tipadas em `src/data/products.ts`. Nomes, descrições, imagens, tamanhos, estoque e preços são fictícios e estão identificados como demonstração na interface.
- As ilustrações SVG de `public/catalog/` são demonstrações, não fotos dos produtos.
- A captura fornecida mostra uma logo oficial, mas o arquivo original não está nos assets do projeto/anexos acessíveis. A marca aparece como wordmark tipográfico provisório no componente `Brand` de `src/components/site-chrome.tsx`. O favicon em `src/app/icon.svg` também usa somente o nome tipográfico, sem símbolo inventado. Substituir ambos quando a loja fornecer o arquivo original em alta resolução e com transparência.
- Não existem migrations, cliente Supabase, rotas administrativas, autenticação ou painel neste workspace. A aplicação é local e permanece executável sem credenciais externas. Este projeto não valida nem implementa as exigências de administração/Supabase descritas em outro escopo.
- O perfil exibido na captura foi configurado como `https://www.instagram.com/lojamoustache/` e a seção aparece apenas com URL definida.
- O envio para WhatsApp fica bloqueado enquanto `demoCatalog` estiver `true`, mesmo que um número seja configurado. Nenhum contato comercial deve ser feito com os dados fictícios.
- A rota antiga `/produtos` redireciona para `/catalogo`.

Antes de publicar, substitua todos os fixtures por dados e imagens autorizados e confirmados, confira estoque/preços/variações, receba e instale a logo oficial e confirme os canais comerciais. Depois, altere `demoCatalog` em `src/config/store.ts` somente quando todo o conteúdo for real.

## Executar localmente

Requisitos: Node.js 22.6 ou superior e npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Abra `http://localhost:3000`.

## Configuração

Preencha `.env.local` apenas com informações oficiais:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=5532991476580
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/lojamoustache/
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
```

O telefone e o perfil acima foram copiados da captura fornecida pelo responsável da loja; confirme-os antes da publicação. O telefone deve conter código do país e DDD, com 10 a 15 dígitos. Sem número válido, o contato permanece indisponível. O endereço do site habilita `metadataBase` e o sitemap.

## Produtos, categorias e imagens

Edite `src/data/products.ts`:

- `products` contém os registros tipados. Use preços, preços promocionais, disponibilidade e estoque somente quando confirmados.
- `categories` define as categorias existentes. Os filtros usam o ID da categoria.
- `images` aceita caminhos locais em `public/`, por exemplo `/catalog/camiseta.webp`. Prefira arquivos WebP autorizados e otimizados para dispositivos móveis.
- `variants` aceita opções simples (`name` e `value`) ou combinações por `attributes`, além de disponibilidade e estoque.
- Ajuste `created_at`, `is_featured`, `is_available` e `stock` com dados reais.

As fotos editoriais locais em `public/catalog/photo-*.webp` são referências gratuitas da Unsplash, não fotos da loja ou do estoque MOUSTACHE. Os cartões e detalhes as identificam como ilustrativas; substitua-as por fotografias autorizadas dos produtos reais antes de publicar.

Créditos das imagens:

- Capa editorial: [Abolfazl Babaei](https://unsplash.com/photos/man-in-black-t-shirt-and-jeans-looking-over-shoulder-jRDUsBsaVkk).
- Camisetas: [roupas pretas em cabides](https://unsplash.com/photos/black-clothes-hanged-in-rack-kWVImL5QxJI).
- Jaqueta: [Matthew LeJune](https://unsplash.com/photos/man-wearing-black-jacket-i5SGtimnb_A).
- Arara de roupas: [Artem Beliaikin](https://unsplash.com/photos/mens-clothes-displayed-on-a-rack-DUvOYPOT5Cw).
- Polo: [Luiz Rogério Nunes](https://unsplash.com/photos/man-with-mustache-in-polo-shirt-WZmdNbGdnq4).
- Jeans: [Long Chung](https://unsplash.com/photos/man-wearing-a-suede-jacket-white-shirt-and-jeans-Gc5Rpu9186o).
- Bermuda: [Maria Lysenko](https://unsplash.com/photos/a-man-in-a-white-shirt-and-black-shorts-2C32-lQ63p4).

Enquanto `demoCatalog` for `true`, as páginas permanecem `noindex`, não entram no sitemap e não têm dados estruturados de oferta. O WhatsApp não recebe solicitações. Os fixtures atuais estão em `src/data/products.ts`.

## Orçamento

A sacola persiste no `localStorage`, permite revisar itens e variações e calcula uma estimativa a partir dos valores presentes no catálogo. Ela não processa pagamentos. Em modo demonstrativo, o link para enviar pelo WhatsApp fica bloqueado. Em produção, configure o número oficial e só desative `demoCatalog` depois de confirmar os dados comerciais.

## Supabase e administração

Esta cópia do projeto não contém configuração, migrations, dependências ou rotas Supabase/admin. Portanto, não há cadastro administrativo, autenticação, gravação em banco ou políticas RLS implementadas para validar. Para retomar esse escopo, é necessário fornecer/restaurar a versão que contém as migrations e os recursos administrativos referidos no briefing; não adicione uma chave `service_role` ao frontend.

## Verificações

Scripts presentes em `package.json`:

```powershell
npm test
npm run lint
npm run typecheck
npm run build
```

Este projeto não define `test:routes`; não execute um comando alternativo inventado. A verificação visual em 375, 768, 1024 e 1440 px deve ser feita e registrada separadamente antes da publicação.

## Pendências para publicação

1. Dados comerciais reais e autorizados para produtos, categorias, preços, estoque e variações.
2. Logo oficial em versões adequadas para fundo escuro e claro.
3. Número comercial de WhatsApp válido e URL oficial do Instagram, caso aplicável.
4. Domínio final e validação visual responsiva.
5. Para painel/Supabase: migrations 001–009, configuração do projeto e implementação administrativa correspondente, ausentes desta cópia.
