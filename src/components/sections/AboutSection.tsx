import SectionHeading from "@/components/ui/SectionHeading";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image Side */}
          <div className="relative">
            <div className="aspect-[4/5] bg-muted rounded-sm overflow-hidden">
              {/* Placeholder for restaurant interior image */}
              <div className="w-full h-full bg-gradient-to-br from-brown/20 to-primary/20 flex items-center justify-center">
                <span className="text-muted-foreground font-serif">Restaurant Interior</span>
              </div>
            </div>
            {/* Decorative frame */}
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-secondary -z-10" />
          </div>

          {/* Content Side */}
          <div>
            <SectionHeading
              title="Our Story"
              subtitle="A legacy of authentic flavors"
              align="left"
            />
            
            <div className="space-y-6 font-serif text-lg text-muted-foreground leading-relaxed">
              <p>
                Nestled in the heart of Rotterdam, Light of India brings the rich 
                culinary heritage of the Indian subcontinent to the Netherlands. 
                Our journey began with a simple dream: to share the authentic 
                flavors that have been passed down through generations.
              </p>
              <p>
                Every dish we serve is a celebration of tradition, crafted with 
                the finest spices imported directly from India and prepared with 
                techniques perfected over decades. Our chefs bring years of 
                experience from renowned kitchens across India.
              </p>
              <p>
                Beyond the food, we offer an atmosphere of warmth and elegance, 
                where every guest is treated like family. Whether you are 
                celebrating a special occasion or enjoying a quiet evening, 
                Light of India promises an unforgettable experience.
              </p>
            </div>

            <div className="mt-10 flex gap-12">
              <div>
                <span className="block text-4xl font-display text-primary">15+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  Years of Excellence
                </span>
              </div>
              <div>
                <span className="block text-4xl font-display text-primary">50+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  Signature Dishes
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
