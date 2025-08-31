import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Calendar, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  {
    icon: MapPin,
    title: 'Visit Us',
    details: ['123 Coffee Street', 'Downtown District', 'New York, NY 10001'],
    color: 'text-coffee-medium',
  },
  {
    icon: Phone,
    title: 'Call Us',
    details: ['+1 (555) 123-4567', 'Text orders welcome'],
    color: 'text-sage',
  },
  {
    icon: Mail,
    title: 'Email Us',
    details: ['hello@aromacafe.com', 'We reply within 24 hours'],
    color: 'text-coffee-light',
  },
  {
    icon: Clock,
    title: 'Open Hours',
    details: ['Mon-Fri: 6:00 AM - 9:00 PM', 'Sat-Sun: 7:00 AM - 10:00 PM'],
    color: 'text-coffee-rich',
  },
];

const ContactSection = () => {
  return (
    <section id="contact" className="py-20 bg-warm-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-coffee-medium/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage/5 rounded-full blur-3xl" />

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
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-display font-semibold text-coffee-rich mb-6">
                Visit Our Cozy Space
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Whether you're looking for your morning pick-me-up, a quiet workspace, 
                or a place to catch up with friends, we're here to welcome you with 
                exceptional coffee and warm hospitality.
              </p>
            </div>

            {/* Contact Cards */}
            <div className="grid gap-6">
              {contactInfo.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-soft hover:shadow-warm transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-lg bg-background flex items-center justify-center ${item.color}`}>
                            <item.icon className="h-6 w-6" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-coffee-rich mb-2">{item.title}</h4>
                          {item.details.map((detail, i) => (
                            <p key={i} className="text-muted-foreground text-sm leading-relaxed">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 pt-6"
            >
              <Button
                className="bg-coffee-medium hover:bg-coffee-rich flex-1"
                size="lg"
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book a Table
              </Button>
              <Button
                variant="outline"
                className="border-2 border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream flex-1"
                size="lg"
              >
                <MessageCircle className="mr-2 h-5 w-5" />
                Live Chat
              </Button>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-warm">
              <CardContent className="p-8">
                <h3 className="text-2xl font-display font-semibold text-coffee-rich mb-6">
                  Send us a Message
                </h3>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-coffee-rich mb-2">
                        First Name
                      </label>
                      <Input 
                        placeholder="John"
                        className="border-coffee-light/30 focus:border-coffee-medium focus:ring-coffee-medium/20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-coffee-rich mb-2">
                        Last Name
                      </label>
                      <Input 
                        placeholder="Doe"
                        className="border-coffee-light/30 focus:border-coffee-medium focus:ring-coffee-medium/20"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-coffee-rich mb-2">
                      Email Address
                    </label>
                    <Input 
                      type="email"
                      placeholder="john@example.com"
                      className="border-coffee-light/30 focus:border-coffee-medium focus:ring-coffee-medium/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-coffee-rich mb-2">
                      Phone Number (Optional)
                    </label>
                    <Input 
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      className="border-coffee-light/30 focus:border-coffee-medium focus:ring-coffee-medium/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-coffee-rich mb-2">
                      Subject
                    </label>
                    <Input 
                      placeholder="How can we help you?"
                      className="border-coffee-light/30 focus:border-coffee-medium focus:ring-coffee-medium/20"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-coffee-rich mb-2">
                      Message
                    </label>
                    <Textarea 
                      placeholder="Tell us more about your inquiry..."
                      rows={5}
                      className="border-coffee-light/30 focus:border-coffee-medium focus:ring-coffee-medium/20 resize-none"
                    />
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit"
                      size="lg"
                      className="w-full bg-coffee-medium hover:bg-coffee-rich transition-colors duration-300"
                    >
                      Send Message
                    </Button>
                  </motion.div>
                </form>
                
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="text-sm text-muted-foreground text-center">
                    We typically respond within <span className="font-medium text-coffee-medium">24 hours</span>.
                    For urgent matters, please call us directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map or Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <Card className="bg-coffee-medium/5 border-coffee-medium/20 p-8">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold text-coffee-rich mb-4">
                Located in the Heart of Downtown
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Easy to find and even easier to love. We're just a short walk from the metro station, 
                with plenty of parking available. Look for our signature wooden sign and the aroma 
                of freshly roasted coffee.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" className="border-coffee-medium text-coffee-medium hover:bg-coffee-medium hover:text-cream">
                  Get Directions
                </Button>
                <Button variant="outline" className="border-sage text-sage hover:bg-sage hover:text-coffee-rich">
                  View on Map
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;