import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Instagram,
  Heart,
  Share,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryItem } from "@/types";
import galleryItems from "@/utils/galleryItems";

/* ----------------------------- Data / Types ----------------------------- */

// type GalleryItem = {
//   id: number;
//   image: string;
//   title: string;
//   description: string;
//   likes: number;
//   category: "Coffee" | "Interior" | "Latte Art" | "Pastries";
// };

// const galleryItems: GalleryItem[] = [
//   {
//     id: 1,
//     image: heroImage,
//     title: "Perfect Morning Brew",
//     description: "Start your day with our signature blend",
//     likes: 342,
//     category: "Coffee",
//   },
//   {
//     id: 2,
//     image: cafeInteriorImage,
//     title: "Cozy Interior",
//     description: "Warm atmosphere perfect for work or relaxation",
//     likes: 289,
//     category: "Interior",
//   },
//   {
//     id: 3,
//     image: latteImage,
//     title: "Artisan Latte Art",
//     description: "Every cup is a work of art",
//     likes: 456,
//     category: "Latte Art",
//   },
//   {
//     id: 4,
//     image: pastriesImage,
//     title: "Fresh Pastries",
//     description: "Baked daily with love and premium ingredients",
//     likes: 198,
//     category: "Pastries",
//   },
//   {
//     id: 5,
//     image: heroImage,
//     title: "Golden Hour Coffee",
//     description: "Perfect lighting, perfect coffee",
//     likes: 523,
//     category: "Coffee",
//   },
//   {
//     id: 6,
//     image: cafeInteriorImage,
//     title: "Community Space",
//     description: "Where conversations and friendships bloom",
//     likes: 167,
//     category: "Interior",
//   },
// ];

const categories = [
  "All",
  "Coffee",
  "Interior",
  "Latte Art",
  "Pastries",
] as const;
type Category = (typeof categories)[number];

/* ----------------------------- Hooks / Utils ---------------------------- */

/** Extracts a soft dominant color from an image (average of a downscaled canvas). */
function useDominantColor(src: string) {
  const [color, setColor] = React.useState<string>("rgba(136,107,71,0.35)"); // coffee-ish fallback
  React.useEffect(() => {
    let mounted = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img
      .decode?.()
      .catch(() => Promise.resolve())
      .finally(() => {
        // Draw tiny canvas for average color
        try {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          if (!ctx) return;
          const w = 16,
            h = 16;
          canvas.width = w;
          canvas.height = h;
          ctx.drawImage(img, 0, 0, w, h);
          const data = ctx.getImageData(0, 0, w, h).data;
          let r = 0,
            g = 0,
            b = 0,
            count = 0;
          for (let i = 0; i < data.length; i += 4) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            count++;
          }
          r = Math.round(r / count);
          g = Math.round(g / count);
          b = Math.round(b / count);
          if (mounted) setColor(`rgba(${r}, ${g}, ${b}, 0.45)`);
        } catch {
          // ignore, keep fallback
        }
      });
    return () => {
      mounted = false;
    };
  }, [src]);
  return color;
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/* ---------------------------- Card Component ---------------------------- */

const GalleryCard: React.FC<{
  item: GalleryItem;
  onOpen: () => void;
  mood: number; // 0..100 (Morning -> Golden)
}> = ({ item, onOpen, mood }) => {
  const reduceMotion = useReducedMotion();
  const domColor = useDominantColor(item.image);
  const [liked, setLiked] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const holdRef = React.useRef<number | null>(null);
  const [peeking, setPeeking] = React.useState(false);

  const startHold = () => {
    if (holdRef.current) return;
    holdRef.current = window.setTimeout(() => setPeeking(true), 220);
  };
  const endHold = () => {
    if (holdRef.current) {
      clearTimeout(holdRef.current);
      holdRef.current = null;
    }
    setPeeking(false);
  };

  const tintedOverlay = `linear-gradient(to top, rgba(0,0,0,${
    0.4 + mood / 600
  }), transparent 60%)`;
  const moodWarmth = `hue-rotate(${mood * 0.12}deg) saturate(${
    1 + mood / 300
  })`;

  return (
    <motion.div
      className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-warm transition-all duration-500 border border-white/10 bg-card/70 backdrop-blur-sm"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -2 }}
    >
      {/* Aroma glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(60% 60% at 50% 70%, ${domColor} 0%, transparent 70%)`,
          opacity: 0.75,
          mixBlendMode: "multiply",
        }}
        aria-hidden="true"
      />

      {/* Image */}
      <div
        className="relative overflow-hidden"
        onPointerDown={startHold}
        onPointerUp={endHold}
        onPointerLeave={endHold}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-background/40 to-background/20" />
        )}
        <img
          src={item.image}
          alt={item.title}
          className={`
            w-full h-64 lg:h-80 object-cover transition-transform duration-700
            ${peeking ? "scale-110" : "group-hover:scale-110"}
          `}
          onLoad={() => setLoaded(true)}
          loading="lazy"
          decoding="async"
          style={{ filter: moodWarmth }}
        />
        {/* Tint + gradient overlay */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ background: tintedOverlay, opacity: 1 }}
        />
        {/* Top row: category + actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="bg-coffee-medium/90 text-cream px-3 py-1 rounded-full text-sm font-medium border border-white/10">
            {item.category}
          </div>
          <div className="flex gap-2">
            <motion.button
              onClick={() => setLiked((v) => !v)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors border border-white/10
                ${
                  liked
                    ? "text-red-500"
                    : "text-coffee-medium hover:bg-background"
                }`}
              aria-label="Like"
            >
              <Heart className={`h-4 w-4 ${liked ? "fill-red-500" : ""}`} />
            </motion.button>
            <motion.button
              onClick={async () => {
                const url =
                  window.location.href.split("#")[0] + `#gallery-${item.id}`;
                if ((navigator as any).share) {
                  try {
                    await (navigator as any).share({
                      title: item.title,
                      text: item.description,
                      url,
                    });
                  } catch {}
                } else {
                  await navigator.clipboard.writeText(url);
                }
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-coffee-medium hover:bg-background border border-white/10"
              aria-label="Share"
            >
              <Share className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-0">
          <h3 className="text-xl font-semibold text-cream mb-1">
            {item.title}
          </h3>
          <p className="text-cream/85 text-sm mb-3">{item.description}</p>
          <div className="flex items-center justify-between text-cream/80">
            <div className="flex items-center gap-2">
              <Heart
                className={`h-4 w-4 ${
                  liked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span className="text-sm">{item.likes + (liked ? 1 : 0)}</span>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpen}
              className="text-cream hover:text-cream/80 text-sm font-medium"
            >
              View Details
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* --------------------------- Lightbox Component -------------------------- */

const Lightbox: React.FC<{
  items: GalleryItem[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}> = ({ items, index, onClose, onPrev, onNext }) => {
  const reduceMotion = useReducedMotion();
  const item = items[index];
  const domColor = useDominantColor(item.image);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md"
        style={{
          backgroundImage: `radial-gradient(60% 60% at 50% 50%, ${domColor}, transparent)`,
        }}
      />
      <motion.div
        key="dialog"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[101] grid place-items-center p-4"
      >
        <div className="relative max-w-6xl w-full">
          {/* Image frame */}
          <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black">
            <motion.img
              key={item.id}
              src={item.image}
              alt={item.title}
              initial={{ scale: 1.02 }}
              animate={{ scale: 1 }}
              transition={{ duration: 4, ease: "easeInOut" }}
              className="w-full max-h-[72vh] object-contain"
            />
            {/* Caption */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 md:p-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
                <div>
                  <h3 className="text-cream text-xl font-semibold">
                    {item.title}
                  </h3>
                  <p className="text-cream/80 text-sm">{item.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="border-2 border-cream text-cream hover:bg-cream hover:text-coffee-rich"
                    onClick={onPrev}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </Button>
                  <Button
                    className="bg-cream text-coffee-rich hover:bg-warm-white"
                    onClick={onNext}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm grid place-items-center text-cream hover:bg-black/70"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ----------------------------- Main Section ------------------------------ */

const GallerySection: React.FC = () => {
  const [activeCat, setActiveCat] = React.useState<Category>("All");
  const [mood, setMood] = React.useState(20); // 0..100 (Morning -> Golden Hour)
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);

  const filtered = React.useMemo(() => {
    if (activeCat === "All") return galleryItems;
    return galleryItems.filter((g) => g.category === activeCat);
  }, [activeCat]);

  const openAt = (id: number) => {
    const idx = filtered.findIndex((g) => g.id === id);
    if (idx >= 0) setLightboxIndex(idx);
  };

  const close = () => setLightboxIndex(null);
  const prev = () =>
    setLightboxIndex((i) =>
      i == null ? i : (i - 1 + filtered.length) % filtered.length
    );
  const next = () =>
    setLightboxIndex((i) => (i == null ? i : (i + 1) % filtered.length));

  return (
    <section
      id="gallery"
      className="py-20 bg-background relative overflow-hidden"
    >
      {/* Ambient blobs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-coffee-medium/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-sage/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10 md:mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-coffee-rich mb-4">
            Our Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Moments captured, memories made. Follow our journey through coffee,
            community, and creativity.
          </p>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6"
          >
            <Button
              variant="outline"
              className="border-2 border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/deccanbrewscafe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow @Deccan brews cafe
            </Button>
          </motion.div>
        </motion.div>

        {/* Controls Bar (Category + Mood slider) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="sticky top-20 z-10 mb-8"
        >
          <div className="rounded-2xl bg-background/30 backdrop-blur-xl border border-white/10 ring-1 ring-white/10 shadow-soft p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              {/* Category chips (scrollable on mobile) */}
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

              {/* Mood slider */}
              <div className="flex items-center gap-3">
                <span className="text-sm text-foreground/70">Mood</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={mood}
                  onChange={(e) =>
                    setMood(clamp(parseInt(e.target.value, 10), 0, 100))
                  }
                  className="accent-coffee-medium w-44"
                  aria-label="Gallery mood warmth"
                />
                <div className="text-xs text-foreground/60 w-24">
                  {mood < 33
                    ? "Morning"
                    : mood < 66
                    ? "Afternoon"
                    : "Golden Hour"}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filtered.map((item, i) => (
            <GalleryCard
              key={item.id}
              item={item}
              onOpen={() => openAt(item.id)}
              mood={mood}
            />
          ))}
        </div>

        {/* Load more (placeholder) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center"
        >
          <Button
            variant="outline"
            size="lg"
            className="border-2 border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream px-8 py-4"
          >
            Load More Photos
          </Button>
        </motion.div>

        {/* IG CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
          className="mt-20 text-center bg-gradient-to-r from-coffee-medium/5 to-sage/5 p-12 rounded-3xl"
        >
          <Instagram className="h-16 w-16 text-coffee-medium mx-auto mb-6" />
          <h3 className="text-2xl font-display font-bold text-coffee-rich mb-4">
            Share Your Brews Moments
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tag us @Deccan Brews Cafe and use #Deccanbrewscafe to be featured in
            our gallery. We love seeing how our coffee becomes part of your
            daily story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-coffee-medium hover:bg-coffee-rich"
              onClick={() =>
                window.open(
                  "https://www.instagram.com/deccanbrewscafe?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow Us
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex != null && (
          <Lightbox
            items={filtered}
            index={lightboxIndex}
            onClose={close}
            onPrev={prev}
            onNext={next}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
