import { motion } from "framer-motion";
import { CalendarDays, Clock3, MapPin, Sparkles } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";

import heroImage from "@/assets/gallery/interior-dining.jpg";

const featuredEvent = {
  date: "Sunday, 15 Nov 2026",
  dateNl: "Zondag, 15 nov 2026",
  titleEn: "Dinner Night with Ustad Faiyaz Hussain",
  titleNl: "Dinner Night met Ustad Faiyaz Hussain",
  subtitleEn: "Geet, Ghazal & Bollywood Songs",
  subtitleNl: "Geet, Ghazal & Bollywood Songs",
  descriptionEn:
    "An elegant live-music dinner evening inspired by our featured event poster. Enjoy an authentic Indian buffet and a vibrant stage performance in a refined setting.",
  descriptionNl:
    "Een elegante live-muziek dineravond, geinspireerd op onze eventposter. Geniet van een authentiek Indiaas buffet en een levendige podiumshow in een verfijnde setting.",
  timeEn: "Buffet 18:00 - 20:30 | Restaurant 16:00 - 22:00",
  timeNl: "Buffet 18:00 - 20:30 | Restaurant 16:00 - 22:00",
  locationEn: "Kortekade 1, Kralingen, Rotterdam",
  locationNl: "Kortekade 1, Kralingen, Rotterdam",
  host: "Gastheer Zafar",
  phonePrimary: "06-38970292",
  phoneSecondary: "010-3072299",
  email: "zafar@lightofindia.nl",
  price: "EUR 32.50 p/p",
};

const UpcomingEvents = () => {
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative h-[55vh] min-h-[460px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={language === "nl" ? "Aankomende evenementen" : "Upcoming events"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/65 to-background" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Sparkles className="w-12 h-12 text-secondary mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-6xl text-primary-foreground mb-5">
              {language === "nl" ? "Aankomende Evenementen" : "Upcoming Events"}
            </h1>
            <p className="font-serif text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              {language === "nl"
                ? "Ontdek wat er binnenkort op onze agenda staat en reserveer op tijd."
                : "Discover what is coming next at our restaurant and reserve your seats early."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <SectionHeading
            title={language === "nl" ? "Aankomend Event" : "Featured Event"}
            subtitle={language === "nl" ? "Eén speciale avond" : "One special evening"}
          />

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto border border-border bg-card/70 backdrop-blur-sm shadow-sm overflow-hidden"
          >
            <div className="relative px-6 py-8 md:px-10 md:py-12 bg-gradient-to-b from-primary/95 via-primary/90 to-primary text-primary-foreground">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,215,128,.25),transparent_40%)]" />

              <div className="relative z-10 text-center">
                <p className="font-serif tracking-[0.3em] uppercase text-primary-foreground/85 text-xs md:text-sm mb-4">
                  {language === "nl" ? "Presents Live" : "Presents Live"}
                </p>
                <h2 className="font-display text-3xl md:text-5xl leading-tight mb-3">
                  {language === "nl" ? featuredEvent.titleNl : featuredEvent.titleEn}
                </h2>
                <p className="font-serif text-lg md:text-2xl text-secondary mb-6">
                  {language === "nl" ? featuredEvent.subtitleNl : featuredEvent.subtitleEn}
                </p>
                <p className="font-serif text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                  {language === "nl" ? featuredEvent.descriptionNl : featuredEvent.descriptionEn}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid md:grid-cols-3 gap-5 mb-8">
                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    {language === "nl" ? "Datum" : "Date"}
                  </p>
                  <div className="flex items-center gap-2 text-foreground font-serif">
                    <CalendarDays className="w-4 h-4 text-secondary" />
                    <span>{language === "nl" ? featuredEvent.dateNl : featuredEvent.date}</span>
                  </div>
                </div>

                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    {language === "nl" ? "Tijden" : "Timings"}
                  </p>
                  <div className="flex items-center gap-2 text-foreground font-serif">
                    <Clock3 className="w-4 h-4 text-secondary" />
                    <span>{language === "nl" ? featuredEvent.timeNl : featuredEvent.timeEn}</span>
                  </div>
                </div>

                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    {language === "nl" ? "Locatie" : "Location"}
                  </p>
                  <div className="flex items-center gap-2 text-foreground font-serif">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>{language === "nl" ? featuredEvent.locationNl : featuredEvent.locationEn}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5 text-center">
                <div className="border border-secondary/40 bg-secondary/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {language === "nl" ? "Buffet" : "Buffet Open"}
                  </p>
                  <p className="font-display text-3xl text-foreground">{featuredEvent.price}</p>
                </div>
                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {language === "nl" ? "Gastheer" : "Host"}
                  </p>
                  <p className="font-serif text-lg text-foreground">{featuredEvent.host}</p>
                  <p className="font-serif text-muted-foreground">{featuredEvent.phonePrimary}</p>
                </div>
                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {language === "nl" ? "Contact" : "Contact"}
                  </p>
                  <p className="font-serif text-lg text-foreground">{featuredEvent.phoneSecondary}</p>
                  <p className="font-serif text-muted-foreground break-all">{featuredEvent.email}</p>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UpcomingEvents;
