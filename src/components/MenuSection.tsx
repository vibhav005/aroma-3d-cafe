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
  const [activeCat, setActiveCat] = React.useState<Category | "All">("All");
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("popular");

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
          <div className="rounded-2xl bg-background/30 backdrop-blur-xl border border-white/10 ring-1 ring-white/10 shadow-soft p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Category chips */}
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
                      className={`shrink-0 px-4 py-2 rounded-full font-medium transition-all ${
                        active
                          ? "bg-coffee-medium text-cream shadow-warm"
                          : "bg-card text-foreground hover:bg-coffee-light/20 hover:shadow-soft"
                      }`}
                      aria-pressed={active}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>

              {/* Search + Sort */}
              <div className="flex flex-col sm:flex-row gap-3">
                <label className="relative flex-1 min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/60" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search drinks & pastries…"
                    className="w-full pl-10 pr-3 py-2 rounded-xl bg-background/40 border border-white/10 text-foreground placeholder:text-foreground/60 focus:outline-none focus:ring-2 focus:ring-cream"
                    aria-label="Search menu"
                  />
                </label>

                <label className="relative">
                  <span className="sr-only">Sort by</span>
                  <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
                    <SlidersHorizontal className="h-4 w-4 text-foreground/60" />
                  </div>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as SortKey)}
                    className="appearance-none pl-10 pr-8 py-2 rounded-xl bg-background/40 border border-white/10 text-foreground focus:outline-none focus:ring-2 focus:ring-cream"
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
            </div>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </div>

        {/* View Full Menu Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-soft hover:shadow-warm"
          >
            View Full Menu
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

/* ------- Card ------- */
const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <Card className="group hover:shadow-warm transition-all duration-500 overflow-hidden border border-white/10 bg-card/80 backdrop-blur-sm rounded-2xl">
      <div className="relative overflow-hidden">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-background/40 to-background/20" />
        )}
        <img
          src={item.image}
          alt={item.name}
          className={`w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          decoding="async"
        />

        {/* Rating */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
          <div className="flex items-center gap-1 text-sm">
            <Star
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">{item.rating}</span>
          </div>
        </div>

        {/* Price */}
        <div className="absolute top-4 right-4 rounded-full bg-coffee-medium text-cream px-3 py-1.5 text-sm font-semibold shadow-soft">
          {item.price}
        </div>

        {/* Tags */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <Badge
              key={tag}
              className="bg-coffee-medium/90 text-cream text-xs border-0"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Corner gradient on hover */}
        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-tr from-black/0 via-black/0 to-black/20" />
        </div>
      </div>

      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-coffee-rich group-hover:text-coffee-medium transition-colors duration-300">
            {item.name}
          </h3>
          <span className="text-xs font-medium bg-background/40 border border-white/10 text-foreground px-2.5 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        <p className="text-muted-foreground mb-4 leading-relaxed">
          {item.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{item.time}</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf className="h-4 w-4 text-sage" aria-hidden="true" />
              <span>Fresh</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-coffee-medium hover:bg-coffee-rich text-cream px-4 py-2 rounded-full font-medium transition-colors duration-300"
            aria-label={`Add ${item.name} to order`}
            onClick={() =>
              addToCart({
                id: item.id,
                name: item.name,
                price: priceToNumber(item.price),
                image: item.image,
              })
            }
          >
            Add to Order
          </motion.button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MenuSection;
