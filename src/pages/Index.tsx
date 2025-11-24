import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import MenuSection from "@/components/MenuSection";
import AboutSection from "@/components/AboutSection";
import GallerySection from "@/components/GallerySection";
import FloatingCTA from "@/components/FloatingCTA";
import Reservations from "@/components/Reservations";

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

        {/* Testimonials Section*/}
        {/* <Testimonials /> */}

        {/* About Section */}
        <AboutSection />

        {/* Gallery Section */}
        <GallerySection />

        <Reservations />

        {/* Contact & Reservations Section */}
        {/* <ContactSection /> */}
      </main>

      {/* Floating Call-to-Action Button */}
      <FloatingCTA />

      {/* Footer */}
      <footer className="bg-coffee-rich text-cream py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <h3 className="text-2xl font-display font-bold mb-4">
                Aroma Cafe
              </h3>
              <p className="text-cream/80 mb-6 max-w-md">
                Where exceptional coffee meets warm hospitality. Join us for a
                perfect blend of artisanal beverages, cozy atmosphere, and
                community connection.
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
                <li>
                  <a
                    href="#menu"
                    className="hover:text-cream transition-colors"
                  >
                    Menu
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="hover:text-cream transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#gallery"
                    className="hover:text-cream transition-colors"
                  >
                    Gallery
                  </a>
                </li>
                <li>
                  <a
                    href="#reservations"
                    className="hover:text-cream transition-colors"
                  >
                    Reservation
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-cream/80 text-sm">
                <li>Shop 15/16/17, ABC Rutuja Elegancet</li>
                <li>Ward 22, Akurdi, Pune</li>
                <li className="pt-2">+91 7387833732</li>
                <li>cafedeccanbrews@gmail.com</li>
                <li className="pt-2">
                  <strong className="text-cream">Hours:</strong>
                  <br />
                  Mon-Fri: 8AM - 11.30PM
                  <br />
                  Sat-Sun: 8AM - 11.30PM
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-cream/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-cream/60 text-sm">
            <p>&copy; 2025 Cafe Deccan Brews. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-cream transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-cream transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-cream transition-colors">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
