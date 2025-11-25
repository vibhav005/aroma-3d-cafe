// src/features/menu/menu-types.ts
export type Category =
  | "Coffee"
  | "Cold Coffee"
  | "Tea"
  | "Iced Tea"
  | "Shakes"
  | "Mojitos"
  | "Brunch"
  | "Desserts";

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
};

export const categories: readonly ("All" | Category)[] = [
  "All",
  "Coffee",
  "Cold Coffee",
  "Tea",
  "Iced Tea",
  "Shakes",
  "Mojitos",
  "Brunch",
  "Desserts",
] as const;
