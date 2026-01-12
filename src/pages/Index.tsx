import Logo from "@/components/Logo";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Logo variant="image" size="md" />
          <nav className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-foreground/80 hover:text-primary transition-colors font-serif">
              Menu
            </a>
            <a href="#about" className="text-foreground/80 hover:text-primary transition-colors font-serif">
              About
            </a>
            <a href="#gallery" className="text-foreground/80 hover:text-primary transition-colors font-serif">
              Gallery
            </a>
            <a href="#contact" className="text-foreground/80 hover:text-primary transition-colors font-serif">
              Contact
            </a>
            <button className="bg-primary text-primary-foreground px-6 py-2 font-serif hover:bg-primary/90 transition-colors">
              Reserve Table
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center pt-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-8 animate-fade-in">
            <Logo variant="image" size="lg" className="mx-auto h-24 md:h-32" />
          </div>
          <p className="text-xl md:text-2xl font-serif text-muted-foreground mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Fine Dining Indian Cuisine
          </p>
          <p className="text-lg font-serif text-muted-foreground/80 mb-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            Kortekade 1, Rotterdam
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: "0.6s" }}>
            <button className="bg-primary text-primary-foreground px-8 py-3 font-serif text-lg hover:bg-primary/90 transition-colors">
              Reserve Your Table
            </button>
            <button className="border-2 border-secondary text-secondary-foreground px-8 py-3 font-serif text-lg hover:bg-secondary/10 transition-colors">
              View Menu
            </button>
          </div>
        </div>
      </section>

      {/* Logo Variants Preview (temporary for review) */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-display text-center mb-12 text-foreground">
            Logo Variants
          </h2>
          <div className="grid md:grid-cols-3 gap-12 items-center justify-items-center">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Refined Image Logo</p>
              <div className="bg-background p-8 rounded-lg shadow-sm">
                <Logo variant="image" size="lg" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">Text Logo (Fallback)</p>
              <div className="bg-background p-8 rounded-lg shadow-sm">
                <Logo variant="text" size="lg" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4 uppercase tracking-wider">On Dark Background</p>
              <div className="bg-brown p-8 rounded-lg">
                <Logo variant="image" size="lg" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
