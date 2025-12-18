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
      <span className="text-sm font-medium text-coffee-rich">{type}</span>
    </span>
  );
};

const ListRow: React.FC<{ item: MenuItem }> = ({ item }) => (
  <div className="flex items-start justify-between gap-4">
    <div className="min-w-0">
      <p className="text-lg font-semibold text-coffee-rich leading-snug">{item.name}</p>
      <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{item.description}</p>
    </div>

    <div className="shrink-0 flex items-center gap-3">
      <p className="text-lg font-bold text-coffee-rich">₹{priceToNumber(item.price)}</p>
      <button
        onClick={() =>
          addToCart({
            id: item.id,
            name: item.name,
            price: priceToNumber(item.price),
            image: item.image,
          })
        }
        className="px-4 py-2 rounded-full bg-coffee-medium text-cream font-semibold hover:bg-coffee-rich transition"
      >
        Add
      </button>
    </div>
  </div>
);

const SandwichCroissantSection: React.FC<{
  items: MenuItem[];
  vegMode: "All" | "Veg" | "Non-Veg";
  vegHero: string;
  nonVegHero: string;
}> = ({ items, vegMode, vegHero, nonVegHero }) => {
  const vegItems = items.filter((i) => i.tags.includes("Veg"));
  const nonVegItems = items.filter((i) => i.tags.includes("Non-Veg"));

  return (
    <div className="space-y-14">
      {/* Title (once) */}
      <div className="flex items-center justify-between">
        <h3 className="text-4xl md:text-5xl font-display font-bold text-coffee-rich">Sandwich Croissant</h3>
        {(vegMode === "All" || vegMode === "Veg") && <DietMark type="Veg" />}
      </div>

      {/* VEG BLOCK: image left, list right */}
      {(vegMode === "All" || vegMode === "Veg") && vegItems.length > 0 && (
        <div className="grid md:grid-cols-[320px_1fr] gap-8 items-center">
          <div className="flex justify-center md:justify-start">
            <div className="w-[260px] h-[260px] rounded-full overflow-hidden shadow-md border border-white/10 bg-background/40">
              <img src={vegHero} alt="Veg croissant" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="rounded-3xl bg-background/40 border border-white/10 shadow-sm p-6 md:p-7">
            <div className="mb-4">
              <DietMark type="Veg" />
            </div>
            <div className="space-y-5">
              {vegItems.map((it) => (
                <ListRow key={it.id} item={it} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* NON-VEG LABEL */}
      {(vegMode === "All" || vegMode === "Non-Veg") && (
        <div className="flex items-center gap-3">
          <p className="text-xl font-semibold text-coffee-rich">Non Veg</p>
          <DietMark type="Non-Veg" />
        </div>
      )}

      {/* NON-VEG BLOCK: list left, image right */}
      {(vegMode === "All" || vegMode === "Non-Veg") && nonVegItems.length > 0 && (
        <div className="grid md:grid-cols-[1fr_320px] gap-8 items-center">
          <div className="rounded-3xl bg-background/40 border border-white/10 shadow-sm p-6 md:p-7 order-2 md:order-1">
            <div className="space-y-5">
              {nonVegItems.map((it) => (
                <ListRow key={it.id} item={it} />
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <div className="w-[260px] h-[260px] rounded-full overflow-hidden shadow-md border border-white/10 bg-background/40">
              <img src={nonVegHero} alt="Non-veg croissant" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SandwichCroissantSection;
