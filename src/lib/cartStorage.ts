// src/lib/cartStorage.ts
export type StoredCartItem = {
  id: number;
  name: string;
  price: number;   // numeric
  image?: string;
  qty: number;
};

const KEY = "cart";

export const readCart = (): StoredCartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as StoredCartItem[]) : [];
  } catch {
    return [];
  }
};

export const writeCart = (items: StoredCartItem[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(items));
};

export const clearCartStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
};
