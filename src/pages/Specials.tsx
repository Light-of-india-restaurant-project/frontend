import { motion } from "framer-motion";
import { Sparkles, Star, Clock, Tag } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";

const Specials = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(40, 33%, 96%)" }}>
      <Header />

      {/* Hero Banner */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, hsl(25, 30%, 20%), hsl(25, 30%, 25%))",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-secondary rounded-full" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 border border-secondary rounded-full" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles
              className="mx-auto mb-4"
              size={48}
              style={{ color: "hsl(43, 74%, 49%)" }}
            />
            <h1
              className="text-4xl md:text-6xl font-display mb-4"
              style={{ color: "hsl(40, 33%, 96%)" }}
            >
              {language === "nl" ? "Speciale Aanbiedingen" : "Special Offers"}
            </h1>
            <p
              className="text-xl font-serif max-w-2xl mx-auto"
              style={{ color: "hsla(40, 33%, 96%, 0.8)" }}
            >
              {language === "nl"
                ? "Ontdek onze exclusieve aanbiedingen en seizoensgebonden specialiteiten"
                : "Discover our exclusive deals and seasonal specialties"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Specials Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading
            title={language === "nl" ? "Wat is er speciaal?" : "What's Special?"}
            subtitle={
              language === "nl"
                ? "Onze chef-koks bereiden speciale gerechten en aanbiedingen voor u"
                : "Our chefs prepare special dishes and offers just for you"
            }
          />

          {/* Coming Soon / No Specials State */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-center mt-12"
          >
            <div
              className="rounded-2xl p-12 shadow-lg"
              style={{
                backgroundColor: "hsl(25, 30%, 20%)",
                border: "1px solid hsla(43, 74%, 49%, 0.3)",
              }}
            >
              <Star
                className="mx-auto mb-6"
                size={56}
                style={{ color: "hsl(43, 74%, 49%)" }}
              />
              <h3
                className="text-3xl font-display mb-4"
                style={{ color: "hsl(43, 74%, 49%)" }}
              >
                {language === "nl" ? "Binnenkort beschikbaar" : "Coming Soon"}
              </h3>
              <p
                className="text-lg font-serif leading-relaxed mb-8"
                style={{ color: "hsla(40, 33%, 96%, 0.8)" }}
              >
                {language === "nl"
                  ? "We bereiden spannende speciale aanbiedingen voor u voor. Kom snel terug om onze exclusieve deals en seizoensgebonden specialiteiten te ontdekken!"
                  : "We're preparing exciting special offers for you. Check back soon to discover our exclusive deals and seasonal specialties!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/#menu"
                  className="px-8 py-3 font-serif text-lg transition-all hover:scale-105"
                  style={{
                    backgroundColor: "hsl(43, 74%, 49%)",
                    color: "hsl(25, 30%, 15%)",
                  }}
                >
                  {language === "nl" ? "Bekijk Menu" : "View Menu"}
                </a>
                <a
                  href="/#reservation"
                  className="px-8 py-3 font-serif text-lg transition-all hover:scale-105"
                  style={{
                    border: "2px solid hsl(43, 74%, 49%)",
                    color: "hsl(43, 74%, 49%)",
                  }}
                >
                  {language === "nl" ? "Reserveer een Tafel" : "Reserve a Table"}
                </a>
              </div>
            </div>
          </motion.div>

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            {[
              {
                icon: Tag,
                titleEn: "Exclusive Deals",
                titleNl: "Exclusieve Deals",
                descEn: "Special pricing on selected dishes and combos",
                descNl: "Speciale prijzen op geselecteerde gerechten en combo's",
              },
              {
                icon: Clock,
                titleEn: "Seasonal Specials",
                titleNl: "Seizoensgebonden",
                descEn: "Limited-time dishes featuring seasonal ingredients",
                descNl: "Tijdelijke gerechten met seizoensgebonden ingrediënten",
              },
              {
                icon: Sparkles,
                titleEn: "Chef's Selection",
                titleNl: "Chef's Selectie",
                descEn: "Hand-picked specialties by our head chef",
                descNl: "Door onze chef-kok geselecteerde specialiteiten",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="text-center p-6"
              >
                <feature.icon
                  className="mx-auto mb-4"
                  size={36}
                  style={{ color: "hsl(43, 74%, 49%)" }}
                />
                <h4
                  className="text-xl font-display mb-2"
                  style={{ color: "hsl(25, 30%, 20%)" }}
                >
                  {language === "nl" ? feature.titleNl : feature.titleEn}
                </h4>
                <p className="font-serif text-muted-foreground">
                  {language === "nl" ? feature.descNl : feature.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Specials;
