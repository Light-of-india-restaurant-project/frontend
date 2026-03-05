import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";

const AboutSection = () => {
  const { t } = useLanguage();

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
              title={t("about.title")}
              subtitle={t("about.subtitle")}
              align="left"
            />
            
            <div className="space-y-6 font-serif text-lg text-muted-foreground leading-relaxed">
              <p>{t("about.p1")}</p>
              <p>{t("about.p2")}</p>
            </div>

            <div className="mt-10 flex gap-12">
              <div>
                <span className="block text-4xl font-display text-primary">40+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  {t("about.experience")}
                </span>
              </div>
              <div>
                <span className="block text-4xl font-display text-primary">50+</span>
                <span className="text-sm text-muted-foreground uppercase tracking-wider">
                  {t("about.recipes")}
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
