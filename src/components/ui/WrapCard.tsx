// src/features/menu/ui/WrapCard.tsx
import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
import { motion } from "framer-motion";
import React from "react";

const priceToNumber = (p: string) => {
  const n = parseFloat(p.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const DietMark: React.FC<{ type: "Veg" | "Non-Veg" }> = ({ type }) => {
  const isVeg = type === "Veg";
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-[6px] border ${
          isVeg ? "border-green-600/80" : "border-red-600/80"
        } bg-white/70 backdrop-blur shadow-sm`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
      </span>
      <span className="text-sm font-semibold text-coffee-rich">{type}</span>
    </span>
  );
};

const PricePill: React.FC<{ price: string; onClick: () => void }> = ({ price, onClick }) => {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="
        px-6 py-2 rounded-full
        border border-coffee-rich/20 bg-background/70 backdrop-blur
        font-extrabold text-coffee-rich shadow-sm
        hover:bg-coffee-light/15 transition
      "
    >
      ₹ {priceToNumber(price)}
    </motion.button>
  );
};

/**
 * WrapCard supports two patterns:
 * 1) variants: [{name:"Veg"},{name:"Non-Veg"}]  -> shows two price pills like PastaCard
 * 2) no variants -> shows single price pill
 */
const WrapCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const veg = item.variants?.find((v) => v.name === "Veg");
  const nonVeg = item.variants?.find((v) => v.name === "Non-Veg");

  const add = (label: "Veg" | "Non-Veg" | "Regular", price: string) => {
    addToCart({
      id: item.id,
      name: label === "Regular" ? item.name : `${item.name} (${label})`,
      price: priceToNumber(price),
      image: item.image,
    });
  };

  const first = item.name.split(" ").slice(0, 1).join(" ");
  const rest = item.name.split(" ").slice(1).join(" ");

  const hasDual = Boolean(veg && nonVeg);

  return (
    <div className="w-full max-w-[360px]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        whileHover={{ y: -6 }}
        className="
      w-full max-w-[340px]
      group relative rounded-[28px] overflow-hidden
      border border-white/10 shadow-sm hover:shadow-2xl
      bg-background/45 backdrop-blur-xl
      p-5
    "
      >
        {/* glass glow */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute -top-20 -left-24 h-60 w-60 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-coffee-light/15 blur-2xl" />
        </div>

        {/* inner ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/10" />

        {/* Image frame */}
        <div
          className="
            relative rounded-3xl overflow-hidden
            border border-white/10
            bg-gradient-to-b from-white/35 via-white/15 to-white/5
            shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]
          "
        >
          {/* vignette */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/25 blur-2xl" />
            <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-coffee-light/20 blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          <div className="rounded-3xl overflow-hidden">
            <motion.img
              src={item.image}
              alt={item.name}
              loading="lazy"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full h-[260px] object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mt-5 relative">
          <p className="text-4xl font-display font-extrabold text-coffee-rich leading-tight">
            {first}
            {rest ? (
              <>
                <br />
                {rest}
              </>
            ) : null}
          </p>

          {item.subtitle && <p className="mt-3 font-semibold text-coffee-rich">{item.subtitle}</p>}

          <p className="mt-1 text-sm text-muted-foreground italic">{item.description}</p>

          {/* Diet row */}
          {hasDual ? (
            <div className="mt-5 flex items-center justify-center gap-10">
              <DietMark type="Veg" />
              <DietMark type="Non-Veg" />
            </div>
          ) : (
            <div className="mt-5 flex items-center justify-center">
              <DietMark type={item.tags.includes("Veg") ? "Veg" : "Non-Veg"} />
            </div>
          )}

          {/* Price row */}
          {hasDual ? (
            <div className="mt-4 flex items-center justify-center gap-10">
              <PricePill price={veg!.price} onClick={() => add("Veg", veg!.price)} />
              <PricePill price={nonVeg!.price} onClick={() => add("Non-Veg", nonVeg!.price)} />
            </div>
          ) : (
            <div className="mt-4 flex items-center justify-center">
              <PricePill price={item.price} onClick={() => add("Regular", item.price)} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default WrapCard;
