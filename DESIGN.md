# Tribu’s Men — direção visual

## Referência e limites

A referência disponível foi o print enviado pelo usuário: moda casual masculina, peças organizadas, tons naturais e uma identidade de loja local. A logo gráfica aparece no print, mas não existe arquivo oficial utilizável no repositório. O perfil externo do Instagram não pôde ser carregado.

A paleta abaixo é **provisória**; não é apresentada como paleta oficial. O nome da loja aparece em texto enquanto a logo não é fornecida. O ícone com a letra t é um marcador temporário, substituído pela logo configurada no painel quando disponível.

## Tokens

Tokens centralizados em `src/app/globals.css` com mapeamento Tailwind v4 por `@theme inline`, evitando variáveis que referenciam a si mesmas.

| Token | Valor | Uso |
| --- | --- | --- |
| ink | #22241f | Texto, CTAs |
| paper | #fbfaf7 | Fundo principal |
| muted | #696b63 | Texto secundário |
| accent | #76795f | Bordas e detalhes |
| accent-deep | #535842 | Texto de apoio |
| surface | #f0efea | Vitrine, filtros e blocos |
| line | #dcdcd3 | Divisórias |
| radius | 2 px | Controles discretos |
| space-section | clamp(56px, 6.7vw, 100px) | Ritmo vertical |
| shadow-modal | 0 24px 90px #0002 | Modais |

Inter local para texto e navegação; Playfair Display local para títulos editoriais. A combinação de serifada e sans serif diferencia campanhas e interfaces. As fontes foram recuperadas dos arquivos já existentes no cache do próprio projeto, preservando copyright e licença.

## Composição e comportamento

- Faixa superior escura e header claro, com busca e contador de sacola.
- Hero com figura masculina à direita e texto sobre área clara à esquerda. No celular, texto ocupa a região inferior, com contraste próprio.
- Coleções em quatro colunas no desktop e duas no celular.
- Cards de produtos em duas colunas no celular, três no tablet e quatro no desktop.
- Botões discretos, divisórias finas, hover de imagem e foco visível.
- Modais nativos com teclado, Escape e restauração de foco.
- Movimento reduzido desativa animações e rolagem suave.
- Imagens ilustrativas e produtos de demonstração rotulados. Nenhuma foto é apresentada como foto real da loja.

## Assets gerados

Gerados com a ferramenta integrada **imagegen**, sem marcas de terceiros. Originais preservados no diretório padrão da ferramenta; arquivos usados pela aplicação copiados e otimizados no workspace:

- `public/images/editorial-hero.webp`
- `public/images/camiseta.webp`
- `public/images/polo.webp`
- `public/images/camisa.webp`
- `public/images/jeans.webp`

Os prompts completos estão em [docs/image-prompts.md](docs/image-prompts.md). O processamento determinístico de tamanho, recorte e WebP está em `scripts/prepare-assets.mjs`. Nenhum asset consumido pelo site depende de um caminho externo ao projeto.

## Verificação visual

As imagens foram inspecionadas diretamente. O layout tem media queries para mobile e tablet, porém o teste visual em navegador não foi concluído: o controle de navegador do Windows encerrou a sessão por não conseguir determinar a URL com segurança. As larguras de aceitação 375, 768, 1024 e 1440 px permanecem como conferência visual pendente. Isso não equivale a um resultado visual aprovado.

