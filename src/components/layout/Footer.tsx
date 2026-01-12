import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import Logo from "@/components/Logo";

const Footer = () => {
  return (
    <footer className="bg-brown text-cream py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Logo variant="image" size="lg" className="mb-6 brightness-0 invert" />
            <p className="font-serif text-cream/80 leading-relaxed">
              Experience the finest Indian cuisine in an elegant setting. 
              Every dish tells a story of tradition and innovation.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg mb-6 text-secondary">Contact</h4>
            <ul className="space-y-4 font-serif">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-secondary mt-1 flex-shrink-0" />
                <span className="text-cream/80">
                  Kortekade 1<br />
                  Rotterdam, Netherlands
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-secondary flex-shrink-0" />
                <a href="tel:+31101234567" className="text-cream/80 hover:text-secondary transition-colors">
                  +31 10 123 4567
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary flex-shrink-0" />
                <a href="mailto:info@lightofindia.nl" className="text-cream/80 hover:text-secondary transition-colors">
                  info@lightofindia.nl
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-display text-lg mb-6 text-secondary">Opening Hours</h4>
            <ul className="space-y-3 font-serif text-cream/80">
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-secondary mt-1 flex-shrink-0" />
                <div>
                  <p className="font-medium text-cream">Tue - Thu</p>
                  <p>17:00 - 22:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-secondary mt-1 flex-shrink-0 opacity-0" />
                <div>
                  <p className="font-medium text-cream">Fri - Sat</p>
                  <p>17:00 - 23:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-secondary mt-1 flex-shrink-0 opacity-0" />
                <div>
                  <p className="font-medium text-cream">Sunday</p>
                  <p>16:00 - 21:00</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="text-secondary mt-1 flex-shrink-0 opacity-0" />
                <div>
                  <p className="font-medium text-cream/60">Monday</p>
                  <p className="text-cream/60">Closed</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Quick Links & Social */}
          <div>
            <h4 className="font-display text-lg mb-6 text-secondary">Follow Us</h4>
            <div className="flex gap-4 mb-8">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-secondary hover:text-brown transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-secondary hover:text-brown transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
            </div>
            <div className="space-y-2 font-serif">
              <a href="#menu" className="block text-cream/80 hover:text-secondary transition-colors">
                Our Menu
              </a>
              <a href="#reservation" className="block text-cream/80 hover:text-secondary transition-colors">
                Reservations
              </a>
              <a href="#contact" className="block text-cream/80 hover:text-secondary transition-colors">
                Private Events
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/60 text-sm font-serif">
            © {new Date().getFullYear()} Light of India. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm font-serif text-cream/60">
            <a href="/privacy" className="hover:text-secondary transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-secondary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
