import { motion } from "framer-motion";
import { Coffee, Sun, Clock, MapPin, Flame, Leaf, Star, ChevronDown, CalendarClock } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import BreakfastReservationSection from "@/components/sections/BreakfastReservationSection";
import { useLanguage } from "@/lib/i18n";
import breakfastImg from "@/assets/breakfast-reservation.jpeg";

const LAUNCH_DATE = new Date("2026-07-19T00:00:00");

const DesiNashtaBrunch = () => {
  const { t, language } = useLanguage();
  const isLaunched = new Date() >= LAUNCH_DATE;

  const highlights = [
    { icon: Coffee, nameKey: "nashta.dish.chai.name", descKey: "nashta.dish.chai.desc" },
    { icon: Flame, nameKey: "nashta.dish.paratha.name", descKey: "nashta.dish.paratha.desc" },
    { icon: Leaf, nameKey: "nashta.dish.poha.name", descKey: "nashta.dish.poha.desc" },
    { icon: Star, nameKey: "nashta.dish.chole.name", descKey: "nashta.dish.chole.desc" },
    { icon: Sun, nameKey: "nashta.dish.dosa.name", descKey: "nashta.dish.dosa.desc" },
    { icon: Flame, nameKey: "nashta.dish.samosa.name", descKey: "nashta.dish.samosa.desc" },
  ];

  const handleScrollToForm = () => {
    const el = document.getElementById("desi-nashta-reserve");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero — 70% viewport height */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img
            src={breakfastImg}
            alt="Desi Nashta & Brunch at Light of India"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-background/90" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <p
              className="font-serif text-sm tracking-[0.25em] uppercase mb-4"
              style={{ color: "hsl(43, 74%, 49%)" }}
            >
              {t("nashta.badge")}
            </p>
            <h1
              className="font-display text-4xl md:text-6xl mb-4"
              style={{ color: "hsl(43, 74%, 49%)" }}
            >
              {t("nashta.hero.title")}
            </h1>
            <p className="font-serif text-lg md:text-xl text-white/85 max-w-xl mx-auto mb-8">
              {t("nashta.hero.subtitle")}
            </p>
            {isLaunched && (
              <button
                onClick={handleScrollToForm}
                className="flex flex-col items-center gap-2 group"
              >
                <span
                  className="px-8 py-3 font-serif text-base tracking-wide transition-opacity hover:opacity-90"
                  style={{ backgroundColor: "hsl(345, 65%, 25%)", color: "hsl(40, 33%, 96%)" }}
                >
                  {t("nashta.hero.cta")}
                </span>
                <ChevronDown
                  size={18}
                  className="animate-bounce mt-1"
                  style={{ color: "hsl(43, 74%, 49%)" }}
                />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Coming Soon or Reservation Form */}
      {isLaunched ? (
        <BreakfastReservationSection sectionId="desi-nashta-reserve" />
      ) : (
        <section className="py-24 bg-brown text-cream">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-2xl mx-auto"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
                style={{ backgroundColor: "rgba(184,138,46,0.15)", border: "2px solid hsl(43, 74%, 49%)" }}
              >
                <CalendarClock size={36} style={{ color: "hsl(43, 74%, 49%)" }} />
              </div>
              <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "hsl(43, 74%, 49%)" }}>
                {language === "nl" ? "Binnenkort Beschikbaar" : "Coming Soon"}
              </h2>
              <p className="font-serif text-xl text-cream/80 mb-6">
                {language === "nl"
                  ? "Onze Desi Nashta & Brunch start op zaterdag 19 juli 2026. Reserveringen openen binnenkort."
                  : "Our Desi Nashta & Brunch launches on Saturday 19 July 2026. Reservations open soon."}
              </p>
              <div
                className="inline-block px-6 py-3 font-serif text-sm tracking-widest uppercase"
                style={{ border: "1px solid hsl(43, 74%, 49%)", color: "hsl(43, 74%, 49%)" }}
              >
                {language === "nl" ? "Elke Zaterdag & Zondag · 10:00 – 13:30" : "Every Saturday & Sunday · 10:00 – 13:30"}
              </div>
              <p className="font-serif text-cream/60 mt-8 text-sm">
                {language === "nl" ? "Vragen? Bel ons op " : "Questions? Call us at "}
                <a href="tel:+31103072299" className="hover:underline" style={{ color: "hsl(43, 74%, 49%)" }}>010 307 22 99</a>
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Intro & About */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <h2
                className="font-display text-3xl md:text-4xl mb-6"
                style={{ color: "hsl(43, 74%, 49%)" }}
              >
                {t("nashta.about.title")}
              </h2>
              <p className="font-serif text-muted-foreground text-lg leading-relaxed mb-5">
                {t("nashta.about.p1")}
              </p>
              <p className="font-serif text-muted-foreground text-lg leading-relaxed">
                {t("nashta.about.p2")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="space-y-6"
            >
              <div
                className="border-l-4 pl-6 py-2"
                style={{ borderColor: "hsl(43, 74%, 49%)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={18} style={{ color: "hsl(43, 74%, 49%)" }} />
                  <h3 className="font-display text-lg text-foreground">{t("nashta.hours.label")}</h3>
                </div>
                <p className="font-serif text-muted-foreground">{t("nashta.hours.value")}</p>
              </div>

              <div
                className="border-l-4 pl-6 py-2"
                style={{ borderColor: "hsl(43, 74%, 49%)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={18} style={{ color: "hsl(43, 74%, 49%)" }} />
                  <h3 className="font-display text-lg text-foreground">{t("nashta.where.label")}</h3>
                </div>
                <p className="font-serif text-muted-foreground">{t("nashta.where.value")}</p>
              </div>

              <div
                className="border-l-4 pl-6 py-2"
                style={{ borderColor: "hsl(43, 74%, 49%)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Coffee size={18} style={{ color: "hsl(43, 74%, 49%)" }} />
                  <h3 className="font-display text-lg text-foreground">{t("nashta.experience.label")}</h3>
                </div>
                <p className="font-serif text-muted-foreground">{t("nashta.experience.value")}</p>
              </div>

              <div
                className="p-5 rounded"
                style={{ backgroundColor: "hsl(25, 30%, 16%)", border: "1px solid rgba(184,138,46,0.3)" }}
              >
                <p className="font-serif text-cream/90 text-sm italic leading-relaxed">
                  {t("nashta.quote")}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Highlights Grid */}
      <section className="py-20" style={{ backgroundColor: "hsl(25, 30%, 14%)" }}>
        <div className="container mx-auto px-6">
          <SectionHeading
            title={t("nashta.highlights.title")}
            subtitle={t("nashta.highlights.subtitle")}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-4">
            {highlights.map((item, index) => (
              <motion.div
                key={item.nameKey}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group p-6 rounded border border-cream/10 hover:border-secondary/50 transition-colors duration-300"
                style={{ backgroundColor: "hsl(25, 30%, 18%)" }}
              >
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: "rgba(184,138,46,0.15)", border: "1px solid rgba(184,138,46,0.4)" }}
                >
                  <item.icon size={20} style={{ color: "hsl(43, 74%, 49%)" }} />
                </div>
                <h3 className="font-display text-lg text-foreground mb-2">{t(item.nameKey)}</h3>
                <p className="font-serif text-muted-foreground text-sm leading-relaxed">{t(item.descKey)}</p>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center font-serif text-muted-foreground mt-10 text-sm"
          >
            {t("nashta.highlights.note")}
          </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default DesiNashtaBrunch;
