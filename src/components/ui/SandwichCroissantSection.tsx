import type { MenuItem } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
import { motion } from "framer-motion";
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
        } bg-white/70 backdrop-blur`}
      >
        <span className={`w-2.5 h-2.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`} />
      </span>
      <span className="text-sm font-medium text-coffee-rich">{type}</span>
    </span>
  );
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const ListRow: React.FC<{ item: MenuItem; index: number }> = ({ item, index }) => (
  <motion.div
    variants={fadeUp}
    transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.05 }}
    whileHover={{ x: 2 }}
    className="rounded-2xl p-3 -m-3 hover:bg-white/10 transition-colors"
  >
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-lg font-semibold text-coffee-rich leading-snug">{item.name}</p>
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">{item.description}</p>
      </div>

      <div className="shrink-0 flex items-center gap-3">
        <p className="text-lg font-bold text-coffee-rich">₹{priceToNumber(item.price)}</p>

        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ y: -1 }}
          onClick={() =>
            addToCart({
              id: item.id,
              name: item.name,
              price: priceToNumber(item.price),
              image: item.image,
            })
          }
          className="px-4 py-2 rounded-full bg-coffee-medium text-cream font-semibold hover:bg-coffee-rich transition shadow-sm"
        >
          Add
        </motion.button>
      </div>
    </div>
  </motion.div>
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
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeUp}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="flex items-center justify-between"
      >
        <h3 className="text-4xl md:text-5xl font-display font-bold text-coffee-rich">Sandwich Croissant</h3>
        {(vegMode === "All" || vegMode === "Veg") && <DietMark type="Veg" />}
      </motion.div>

      {/* VEG BLOCK: image left, list right */}
      {(vegMode === "All" || vegMode === "Veg") && vegItems.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid md:grid-cols-[320px_1fr] gap-8 items-center"
        >
          <div className="flex justify-center md:justify-start">
            <motion.div
              whileHover={{ scale: 1.02, rotate: -0.5 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-[260px] h-[260px] rounded-full overflow-hidden shadow-md border border-white/10 bg-background/40"
            >
              {/* subtle glow */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-coffee-light/20 blur-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              <img src={vegHero} alt="Veg croissant" className="w-full h-full object-cover" />
            </motion.div>
          </div>

          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative rounded-3xl bg-background/40 backdrop-blur border border-white/10 shadow-sm p-6 md:p-7 overflow-hidden"
          >
            {/* glass blobs */}
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute -top-20 -left-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-coffee-light/15 blur-2xl" />
            </div>

            <div className="relative mb-4">
              <DietMark type="Veg" />
            </div>

            <motion.div
              className="relative space-y-2"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {vegItems.map((it, idx) => (
                <ListRow key={it.id} item={it} index={idx} />
              ))}
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* NON-VEG LABEL */}
      {(vegMode === "All" || vegMode === "Non-Veg") && (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-center gap-3"
        >
          <p className="text-xl font-semibold text-coffee-rich">Non Veg</p>
          <DietMark type="Non-Veg" />
        </motion.div>
      )}

      {/* NON-VEG BLOCK: list left, image right */}
      {(vegMode === "All" || vegMode === "Non-Veg") && nonVegItems.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="grid md:grid-cols-[1fr_320px] gap-8 items-center"
        >
          <motion.div
            whileHover={{ y: -2 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="relative rounded-3xl bg-background/40 backdrop-blur border border-white/10 shadow-sm p-6 md:p-7 order-2 md:order-1 overflow-hidden"
          >
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute -top-20 -left-24 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-coffee-light/15 blur-2xl" />
            </div>

            <motion.div
              className="relative space-y-2"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.2 }}
            >
              {nonVegItems.map((it, idx) => (
                <ListRow key={it.id} item={it} index={idx} />
              ))}
            </motion.div>
          </motion.div>

          <div className="flex justify-center md:justify-end order-1 md:order-2">
            <motion.div
              whileHover={{ scale: 1.02, rotate: 0.5 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="relative w-[260px] h-[260px] rounded-full overflow-hidden shadow-md border border-white/10 bg-background/40"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-2xl" />
                <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-coffee-light/20 blur-2xl" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
              </div>

              <img src={nonVegHero} alt="Non-veg croissant" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SandwichCroissantSection;
