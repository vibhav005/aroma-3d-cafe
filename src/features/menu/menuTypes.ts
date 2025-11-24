// src/features/menu/menu-types.ts
export type Category =
  | "Coffee"
  | "Pastries"
  | "Cold Coffee"
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
};

export const categories: readonly ("All" | Category)[] = [
  "All",
  "Coffee",
  "Pastries",
  "Cold Coffee",
  "Brunch",
  "Desserts",
] as const;
