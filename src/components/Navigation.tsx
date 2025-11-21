import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState<string>("#home");
  const [scrollProgress, setScrollProgress] = useState(0);
  const firstMobileLinkRef = useRef<HTMLButtonElement | null>(null);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Menu", href: "#menu" },
    { name: "About", href: "#about" },
    { name: "Gallery", href: "#gallery" },
    { name: "Reservations", href: "#reservations" },
  ];

  // Header shrink + scroll progress
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 24);
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setScrollProgress(max > 0 ? (y / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Section spy — highlights active link as you scroll
  useEffect(() => {
    const ids = navItems.map((n) => n.href).filter((h) => h.startsWith("#"));
    const els = ids
      .map((id) => document.querySelector(id))
      .filter(Boolean) as Element[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement && visible.target.id) {
          setActiveHref(`#${visible.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    const root = document.documentElement;
    if (isMobileMenuOpen) {
      const original = root.style.overflow;
      root.style.overflow = "hidden";
      return () => {
        root.style.overflow = original;
      };
    }
  }, [isMobileMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const scrollToSection = (href: string) => {
  if (window.location.pathname !== "/") {
    window.location.href = `/${href}`; // e.g. "/#menu"
    return;
  }
  const el = document.querySelector(href);
  if (el) el.scrollIntoView({ behavior: "smooth" });
  setIsMobileMenuOpen(false);
};


  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 w-full z-50 transition-all duration-500 
          ${isScrolled
            ? "bg-background/30 backdrop-blur-xl shadow-warm border-b border-white/10"
            : "bg-background/70 backdrop-blur-xl border-b border-white/10"
          }`}
      >
        {/* Scroll progress bar */}
        <motion.div
          className="absolute top-0 left-0 h-0.5 bg-coffee-medium"
          style={{ width: `${scrollProgress}%` }}
          transition={{ type: "tween", duration: 0.2 }}
        />

        <div className={`container mx-auto px-6 ${isScrolled ? "py-3" : "py-4"}`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => scrollToSection("#home")}
              className="flex items-center space-x-2"
              aria-label="Go to home"
            >
              <Coffee className="h-8 w-8 text-coffee-medium" />
              <span className="text-2xl font-display font-bold text-coffee-rich">
                Deccan Brews
              </span>
            </motion.button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const isActive = activeHref === item.href;
                return (
                  <button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className={`relative text-foreground transition-colors duration-300 font-medium hover:text-coffee-medium ${
                      isActive ? "text-coffee-medium" : ""
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-coffee-medium rounded-full"
                      />
                    )}
                  </button>
                );
              })}
              <Button
                variant="default"
                className="bg-coffee-medium hover:bg-coffee-rich transition-colors duration-300"
                onClick={() => scrollToSection("#reservations")}
              >
                Reserve Table
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-drawer"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-foreground" />
              ) : (
                <Menu className="h-6 w-6 text-foreground" />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay + Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <div className="absolute inset-0 glass-effect" />
            <motion.aside
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 220 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 top-0 h-full w-[85vw] max-w-80 bg-card shadow-warm p-6 pt-20 pb-[env(safe-area-inset-bottom)]"
            >
              <div className="space-y-6">
                {navItems.map((item, index) => {
                  const isActive = activeHref === item.href;
                  return (
                    <motion.button
                      key={item.name}
                      ref={index === 0 ? firstMobileLinkRef : undefined}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.06 }}
                      onClick={() => scrollToSection(item.href)}
                      className={`block w-full text-left text-lg font-medium transition-colors duration-300 py-2 ${
                        isActive
                          ? "text-coffee-medium"
                          : "text-foreground hover:text-coffee-medium"
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.name}
                    </motion.button>
                  );
                })}

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navItems.length * 0.06 }}
                  className="pt-4"
                >
                  <Button
                    variant="default"
                    className="w-full bg-coffee-medium hover:bg-coffee-rich"
                    onClick={() => scrollToSection("#reservations")}
                  >
                    Reserve Table
                  </Button>
                </motion.div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
