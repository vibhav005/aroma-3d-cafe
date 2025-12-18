// src/features/menu/MenuSection.tsx

import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import React from "react";

import { menuItems } from "@/features/menu/menuData";
import { categories, type Category } from "@/features/menu/menuTypes";

import { foodImages } from "@/features/menu/menuImages";
import BreakfastCard from "./ui/BreakfastCard";
import FoodCard from "./ui/FoodCard";
import MenuCard from "./ui/MenuCard";
import Pagination from "./ui/pagination";
import PastaCard from "./ui/PastaCard";
import PizzaCard from "./ui/PizzaCard";
import SandwichCroissantSection from "./ui/SandwichCroissantSection";
import SandwichSection from "./ui/SandwichSection";

type SortKey = "popular" | "price-asc" | "price-desc" | "time";

const priceToNumber = (p: string) => {
  const n = parseFloat(p.replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const timeToMinutes = (t: string) => {
  if (!t) return 0;
  if (t.toLowerCase() === "ready") return 0;
  const m = t.match(/(\d+)\s*min/);
  return m ? parseInt(m[1], 10) : 0;
};

const MenuSection: React.FC = () => {
  const [activeCat, setActiveCat] = React.useState<Category | "All">("Breakfast");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("popular");
  const [page, setPage] = React.useState(1);

  const foodSubs = ["Appetizers", "Sandwiches", "Pastas", "Pizzas", "Burgers", "Wraps", "Sandwich Croissant"];

  // NEW FOR FOOD
  const [foodSub, setFoodSub] = React.useState(foodSubs[0]);
  const [vegMode, setVegMode] = React.useState<"All" | "Veg" | "Non-Veg">("All");

  React.useEffect(() => {
    setPage(1);
  }, [activeCat, query, sort, foodSub, vegMode]);

  const filtered = React.useMemo(() => {
    let items = [...menuItems];

    if (activeCat !== "All") {
      items = items.filter((i) => i.category === activeCat);
    }

    // SEARCH
    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (activeCat === "Food") {
      items = items.filter((i) => i.tags.includes(foodSub));

      if (vegMode !== "All") {
        items = items.filter((i) => i.tags.includes(vegMode) || i.variants?.some((v) => v.name === vegMode));
      }
    }
    if (activeCat === "Breakfast" && vegMode !== "All") {
      items = items.filter((i) => i.tags.includes(vegMode));
    }

    // SORTING
    switch (sort) {
      case "popular":
        items.sort((a, b) => b.rating - a.rating);
        break;
      case "price-asc":
        items.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
        break;
      case "price-desc":
        items.sort((a, b) => priceToNumber(b.price) - priceToNumber(a.price));
        break;
      case "time":
        items.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
        break;
    }

    return items;
  }, [activeCat, query, sort, foodSub, vegMode]);
  const pageSize = activeCat === "Food" && foodSub === "Pizzas" ? 8 : 6;

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, pageCount);

  const isBreakfastView = activeCat === "Breakfast";
  const isSandwichView = activeCat === "Food" && foodSub === "Sandwiches";
  const isPastaView = activeCat === "Food" && foodSub === "Pastas";
  const isPizzaView = activeCat === "Food" && foodSub === "Pizzas";
  const sandwichItems = React.useMemo(
    () => filtered.filter((i) => i.tags.includes("Sandwiches")),
    [filtered]
  );

  const isCroissantView = activeCat === "Food" && foodSub === "Sandwich Croissant";
  const croissantItems = React.useMemo(
    () => filtered.filter((i) => i.tags.includes("Sandwich Croissant")),
    [filtered]
  );

  const visibleItems = React.useMemo(() => {
    if (isSandwichView) return filtered;
    return filtered.slice((clampedPage - 1) * pageSize, clampedPage * pageSize);
  }, [filtered, clampedPage, isSandwichView, pageSize]);

  const goToPage = (p: number) => {
    setPage((prev) => {
      const next = Math.min(Math.max(p, 1), pageCount);
      return next === prev ? prev : next;
    });
  };

  const goPrev = () => goToPage(clampedPage - 1);
  const goNext = () => goToPage(clampedPage + 1);

  return (
    <section id="menu" className="py-20 bg-warm-gradient">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-background/30 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-green-300" />
            <span className="text-xs font-medium text-coffee-rich">Fresh • Hand-crafted • Daily</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-coffee-rich mb-3">Our Menu</h2>
        </motion.div>

        {/* Filters bar */}
        <div className="mb-8">
          <div className="rounded-2xl bg-background/60 border border-white/10 shadow-sm p-4">
            <div className="flex flex-col gap-4">
              {/* Search + Sort */}
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <label className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search food, drinks & pastries…"
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-background/70 border border-white/10 text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-cream"
                  />
                </label>

                {/* SORTING */}
                <label className="relative w-full sm:w-auto">
                  <span className="sr-only">Sort by</span>
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    <SlidersHorizontal className="h-4 w-4 text-foreground/60" />
                  </div>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="w-full sm:w-[180px] appearance-none pl-10 pr-8 py-2 rounded-xl bg-background/70 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-cream"
                  >
                    <option value="popular">Popular</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="time">Prep Time</option>
                  </select>
                  <svg
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10 12l-4-4h8l-4 4z" />
                  </svg>
                </label>
              </div>

              {/* Category Buttons */}
              <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
                {categories.map((c) => {
                  const active = c === activeCat;
                  return (
                    <button
                      key={c}
                      onClick={() => setActiveCat(c)}
                      className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        active
                          ? "bg-coffee-medium text-cream shadow-sm"
                          : "bg-card text-foreground hover:bg-coffee-light/20"
                      }`}
                      aria-pressed={active}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              {/* EXTRA UI ONLY WHEN FOOD */}
              {activeCat === "Food" && (
                <div className="flex gap-2 flex-wrap">
                  {foodSubs.map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setFoodSub(sub)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
                        foodSub === sub
                          ? "bg-coffee-medium text-cream"
                          : "bg-card text-foreground hover:bg-coffee-light/20"
                      }`}
                    >
                      {sub}
                    </button>
                  ))}

                  <button
                    onClick={() => setVegMode("Veg")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      vegMode === "Veg" ? "bg-green-600 text-white" : "bg-card hover:bg-green-50"
                    }`}
                  >
                    Veg
                  </button>
                  <button
                    onClick={() => setVegMode("Non-Veg")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      vegMode === "Non-Veg" ? "bg-red-600 text-white" : "bg-card hover:bg-red-50"
                    }`}
                  >
                    Non-Veg
                  </button>
                  <button
                    onClick={() => setVegMode("All")}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                      vegMode === "All" ? "bg-gray-600 text-white" : "bg-card hover:bg-gray-100"
                    }`}
                  >
                    All
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main grid */}
        {!isSandwichView && !isCroissantView && pageCount > 1 && (
          <Pagination
            page={clampedPage}
            pageCount={pageCount}
            onPrev={goPrev}
            onNext={goNext}
            onPage={goToPage}
          />
        )}
        {isPastaView ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {visibleItems.map((item) => (
              <PastaCard key={item.id} item={item} />
            ))}
          </div>
        ) : isSandwichView ? (
          <SandwichSection
            items={sandwichItems}
            vegMode={vegMode}
            vegHero={foodImages.vegCheeseSandwich}
            nonVegHero={foodImages.vegCheeseSandwich}
          />
        ) : isCroissantView ? (
          <SandwichCroissantSection
            items={croissantItems}
            vegMode={vegMode}
            vegHero={foodImages.vegCroissant}
            nonVegHero={foodImages.nonVegCroissant}
          />
        ) : (
          <div
            className={`grid gap-6 ${
              activeCat === "Food"
                ? isPizzaView || isBreakfastView
                  ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4"
                  : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {visibleItems.map((item) =>
              activeCat === "Food" ? (
                isPizzaView ? (
                  <PizzaCard key={item.id} item={item} />
                ) : isBreakfastView ? (
                  <BreakfastCard key={item.id} item={item} />
                ) : (
                  <FoodCard key={item.id} item={item} />
                )
              ) : (
                <MenuCard key={item.id} item={item} />
              )
            )}
          </div>
        )}

        {/* PAGINATION */}
        {/* {pageCount > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button onClick={goPrev}>Prev</button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => goToPage(p)}>
                {p}
              </button>
            ))}
            <button onClick={goNext}>Next</button>
          </div>
        )} */}
      </div>
    </section>
  );
};

export default MenuSection;
