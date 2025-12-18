import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
import React from "react";

const DietMark: React.FC<{ type: "Veg" | "Non-Veg" }> = ({ type }) => {
  const isVeg = type === "Veg";
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-[4px] border ${
        isVeg ? "border-green-600" : "border-red-600"
      } bg-white/70`}
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

const SectionBlock: React.FC<{
  title: string;
  marker: "Veg" | "Non-Veg";
  heroImage: string;
  items: MenuItem[];
}> = ({ title, marker, heroImage, items }) => {
  if (!items.length) return null;

  return (
    <div className="rounded-3xl bg-background/50 border border-white/10 shadow-sm overflow-hidden">
      <div className="grid md:grid-cols-[360px_1fr]">
        {/* Left hero */}
        <div className="p-6 md:p-7">
          <div className="flex items-center gap-3 mb-4">
            <DietMark type={marker} />
            <h3 className="text-2xl font-display font-bold text-coffee-rich">{title}</h3>
          </div>

          <div className="relative rounded-3xl overflow-hidden shadow-md">
            <img src={heroImage} alt={title} className="w-full h-[240px] object-cover" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
          </div>
        </div>

        {/* Right list */}
        <div className="p-6 md:p-7">
          <div className="space-y-5">
            {items.map((it) => (
              <div key={it.id} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-lg font-semibold text-coffee-rich leading-snug">{it.name}</p>
                  <p className="text-sm text-muted-foreground leading-snug line-clamp-2">{it.description}</p>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <p className="text-lg font-bold text-coffee-rich">₹{priceToNumber(it.price)}</p>
                  <button
                    onClick={() =>
                      addToCart({
                        id: it.id,
                        name: it.name,
                        price: priceToNumber(it.price),
                        image: it.image,
                      })
                    }
                    className="px-4 py-2 rounded-full bg-coffee-medium text-cream font-semibold hover:bg-coffee-rich transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SandwichSection: React.FC<{
  items: MenuItem[];
  vegMode: "All" | "Veg" | "Non-Veg";
  vegHero: string;
  nonVegHero: string;
}> = ({ items, vegMode, vegHero, nonVegHero }) => {
  const vegItems = items.filter((i) => i.tags.includes("Veg"));
  const nonVegItems = items.filter((i) => i.tags.includes("Non-Veg"));

  return (
    <div className="space-y-8">
      {(vegMode === "All" || vegMode === "Veg") && (
        <SectionBlock title="Sandwich" marker="Veg" heroImage={vegHero} items={vegItems} />
      )}
      {(vegMode === "All" || vegMode === "Non-Veg") && (
        <SectionBlock title="Sandwich" marker="Non-Veg" heroImage={nonVegHero} items={nonVegItems} />
      )}
    </div>
  );
};

export default SandwichSection;
