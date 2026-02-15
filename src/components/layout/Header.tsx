import { useState, useRef, useEffect } from "react";
import { Menu, X, User, Package, LogOut, LogIn, ChevronDown } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CartButton } from "@/components/cart/CartDrawer";
import { useLanguage } from "@/lib/i18n";
import { useUserAuth } from "@/contexts/UserAuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const { user, isAuthenticated, logout } = useUserAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: t("nav.menu"), href: "#menu" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.gallery"), href: "#gallery" },
    { label: t("nav.events"), href: "/private-events" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  // Handle navigation for hash links
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a regular route (not hash), let it navigate normally
    if (!href.startsWith("#")) {
      return;
    }

    e.preventDefault();
    
    // If we're not on the home page, navigate to home first with hash
    if (location.pathname !== "/") {
      navigate("/" + href);
    } else {
      // We're on home page, scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

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
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-foreground/80 hover:text-primary transition-colors font-serif text-lg"
            >
              {link.label}
            </a>
          ))}
          <LanguageSwitcher />
          <CartButton />
          
          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary transition-colors font-serif"
              >
                <User size={20} />
                <span className="max-w-[100px] truncate">{user?.fullName || user?.email?.split("@")[0]}</span>
                <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50">
                  <a
                    href="/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-2 text-foreground/80 hover:text-primary hover:bg-muted transition-colors font-serif"
                  >
                    <Package size={18} />
                    {language === "nl" ? "Mijn Bestellingen" : "My Orders"}
                  </a>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-foreground/80 hover:text-destructive hover:bg-muted transition-colors font-serif"
                  >
                    <LogOut size={18} />
                    {language === "nl" ? "Uitloggen" : "Logout"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <a
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-foreground/80 hover:text-primary transition-colors font-serif"
            >
              <LogIn size={20} />
              {language === "nl" ? "Inloggen" : "Login"}
            </a>
          )}
          
          <a
            href="#reservation"
            onClick={(e) => handleNavClick(e, "#reservation")}
            className="bg-primary text-primary-foreground px-6 py-2.5 font-serif hover:bg-primary/90 transition-colors"
          >
            {t("nav.reserve")}
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          <CartButton />
          <button
            className="p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
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
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            
            {/* Mobile User Menu */}
            {isAuthenticated ? (
              <>
                <div className="border-t border-border pt-4 mt-2">
                  <p className="font-serif text-muted-foreground text-sm mb-2">
                    {language === "nl" ? "Ingelogd als" : "Logged in as"}
                  </p>
                  <p className="font-serif text-foreground truncate">
                    {user?.fullName || user?.email}
                  </p>
                </div>
                <a
                  href="/orders"
                  className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors font-serif text-lg py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Package size={20} />
                  {language === "nl" ? "Mijn Bestellingen" : "My Orders"}
                </a>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="flex items-center gap-3 text-foreground/80 hover:text-destructive transition-colors font-serif text-lg py-2"
                >
                  <LogOut size={20} />
                  {language === "nl" ? "Uitloggen" : "Logout"}
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="flex items-center gap-3 text-foreground/80 hover:text-primary transition-colors font-serif text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn size={20} />
                {language === "nl" ? "Inloggen" : "Login"}
              </a>
            )}
            
            <div className="py-2">
              <LanguageSwitcher />
            </div>
            <a
              href="#reservation"
              className="bg-primary text-primary-foreground px-6 py-3 font-serif text-center hover:bg-primary/90 transition-colors mt-2"
              onClick={(e) => handleNavClick(e, "#reservation")}
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
