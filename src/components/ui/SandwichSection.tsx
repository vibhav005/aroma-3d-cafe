import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
import { motion } from "framer-motion";
import React from "react";

const DietMark: React.FC<{ type: "Veg" | "Non-Veg" }> = ({ type }) => {
  const isVeg = type === "Veg";
  return (
    <span
      className={`inline-flex items-center justify-center w-5 h-5 rounded-[4px] border ${
        isVeg ? "border-green-600" : "border-red-600"
      } bg-white/70 backdrop-blur`}
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

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const listStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const rowAnim = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const SectionBlock: React.FC<{
  title: string;
  marker: "Veg" | "Non-Veg";
  heroImage: string;
  items: MenuItem[];
}> = ({ title, marker, heroImage, items }) => {
  if (!items.length) return null;

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-3xl bg-background/50 backdrop-blur border border-white/10 shadow-sm overflow-hidden"
    >
      <div className="grid md:grid-cols-[360px_1fr]">
        {/* Left hero */}
        <div className="p-6 md:p-7">
          <div className="flex items-center gap-3 mb-4">
            <DietMark type={marker} />
            <h3 className="text-2xl font-display font-bold text-coffee-rich">{title}</h3>
          </div>

          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative rounded-3xl overflow-hidden shadow-md border border-white/10 bg-background/30"
          >
            {/* glow + overlay */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-14 -left-14 h-44 w-44 rounded-full bg-white/20 blur-2xl" />
              <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-coffee-light/20 blur-2xl" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
            </div>

            <img src={heroImage} alt={title} className="w-full h-[240px] object-cover" loading="lazy" />
          </motion.div>
        </div>

        {/* Right list */}
        <div className="p-6 md:p-7">
          <motion.div
            variants={listStagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="space-y-3"
          >
            {items.map((it) => (
              <motion.div
                key={it.id}
                variants={rowAnim}
                whileHover={{ x: 2 }}
                className="rounded-2xl p-3 -m-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-coffee-rich leading-snug">{it.name}</p>
                    <p className="text-sm text-muted-foreground leading-snug line-clamp-2">
                      {it.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <p className="text-lg font-bold text-coffee-rich">₹{priceToNumber(it.price)}</p>

                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      whileHover={{ y: -1 }}
                      onClick={() =>
                        addToCart({
                          id: it.id,
                          name: it.name,
                          price: priceToNumber(it.price),
                          image: it.image,
                        })
                      }
                      className="px-4 py-2 rounded-full bg-coffee-medium text-cream font-semibold hover:bg-coffee-rich transition shadow-sm"
                    >
                      Add
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
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
