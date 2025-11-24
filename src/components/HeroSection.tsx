import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowDown, Play, Coffee, Heart, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/heroImage.jpeg";
import cafeInterior from "@/assets/Interior.png";
import chillVietnamese from "@/assets/coffee/chill_vietnamese.png";
import pastries from "@/assets/pastries.jpg";
import cafeAmbience from "@/assets/cafe-ambience.mp4";

const ModernShowcase = () => {
  const reduceMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const [activeCard, setActiveCard] = React.useState(0);
  const [autoplay, setAutoplay] = React.useState(true);
  const [isInteracting, setIsInteracting] = React.useState(false);
  const [imgReady, setImgReady] = React.useState(false);

  const showcaseItems = [
    {
      src: heroImage,
      title: "Your Cozy Corner",
      subtitle: "A warm, brown & beige space where every cup feels like home.",
      icon: Coffee,
      color: "from-coffee-rich/20 to-coffee-medium/20",
      accent: "coffee-rich",
      objectPosition: "object-top",
    },
    {
      src: cafeInterior,
      title: "Premium Space",
      subtitle: "Modern comfort meets tradition",
      icon: Heart,
      color: "from-sage/20 to-sage-light/20",
      accent: "sage",
    },
    {
      src: chillVietnamese,
      title: "Signature Coffee",
      subtitle: "Art in every cup",
      icon: Star,
      color: "from-cream/20 to-warm-white/20",
      accent: "cream",
    },
    {
      src: pastries,
      title: "Fresh Pastries",
      subtitle: "Baked with passion",
      icon: Coffee,
      color: "from-coffee-light/20 to-coffee-medium/20",
      accent: "coffee-medium",
    },
  ];

  const total = showcaseItems.length;
  const goPrev = () => setActiveCard((p) => (p - 1 + total) % total);
  const goNext = () => setActiveCard((p) => (p + 1) % total);

  // Autoplay (pause on interaction/reduced motion)
  React.useEffect(() => {
    const on = autoplay && !reduceMotion && !isInteracting;
    if (!on) return;
    const id = setInterval(goNext, 4800);
    return () => clearInterval(id);
  }, [autoplay, reduceMotion, isInteracting]);

  // Keyboard arrows
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Swipe/drag (mobile)
  const startX = React.useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    startX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (startX.current == null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) < 40) return;
    dx < 0 ? goNext() : goPrev();
  };

  // Reset skeleton on slide change
  React.useEffect(() => setImgReady(false), [activeCard]);

  return (
    <div className="relative h-full w-full select-none">
      {/* SR-only announcer */}
      <div aria-live="polite" className="sr-only">
        Showing: {showcaseItems[activeCard].title} —{" "}
        {showcaseItems[activeCard].subtitle}
      </div>

      {/* Responsive layout:
          - <lg: two rows (hero + bottom dock)
          - lg+: two columns (hero + right rail) */}
      <div className="grid h-full gap-4 grid-rows-[1fr_auto] lg:grid-rows-1 lg:grid-cols-12">
        {/* Hero pane */}
        <motion.div
          className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-br from-background/50 to-background/20 backdrop-blur-xl transform-gpu will-change-transform lg:col-span-9"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
          onFocusCapture={() => setIsInteracting(true)}
          onBlurCapture={() => setIsInteracting(false)}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCard}
              className="absolute inset-0"
              initial={{ opacity: 0.0, scale: reduceMotion ? 1 : 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              {!imgReady && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-background/40 to-background/20" />
              )}
              <img
                src={showcaseItems[activeCard].src}
                alt={showcaseItems[activeCard].title}
                className={`w-full h-full object-cover transition-opacity duration-300 ${
                  imgReady ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => setImgReady(true)}
                loading="eager"
                decoding="async"
                fetchPriority="high"
              />
              <div
                className={`absolute inset-0 bg-gradient-to-br ${showcaseItems[activeCard].color}`}
              />
              {/* Soft vignette to help legibility on small screens */}
              <div className="absolute inset-0 pointer-events-none [background:radial-gradient(120%_60%_at_50%_100%,_rgba(0,0,0,0.28),_transparent_60%)]" />
            </motion.div>
          </AnimatePresence>

          {/* Content overlay */}
          <div className="absolute inset-0 p-4 sm:p-6 md:p-8 flex flex-col justify-end pointer-events-none">
            <div className="max-w-xl sm:max-w-md md:max-w-lg bg-background/20 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 pointer-events-auto">
              <div className="flex items-center gap-2 mb-2">
                {React.createElement(showcaseItems[activeCard].icon, {
                  className: `h-5 w-5 text-${showcaseItems[activeCard].accent}`,
                })}
                <span className="text-xs uppercase tracking-wide text-foreground/70">
                  Featured
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                {showcaseItems[activeCard].title}
              </h3>
              <p className="text-sm md:text-base text-foreground/80 mt-1">
                {showcaseItems[activeCard].subtitle}
              </p>

              {/* Controls + dots become stacked on small screens */}
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={goPrev}
                    className="px-3 py-2 text-xs md:text-sm rounded-lg bg-background/40 border border-white/10 hover:bg-background/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/60"
                    aria-label="Previous"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setAutoplay((v) => !v)}
                    className="px-3 py-2 text-xs md:text-sm rounded-lg bg-background/40 border border-white/10 hover:bg-background/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/60"
                    aria-pressed={autoplay}
                  >
                    {autoplay ? "Pause" : "Play"}
                  </button>
                  <button
                    onClick={goNext}
                    className="px-3 py-2 text-xs md:text-sm rounded-lg bg-background/40 border border-white/10 hover:bg-background/60 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/60"
                    aria-label="Next"
                  >
                    Next
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {showcaseItems.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveCard(i)}
                      aria-label={`Go to slide ${i + 1}`}
                      aria-current={i === activeCard ? "true" : "false"}
                      title={`Slide ${i + 1}: ${showcaseItems[i].title}`}
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        i === activeCard
                          ? "w-6 bg-cream"
                          : "w-2.5 bg-white/40 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Ambient glow */}
          <motion.div
            aria-hidden
            className="absolute -top-24 -right-24 w-72 h-72 rounded-full opacity-25 blur-3xl"
            style={{
              background: `radial-gradient(circle, hsl(var(--${showcaseItems[activeCard].accent})) 0%, transparent 60%)`,
            }}
            initial={{ scale: 0.9, opacity: 0.15 }}
            animate={{ scale: 1, opacity: 0.25 }}
            transition={{ duration: reduceMotion ? 0 : 0.8 }}
          />
        </motion.div>

        {/* Bottom Dock (mobile & tablet) */}
        <div
          className="flex lg:hidden gap-3 overflow-x-auto px-1 py-1 snap-x snap-mandatory"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
          }}
        >
          {showcaseItems.map((item, index) => {
            const isActive = index === activeCard;
            return (
              <button
                key={index}
                onClick={() => setActiveCard(index)}
                className={`snap-start shrink-0 w-40 rounded-2xl overflow-hidden border p-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/60 ${
                  isActive
                    ? "border-cream ring-2 ring-cream/40 bg-background/40"
                    : "border-white/10 hover:border-white/20 bg-background/20"
                }`}
                aria-current={isActive ? "true" : "false"}
                title={item.title}
              >
                <div className="relative w-full h-24 rounded-xl overflow-hidden">
                  <img
                    src={item.src}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color}`}
                  />
                </div>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    {React.createElement(item.icon, {
                      className: `h-4 w-4 text-${item.accent}`,
                    })}
                    <span className="text-xs text-foreground/70">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="font-semibold text-sm text-foreground truncate">
                    {item.title}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right rail (desktop only) */}
        <div className="relative col-span-12 lg:col-span-3 hidden lg:flex flex-col gap-3">
          <div
            className="sticky top-6 flex flex-col gap-3 max-h-[70vh] overflow-auto pr-1"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0, black 24px, black calc(100% - 24px), transparent 100%)",
            }}
          >
            {showcaseItems.map((item, index) => {
              const isActive = index === activeCard;
              return (
                <button
                  key={index}
                  onClick={() => setActiveCard(index)}
                  className={`group relative w-full rounded-2xl overflow-hidden border p-2 text-left transition snap-start focus:outline-none focus-visible:ring-2 focus-visible:ring-cream/60 ${
                    isActive
                      ? "border-cream ring-2 ring-cream/40 bg-background/40"
                      : "border-white/10 hover:border-white/20 bg-background/20"
                  }`}
                  aria-current={isActive ? "true" : "false"}
                  title={item.title}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative w-20 h-16 rounded-xl overflow-hidden">
                      <img
                        src={item.src}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform"
                        loading="lazy"
                        decoding="async"
                      />
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${item.color}`}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {React.createElement(item.icon, {
                          className: `h-4 w-4 text-${item.accent}`,
                        })}
                        <span className="text-xs text-foreground/70">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <div className="font-semibold text-sm text-foreground truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-foreground/70 truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cream to-sage" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const VideoLightbox: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    // Prevent scrolling
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        key="overlay-video"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md"
      />

      <motion.div
        key="dialog-video"
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.98 }}
        transition={{ duration: 0.22 }}
        className="fixed inset-0 z-[201] grid place-items-center p-4"
      >
        <div className="relative max-w-md w-full">
          {/* Video Frame - Vertical */}
          <div className="relative rounded-2xl top-10 overflow-hidden border border-white/15 bg-black">
            <video
              src={cafeAmbience}
              controls
              autoPlay
              className="w-full max-h-[85vh] object-contain"
            />

            {/* Close Button */}
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

const HeroSection = () => {
  const [showVideo, setShowVideo] = React.useState(false);

  const scrollToMenu = () => {
    const element = document.querySelector("#menu");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Coffee cup with steam"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-coffee-rich/80 via-coffee-medium/60 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-background/30 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5 mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cream" />
              <span className="text-xs font-medium text-cream/90">
                Small Batch • Fresh Daily
              </span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-bold text-warm-white mb-6 leading-tight"
            >
              Perfect
              <br />
              <span className="text-cream italic">Coffee</span>
              <br />
              Moments
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-cream/90 mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Welcome to Deccan Brews where coffee meets culture. We serve
              premium handcrafted coffee and fresh gourmet food in a warm,
              artistic space designed for conversations, creativity, and
              comfort.
              <p>
                We host live music and cultural events to bring people together
                always free for our guests.
              </p>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="bg-cream text-coffee-rich hover:bg-warm-white transition-all duration-300 shadow-warm px-8 py-6 text-lg font-semibold"
                onClick={scrollToMenu}
              >
                Explore Menu
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="bg-cream text-coffee-rich hover:bg-warm-white transition-all duration-300 shadow-warm px-8 py-6 text-lg font-semibold"
                onClick={() => setShowVideo(true)}
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Story
              </Button>
              {/* Video Lightbox */}
              <AnimatePresence>
                {showVideo && (
                  <VideoLightbox onClose={() => setShowVideo(false)} />
                )}
              </AnimatePresence>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-cream/30"
            >
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-cream">50k+</div>
                <div className="text-cream/70">Happy Customers</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-cream">15+</div>
                <div className="text-cream/70">Coffee Varieties</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-cream">5★</div>
                <div className="text-cream/70">Rating</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            {/* Background gradient sits BEHIND the showcase */}
            <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cream/20" />
            </div>

            {/* Self-contained ModernShowcase card */}
            <div className="relative h-full rounded-3xl overflow-hidden bg-background/10 backdrop-blur-md border border-white/10 shadow-xl ring-1 ring-white/10 z-10">
              <ModernShowcase />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-cream/80 hover:text-cream transition-colors duration-300"
        >
          <span className="text-sm mb-2 font-medium">Discover More</span>
          <ArrowDown className="h-6 w-6" />
        </motion.div>
      </motion.button>
    </section>
  );
};

export default HeroSection;
