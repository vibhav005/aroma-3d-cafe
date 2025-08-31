import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling down 100px
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleOrderClick = () => {
    if (orderCount === 0) {
      setIsExpanded(true);
      setOrderCount(1);
    } else {
      // Navigate to order page or open order modal
      console.log('Opening order page...');
    }
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
          {/* Expanded Quick Order Panel */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                className="mb-4 mr-2"
              >
                <Card className="w-80 shadow-floating bg-card/95 backdrop-blur-md border-coffee-light/20">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-coffee-rich">Quick Order</h3>
                      <button
                        onClick={() => setIsExpanded(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">Signature Latte</div>
                          <div className="text-xs text-muted-foreground">$4.50</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setOrderCount(Math.max(0, orderCount - 1))}
                            className="w-6 h-6 rounded-full bg-muted hover:bg-coffee-light/20 flex items-center justify-center transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center font-medium">{orderCount}</span>
                          <button
                            onClick={() => setOrderCount(orderCount + 1)}
                            className="w-6 h-6 rounded-full bg-coffee-medium text-cream hover:bg-coffee-rich flex items-center justify-center transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2 border-t border-border">
                        <span className="font-semibold">Total: ${(4.50 * orderCount).toFixed(2)}</span>
                        <Button
                          size="sm"
                          className="bg-coffee-medium hover:bg-coffee-rich"
                          onClick={() => console.log('Checkout')}
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
            whileTap={{ scale: 0.9 }}
            onClick={handleOrderClick}
            className="relative w-16 h-16 bg-coffee-medium hover:bg-coffee-rich text-cream rounded-full shadow-floating hover:shadow-warm transition-all duration-300 flex items-center justify-center group"
          >
            <motion.div
              animate={orderCount > 0 ? { rotate: 360 } : { rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBag className="h-6 w-6" />
            </motion.div>
            
            {/* Order Count Badge */}
            <AnimatePresence>
              {orderCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-sage text-coffee-rich rounded-full flex items-center justify-center text-sm font-bold shadow-soft"
                >
                  {orderCount}
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Ripple Effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-coffee-medium/30"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.button>

          {/* Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute right-full top-1/2 transform -translate-y-1/2 mr-4 pointer-events-none"
          >
            <div className="bg-coffee-rich text-cream px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-warm">
              {orderCount > 0 ? 'View Cart' : 'Quick Order'}
              <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-coffee-rich border-y-4 border-y-transparent" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;