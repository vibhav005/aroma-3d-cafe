import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
import { Clock, Star } from "lucide-react";
import React from "react";

const DietMark: React.FC<{ type: "Veg" | "Non-Veg" }> = ({ type }) => {
  const isVeg = type === "Veg";
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-[4px] border ${
        isVeg ? "border-green-600" : "border-red-600"
      } bg-white/80 backdrop-blur`}
      title={type}
    >
      <span className={`w-2.5 h-2.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
    </span>
  );
};

const priceToNumber = (p: string) => {
  const n = parseFloat(p.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const FoodCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const isVeg = item.tags.includes("Veg");
  const isNonVeg = item.tags.includes("Non-Veg");

  return (
    <div className="group rounded-2xl overflow-hidden bg-background/55 border border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 flex items-center gap-2">
          {isVeg && <DietMark type="Veg" />}
          {isNonVeg && <DietMark type="Non-Veg" />}
        </div>

        <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/35 text-white text-xs">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{item.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[15px] font-semibold text-coffee-rich leading-tight line-clamp-1">
              {item.name}
            </p>
            {item.subtitle && (
              <p className="text-xs text-coffee-dark font-medium line-clamp-1">{item.subtitle}</p>
            )}
          </div>

          <p className="shrink-0 text-sm font-bold text-coffee-rich">₹{priceToNumber(item.price)}</p>
        </div>

        <p className="mt-2 text-xs text-muted-foreground leading-snug line-clamp-2">{item.description}</p>

        <div className="mt-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" /> {item.time}
          </span>

          <button
            onClick={() =>
              addToCart({
                id: item.id,
                name: item.name,
                price: priceToNumber(item.price),
                image: item.image,
              })
            }
            className="px-4 py-2 rounded-full bg-coffee-medium text-cream text-sm font-semibold hover:bg-coffee-rich transition"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
