import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, CreditCard, Smartphone, Wallet, Trash2, Minus, Plus, BadgePercent, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { readCart, writeCart, clearCartStorage, StoredCartItem } from "@/lib//cartStorage";

type PaymentMethod = "upi" | "card" | "cash";
type ServiceType = "pickup" | "dinein";

const currency = (n: number) => `$${n.toFixed(2)}`;

const CheckoutPage = () => {
  const [cart, setCart] = useState<StoredCartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<ServiceType>("pickup");
  const [time, setTime] = useState("ASAP");
  const [promo, setPromo] = useState("");
  const [tipPct, setTipPct] = useState<number>(0);
  const [payment, setPayment] = useState<PaymentMethod>("upi");
  const [placing, setPlacing] = useState(false);

  // load from storage
  useEffect(() => {
    setCart(readCart());
  }, []);

  useEffect(() => {
    writeCart(cart);
  }, [cart]);

  const subtotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);

  const promoDiscount = useMemo(() => {
    const code = promo.trim().toUpperCase();
    if (!code) return 0;
    // sample: 10% off for COFFEE10
    if (code === "COFFEE10") return Math.min(subtotal * 0.1, 20); // cap at 20
    return 0;
  }, [promo, subtotal]);

  const tip = useMemo(() => (subtotal - promoDiscount) * (tipPct / 100), [subtotal, promoDiscount, tipPct]);
  const tax = useMemo(() => (subtotal - promoDiscount) * 0.07, [subtotal, promoDiscount]); // ~7% demo tax
  const total = useMemo(() => Math.max(0, subtotal - promoDiscount) + tip + tax, [subtotal, promoDiscount, tip, tax]);

  const inc = (id: number) => setCart((prev) => prev.map((p) => (p.id === id ? { ...p, qty: p.qty + 1 } : p)));
  const dec = (id: number) =>
    setCart((prev) =>
      prev
        .map((p) => (p.id === id ? { ...p, qty: Math.max(0, p.qty - 1) } : p))
        .filter((p) => p.qty > 0)
    );
  const removeItem = (id: number) => setCart((prev) => prev.filter((p) => p.id !== id));
  const clearCart = () => setCart([]);

  const valid = cart.length > 0 && name.trim() && phone.trim();

  const placeOrder = async () => {
    if (!valid) {
      alert("Please add items and fill in name + phone.");
      return;
    }
    setPlacing(true);
    try {
      // TODO: connect this to your real endpoint (Apps Script / Appwrite)
      // Example (Apps Script POST):
      // await fetch("https://script.google.com/macros/s/XXXX/exec", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      //   body: new URLSearchParams({
      //     type: "order",
      //     name, phone, email, service, time,
      //     payment,
      //     // items as JSON string
      //     items: JSON.stringify(cart),
      //     subtotal: String(subtotal),
      //     promo: promo.trim(),
      //     promoDiscount: String(promoDiscount),
      //     tip: String(tip),
      //     tax: String(tax),
      //     total: String(total)
      //   })
      // });

      await new Promise((r) => setTimeout(r, 900));

      clearCart();
      clearCartStorage();
      alert("Order placed! We’ve received your order details.");
      window.location.href = "/"; // go home or show success page
    } catch (e) {
      alert("Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <section className="min-h-screen bg-cream">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold text-coffee-rich">Checkout</h1>
          <p className="text-coffee-medium/90 mt-1">Complete your order—freshly brewed and ready soon.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Cart items */}
          <Card className="lg:col-span-2 border border-coffee-rich/15 bg-white/80 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-coffee-rich">Your Items</h2>
                {cart.length > 0 && (
                  <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear all</button>
                )}
              </div>

              {cart.length === 0 ? (
                <p className="text-muted-foreground">Your cart is empty.</p>
              ) : (
                <div className="space-y-4">
                  {cart.map((it) => (
                    <div key={it.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-background/50 border border-white/10">
                      <div className="flex items-center gap-3 min-w-0">
                        {it.image && (
                          <img src={it.image} alt={it.name} className="w-14 h-14 rounded-md object-cover" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-coffee-rich truncate">{it.name}</div>
                          <div className="text-sm text-muted-foreground">{currency(it.price)}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => dec(it.id)}
                          className="w-8 h-8 rounded-full bg-muted hover:bg-coffee-light/20 grid place-items-center"
                          aria-label="Decrease"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-semibold">{it.qty}</span>
                        <button
                          onClick={() => inc(it.id)}
                          className="w-8 h-8 rounded-full bg-coffee-medium text-cream hover:bg-coffee-rich grid place-items-center"
                          aria-label="Increase"
                        >
                          <Plus className="h-4 w-4" />
                        </button>

                        <button
                          onClick={() => removeItem(it.id)}
                          className="text-muted-foreground hover:text-red-500"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Right: Details + payment */}
          <div className="space-y-6">
            {/* Customer details */}
            <Card className="border border-coffee-rich/15 bg-white/80 backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-coffee-rich">Contact</h3>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label htmlFor="name" className="text-coffee-rich">Name *</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-coffee-rich">Phone *</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-coffee-rich">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Service + time */}
            <Card className="border border-coffee-rich/15 bg-white/80 backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-coffee-rich">Pickup or Dine-in</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setService("pickup")}
                    className={`px-4 py-2 rounded-full border ${service === "pickup" ? "bg-coffee-medium text-cream border-coffee-medium" : "bg-white text-coffee-rich border-coffee-rich/20 hover:bg-coffee-rich/10"}`}
                  >
                    Pickup
                  </button>
                  <button
                    onClick={() => setService("dinein")}
                    className={`px-4 py-2 rounded-full border ${service === "dinein" ? "bg-coffee-medium text-cream border-coffee-medium" : "bg-white text-coffee-rich border-coffee-rich/20 hover:bg-coffee-rich/10"}`}
                  >
                    Dine-in
                  </button>
                </div>

                <div className="mt-3">
                  <Label className="text-coffee-rich flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Time
                  </Label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="mt-1 w-full rounded-xl bg-background/40 border border-white/10 px-3 py-2"
                  >
                    <option value="ASAP">ASAP</option>
                    <option value="In 10 min">In 10 min</option>
                    <option value="In 20 min">In 20 min</option>
                    <option value="In 30 min">In 30 min</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Order summary */}
            <Card className="border border-coffee-rich/15 bg-white/80 backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-coffee-rich">Summary</h3>

                <div className="flex items-center gap-2">
                  <BadgePercent className="w-4 h-4 text-coffee-medium" />
                  <Input
                    value={promo}
                    onChange={(e) => setPromo(e.target.value)}
                    placeholder="Promo code (try COFFEE10)"
                  />
                </div>

                <div>
                  <Label className="text-coffee-rich">Tip</Label>
                  <div className="flex gap-2 mt-2">
                    {[0, 5, 10, 15, 20].map((p) => (
                      <button
                        key={p}
                        onClick={() => setTipPct(p)}
                        className={`px-3 py-1.5 rounded-full border text-sm ${tipPct === p ? "bg-coffee-medium text-cream border-coffee-medium" : "bg-white text-coffee-rich border-coffee-rich/20 hover:bg-coffee-rich/10"}`}
                      >
                        {p}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-coffee-medium">Subtotal</span>
                    <span className="text-coffee-rich">{currency(subtotal)}</span>
                  </div>
                  {promoDiscount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-coffee-medium">Promo</span>
                      <span className="text-coffee-rich">- {currency(promoDiscount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-coffee-medium">Tip</span>
                    <span className="text-coffee-rich">{currency(tip)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-coffee-medium">Tax</span>
                    <span className="text-coffee-rich">{currency(tax)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/20">
                    <span className="font-semibold text-coffee-rich">Total</span>
                    <span className="font-semibold text-coffee-rich">{currency(total)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment */}
            <Card className="border border-coffee-rich/15 bg-white/80 backdrop-blur-xl">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold text-coffee-rich">Payment</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setPayment("upi")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${payment === "upi" ? "bg-coffee-medium text-cream border-coffee-medium" : "bg-white text-coffee-rich border-coffee-rich/20 hover:bg-coffee-rich/10"}`}
                  >
                    <Smartphone className="w-4 h-4" /> UPI
                  </button>
                  <button
                    onClick={() => setPayment("card")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${payment === "card" ? "bg-coffee-medium text-cream border-coffee-medium" : "bg-white text-coffee-rich border-coffee-rich/20 hover:bg-coffee-rich/10"}`}
                  >
                    <CreditCard className="w-4 h-4" /> Card
                  </button>
                  <button
                    onClick={() => setPayment("cash")}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${payment === "cash" ? "bg-coffee-medium text-cream border-coffee-medium" : "bg-white text-coffee-rich border-coffee-rich/20 hover:bg-coffee-rich/10"}`}
                  >
                    <Wallet className="w-4 h-4" /> Cash
                  </button>
                </div>

                {/* If UPI, show a placeholder QR (replace with your actual QR later) */}
                {payment === "upi" && (
                  <div className="mt-2 rounded-xl border border-white/20 bg-background/40 p-4 text-center">
                    <p className="text-sm text-coffee-medium mb-2">Scan to pay at pickup</p>
                    <div className="mx-auto w-40 h-40 bg-[repeating-linear-gradient(45deg,rgba(0,0,0,0.08),rgba(0,0,0,0.08) 8px,transparent 8px,transparent 16px)] rounded-md" />
                    <p className="text-xs text-muted-foreground mt-2">Attach your real UPI QR here</p>
                  </div>
                )}

                <Button
                  disabled={!valid || placing || cart.length === 0}
                  onClick={placeOrder}
                  className="w-full bg-coffee-rich hover:bg-coffee-medium text-cream"
                >
                  {placing ? (
                    <span className="inline-flex items-center gap-2">
                      <Receipt className="w-5 h-5 animate-pulse" /> Placing…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      <Receipt className="w-5 h-5" /> Place Order
                    </span>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
