import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, X, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { writeCart } from "@/lib/cartStorage";

type CartItem = {
  id: number;
  name: string;
  price: number; // numeric
  image?: string;
  qty: number;
};

const currency = (n: number) => `$${n.toFixed(2)}`;

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  // derived
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const total = cart.reduce((s, i) => s + i.qty * i.price, 0);

  // show after scroll a bit
  useEffect(() => {
    const onScroll = () => setIsVisible(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // listen to global cart events
  useEffect(() => {
    const onAdd = (e: Event) => {
      const ce = e as CustomEvent<{
        id: number;
        name: string;
        price: number;
        image?: string;
      }>;
      const item = ce.detail;
      if (!item) return;
      setCart((prev) => {
        const existing = prev.find((p) => p.id === item.id);
        if (existing) {
          return prev.map((p) =>
            p.id === item.id ? { ...p, qty: p.qty + 1 } : p
          );
        }
        return [{ ...item, qty: 1 }, ...prev];
      });
      setIsExpanded(true); // open the panel on add
    };

    const onOpen = () => setIsExpanded(true);

    window.addEventListener("cart:add", onAdd as EventListener);
    window.addEventListener("cart:open", onOpen);
    return () => {
      window.removeEventListener("cart:add", onAdd as EventListener);
      window.removeEventListener("cart:open", onOpen);
    };
  }, []);

  useEffect(() => {
    writeCart(cart);
  }, [cart]);

  const inc = (id: number) =>
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p))
    );

  const dec = (id: number) =>
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty - 1) } : p))
        .filter((p) => p.qty > 0)
    );

  const removeItem = (id: number) =>
    setCart((prev) => prev.filter((p) => p.id !== id));

  const clearCart = () => setCart([]);

  const handleFabClick = () => {
    // toggle open if there are items; otherwise just open an empty panel
    setIsExpanded((v) => !v || count === 0);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 100 }}
          className="fixed bottom-6 right-6 z-50"
        >
          {/* Expanded cart panel */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.96 }}
                className="mb-4 mr-2"
              >
                <Card className="w-80 shadow-floating bg-card/95 backdrop-blur-md border border-white/10">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-coffee-rich">
                        Your Order
                      </h3>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>

                    {cart.length === 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Your cart is empty. Add something tasty from the menu!
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-64 overflow-auto pr-1">
                        {cart.map((it) => (
                          <div
                            key={it.id}
                            className="flex items-center justify-between gap-3 p-3 bg-background/50 rounded-lg border border-white/10"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              {it.image && (
                                <img
                                  src={it.image}
                                  alt={it.name}
                                  className="w-10 h-10 rounded-md object-cover"
                                />
                              )}
                              <div className="min-w-0">
                                <div className="font-medium text-sm text-coffee-rich truncate">
                                  {it.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {currency(it.price)}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => dec(it.id)}
                                className="w-6 h-6 rounded-full bg-muted hover:bg-coffee-light/20 grid place-items-center transition-colors"
                                aria-label="Decrease"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="w-6 text-center font-medium">
                                {it.qty}
                              </span>
                              <button
                                onClick={() => inc(it.id)}
                                className="w-6 h-6 rounded-full bg-coffee-medium text-cream hover:bg-coffee-rich grid place-items-center transition-colors"
                                aria-label="Increase"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => removeItem(it.id)}
                                className="ml-1 text-muted-foreground hover:text-red-500"
                                aria-label="Remove item"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-3 mt-3 border-t border-white/10">
                      <span className="font-semibold">
                        Total: {currency(total)}
                      </span>
                      <div className="flex items-center gap-2">
                        {!!cart.length && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border border-white/20"
                            onClick={clearCart}
                          >
                            Clear
                          </Button>
                        )}
                        <Button
                          size="sm"
                          className="bg-coffee-medium hover:bg-coffee-rich"
                          onClick={() => {
                            // persist just in case + go to checkout
                            writeCart(cart);
                            window.location.href = "/checkout";
                          }}
                        >
                          Checkout
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Action Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleFabClick}
            className="relative w-16 h-16 bg-coffee-medium hover:bg-coffee-rich text-cream rounded-full shadow-floating hover:shadow-warm transition-all duration-300 flex items-center justify-center group"
            aria-label="Open cart"
          >
            <motion.div
              animate={count > 0 ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBag className="h-6 w-6" />
            </motion.div>

            {/* Count badge */}
            <AnimatePresence>
              {count > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 min-w-6 h-6 bg-sage text-coffee-rich rounded-full px-1.5 flex items-center justify-center text-sm font-bold shadow-soft"
                >
                  {count}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Ripple */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-coffee-medium/30"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.button>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full top-1/2 -translate-y-1/2 mr-4 pointer-events-none"
          >
            <div className="bg-coffee-rich text-cream px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-warm">
              {count > 0 ? "View Cart" : "Quick Order"}
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-coffee-rich border-y-4 border-y-transparent" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;
