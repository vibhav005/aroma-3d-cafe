import { motion } from 'framer-motion';
import { ArrowDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CoffeeScene3D from './CoffeeScene3D';
import heroImage from '@/assets/hero-coffee.jpg';

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

          {/* Right Content - 3D Scene */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative h-[600px] lg:h-[700px]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cream/10 rounded-3xl backdrop-blur-sm">
              <CoffeeScene3D />
            </div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 right-12 bg-cream/20 backdrop-blur-sm rounded-full p-4"
            >
              <div className="text-cream text-sm font-medium">
                Interactive<br />3D Experience
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