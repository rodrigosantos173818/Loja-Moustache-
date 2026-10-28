import test from 'node:test';
import assert from 'node:assert/strict';
import { filterCatalogProducts } from '../src/lib/catalog-utils.ts';
import type { Product } from '../src/lib/types.ts';

const sample = (overrides: Partial<Product> = {}): Product => ({ id: 'p1', name: 'Camiseta Urbana', slug: 'camiseta-urbana', sku: null, description: 'Peça casual demonstrativa', price: 120, sale_price: null, images: [], attributes: { Cor: ['Preto'], Tamanho: ['M'] }, variants: [{ name: 'Tamanho', value: 'M', stock: 3 }], stock: 3, is_available: true, is_active: true, is_featured: false, sort_order: 1, category_id: 'camisetas', categories: { name: 'Camisetas', slug: 'camisetas' }, created_at: '2026-10-01T00:00:00.000Z', ...overrides });
const products = [sample(), sample({ id: 'p2', name: 'Polo Grafite', slug: 'polo-grafite', price: 180, category_id: 'polos', categories: { name: 'Polos', slug: 'polos' }, attributes: { Cor: ['Grafite'], Tamanho: ['G'] }, created_at: '2026-10-02T00:00:00.000Z' }), sample({ id: 'p3', name: 'Camiseta indisponível', slug: 'camiseta-indisponivel', is_available: false })];

test('combina busca, categoria, atributo, disponibilidade e teto de preço', () => { const result = filterCatalogProducts(products, { query: 'camiseta', categoryId: 'camisetas', attributes: { Cor: 'Preto', Tamanho: 'M' }, availableOnly: true, maxPrice: 130 }); assert.deepEqual(result.map((product) => product.id), ['p1']); });
test('ordena resultados por preço ascendente', () => { const result = filterCatalogProducts(products, { sort: 'price-asc' }); assert.deepEqual(result.map((product) => product.id), ['p1', 'p3', 'p2']); });
test('prioriza correspondência exata por relevância', () => { const result = filterCatalogProducts([sample({ name: 'Urbana Camiseta' }), sample({ id: 'exact', name: 'Urbana' })], { query: 'Urbana', sort: 'relevance' }); assert.equal(result[0].id, 'exact'); });
