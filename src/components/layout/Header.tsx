import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/lib/i18n";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { label: t("nav.menu"), href: "#menu" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.gallery"), href: "#gallery" },
    { label: t("nav.events"), href: "/private-events" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/" className="hover:opacity-90 transition-opacity">
          <Logo variant="image" size="md" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-foreground/80 hover:text-primary transition-colors font-serif text-lg"
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher />
          <a
            href="#reservation"
            className="bg-primary text-primary-foreground px-6 py-2.5 font-serif hover:bg-primary/90 transition-colors"
          >
            {t("nav.reserve")}
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-background border-t border-border animate-fade-in">
          <div className="container mx-auto px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-foreground/80 hover:text-primary transition-colors font-serif text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            <a
              href="#reservation"
              className="bg-primary text-primary-foreground px-6 py-3 font-serif text-center hover:bg-primary/90 transition-colors mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.reserve")}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
