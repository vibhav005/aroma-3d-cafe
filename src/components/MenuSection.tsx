import { motion } from 'framer-motion';
import { Star, Clock, Leaf } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import latteImage from '@/assets/latte-art.jpg';
import pastriesImage from '@/assets/pastries.jpg';

const menuItems = [
  {
    id: 1,
    name: "Signature Latte",
    description: "Rich espresso with perfectly steamed milk and artistic foam",
    price: "$4.50",
    image: latteImage,
    category: "Coffee",
    rating: 4.9,
    time: "3 mins",
    tags: ["Popular", "Signature"]
  },
  {
    id: 2,
    name: "Artisan Croissant",
    description: "Buttery, flaky pastry baked fresh daily with premium ingredients",
    price: "$3.25",
    image: pastriesImage,
    category: "Pastries",
    rating: 4.8,
    time: "2 mins",
    tags: ["Fresh Baked", "Organic"]
  },
  {
    id: 3,
    name: "Cold Brew Concentrate",
    description: "Smooth, bold coffee brewed for 24 hours for maximum flavor",
    price: "$3.75",
    image: latteImage,
    category: "Cold Coffee",
    rating: 4.7,
    time: "1 min",
    tags: ["Refreshing", "Strong"]
  },
  {
    id: 4,
    name: "Avocado Toast Deluxe",
    description: "Smashed avocado on sourdough with microgreens and sea salt",
    price: "$8.50",
    image: pastriesImage,
    category: "Brunch",
    rating: 4.6,
    time: "5 mins",
    tags: ["Healthy", "Vegan"]
  },
  {
    id: 5,
    name: "Cappuccino Classic",
    description: "Traditional Italian cappuccino with perfect foam to espresso ratio",
    price: "$4.00",
    image: latteImage,
    category: "Coffee",
    rating: 4.8,
    time: "3 mins",
    tags: ["Classic", "Traditional"]
  },
  {
    id: 6,
    name: "Seasonal Fruit Tart",
    description: "Delicate pastry filled with vanilla cream and fresh seasonal fruits",
    price: "$5.75",
    image: pastriesImage,
    category: "Desserts",
    rating: 4.9,
    time: "Ready",
    tags: ["Seasonal", "Premium"]
  }
];

const categories = ["All", "Coffee", "Pastries", "Cold Coffee", "Brunch", "Desserts"];

const MenuSection = () => {
  return (
    <section id="menu" className="py-20 bg-warm-gradient">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-coffee-rich mb-4">
            Our Menu
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Carefully crafted beverages and artisanal treats made with love and premium ingredients
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category, index) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                index === 0 
                  ? 'bg-coffee-medium text-cream shadow-warm' 
                  : 'bg-card hover:bg-coffee-light/20 text-foreground hover:shadow-soft'
              }`}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Menu Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="group hover:shadow-warm transition-all duration-500 overflow-hidden border-0 bg-card/80 backdrop-blur-sm">
                <div className="relative overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {item.tags.map((tag) => (
                      <Badge key={tag} className="bg-coffee-medium/90 text-cream text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm rounded-full p-2">
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{item.rating}</span>
                    </div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-semibold text-coffee-rich group-hover:text-coffee-medium transition-colors duration-300">
                      {item.name}
                    </h3>
                    <span className="text-2xl font-bold text-coffee-medium">
                      {item.price}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {item.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{item.time}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Leaf className="h-4 w-4 text-sage" />
                        <span>{item.category}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-coffee-medium hover:bg-coffee-rich text-cream px-4 py-2 rounded-full font-medium transition-colors duration-300"
                    >
                      Add to Order
                    </motion.button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View Full Menu Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-transparent border-2 border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream px-8 py-4 rounded-full font-semibold transition-all duration-300 shadow-soft hover:shadow-warm"
          >
            View Full Menu
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default MenuSection;