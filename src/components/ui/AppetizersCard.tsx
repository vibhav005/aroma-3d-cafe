import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import React from "react";

const priceToNumber = (p: string) => {
  const n = parseFloat(p.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const DietMark: React.FC<{ type: "Veg" | "Non-Veg" }> = ({ type }) => {
  const isVeg = type === "Veg";
  return (
    <span
      className={`absolute top-3 left-3 z-20 inline-flex items-center justify-center w-7 h-7 rounded-[8px] border bg-white/75 backdrop-blur shadow-sm ${
        isVeg ? "border-green-600" : "border-red-600"
      }`}
      title={type}
    >
      <span className={`w-3 h-3 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
    </span>
  );
};

const AppetizerCard: React.FC<{ item: MenuItem }> = ({ item }) => {
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
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="
        group relative overflow-hidden rounded-3xl
        bg-background/45 backdrop-blur-xl
        border border-white/10 shadow-sm hover:shadow-xl
      "
    >
      {/* glass glow */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute -top-20 -left-20 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-coffee-light/15 blur-2xl" />
      </div>

      <DietMark type={type} />

      {/* rating */}
      <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs bg-black/30 text-white backdrop-blur border border-white/10">
        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        <span className="font-semibold">{item.rating}</span>
      </div>

      {/* image */}
      <div className="relative p-4">
        <div className="rounded-3xl overflow-hidden bg-background/40 border border-white/10">
          <div className="aspect-[4/3] w-full overflow-hidden">
            <motion.img
              src={item.image}
              alt={item.name}
              loading="lazy"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* content */}
      <div className="px-5 pb-5">
        <div className="text-center">
          <p className="text-xl font-display font-extrabold text-coffee-rich leading-tight line-clamp-1">
            {item.name}
          </p>

          {item.subtitle && (
            <p className="mt-1 text-xs font-semibold text-coffee-dark/90 line-clamp-1">{item.subtitle}</p>
          )}

          <p className="mt-2 text-sm text-muted-foreground leading-snug line-clamp-2">{item.description}</p>
        </div>

        {/* bottom row */}
        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-background/70 border border-coffee-rich/20 font-extrabold text-coffee-rich shadow-sm">
            ₹ {price}
          </div>

          {/* <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="
              inline-flex items-center gap-2
              px-5 py-2 rounded-full
              bg-coffee-medium text-cream font-bold
              hover:bg-coffee-rich transition
              shadow-sm
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

export default AppetizerCard;
