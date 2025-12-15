import Portal from "@/components/Portal";
import { AddOns, MenuItem, MenuVariant } from "@/features/menu/menuTypes";
import { addToCart } from "@/lib/cartBus";
import { ChevronDown, Clock, Leaf, Star } from "lucide-react";
import React from "react";
import { Card, CardContent } from "./card";

const POPOVER_WIDTH = 260;

const MenuCard: React.FC<{ item: MenuItem }> = ({ item }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [selectedVariant, setSelectedVariant] = React.useState<MenuVariant | null>(null);
  const [selectedAddOns, setSelectedAddOns] = React.useState<AddOns[]>([]);
  const [open, setOpen] = React.useState(false);
  const [openUp, setOpenUp] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [popoverPos, setPopoverPos] = React.useState({ top: 0, left: 0 });

  const priceToNumber = (p: string) => Number(parseFloat(p.replace(/[^0-9.]/g, "")) || 0);

  const computeTotal = () => {
    const base = selectedVariant !== null ? priceToNumber(selectedVariant.price) : priceToNumber(item.price);

    const addOnsTotal = selectedAddOns.reduce((sum, add) => sum + priceToNumber(add.price), 0);

    return base + addOnsTotal;
  };

  const buildCartName = () => {
    const base = selectedVariant ? `${item.name} - ${selectedVariant.name}` : item.name;
    const extras = selectedAddOns.length ? ` + ${selectedAddOns.map((a) => a.name).join(", ")}` : "";
    return base + extras;
  };

  const handleAddToCart = () => {
    addToCart({
      id: item.id,
      name: buildCartName(),
      price: computeTotal(),
      image: item.image,
    });

    setOpen(false);
  };

  const togglePopover = () => {
    if (!open) {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        setPopoverPos({ top: rect.top, left: rect.left + rect.width / 2 });
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setOpenUp(spaceAbove > spaceBelow);
      }
      setOpen(true);
    } else {
      setOpen(false);
    }
  };

  const toggleAddOn = (addon: AddOns) => {
    setSelectedAddOns((prev) =>
      prev.some((a) => a.name === addon.name) ? prev.filter((a) => a.name !== addon.name) : [...prev, addon]
    );
  };

  return (
    <Card className="group transition-all duration-300 overflow-hidden border border-white/10 bg-background/40 rounded-2xl hover:-translate-y-1 hover:shadow-xl">
      {/* ---------- IMAGE ---------- */}
      <div className="relative overflow-hidden">
        {!loaded && <div className="absolute inset-0 animate-pulse bg-background/30" />}

        <img
          src={item.image}
          alt={item.name}
          onLoad={() => setLoaded(true)}
          className={`w-full ${item.fit === "Contain" ? "h-81 object-contain" : "h-52 object-cover"}
          transition-transform duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
        />

        <div className="absolute top-4 left-4 bg-black/30 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1 text-white text-sm flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {item.rating}
        </div>

        <div className="absolute top-4 right-4 bg-coffee-medium text-cream px-3 py-1.5 rounded-full font-semibold">
          ₹{computeTotal().toFixed(2)}
        </div>
      </div>

      <CardContent className="p-6">
        {/* ---------- NAME + SELECT ---------- */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl font-semibold text-coffee-rich">{item.name}</h3>

            {item.variants && (
              <button
                ref={buttonRef}
                onClick={togglePopover}
                className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-background/60 border border-white/10 hover:bg-background/80 transition"
              >
                {selectedVariant?.name || "Flavour"}
                <ChevronDown className="h-3 w-3" />
              </button>
            )}
          </div>

          <span className="text-xs bg-background/50 border border-white/10 px-2.5 py-1 rounded-full">
            {item.category}
          </span>
        </div>

        <p className="text-muted-foreground mb-4">{item.description}</p>
        {/* ---------- POPOVER ---------- */}
        {open && item.variants && (
          <Portal>
            <>
              <div
                className="fixed inset-0 z-[90] bg-black/40 backdrop-blur-sm animate-fadeBg"
                onClick={() => setOpen(false)}
              />

              <div
                className="fixed z-[100] bg-card/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl px-4 py-4 animate-springIn"
                style={{
                  width: POPOVER_WIDTH,
                  left: popoverPos.left,
                  transform: "translateX(-50%)",
                  bottom: openUp ? window.innerHeight - popoverPos.top + 16 : undefined,
                  top: openUp ? undefined : popoverPos.top + 40,
                }}
              >
                {/* ---------- SCROLLABLE SECTION ---------- */}
                <div
                  className="flex flex-col gap-3 overflow-y-auto pr-1"
                  style={{
                    maxHeight: window.innerWidth > 640 ? "260px" : "200px",
                  }}
                >
                  <p className="text-xs text-muted-foreground mt-1 mb-1">Select Flavour</p>

                  {/* ---------- VARIANTS ---------- */}
                  {item.variants.map((v) => (
                    <button
                      key={v.name}
                      onClick={() => setSelectedVariant(v)}
                      className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm border transition ${
                        selectedVariant?.name === v.name
                          ? "bg-coffee-medium text-cream border-coffee-medium"
                          : "bg-background/40 border-white/10 text-foreground hover:bg-background/60"
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="ml-auto text-xs opacity-70">{v.price}</span>
                    </button>
                  ))}

                  {/* ---------- ADD-ONS ---------- */}
                  {item.addOns && (
                    <>
                      <p className="text-xs text-muted-foreground mt-3 mb-1">Add-ons (optional)</p>
                      {item.addOns.map((a) => {
                        const active = selectedAddOns.some((s) => s.name === a.name);
                        return (
                          <button
                            key={a.name}
                            onClick={() => toggleAddOn(a)}
                            className={`flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm border transition ${
                              active
                                ? "bg-purple-600/30 border-purple-700"
                                : "bg-background/40 border-white/10 text-foreground hover:bg-background/60"
                            }`}
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${
                                active ? "bg-green-500" : "bg-transparent border border-white/40"
                              }`}
                            />
                            <span>{a.name}</span>
                            <span className="ml-auto text-xs opacity-70">{a.price}</span>
                          </button>
                        );
                      })}
                    </>
                  )}
                </div>

                <button
                  onClick={() => setOpen(false)}
                  className="w-full bg-coffee-medium hover:bg-coffee-rich text-cream py-2 rounded-lg font-semibold transition mt-3"
                >
                  Done
                </button>
              </div>
            </>
          </Portal>
        )}

        {/* ---------- FOOTER ---------- */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" /> {item.time}
            </span>
            <span className="flex items-center gap-1">
              <Leaf className="h-4 w-4 text-sage" /> Fresh
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-coffee-medium hover:bg-coffee-rich text-cream px-4 py-2 rounded-full transition"
          >
            Add to Order
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(MenuCard);
