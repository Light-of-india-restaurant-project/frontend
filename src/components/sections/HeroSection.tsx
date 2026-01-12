import Logo from "@/components/Logo";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-brown/95 via-brown/85 to-background z-0" />
      
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
          style={{ animationDelay: "0.2s" }}
        >
          Fine Dining Indian Cuisine
        </p>
        
        <div
          className="flex items-center justify-center gap-4 mb-8 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <span className="h-px w-16 bg-secondary/60" />
          <span className="text-secondary font-serif tracking-widest text-sm uppercase">
            Rotterdam
          </span>
          <span className="h-px w-16 bg-secondary/60" />
        </div>
        
        <p
          className="text-lg md:text-xl font-serif text-cream/70 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in"
          style={{ animationDelay: "0.4s" }}
        >
          Embark on a culinary journey through the rich flavors and traditions 
          of India, crafted with passion in the heart of Rotterdam.
        </p>
        
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in"
          style={{ animationDelay: "0.6s" }}
        >
          <a
            href="#reservation"
            className="bg-secondary text-secondary-foreground px-10 py-4 font-serif text-lg hover:bg-secondary/90 transition-all hover:scale-105"
          >
            Reserve Your Table
          </a>
          <a
            href="#menu"
            className="border-2 border-cream/40 text-cream px-10 py-4 font-serif text-lg hover:bg-cream/10 transition-all"
          >
            Explore Menu
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in"
          style={{ animationDelay: "1s" }}
        >
          <div className="flex flex-col items-center gap-2 text-cream/50">
            <span className="text-xs uppercase tracking-widest font-serif">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-cream/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
