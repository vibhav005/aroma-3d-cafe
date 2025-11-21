// src/lib/cartBus.ts
export type CartAddPayload = {
  id: number;
  name: string;
  price: number;     // numeric
  image?: string;
};

export const addToCart = (payload: CartAddPayload) => {
  window.dispatchEvent(new CustomEvent<CartAddPayload>("cart:add", { detail: payload }));
};

export const openCart = () => {
  window.dispatchEvent(new Event("cart:open"));
};
