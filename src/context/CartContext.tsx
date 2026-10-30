"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";
import { restoreCart } from "@/lib/cart";

const STORAGE_KEY = "moustache:cart";

type AddItemInput = CartItem;

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: AddItemInput) => void;
  removeItem: (productId: string, size: string | null, color: string | null) => void;
  updateQuantity: (
    productId: string,
    size: string | null,
    color: string | null,
    quantity: number
  ) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(a: CartItem, productId: string, size: string | null, color: string | null) {
  return a.productId === productId && a.size === size && a.color === color;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Carrega o carrinho salvo assim que o componente monta no navegador.
  // Precisa ser um efeito (não um inicializador de useState) para que a
  // primeira renderização no cliente bata com o HTML vindo do servidor
  // (que nunca tem acesso ao localStorage) — evita erro de hidratação.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincronização única com localStorage (sistema externo) logo após montar; ver comentário acima.
      setItems(restoreCart(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      // localStorage indisponível (modo privado etc.) — segue com carrinho vazio.
    }
    setHydrated(true);
  }, []);

  // Persiste a cada mudança, uma vez já hidratado (evita sobrescrever com []).
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignora falhas de storage
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: AddItemInput) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex((i) =>
        sameLine(i, item.productId, item.size, item.color)
      );
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          maxStock: item.maxStock,
          quantity: Math.min(next[existingIndex].quantity + item.quantity, item.maxStock || 99),
        };
        return next;
      }
      return [...prev, item];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback(
    (productId: string, size: string | null, color: string | null) => {
      setItems((prev) => prev.filter((i) => !sameLine(i, productId, size, color)));
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, size: string | null, color: string | null, quantity: number) => {
      setItems((prev) => {
        if (quantity <= 0) {
          return prev.filter((i) => !sameLine(i, productId, size, color));
        }
        return prev.map((i) =>
          sameLine(i, productId, size, color) ? { ...i, quantity: Math.max(1, Math.min(Math.floor(quantity) || 1, i.maxStock || 99)) } : i
        );
      });
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const totalPrice = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    isOpen,
    openCart,
    closeCart,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve ser usado dentro de <CartProvider>");
  return ctx;
}
