import { MenuItem } from "@/features/menu/menuTypes";
import React from "react";
import { Card, CardContent } from "./card";
import { Clock, Leaf, Star } from "lucide-react";
import { Badge } from "./badge";
import { motion } from "framer-motion";
import { addToCart } from "@/lib/cartBus";

/* ------- Card (with fit + transparent text area) ------- */
const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [loaded, setLoaded] = React.useState(false);
  const priceToNumber = (p: string) => {
    const n = parseFloat(p.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  };
  // Use contain for tall glass images (shakes), cover for normal ones
  const isContain = item.fit === "Contain";

  const handleAddToCart = React.useCallback(() => {
    addToCart({
      id: item.id,
      name: item.name,
      price: priceToNumber(item.price),
      image: item.image,
    });
  }, [item.id, item.name, item.price, item.image]);

  return (
    <Card className="group transition-all duration-300 overflow-hidden border border-white/10 bg-background/40 rounded-2xl hover:shadow-lg hover:-translate-y-1">
      <div className="relative overflow-hidden bg-gradient-to-b from-background/40 to-background/10">
        {/* Skeleton while image loads */}
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-background/40 to-background/20" />
        )}

        <img
          src={item.image}
          alt={item.name}
          className={`w-full ${
            isContain ? "h-81 object-contain" : "h-52 object-cover"
          } transition-transform duration-500 group-hover:scale-105 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          decoding="async"
        />

        {/* Rating pill */}
        <div className="absolute top-4 left-4 bg-card/90 rounded-full px-2.5 py-1 border border-white/10">
          <div className="flex items-center gap-1 text-sm">
            <Star
              className="h-4 w-4 fill-yellow-400 text-yellow-400"
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">{item.rating}</span>
          </div>
        </div>

        {/* Price pill */}
        <div className="absolute top-4 right-4 rounded-full bg-coffee-medium text-cream px-3 py-1.5 text-sm font-semibold shadow-sm">
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
      </div>

      {/* Transparent-ish text area */}
      <CardContent className="p-6 bg-transparent border-t border-white/10">
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

          <button
            className="bg-coffee-medium hover:bg-coffee-rich text-cream px-4 py-2 rounded-full font-medium transition-colors duration-300"
            aria-label={`Add ${item.name} to order`}
            onClick={handleAddToCart}
          >
            Add to Order
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

// Keep memoization to avoid unnecessary re-renders
const MemoMenuCard = React.memo(MenuCard);

export default MenuCard;
