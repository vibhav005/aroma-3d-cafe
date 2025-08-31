import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import MenuSection from '@/components/MenuSection';
import AboutSection from '@/components/AboutSection';
import GallerySection from '@/components/GallerySection';
import ContactSection from '@/components/ContactSection';
import FloatingCTA from '@/components/FloatingCTA';

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main>
        {/* Hero Section with 3D Coffee Scene */}
        <HeroSection />
        
        {/* Menu Section */}
        <MenuSection />
        
        {/* About Section */}
        <AboutSection />
        
        {/* Gallery Section */}
        <GallerySection />
        
        {/* Contact & Reservations Section */}
        <ContactSection />
      </main>
      
      {/* Floating Call-to-Action Button */}
      <FloatingCTA />
      
      {/* Footer */}
      <footer className="bg-coffee-rich text-cream py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-display font-bold mb-4">Aroma Cafe</h3>
              <p className="text-cream/80 mb-6 max-w-md">
                Where exceptional coffee meets warm hospitality. Join us for a perfect blend 
                of artisanal beverages, cozy atmosphere, and community connection.
              </p>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-cream/20 rounded-full flex items-center justify-center hover:bg-cream/30 transition-colors cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-cream/20 rounded-full flex items-center justify-center hover:bg-cream/30 transition-colors cursor-pointer">
                  <span className="text-sm">@</span>
                </div>
                <div className="w-8 h-8 bg-cream/20 rounded-full flex items-center justify-center hover:bg-cream/30 transition-colors cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-cream/80">
                <li><a href="#menu" className="hover:text-cream transition-colors">Menu</a></li>
                <li><a href="#about" className="hover:text-cream transition-colors">About Us</a></li>
                <li><a href="#gallery" className="hover:text-cream transition-colors">Gallery</a></li>
                <li><a href="#contact" className="hover:text-cream transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-cream transition-colors">Careers</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-cream/80 text-sm">
                <li>123 Coffee Street</li>
                <li>New York, NY 10001</li>
                <li className="pt-2">+1 (555) 123-4567</li>
                <li>hello@aromacafe.com</li>
                <li className="pt-2">
                  <strong className="text-cream">Hours:</strong><br />
                  Mon-Fri: 6AM - 9PM<br />
                  Sat-Sun: 7AM - 10PM
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-cream/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-cream/60 text-sm">
            <p>&copy; 2024 Aroma Cafe. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-cream transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-cream transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-cream transition-colors">Accessibility</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;