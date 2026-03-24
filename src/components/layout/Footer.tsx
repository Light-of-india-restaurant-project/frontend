import { Phone, Mail, MapPin, Clock, Facebook, Instagram } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import { useLanguage } from "@/lib/i18n";
import { useOperatingHours } from "@/hooks/use-operating-hours";

const Footer = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { getGroupedHours } = useOperatingHours();
  const hoursGroups = getGroupedHours(language);

  // Handle navigation for hash links - smooth scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) {
      return;
    }

    e.preventDefault();
    
    if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <footer className="bg-brown text-cream py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-12">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Logo variant="image" size="lg" className="mb-6 brightness-0 invert" />
            <p className="font-serif text-cream/80 leading-relaxed">
              {t("footer.tagline")}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display text-lg mb-6 text-secondary">{t("footer.contact")}</h4>
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
                <a href="tel:+31103072299" className="text-cream/80 hover:text-secondary transition-colors">
                  010 307 22 99
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-secondary flex-shrink-0" />
                <a href="mailto:zafar@LightofIndia.nl" className="text-cream/80 hover:text-secondary transition-colors">
                  zafar@LightofIndia.nl
                </a>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-display text-lg mb-6 text-secondary">{t("footer.hours")}</h4>
            <ul className="space-y-3 font-serif text-cream/80">
              {hoursGroups.map((group, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Clock size={18} className={`text-secondary mt-1 flex-shrink-0${idx > 0 ? " opacity-0" : ""}`} />
                  <div>
                    <p className={`font-medium ${group.isOpen ? "text-cream" : "text-cream/60"}`}>{group.days}</p>
                    <p className={group.isOpen ? "" : "text-cream/60"}>{group.hours}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-6 text-secondary">
              {language === 'nl' ? 'Snelle Links' : 'Quick Links'}
            </h4>
            <div className="space-y-2 font-serif">
              <a href="#menu" onClick={(e) => handleNavClick(e, "#menu")} className="block text-cream/80 hover:text-secondary transition-colors">
                {t("nav.menu")}
              </a>
              <a href="/menu" className="block text-cream/80 hover:text-secondary transition-colors">
                {t("nav.orderOnline")}
              </a>
              <a href="#about" onClick={(e) => handleNavClick(e, "#about")} className="block text-cream/80 hover:text-secondary transition-colors">
                {t("nav.about")}
              </a>
              <a href="#gallery" onClick={(e) => handleNavClick(e, "#gallery")} className="block text-cream/80 hover:text-secondary transition-colors">
                {t("nav.gallery")}
              </a>
              <a href="#contact" onClick={(e) => handleNavClick(e, "#contact")} className="block text-cream/80 hover:text-secondary transition-colors">
                {t("nav.contact")}
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg mb-6 text-secondary">
              {language === 'nl' ? 'Diensten' : 'Services'}
            </h4>
            <div className="space-y-2 font-serif">
              <a href="/private-events" className="block text-cream/80 hover:text-secondary transition-colors">
                {t("nav.events")}
              </a>
              <a href="/catering" className="block text-cream/80 hover:text-secondary transition-colors">
                Catering
              </a>
              <a href="/specials" className="block text-cream/80 hover:text-secondary transition-colors">
                {t("nav.specials")}
              </a>
              <a href="#reservation" onClick={(e) => handleNavClick(e, "#reservation")} className="block text-cream/80 hover:text-secondary transition-colors">
                {t("nav.reserve")}
              </a>
            </div>
            <div className="flex gap-4 mt-6">
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
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/60 text-sm font-serif">
            © {new Date().getFullYear()} Light of India. {t("footer.rights")}
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
