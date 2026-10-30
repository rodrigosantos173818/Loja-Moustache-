import test from "node:test";
import assert from "node:assert/strict";
import { loadTs } from "./load-ts.mjs";
const { demoProducts } = await loadTs("src/lib/demo.ts");
const { filterProducts } = await loadTs("src/lib/catalog.ts");
const { restoreCart } = await loadTs("src/lib/cart.ts");
const { validateProduct, isSafeUrl } = await loadTs("src/lib/validation.ts");
const { buildWhatsappOrderMessage, buildWhatsappOrderLink } = await loadTs("src/lib/whatsapp.ts");
const filters = { query: "", category: "", size: "", color: "", maxPrice: "", available: false, sort: "curated" };
const line = { productId: "polo", slug: "polo", name: "Polo", image: "/images/polo.webp", size: "M", color: "Preto", quantity: 2, price: 100, maxStock: 4 };
const product = { ...demoProducts[1], is_demo: false, stock: 0, price: 200, sale_price: 150, product_variants: [{ size: "P", color: "Preto", stock: 2 }, { size: "M", color: "Branco", stock: 0 }] };
const input = { name: "Polo", slug: "polo", price: 100, sale_price: null, stock: 0, images: [], variants: [{ size: "M", color: "Preto", stock: 2 }] };

test("search ignores accents, case and surrounding whitespace", () => assert.equal(filterProducts(demoProducts, { ...filters, query: " PÓLO " })[0].slug, "polo-texturizada"));
test("size and color must belong to the same variation", () => assert.equal(filterProducts([product], { ...filters, size: "P", color: "Branco" }).length, 0));
test("stock uses variations, including the selected combination", () => {
  assert.equal(filterProducts([product], { ...filters, available: true }).length, 1);
  assert.equal(filterProducts([product], { ...filters, available: true, size: "M" }).length, 0);
});
test("illustrative unpriced pieces never appear as free products in price filters", () => assert.equal(filterProducts(demoProducts, { ...filters, maxPrice: "100" }).length, 0));
test("price filters consider the actual promotional price", () => assert.equal(filterProducts([product], { ...filters, maxPrice: "175" }).length, 1));
test("sorting does not mutate the catalog input", () => {
  const items = [product, { ...product, name: "A", slug: "a" }];
  assert.equal(filterProducts(items, { ...filters, sort: "name" })[0].name, "A");
  assert.equal(items[0].name, product.name);
});
test("cart survives malformed or incompatible browser storage", () => {
  for (const value of [null, "undefined", "{}", "[null]", "not-json"]) assert.deepEqual(restoreCart(value), []);
  assert.deepEqual(restoreCart(JSON.stringify([line])), [line]);
});
test("cart rejects corrupt quantities, prices, stock and unsafe images", () => {
  for (const changes of [{ quantity: -1 }, { quantity: 1.5 }, { quantity: 5 }, { price: -1 }, { maxStock: "9" }, { image: "javascript:alert(1)" }]) assert.deepEqual(restoreCart(JSON.stringify([{ ...line, ...changes }])), []);
});
test("WhatsApp quote includes variations, quantities and correct subtotal", () => {
  const message = buildWhatsappOrderMessage([line, { ...line, quantity: 1, price: 50, size: "G" }]);
  for (const expected of ["Tamanho: M", "Tamanho: G", "Cor: Preto", "Quantidade: 2", "250,00", "confirmar os valores"]) assert.ok(message.includes(expected), expected);
});
test("WhatsApp URL sanitizes the phone and safely encodes the message", () => {
  const link = new URL(buildWhatsappOrderLink("+55 (32) 99999-0000", [{ ...line, name: "Polo & Camisa #1" }]));
  assert.equal(link.hostname, "wa.me");
  assert.equal(link.pathname, "/5532999990000");
  assert.equal(link.searchParams.size, 1);
  assert.ok(link.searchParams.get("text").includes("Polo & Camisa #1"));
});
test("server rejects invalid sale prices and duplicate variation combinations", () => {
  assert.equal(validateProduct(input), null);
  assert.ok(validateProduct({ ...input, sale_price: 100 }));
  assert.ok(validateProduct({ ...input, stock: -1 }));
  assert.ok(validateProduct({ ...input, variants: [input.variants[0], input.variants[0]] }));
});
test("content links reject script and protocol-relative URLs", () => {
  assert.equal(isSafeUrl("/catalogo"), true);
  assert.equal(isSafeUrl("https://example.com/photo.webp"), true);
  for (const url of ["javascript:alert(1)", "//evil.test", "data:text/html,test", "http://example.com"]) assert.equal(isSafeUrl(url), false);
});
test("demonstration data has no fake commercial price, phone or promotional offer", async () => {
  const { demoSettings } = await loadTs("src/lib/demo.ts");
  assert.equal(demoSettings.whatsapp_number, "");
  assert.ok(demoProducts.every(p => p.is_demo && p.sale_price === null && p.price === 0));
});

