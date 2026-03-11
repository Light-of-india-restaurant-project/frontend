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
        <div className="mb-8 animate-fade-in" style={{ filter: 'drop-shadow(0 0 12px hsla(43, 74%, 49%, 0.5)) drop-shadow(0 0 4px hsla(40, 33%, 96%, 0.3))' }}>
          <Logo variant="image" size="lg" className="mx-auto h-32 md:h-48" />
        </div>
        
        <p
          className="text-2xl md:text-3xl font-serif text-cream/90 mb-2 animate-fade-in"
          style={{ animationDelay: "0.2s", color: "hsla(40, 33%, 96%, 0.9)" }}
        >
          {t("hero.tagline")}
        </p>
        
        {/* Opening Hours Banner */}
        <div
          className="my-8 animate-fade-in"
          style={{ animationDelay: "0.25s" }}
        >
          <h2
            className="text-4xl md:text-6xl lg:text-7xl font-display tracking-wide uppercase"
            style={{ color: "hsl(43, 74%, 49%)", textShadow: "0 0 30px hsla(43, 74%, 49%, 0.4)" }}
          >
            {t("hero.openingHours")}
          </h2>
        </div>

        <div
          className="flex items-center justify-center gap-4 mb-8 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="h-px w-16 bg-secondary/60" />
          <span className="font-serif tracking-widest text-base uppercase" style={{ color: "hsl(43, 85%, 60%)", textShadow: "0 0 10px hsla(43, 74%, 49%, 0.5)" }}>
            Rotterdam
          </span>
          <span className="h-px w-16 bg-secondary/60" />
        </div>
        
        <p
          className="text-xl md:text-2xl font-serif text-cream/70 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.4s", color: "hsl(40, 33%, 96%)", textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
        >
          {t("hero.subtitle")}
        </p>
        
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="#reservation"
            className="px-12 py-4 font-serif text-xl transition-all hover:scale-105"
            style={{ backgroundColor: "hsl(43, 74%, 49%)", color: "hsl(25, 30%, 15%)" }}
          >
            {t("hero.cta.reserve")}
          </a>
          <a
            href="#menu"
            className="px-12 py-4 font-serif text-xl transition-all hover:scale-105"
            style={{ border: "2px solid hsl(43, 74%, 49%)", color: "hsl(43, 74%, 49%)", textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}
          >
            {t("hero.cta.menu")}
          </a>
        </div>


      </div>
    </section>
  );
};

export default HeroSection;
