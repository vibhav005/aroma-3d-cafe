import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
import React from "react";

const priceToNumber = (p: string) => {
  const n = parseFloat(p.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const DietDot: React.FC<{ type: "Veg" | "Non-Veg" }> = ({ type }) => {
  const isVeg = type === "Veg";
  return (
    <span
      className={`absolute top-3 right-3 z-20 inline-flex items-center justify-center w-6 h-6 rounded-[6px] border ${
        isVeg ? "border-green-600" : "border-red-600"
      } bg-white/80 backdrop-blur shadow-sm`}
      title={type}
    >
      <span className={`w-3 h-3 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
    </span>
  );
};

const PizzaCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const isVeg = item.tags.includes("Veg");
  const type = isVeg ? "Veg" : "Non-Veg";

  return (
    <div className="group relative rounded-3xl overflow-hidden bg-background/55 border border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <DietDot type={type} />

      {/* IMAGE (square aspect ratio for pizzas) */}
      <div className="relative">
        <div className="aspect-square w-full overflow-hidden bg-warm-light/20">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        {/* subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* CONTENT */}
      <div className="p-4 text-center">
        <p className="text-lg font-display font-bold text-coffee-rich leading-tight line-clamp-1">
          {item.name}
        </p>

        <p className="mt-1.5 text-xs text-muted-foreground leading-snug line-clamp-2">{item.description}</p>

        <button
          onClick={() =>
            addToCart({
              id: item.id,
              name: item.name,
              price: priceToNumber(item.price),
              image: item.image,
            })
          }
          className="mt-3 inline-flex items-center justify-center px-5 py-2 rounded-full
                     bg-background/70 border border-coffee-rich/20
                     font-semibold text-sm text-coffee-rich shadow-sm
                     hover:bg-coffee-light/15 transition"
        >
          ₹ {priceToNumber(item.price)}
        </button>
      </div>
    </div>
  );
};

export default PizzaCard;
