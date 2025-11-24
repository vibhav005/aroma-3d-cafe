import { MenuItem } from "@/features/menu/menuTypes";
import React from "react";
import { Card, CardContent } from "./card";
import { Clock, Leaf, Star } from "lucide-react";
import { Badge } from "./badge";
import { motion } from "framer-motion";
import { addToCart } from "@/lib/cartBus";

/* ------- Card (polished visuals, skeleton image, chips) ------- */
const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [loaded, setLoaded] = React.useState(false);
  const priceToNumber = (p: string) => {
    const n = parseFloat(p.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };
  return (
    <Card className="group hover:shadow-warm transition-all duration-500 overflow-hidden border border-white/10 bg-card/80 backdrop-blur-sm rounded-2xl">
      <div className="relative overflow-hidden">
        {/* Image + skeleton */}
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

        {/* Top-left: Rating */}
        <div className="absolute top-4 left-4 bg-card/90 backdrop-blur-sm rounded-full px-2.5 py-1 border border-white/10">
          <div className="flex items-center gap-1 text-sm">
            <Star
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">{item.rating}</span>
          </div>
        </div>

        {/* Top-right: Price chip */}
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
          {/* Category pill (light) */}
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

export default MenuCard;
