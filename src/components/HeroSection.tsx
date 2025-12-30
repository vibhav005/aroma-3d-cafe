import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Coffee, Play, Star, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";

import cafeAmbience from "@/assets/cafe-ambience.mp4";
import vietnameseCoffee from "@/assets/coffee/chill_vietnamese.jpg";
import signatureLatte from "@/assets/coffee/french_velvet.jpg";
import pastries from "@/assets/desserts/cookies.png";
import heroCafe from "@/assets/heroImage.jpeg";
import cafeInterior from "@/assets/interior/4.jpeg";
import { Button } from "@/components/ui/button";

// ---------- Floating Coffee Bean ----------
const CoffeeBean: React.FC<{ delay: number; size: number; left: string }> = ({ delay, size, left }) => (
  <motion.div
    className="absolute pointer-events-none opacity-20"
    style={{ left, top: "-10%" }}
    animate={{
      y: ["0vh", "110vh"],
      rotate: [0, 360],
      opacity: [0, 0.15, 0.15, 0],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      repeat: Infinity,
      delay,
      ease: "linear",
    }}
  >
    <Coffee className="text-cream/70" style={{ width: size, height: size }} />
  </motion.div>
);

// ---------- Showcase Gallery ----------
const galleryItems = [
  {
    src: signatureLatte,
    title: "Signature Latte",
    subtitle: "Light and calming with antioxidants. It offers a calm, refreshing experience.",
    category: "Coffee",
  },
  { src: pastries, title: "Fresh Cookies", subtitle: "Baked daily with love", category: "Food" },
  {
    src: vietnameseCoffee,
    title: "Vietnamese Coffee",
    subtitle: "Rich espresso with perfectly steamed milk and artistic foam",
    category: "Specialty",
  },
  { src: cafeInterior, title: "Cozy Corners", subtitle: "Your second home", category: "Space" },
];

const ShowcaseGallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const reduceMotion = useReducedMotion();

  const next = useCallback(() => setActiveIndex((p) => (p + 1) % galleryItems.length), []);
  const prev = useCallback(
    () => setActiveIndex((p) => (p - 1 + galleryItems.length) % galleryItems.length),
    []
  );

  useEffect(() => {
    if (!isAutoPlaying || reduceMotion) return;
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, next, reduceMotion]);

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, scale: reduceMotion ? 1 : 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.95 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 rounded-3xl overflow-hidden"
        >
          <img
            src={galleryItems[activeIndex].src}
            alt={galleryItems[activeIndex].title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-rich/80 via-coffee-rich/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <span className="inline-block px-3 py-1 bg-secondary/80 text-secondary-foreground text-xs font-semibold rounded-full mb-2">
              {galleryItems[activeIndex].category}
            </span>

            <h3 className="text-2xl font-display font-bold text-cream mb-1">
              {galleryItems[activeIndex].title}
            </h3>
            <p className="text-cream/80 text-sm">{galleryItems[activeIndex].subtitle}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-4">
          <div className="flex gap-2">
            {galleryItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIndex ? "w-8 bg-primary" : "w-1.5 bg-cream/40 hover:bg-cream/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={prev}
              className="p-2 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream hover:bg-cream/20 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="p-2 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 text-cream hover:bg-cream/20 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute -inset-3 rounded-[2rem] border border-primary/20 pointer-events-none" />
    </div>
  );
};

// ---------- Video Lightbox ----------
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
            <video src={cafeAmbience} controls autoPlay className="w-full max-h-[85vh] object-contain" />

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

// ---------- UI Bits ----------
const StatCard: React.FC<{ value: string; label: string; delay: number }> = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="text-center lg:text-left"
  >
    <div className="text-3xl md:text-4xl font-display font-bold text-cream">{value}</div>
    <div className="text-cream/70 text-sm">{label}</div>
  </motion.div>
);

const FeatureBadge: React.FC<{ icon: React.ReactNode; text: string; delay: number }> = ({
  icon,
  text,
  delay,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4, delay }}
    className="flex items-center gap-2 px-4 py-2 bg-cream/10 backdrop-blur-md rounded-full border border-cream/20"
  >
    {icon}
    <span className="text-cream/90 text-sm font-medium">{text}</span>
  </motion.div>
);

// ---------- Main Hero ----------
const HeroSection: React.FC = () => {
  const [showVideo, setShowVideo] = React.useState(false);

  const scrollToMenu = () => {
    const el = document.querySelector("#menu");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-coffee-rich">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroCafe} alt="Deccan Brews cafe interior" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-coffee-rich via-coffee-rich/90 to-coffee-rich/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-coffee-rich via-transparent to-coffee-rich/30" />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CoffeeBean delay={0} size={24} left="10%" />
        <CoffeeBean delay={3} size={18} left="25%" />
        <CoffeeBean delay={6} size={20} left="75%" />
        <CoffeeBean delay={9} size={16} left="90%" />
      </div>

      {/* Decorative glows */}
      <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-20 w-72 h-72 rounded-full bg-sage/5 blur-3xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-center py-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
          {/* Left */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/15 backdrop-blur-sm rounded-full border border-primary/25 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-cream text-sm font-medium">Small Batch • Fresh Daily</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-cream leading-[1.1] mb-6"
            >
              Where Coffee
              <br />
              Meets{" "}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-cream via-sage-light to-cream bg-clip-text text-transparent">
                  Culture
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-cream to-sage rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-lg md:text-xl text-cream/80 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed"
            >
              Welcome to Deccan Brews premium handcrafted coffee and fresh gourmet food in a warm, artistic
              space designed for conversations, creativity, and comfort.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8"
            >
              <FeatureBadge icon={<Star className="w-4 h-4 text-sage" />} text="Live Music" delay={0.6} />
              <FeatureBadge icon={<Star className="w-4 h-4 text-sage" />} text="Pottery Events" delay={0.6} />
              <FeatureBadge
                icon={<Star className="w-4 h-4 text-sage" />}
                text="Live Streamings"
                delay={0.6}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12"
            >
              <Button
                size="lg"
                onClick={scrollToMenu}
                className="group bg-primary hover:bg-primary-hover text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-warm transition-all duration-300 hover:shadow-floating"
              >
                Explore Menu
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-cream/30 bg-cream/5 text-cream hover:bg-cream/10 hover:border-cream/50 font-semibold px-8 py-6 text-lg rounded-full backdrop-blur-sm transition-all duration-300"
                onClick={() => setShowVideo(true)}
              >
                <Play className="mr-2 w-5 h-5" />
                Watch Story
              </Button>
              {/* Video Lightbox */}
              <AnimatePresence>
                {showVideo && <VideoLightbox onClose={() => setShowVideo(false)} />}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="pt-8 border-t border-cream/20"
            >
              <div className="grid grid-cols-3 gap-6">
                <StatCard value="200+" label="Happy Customers" delay={0.6} />
                <StatCard value="20+" label="Coffee Varieties" delay={0.7} />
                <StatCard value="4.7★" label="Google Rating" delay={0.8} />
              </div>
            </motion.div>
          </div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:col-span-5 hidden lg:block"
          >
            <div className="relative h-[500px] xl:h-[550px]">
              <ShowcaseGallery />

              {/* Floating mini cards */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -left-8 top-1/4 glass-effect p-3 rounded-xl shadow-floating animate-float"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Specialty</div>
                    <div className="text-xs text-muted-foreground">Roasted Fresh</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                className="absolute -right-4 bottom-1/4 glass-effect p-3 rounded-xl shadow-floating animate-float"
                style={{ animationDelay: "1.2s" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">9.30AM – 11.30PM</span>
                    </div>

                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      Fresh brews & bites all day
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Mobile Gallery */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="lg:hidden px-4 pb-8"
      >
        <div className="h-64 sm:h-80">
          <ShowcaseGallery />
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={scrollToMenu}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center text-cream/60 hover:text-cream transition-colors cursor-pointer"
        >
          <span className="text-sm mb-3 font-medium">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-cream/30 flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-primary"
            />
          </div>
        </motion.div>
      </motion.button>

      {/* Noise overlay */}
      <div className="absolute inset-0 pointer-events-none noise-overlay opacity-25" />
    </section>
  );
};

export default HeroSection;
