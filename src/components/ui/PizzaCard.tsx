// src/features/menu/ui/PizzaCard.tsx
import { motion } from "framer-motion";
import React from "react";

import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";

const priceToNumber = (p: string) => {
  const n = parseFloat(p.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const DietDot: React.FC<{ type: "Veg" | "Non-Veg" }> = ({ type }) => {
  const isVeg = type === "Veg";
  return (
    <span
      className={`absolute top-3 right-3 z-20 inline-flex items-center justify-center w-7 h-7 rounded-[10px] border ${
        isVeg ? "border-green-600/80" : "border-red-600/80"
      } bg-white/70 backdrop-blur shadow-sm`}
      title={type}
    >
      <span className={`w-3 h-3 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
    </span>
  );
};

const PizzaCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const isVeg = item.tags.includes("Veg");
  const type: "Veg" | "Non-Veg" = isVeg ? "Veg" : "Non-Veg";
  const price = priceToNumber(item.price);

  const handleAdd = () => {
    addToCart({
      id: item.id,
      name: item.name,
      price,
      image: item.image,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="
        group relative overflow-hidden rounded-3xl
        border border-white/10 shadow-sm hover:shadow-2xl
        bg-background/45 backdrop-blur-xl
      "
    >
      {/* glass glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-20 -left-24 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-coffee-light/15 blur-2xl" />
      </div>

      <DietDot type={type} />

      {/* IMAGE */}
      <div className="relative p-4">
        <div
          className="
            relative rounded-3xl overflow-hidden
            border border-white/10
            bg-gradient-to-b from-white/35 via-white/15 to-white/5
            backdrop-blur
            shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]
          "
        >
          {/* soft vignette behind image */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/25 blur-2xl" />
            <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-coffee-light/20 blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          <div className="aspect-square w-full grid place-items-center p-3">
            <motion.img
              src={item.image}
              alt={item.name}
              loading="lazy"
              whileHover={{ scale: 1.08, rotate: -0.25 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="
                w-[88%] h-[88%] object-contain
                drop-shadow-[0_18px_25px_rgba(0,0,0,0.18)]
                transition-[filter] duration-300
                group-hover:brightness-[1.04] group-hover:contrast-[1.04] group-hover:saturate-[1.06]
              "
            />
          </div>

          {/* inner border for premium frame */}
          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 pointer-events-none" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="px-5 pb-5 text-center">
        <p className="text-2xl font-display font-extrabold text-coffee-rich leading-tight line-clamp-1">
          {item.name}
        </p>

        <p className="mt-2 text-sm text-muted-foreground leading-snug line-clamp-2">{item.description}</p>

        <div className="mt-4 flex items-center justify-center gap-3">
          {/* Price pill */}
          <div
            className="
              inline-flex items-center justify-center px-6 py-2.5 rounded-full
              bg-background/70 border border-coffee-rich/20
              font-extrabold text-coffee-rich shadow-sm
            "
          >
            ₹ {price}
          </div>

          {/* Add button */}
          {/* <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="
              inline-flex items-center gap-2 px-6 py-2.5 rounded-full
              bg-coffee-medium text-cream font-bold
              hover:bg-coffee-rich transition shadow-sm
            "
          >
            <Plus className="h-4 w-4" />
            Add
          </motion.button> */}
        </div>
      </div>
    </motion.div>
  );
};

export default PizzaCard;
