import Logo from "@/components/Logo";
import { useLanguage } from "@/lib/i18n";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with overlay - inline style as bulletproof fallback */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, hsla(25, 30%, 20%, 0.95), hsla(25, 30%, 20%, 0.85), hsl(40, 33%, 96%))'
        }}
      />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-secondary rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 border border-secondary rounded-full" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="mb-8 animate-fade-in">
          <Logo variant="image" size="lg" className="mx-auto h-28 md:h-40" />
        </div>
        
        <p
          className="text-xl md:text-2xl font-serif text-cream/90 mb-2 animate-fade-in"
          style={{ animationDelay: "0.2s", color: "hsla(40, 33%, 96%, 0.9)" }}
        >
          {t("hero.tagline")}
        </p>
        
        <div
          className="flex items-center justify-center gap-4 mb-8 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="h-px w-16 bg-secondary/60" />
          <span className="font-serif tracking-widest text-sm uppercase" style={{ color: "hsl(43, 74%, 49%)" }}>
            Rotterdam
          </span>
          <span className="h-px w-16 bg-secondary/60" />
        </div>
        
        <p
          className="text-lg md:text-xl font-serif text-cream/70 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.4s", color: "hsla(40, 33%, 96%, 0.85)" }}
        >
          {t("hero.subtitle")}
        </p>
        
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="#reservation"
            className="px-10 py-4 font-serif text-lg transition-all hover:scale-105"
            style={{ backgroundColor: "hsl(43, 74%, 49%)", color: "hsl(25, 30%, 15%)" }}
          >
            {t("hero.cta.reserve")}
          </a>
          <a
            href="#menu"
            className="px-10 py-4 font-serif text-lg transition-all"
            style={{ border: "2px solid hsla(40, 33%, 96%, 0.4)", color: "hsl(40, 33%, 96%)" }}
          >
            {t("hero.cta.menu")}
          </a>
        </div>


      </div>
    </section>
  );
};

export default HeroSection;
