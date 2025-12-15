// src/features/menu/ui/FoodCard.tsx
import { addToCart } from "@/lib/cartBus";
import { Star } from "lucide-react";
import React from "react";

const FoodCard: React.FC<{ item: any }> = ({ item }) => {
  return (
    <div
      className="
      group relative rounded-1xl bg-card/70 border border-white/10 shadow-md
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300
      p-3 flex flex-col justify-between"
    >
      {/* Veg / Non-Veg Icon */}
      {item.tags.includes("Veg") && (
        <img
          src="public/veg.svg"
          alt="Veg"
          className="absolute top-2 left-2 w-5 h-5 bg-white/80 backdrop-blur rounded p-0.5 shadow z-20"
        />
      )}
      {item.tags.includes("Non-Veg") && (
        <img
          src="public/non-veg.svg"
          alt="Non-Veg"
          className="absolute top-2 left-2 w-5 h-5 bg-white/80 backdrop-blur rounded p-0.5 shadow z-20"
        />
      )}

      {/* Image */}
      <div className="relative h-28 w-full rounded overflow-hidden mb-3 z-10">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Name + Rating */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-[15px] font-semibold text-coffee-rich leading-tight">{item.name}</h3>

        {/* Rating */}
        <div className="flex items-center text-[12px] gap-1 px-2 py-0.5 rounded-full bg-black/20 text-yellow-400">
          <Star className="w-3 h-3 fill-yellow-400" />
          <span className="text-white font-medium">{item.rating}</span>
        </div>
      </div>

      {/* Subtitle & Description */}
      <p className="text-[12px] text-coffee-dark font-semibold leading-tight">{item.subtitle}</p>
      <p className="text-[11px] text-muted-foreground mb-3 leading-snug line-clamp-2">{item.description}</p>

      {/* Price Button */}
      <button
        onClick={() =>
          addToCart({
            id: item.id,
            name: item.name,
            price: Number(item.price),
            image: item.image,
          })
        }
        className="
        mt-auto text-center bg-coffee-medium text-cream
        px-4 py-1.5 rounded-full font-bold text-[13px]
        hover:bg-coffee-rich transition
        "
      >
        ₹{item.price}
      </button>
    </div>
  );
};

export default FoodCard;
