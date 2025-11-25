// src/features/menu/MenuSection.tsx
import React from "react";
import { motion } from "framer-motion";
import { Star, Clock, Leaf, Search, SlidersHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { addToCart } from "@/lib/cartBus";

import {
  categories,
  type Category,
  type MenuItem,
} from "@/features/menu/menuTypes";
import { menuItems } from "@/features/menu/menuData";
import MenuCard from "./ui/MenuCard";

type SortKey = "popular" | "price-asc" | "price-desc" | "time";

const PAGE_SIZE = 6;

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
  const [activeCat, setActiveCat] = React.useState<Category | "All">("All");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("popular");
  const [page, setPage] = React.useState(1);

  // Reset to page 1 whenever filters change
  React.useEffect(() => {
    setPage(1);
  }, [activeCat, query, sort]);

  const filtered = React.useMemo(() => {
    let items = [...menuItems];

    if (activeCat !== "All") {
      items = items.filter((i) => i.category === activeCat);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      items = items.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

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
  }, [activeCat, query, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount);

  const visibleItems = React.useMemo(
    () =>
      filtered.slice((clampedPage - 1) * PAGE_SIZE, clampedPage * PAGE_SIZE),
    [filtered, clampedPage]
  );

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
            <span className="text-xs font-medium text-coffee-rich">
              Fresh • Hand-crafted • Daily
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-coffee-rich mb-3">
            Our Menu
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Carefully crafted beverages and artisanal treats made with love and
            premium ingredients
          </p>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="sticky top-20 z-10 mb-8"
        >
          <div className="mb-8">
            <div className="rounded-2xl bg-background/60 border border-white/10 shadow-sm p-4">
              <div className="flex flex-col gap-4">
                {/* Row 1: Search + Sort (full width) */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <label className="relative flex-1 min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Search drinks & pastries…"
                      className="w-full pl-10 pr-3 py-2 rounded-xl bg-background/70 border border-white/10 text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-cream"
                      aria-label="Search menu"
                    />
                  </label>

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
                      aria-hidden="true"
                    >
                      <path d="M10 12l-4-4h8l-4 4z" />
                    </svg>
                  </label>
                </div>

                {/* Row 2: Category chips (independent, scrollable) */}
                <div
                  className="flex gap-2 overflow-x-auto -mx-1 px-1"
                  style={{
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
                    maskImage:
                      "linear-gradient(to right, transparent 0, black 16px, black calc(100% - 16px), transparent 100%)",
                  }}
                >
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
              </div>
            </div>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {visibleItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.35 }}
            >
              <MemoMenuCard item={item} />
            </motion.div>
          ))}
        </div>

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="mt-10 flex items-center justify-center gap-3">
            <button
              onClick={goPrev}
              disabled={clampedPage === 1}
              className={`px-3 py-2 rounded-full text-sm font-medium border ${
                clampedPage === 1
                  ? "border-transparent text-muted-foreground/50 cursor-default"
                  : "border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream transition-colors"
              }`}
            >
              Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition-colors ${
                    p === clampedPage
                      ? "bg-coffee-medium text-cream"
                      : "bg-background/40 text-coffee-medium hover:bg-coffee-light/30"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={goNext}
              disabled={clampedPage === pageCount}
              className={`px-3 py-2 rounded-full text-sm font-medium border ${
                clampedPage === pageCount
                  ? "border-transparent text-muted-foreground/50 cursor-default"
                  : "border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream transition-colors"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const MemoMenuCard = React.memo(MenuCard);

export default MenuSection;
