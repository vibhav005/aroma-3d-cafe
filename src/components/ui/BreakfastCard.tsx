import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
import { Clock, Star } from "lucide-react";
import React from "react";

const priceToNumber = (p: string) => {
  const n = parseFloat(p.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const DietBadge: React.FC<{ type: "Veg" | "Non-Veg" }> = ({ type }) => {
  const isVeg = type === "Veg";
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border shadow-sm ${
        isVeg
          ? "bg-green-500/10 text-green-700 border-green-600/30"
          : "bg-red-500/10 text-red-700 border-red-600/30"
      }`}
      title={type}
    >
      <span
        className={`inline-flex items-center justify-center w-5 h-5 rounded-[6px] border bg-white/70 ${
          isVeg ? "border-green-600" : "border-red-600"
        }`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
      </span>
      {type}
    </span>
  );
};

const BreakfastCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const isVeg = item.tags.includes("Veg");
  const isNonVeg = item.tags.includes("Non-Veg");
  const type: "Veg" | "Non-Veg" = isVeg ? "Veg" : "Non-Veg";

  return (
    <div className="group rounded-3xl overflow-hidden bg-background/55 border border-white/10 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>

        {/* soft overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />

        {/* top-right mini diet mark (subtle) */}
        {(isVeg || isNonVeg) && (
          <div className="absolute top-3 right-3">
            <span
              className={`inline-flex items-center justify-center w-6 h-6 rounded-[6px] border bg-white/80 backdrop-blur shadow-sm ${
                type === "Veg" ? "border-green-600" : "border-red-600"
              }`}
              title={type}
            >
              <span className={`w-3 h-3 rounded-full ${type === "Veg" ? "bg-green-600" : "bg-red-600"}`} />
            </span>
          </div>
        )}

        {/* rating pill (optional, keeps theme) */}
        <div className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/30 text-white text-xs backdrop-blur">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{item.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xl font-display font-extrabold text-coffee-rich leading-tight line-clamp-1">
              {item.name}
            </p>
            {item.subtitle && (
              <p className="mt-1 text-sm font-semibold text-coffee-dark line-clamp-1">{item.subtitle}</p>
            )}
          </div>

          <span className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-4 h-4" />
            {item.time}
          </span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground leading-snug line-clamp-2">{item.description}</p>

        <div className="mt-4 flex items-center justify-between gap-3">
          {(isVeg || isNonVeg) && <DietBadge type={type} />}

          <button
            onClick={() =>
              addToCart({
                id: item.id,
                name: item.name,
                price: priceToNumber(item.price),
                image: item.image,
              })
            }
            className="ml-auto inline-flex items-center justify-center px-6 py-2 rounded-full
                       bg-background/70 border border-coffee-rich/20
                       font-bold text-coffee-rich shadow-sm
                       hover:bg-coffee-light/15 transition"
          >
            ₹ {priceToNumber(item.price)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakfastCard;
