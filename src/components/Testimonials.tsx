import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Types */
type Review = {
  id: string;
  author: string;
  rating: number; // 0-5 (supports decimals)
  text: string;
  source: "Google" | "Zomato" | "Instagram" | "Other";
  date?: string;
  avatarUrl?: string;
};

/** Demo data (replace with your feed) */
const sampleReviews: Review[] = [
  {
    id: "r1",
    author: "Aarav Mehta",
    rating: 4.9,
    text:
      "Hands down the best espresso in town. The crema is perfect and the staff knows their beans. Cozy vibe too!",
    source: "Google",
    date: "2025-02-10",
  },
  {
    id: "r2",
    author: "Meera Iyer",
    rating: 5,
    text:
      "Their signature latte is art in a cup. You can taste the freshness — pastries are a must-try!",
    source: "Google",
    date: "2025-01-22",
  },
  {
    id: "r3",
    author: "Rahul Sharma",
    rating: 4.8,
    text:
      "Love the minimalist interior and calm playlist. Great spot to read and sip. Highly recommend.",
    source: "Zomato",
    date: "2025-03-01",
  },
  {
    id: "r4",
    author: "Sana Kapoor",
    rating: 5,
    text:
      "Baristas are absolute pros. The pour-over had clean flavors and the aftertaste was sweet and long.",
    source: "Other",
    date: "2025-02-04",
  },
  {
    id: "r5",
    author: "Varun Desai",
    rating: 4.7,
    text:
      "Chill ambience, fast Wi-Fi, and that hazelnut croissant… unreal. Deccan Brews is my weekend ritual.",
    source: "Google",
    date: "2025-04-18",
  },
];

/** Utils */
const avgRating = (reviews: Review[]) =>
  reviews.length ? Math.round((reviews.reduce((a, r) => a + r.rating, 0) / reviews.length) * 10) / 10 : 0;

/** Stars (fractional) — tuned for light bg */
const StarRating: React.FC<{ rating: number; size?: number; className?: string }> = ({
  rating,
  size = 18,
  className,
}) => {
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <div className={`relative inline-flex ${className || ""}`} aria-label={`${rating} out of 5 stars`}>
      {/* Outline stars */}
      <div className="flex items-center gap-0.5 text-coffee-rich/25">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={`bg-${i}`} width={size} height={size} className="shrink-0" stroke="currentColor" fill="none" />
        ))}
      </div>
      {/* Filled portion */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pct}%` }}>
        <div className="flex items-center gap-0.5 text-coffee-rich">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={`fg-${i}`} width={size} height={size} className="shrink-0" stroke="none" fill="currentColor" />
          ))}
        </div>
      </div>
    </div>
  );
};

/** Avatar (initials fallback) — tuned for light bg */
const Avatar: React.FC<{ name: string; url?: string }> = ({ name, url }) => {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return url ? (
    <img src={url} alt={name} className="w-10 h-10 rounded-full object-cover border border-coffee-rich/20" />
  ) : (
    <div
      className="w-10 h-10 rounded-full grid place-items-center text-cream font-semibold border border-coffee-rich/20"
      style={{
        background:
          "radial-gradient(circle at 30% 30%, hsl(var(--coffee-medium)) 0%, hsl(var(--coffee-rich)) 70%)",
      }}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

const Testimonials: React.FC<{
  id?: string;
  reviews?: Review[];
  defaultSource?: Review["source"] | "All";
}> = ({ id = "testimonials", reviews = sampleReviews, defaultSource = "All" }) => {
  const reduceMotion = useReducedMotion();
  const [source, setSource] = React.useState<"All" | Review["source"]>(defaultSource);
  const [index, setIndex] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(true);
  const [interacting, setInteracting] = React.useState(false);

  const filtered = source === "All" ? reviews : reviews.filter((r) => r.source === source);
  const total = filtered.length;
  const average = avgRating(filtered);

  const next = () => setIndex((p) => ((p + 1) % total) || 0);
  const prev = () => setIndex((p) => (p - 1 + total) % total);

  // autoplay (pause on hover / reduced motion)
  React.useEffect(() => {
    if (!total) return;
    const on = autoplay && !interacting && !reduceMotion;
    if (!on) return;
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [autoplay, interacting, reduceMotion, total]);

  // swipe (mobile)
  const startX = React.useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => (startX.current = e.clientX);
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? next() : prev();
  };

  // reset index on source change
  React.useEffect(() => setIndex(0), [source]);

  return (
    <section id={id} className="relative py-20 bg-cream text-coffee-rich">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-cream/80 backdrop-blur-xl border border-coffee-rich/15 rounded-full px-3 py-1.5 mb-4 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-coffee-rich" />
              <span className="text-xs font-medium">Loved by coffee lovers</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">What our customers say</h2>
            <p className="mt-2 text-coffee-rich/70">
              Real reviews from Google and beyond — curated for quality and freshness.
            </p>
          </div>

          {/* Rating pill + filters */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="inline-flex items-center gap-3 bg-cream/80 backdrop-blur-xl border border-coffee-rich/15 rounded-2xl px-4 py-3 shadow-sm">
              <StarRating rating={average} />
              <div>
                <div className="text-sm font-semibold">{average}/5.0</div>
                <div className="text-xs text-coffee-rich/60">{filtered.length} reviews</div>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-cream/80 backdrop-blur-xl border border-coffee-rich/15 rounded-full p-1 shadow-sm">
              {["All", "Google", "Zomato", "Instagram", "Other"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSource(tab as any)}
                  className={`px-3 py-1.5 text-sm rounded-full transition ${
                    source === tab
                      ? "bg-coffee-rich text-cream"
                      : "hover:bg-cream/70"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main card */}
        <div
          className="relative rounded-3xl overflow-hidden bg-cream/80 backdrop-blur-xl border border-coffee-rich/10 ring-1 ring-coffee-rich/10 shadow-xl"
          onMouseEnter={() => setInteracting(true)}
          onMouseLeave={() => setInteracting(false)}
        >
          <div className="grid grid-rows-[1fr_auto] lg:grid-rows-1 lg:grid-cols-12 gap-0">
            {/* Big review */}
            <div
              className="relative lg:col-span-8 p-6 md:p-10"
              onPointerDown={onPointerDown}
              onPointerUp={onPointerUp}
            >
              <Quote className="absolute -top-4 -left-2 md:-top-2 md:left-6 h-16 w-16 text-coffee-rich/15" />

              <AnimatePresence mode="wait">
                {!!total && (
                  <motion.div
                    key={filtered[index].id}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -12, scale: 0.98 }}
                    transition={{ duration: reduceMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <StarRating rating={filtered[index].rating} className="mb-3" />
                    <p className="text-lg md:text-xl leading-relaxed">
                      “{filtered[index].text}”
                    </p>
                    <div className="mt-6 flex items-center gap-3">
                      <Avatar name={filtered[index].author} url={filtered[index].avatarUrl} />
                      <div>
                        <div className="font-semibold">{filtered[index].author}</div>
                        <div className="text-xs text-coffee-rich/60">
                          {filtered[index].source}
                          {filtered[index].date ? ` • ${new Date(filtered[index].date).toLocaleDateString()}` : ""}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Controls */}
              {total > 1 && (
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={prev}
                    variant="outline"
                    className="border-2 border-coffee-rich text-coffee-rich hover:bg-coffee-rich hover:text-cream"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Prev
                  </Button>
                  <Button
                    onClick={() => setAutoplay((v) => !v)}
                    variant="outline"
                    className="border-2 border-coffee-rich text-coffee-rich hover:bg-coffee-rich hover:text-cream"
                  >
                    {autoplay ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                    {autoplay ? "Pause" : "Play"}
                  </Button>
                  <Button
                    onClick={next}
                    variant="outline"
                    className="border-2 border-coffee-rich text-coffee-rich hover:bg-coffee-rich hover:text-cream"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>

                  {/* Dots */}
                  <div className="ml-auto flex items-center gap-2">
                    {filtered.map((r, i) => (
                      <button
                        key={r.id}
                        onClick={() => setIndex(i)}
                        aria-label={`Show review ${i + 1}`}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          i === index ? "w-6 bg-coffee-rich" : "w-2.5 bg-coffee-rich/30 hover:bg-coffee-rich/50"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right column: desktop stack / mobile dock */}
            <div className="lg:col-span-4 border-t border-coffee-rich/10 lg:border-t-0 lg:border-l lg:border-coffee-rich/10">
              {/* Desktop vertical stack */}
              <div
                className="hidden lg:flex flex-col gap-3 p-6 max-h-[420px] overflow-auto"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
                }}
              >
                {filtered.map((r, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={`mini-${r.id}`}
                      onClick={() => setIndex(i)}
                      className={`text-left rounded-2xl border p-4 transition bg-cream/70 hover:bg-cream/90 ${
                        active ? "border-coffee-rich ring-2 ring-coffee-rich/40" : "border-coffee-rich/15"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar name={r.author} url={r.avatarUrl} />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{r.author}</div>
                          <div className="text-xs text-coffee-rich/60 truncate">{r.source}</div>
                        </div>
                      </div>
                      <StarRating rating={r.rating} size={14} className="mb-2" />
                      <p className="text-sm text-coffee-rich/80 line-clamp-3">{r.text}</p>
                    </button>
                  );
                })}
              </div>

              {/* Mobile/Tablet dock */}
              <div
                className="lg:hidden flex gap-3 overflow-x-auto p-4"
                style={{
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
                  maskImage:
                    "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
                }}
              >
                {filtered.map((r, i) => {
                  const active = i === index;
                  return (
                    <button
                      key={`dock-${r.id}`}
                      onClick={() => setIndex(i)}
                      className={`shrink-0 w-64 rounded-2xl border p-4 text-left transition bg-cream/70 hover:bg-cream/90 ${
                        active ? "border-coffee-rich ring-2 ring-coffee-rich/40" : "border-coffee-rich/15"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Avatar name={r.author} url={r.avatarUrl} />
                        <div className="min-w-0">
                          <div className="font-semibold truncate">{r.author}</div>
                          <div className="text-xs text-coffee-rich/60 truncate">{r.source}</div>
                        </div>
                      </div>
                      <StarRating rating={r.rating} size={14} className="mb-2" />
                      <p className="text-sm text-coffee-rich/80 line-clamp-3">{r.text}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <p className="text-sm text-coffee-rich/70">
            Showing <span className="font-semibold text-coffee-rich">{source}</span> reviews. Want to share your experience?
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-2 border-coffee-rich text-coffee-rich hover:bg-coffee-rich hover:text-cream"
              onClick={() =>
                window.open("https://www.google.com/maps/search/?api=1&query=Deccan%20Brews", "_blank")
              }
            >
              Leave a Google Review
            </Button>
            <Button
              className="bg-coffee-rich text-cream hover:bg-coffee-medium"
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
