import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
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
        className={`inline-flex items-center justify-center w-5 h-5 rounded-[4px] border ${
          isVeg ? "border-green-600" : "border-red-600"
        } bg-white/70`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
      </span>
      <span className="text-sm text-coffee-rich">{type}</span>
    </span>
  );
};

const PricePill: React.FC<{ price: string; onClick: () => void }> = ({ price, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-2 rounded-full border border-coffee-rich/25 bg-background/60 hover:bg-coffee-light/15
                 font-bold text-coffee-rich shadow-sm transition"
    >
      ₹ {priceToNumber(price)}
    </button>
  );
};

const PastaCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const veg = item.variants?.find((v) => v.name === "Veg");
  const nonVeg = item.variants?.find((v) => v.name === "Non-Veg");

  const add = (label: "Veg" | "Non-Veg", price: string) => {
    addToCart({
      id: item.id,
      name: `${item.name} (${label})`,
      price: priceToNumber(price),
      image: item.image,
    });
  };

  return (
    <div className="w-full max-w-[360px]">
      {/* Title like screenshot */}
      <div className="rounded-[28px] border border-coffee-rich/30 bg-background/40 shadow-md overflow-hidden p-5">
        <div className="rounded-3xl bg-background/40 border border-white/10 p-4">
          <div className="rounded-3xl overflow-hidden">
            <img src={item.image} alt={item.name} className="w-full h-[260px] object-cover" />
          </div>
        </div>

        <div className="text-center mt-5">
          <p className="text-4xl font-display font-extrabold text-coffee-rich leading-tight">
            {item.name.split(" ").slice(0, 1).join(" ")}
            <br />
            {item.name.split(" ").slice(1).join(" ")}
          </p>

          {item.subtitle && <p className="mt-3 font-semibold text-coffee-rich">{item.subtitle}</p>}

          <p className="mt-1 text-sm text-muted-foreground italic">{item.description}</p>

          <div className="mt-5 flex items-center justify-center gap-10">
            <DietMark type="Veg" />
            <DietMark type="Non-Veg" />
          </div>

          <div className="mt-4 flex items-center justify-center gap-10">
            <PricePill
              price={veg?.price || item.price}
              onClick={() => add("Veg", veg?.price || item.price)}
            />
            <PricePill
              price={nonVeg?.price || item.price}
              onClick={() => add("Non-Veg", nonVeg?.price || item.price)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastaCard;
