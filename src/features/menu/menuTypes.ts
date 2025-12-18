// src/features/menu/menu-types.ts
export type Category =
  | "Breakfast"
  | "Speciality Coffee"
  | "Cold Coffee"
  | "Hot Coffee"
  | "Hot Chocolate"
  | "Hot Tea"
  | "Iced Tea"
  | "Shakes"
  | "Mojitos"
  | "Food"
  | "Desserts";

export type MenuVariant = {
  name: string;
  price: string;
};

export type AddOns = {
  name: string;
  price: string;
};

export type MenuItem = {
  id: number;
  name: string;
  description: string;
  subtitle?: string;
  price: string; // "$4.50"
  image: string; // or `string | StaticImport` if using Next/Image
  category: Category;
  rating: number;
  time: string; // "3 mins" | "Ready"
  tags: string[];
  fit?: "Cover" | "Contain";
  variants?: MenuVariant[];
  addOns?: AddOns[];
};

export const categories: readonly ("All" | Category)[] = [
  "Breakfast",
  "Speciality Coffee",
  "Cold Coffee",
  "Hot Coffee",
  "Hot Chocolate",
  "Hot Tea",
  "Iced Tea",
  "Shakes",
  "Mojitos",
  "Food",
  "Desserts",
] as const;
