import { motion } from 'framer-motion';
import { Coffee, Heart, Users, Award } from 'lucide-react';
import cafeInteriorImage from '@/assets/cafe-interior.jpg';

const stats = [
  { icon: Coffee, value: '10k+', label: 'Cups Served Daily', color: 'text-coffee-medium' },
  { icon: Heart, value: '98%', label: 'Customer Satisfaction', color: 'text-red-500' },
  { icon: Users, value: '50+', label: 'Team Members', color: 'text-sage' },
  { icon: Award, value: '15+', label: 'Awards Won', color: 'text-yellow-500' },
];

const values = [
  {
    title: 'Artisan Quality',
    description: 'Every cup is crafted with precision using premium beans from sustainable farms worldwide.',
    icon: Coffee,
  },
  {
    title: 'Community First',
    description: 'We believe in building connections and creating a welcoming space for everyone.',
    icon: Heart,
  },
  {
    title: 'Sustainability',
    description: 'Committed to eco-friendly practices from bean to cup, supporting local and organic suppliers.',
    icon: Users,
  },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23886B47' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

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
            Our Story
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Born from a passion for exceptional coffee and genuine hospitality
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl shadow-warm">
              <img 
                src={cafeInteriorImage} 
                alt="Cozy cafe interior with warm lighting and plants"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coffee-rich/30 to-transparent" />
            </div>
            
            {/* Floating Stats Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="absolute -bottom-6 -right-6 bg-card/95 backdrop-blur-sm rounded-xl p-6 shadow-floating border border-border/50"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-coffee-medium mb-1">2018</div>
                <div className="text-sm text-muted-foreground">Founded</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-display font-semibold text-coffee-rich mb-6">
              Crafting Exceptional Experiences Since 2018
            </h3>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              What started as a dream to create the perfect coffee experience has grown into 
              a beloved community gathering place. We source our beans directly from farmers 
              who share our commitment to quality and sustainability.
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our cozy space combines modern design with warm, natural elements—from reclaimed 
              wood tables to living walls filled with plants. Every detail is thoughtfully 
              curated to create an atmosphere where conversations flow as smoothly as our coffee.
            </p>

            {/* Values Grid */}
            <div className="grid gap-4 mt-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="flex gap-4 p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-coffee-medium/10 rounded-lg flex items-center justify-center">
                      <value.icon className="h-6 w-6 text-coffee-medium" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-coffee-rich mb-2">{value.title}</h4>
                    <p className="text-muted-foreground text-sm">{value.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-gradient-to-r from-coffee-medium/5 to-sage/5 p-8 rounded-2xl"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center shadow-soft group-hover:shadow-warm transition-shadow duration-300">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </div>
              <div className="text-3xl font-bold text-coffee-rich mb-1">{stat.value}</div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mt-20"
        >
          <div className="max-w-4xl mx-auto">
            <blockquote className="text-2xl md:text-3xl font-display font-medium text-coffee-rich leading-relaxed italic">
              "We believe that great coffee has the power to bring people together, 
              spark conversations, and create moments of joy in everyday life."
            </blockquote>
            <footer className="mt-6 text-muted-foreground">
              — Maria Rodriguez, Founder & Head Roaster
            </footer>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;