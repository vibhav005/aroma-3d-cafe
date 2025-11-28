// src/features/menu/menu-types.ts
export type Category =
  | "Speciality Coffee"
  | "Cold Coffee"
  | "Hot Coffee"
  | "Hot Chocolate"
  | "Hot Tea"
  | "Iced Tea"
  | "Shakes"
  | "Mojitos"
  | "Brunch"
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
  "All",
  "Speciality Coffee",
  "Cold Coffee",
  "Hot Coffee",
  "Hot Chocolate",
  "Hot Tea",
  "Iced Tea",
  "Shakes",
  "Mojitos",
  "Brunch",
  "Desserts",
] as const;
