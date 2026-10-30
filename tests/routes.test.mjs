import test from "node:test";
import assert from "node:assert/strict";
const base = process.env.TEST_BASE_URL || "http://localhost:3002";
test("public pages and editorial assets respond successfully", async () => {
  for (const route of ["/", "/catalogo", "/catalogo?busca=polo&categoria=polos", "/produtos", "/produto/polo-texturizada", "/categoria/camisas", "/informacoes", "/admin/login", "/robots.txt", "/sitemap.xml", "/images/editorial-hero.webp", "/images/camisa.webp", "/images/polo.webp", "/images/jeans.webp", "/images/camiseta.webp", "/icon.svg"]) {
    const response = await fetch(base + route);
    assert.equal(response.status, 200, route);
    await response.arrayBuffer();
  }
});
test("admin routes redirect to login while the backend is absent", async () => {
  for (const route of ["/admin", "/admin/produtos", "/admin/configuracoes"]) {
    const response = await fetch(base + route, { redirect: "manual" });
    assert.equal(response.status, 307, route);
    assert.equal(new URL(response.headers.get("location"), base).pathname, "/admin/login");
  }
});
test("unknown products return 404", async () => assert.equal((await fetch(base + "/produto/nao-existe")).status, 404));
test("demo product HTML is not indexed and does not claim a Product offer", async () => {
  const html = await (await fetch(base + "/produto/polo-texturizada")).text();
  assert.ok(html.includes('content="noindex'));
  assert.ok(html.includes("Modo demonstração"));
  assert.equal(html.includes('type="application/ld+json"'), false);
  assert.equal(html.includes("R$"), false);
});
test("home contains navigable catalog links and no fake live feed", async () => {
  const html = await (await fetch(base)).text();
  assert.ok(html.includes('href="/catalogo"'));
  assert.ok(html.includes("Seu estilo."));
  assert.ok(html.includes("Produtos e imagens ilustrativos"));
  assert.equal(html.includes("picsum.photos"), false);
  assert.equal(html.includes("og-image.jpg"), false);
  assert.ok(html.includes('id="main-content"'));
});

