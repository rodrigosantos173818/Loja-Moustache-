import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQuoteMessage, cartSubtotal, clampQuantity, foldSearch, hasUnknownPrice, isValidWhatsAppNumber } from '../src/lib/cart-utils.ts';
import type { CartItem } from '../src/context/cart-context.tsx';

const item: CartItem = { key: 'demo-1:M', productId: 'demo-1', name: 'Camiseta Essencial', slug: 'camiseta-essencial', image: null, price: 119.9, quantity: 2, variation: 'Tamanho: M, Cor: Preto', selection: {}, stock: 4 };

test('normaliza acentos e caixa na busca', () => assert.equal(foldSearch('Calças Masculinas'), 'calcas masculinas'));
test('limita quantidade ao estoque e remove zero', () => { assert.equal(clampQuantity(8, 4), 4); assert.equal(clampQuantity(0, 4), 0); });
test('calcula subtotal conhecido', () => assert.equal(cartSubtotal([item]), 239.8));
test('monta mensagem de orçamento com cliente, variação e valor', () => { const message = buildQuoteMessage([item], 'Breno'); assert.match(message, /Breno/); assert.match(message, /Tamanho: M, Cor: Preto/); assert.match(message, /R\$\s?119,90/); assert.match(message, /demonstrativa/i); });
test('não inclui preço desconhecido no total numérico', () => { const unknown = { ...item, price: null }; assert.equal(hasUnknownPrice([unknown]), true); assert.match(buildQuoteMessage([unknown]), /Subtotal estimado: A confirmar/); });
test('valida telefone comercial com código de país, DDD e até 15 dígitos', () => { assert.equal(isValidWhatsAppNumber('5511999999999'), true); assert.equal(isValidWhatsAppNumber('123'), false); assert.equal(isValidWhatsAppNumber('1234567890123456'), false); });
