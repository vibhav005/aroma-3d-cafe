import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Play, Coffee, Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import heroImage from '@/assets/hero-coffee.jpg';
import cafeInterior from '@/assets/cafe-interior.jpg';
import latteArt from '@/assets/latte-art.jpg';
import pastries from '@/assets/pastries.jpg';

const ModernShowcase = () => {
  const [activeCard, setActiveCard] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const showcaseItems = [
    {
      src: heroImage,
      title: "Artisanal Coffee",
      subtitle: "Hand-crafted perfection",
      icon: Coffee,
      color: "from-coffee-rich/20 to-coffee-medium/20",
      accent: "coffee-rich"
    },
    {
      src: cafeInterior,
      title: "Premium Space",
      subtitle: "Modern comfort meets tradition",
      icon: Heart,
      color: "from-sage/20 to-sage-light/20",
      accent: "sage"
    },
    {
      src: latteArt,
      title: "Signature Lattes",
      subtitle: "Art in every cup",
      icon: Star,
      color: "from-cream/20 to-warm-white/20",
      accent: "cream"
    },
    {
      src: pastries,
      title: "Fresh Pastries",
      subtitle: "Baked with passion",
      icon: Coffee,
      color: "from-coffee-light/20 to-coffee-medium/20",
      accent: "coffee-medium"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % showcaseItems.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div 
      className="relative h-full w-full"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Hero Card */}
      <motion.div
        className="relative h-full rounded-3xl overflow-hidden bg-gradient-to-br from-background/40 to-background/20 backdrop-blur-xl border border-sage/30"
        style={{
          transform: isHovering 
            ? `perspective(1000px) rotateX(${(mousePosition.y - 50) * 0.1}deg) rotateY(${(mousePosition.x - 50) * 0.1}deg)`
            : 'none',
          transition: 'transform 0.1s ease-out'
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCard}
            initial={{ opacity: 0, scale: 1.1, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotateY: -15 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <img 
              src={showcaseItems[activeCard].src}
              alt={showcaseItems[activeCard].title}
              className="w-full h-full object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-br ${showcaseItems[activeCard].color} backdrop-blur-[1px]`} />
          </motion.div>
        </AnimatePresence>

        {/* Floating Glass Cards */}
        <div className="absolute inset-4 pointer-events-none">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={index}
              className={`absolute bg-background/10 backdrop-blur-md rounded-2xl border border-white/20 p-4 cursor-pointer pointer-events-auto ${
                index === activeCard ? 'ring-2 ring-cream/50' : ''
              }`}
              style={{
                left: `${20 + (index % 2) * 50}%`,
                top: `${20 + Math.floor(index / 2) * 35}%`,
                width: '180px',
                height: '120px',
              }}
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                y: 0, 
                scale: index === activeCard ? 1.05 : 1,
                rotate: index === activeCard ? 2 : 0
              }}
              transition={{ 
                delay: index * 0.1, 
                duration: 0.6,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                transition: { duration: 0.2 } 
              }}
              onClick={() => setActiveCard(index)}
            >
              <div className="flex items-center mb-2">
                {React.createElement(item.icon, { 
                  className: `h-5 w-5 text-${item.accent}` 
                })}
                <span className="ml-2 text-xs text-foreground/80 font-medium">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground mb-1">{item.title}</h4>
              <p className="text-xs text-foreground/70">{item.subtitle}</p>
              
              {/* Mini preview */}
              <div className="absolute bottom-2 right-2 w-8 h-8 rounded-lg overflow-hidden opacity-60">
                <img src={item.src} alt="" className="w-full h-full object-cover" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ambient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-32 h-32 rounded-full opacity-20"
              style={{
                background: `radial-gradient(circle, hsl(var(--${showcaseItems[activeCard].accent})) 0%, transparent 70%)`,
                left: `${30 + i * 25}%`,
                top: `${20 + i * 30}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                x: [0, Math.sin(i) * 20, 0],
                y: [0, Math.cos(i) * 15, 0],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.5,
              }}
            />
          ))}
        </div>

        {/* Status Indicator */}
        <motion.div
          className="absolute top-6 right-6 flex items-center space-x-2 bg-background/20 backdrop-blur-md rounded-full px-4 py-2 border border-white/10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="w-2 h-2 bg-sage rounded-full"
            animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-foreground/80 font-medium">Live</span>
        </motion.div>

        {/* Progress Bar */}
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-foreground/60">Experience Preview</span>
            <span className="text-xs text-foreground/60">
              {activeCard + 1} / {showcaseItems.length}
            </span>
          </div>
          <div className="h-1 bg-background/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-cream to-sage"
              initial={{ width: "0%" }}
              animate={{ width: `${((activeCard + 1) / showcaseItems.length) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const HeroSection = () => {
  const scrollToMenu = () => {
    const element = document.querySelector('#menu');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
              Experience the perfect blend of artisanal coffee, cozy atmosphere, 
              and exceptional service in our modern cafe sanctuary.
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
                className="border-2 border-cream text-cream hover:bg-cream hover:text-coffee-rich transition-all duration-300 px-8 py-6 text-lg font-semibold"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Story
              </Button>
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
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cream/10 rounded-3xl backdrop-blur-sm">
              <ModernShowcase />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 right-12 bg-cream/20 backdrop-blur-sm rounded-full p-4"
            >
              <div className="text-cream text-sm font-medium">
                Interactive<br />Showcase
              </div>
            </motion.div>
            
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute bottom-12 left-12 bg-sage/20 backdrop-blur-sm rounded-full p-4"
            >
              <div className="text-cream text-sm font-medium">
                Freshly<br />Roasted Daily
              </div>
            </motion.div>
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