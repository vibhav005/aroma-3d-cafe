import { motion } from 'framer-motion';
import { Instagram, Heart, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-coffee.jpg';
import cafeInteriorImage from '@/assets/cafe-interior.jpg';
import latteImage from '@/assets/latte-art.jpg';
import pastriesImage from '@/assets/pastries.jpg';

const galleryItems = [
  {
    id: 1,
    image: heroImage,
    title: 'Perfect Morning Brew',
    description: 'Start your day with our signature blend',
    likes: 342,
    category: 'Coffee'
  },
  {
    id: 2,
    image: cafeInteriorImage,
    title: 'Cozy Interior',
    description: 'Warm atmosphere perfect for work or relaxation',
    likes: 289,
    category: 'Interior'
  },
  {
    id: 3,
    image: latteImage,
    title: 'Artisan Latte Art',
    description: 'Every cup is a work of art',
    likes: 456,
    category: 'Latte Art'
  },
  {
    id: 4,
    image: pastriesImage,
    title: 'Fresh Pastries',
    description: 'Baked daily with love and premium ingredients',
    likes: 198,
    category: 'Pastries'
  },
  {
    id: 5,
    image: heroImage,
    title: 'Golden Hour Coffee',
    description: 'Perfect lighting, perfect coffee',
    likes: 523,
    category: 'Coffee'
  },
  {
    id: 6,
    image: cafeInteriorImage,
    title: 'Community Space',
    description: 'Where conversations and friendships bloom',
    likes: 167,
    category: 'Interior'
  },
];

const categories = ['All', 'Coffee', 'Interior', 'Latte Art', 'Pastries'];

const GallerySection = () => {
  return (
    <section id="gallery" className="py-20 bg-background relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-coffee-medium/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-sage/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-coffee-rich mb-4">
            Our Gallery
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Moments captured, memories made. Follow our journey through coffee, community, and creativity.
          </p>

          {/* Social Link */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Button
              variant="outline"
              className="border-2 border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow @AromaCafe
            </Button>
          </motion.div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
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

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-soft hover:shadow-warm transition-all duration-500"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 lg:h-80 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-coffee-rich/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4 bg-coffee-medium/90 text-cream px-3 py-1 rounded-full text-sm font-medium">
                  {item.category}
                </div>
                
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-coffee-medium hover:bg-background transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center text-coffee-medium hover:bg-background transition-colors"
                  >
                    <Share className="h-4 w-4" />
                  </motion.button>
                </div>
                
                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-xl font-semibold text-cream mb-2">
                    {item.title}
                  </h3>
                  <p className="text-cream/80 text-sm mb-3">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-cream/60">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{item.likes}</span>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-cream hover:text-cream/80 text-sm font-medium"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
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

        {/* Instagram Feed CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 text-center bg-gradient-to-r from-coffee-medium/5 to-sage/5 p-12 rounded-3xl"
        >
          <Instagram className="h-16 w-16 text-coffee-medium mx-auto mb-6" />
          <h3 className="text-2xl font-display font-bold text-coffee-rich mb-4">
            Share Your Aroma Moments
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Tag us @AromaCafe and use #AromaMoments to be featured in our gallery. 
            We love seeing how our coffee becomes part of your daily story.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-coffee-medium hover:bg-coffee-rich"
            >
              <Instagram className="mr-2 h-5 w-5" />
              Follow Us
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-2 border-sage text-sage hover:bg-sage hover:text-coffee-rich"
            >
              Share Your Photo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default GallerySection;