import { motion } from "framer-motion";
import { Users, Sparkles, Wine, Calendar, Phone, Mail, ChevronRight } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";

// Import venue images
import interiorDining from "@/assets/gallery/interior-dining.jpg";
import privateDining from "@/assets/gallery/private-dining.jpg";
import barLounge from "@/assets/gallery/bar-lounge.jpg";
import chefPlating from "@/assets/gallery/chef-plating.jpg";

const eventSpaces = [
  {
    id: "private-dining",
    image: privateDining,
    titleEn: "The Maharaja Room",
    titleNl: "De Maharaja Kamer",
    capacity: "2-12",
    descEn: "An intimate private dining room adorned with intricate Indian artwork and plush seating. Perfect for romantic dinners, family celebrations, and small business gatherings.",
    descNl: "Een intieme privé-eetzaal versierd met ingewikkelde Indiase kunstwerken en luxe zitplaatsen. Perfect voor romantische diners, familiefeesten en kleine zakelijke bijeenkomsten.",
  },
  {
    id: "main-hall",
    image: interiorDining,
    titleEn: "The Royal Court",
    titleNl: "Het Koninklijk Hof",
    capacity: "30-80",
    descEn: "Our magnificent main dining hall features crystal chandeliers, burgundy velvet seating, and ornate wooden panels. Ideal for weddings, corporate events, and grand celebrations.",
    descNl: "Onze prachtige hoofdeetzaal heeft kristallen kroonluchters, bordeauxrode fluwelen zitplaatsen en sierlijke houten panelen. Ideaal voor bruiloften, bedrijfsevenementen en grote feesten.",
  },
  {
    id: "lounge",
    image: barLounge,
    titleEn: "The Lounge Bar",
    titleNl: "De Lounge Bar",
    capacity: "15-40",
    descEn: "A sophisticated cocktail lounge with polished copper accents and ambient lighting. Perfect for cocktail receptions, networking events, and pre-dinner gatherings.",
    descNl: "Een verfijnde cocktaillounge met gepolijste koperen accenten en sfeerverlichting. Perfect voor cocktailrecepties, netwerkevenementen en bijeenkomsten voor het diner.",
  },
];

const eventTypes = [
  {
    iconEn: "Corporate",
    iconNl: "Zakelijk",
    titleEn: "Corporate Events",
    titleNl: "Zakelijke Evenementen",
    descEn: "Board meetings, client dinners, team celebrations, and product launches with tailored menus and AV equipment.",
    descNl: "Bestuursvergaderingen, klantdiners, teamvieringen en productlanceringen met op maat gemaakte menu's en AV-apparatuur.",
  },
  {
    iconEn: "Wedding",
    iconNl: "Bruiloft",
    titleEn: "Weddings & Engagements",
    titleNl: "Bruiloften & Verlovingen",
    descEn: "Create unforgettable moments with our bespoke wedding packages, from intimate ceremonies to grand receptions.",
    descNl: "Creëer onvergetelijke momenten met onze op maat gemaakte bruiloftspakketten, van intieme ceremonies tot grote recepties.",
  },
  {
    iconEn: "Birthday",
    iconNl: "Verjaardag",
    titleEn: "Milestone Celebrations",
    titleNl: "Mijlpaalvieringen",
    descEn: "Birthdays, anniversaries, graduations, and retirement parties with personalized touches and celebration packages.",
    descNl: "Verjaardagen, jubilea, afstudeerfeesten en pensioenfeesten met persoonlijke accenten en feestpakketten.",
  },
  {
    iconEn: "Cultural",
    iconNl: "Cultureel",
    titleEn: "Cultural Celebrations",
    titleNl: "Culturele Vieringen",
    descEn: "Diwali, Eid, Holi, and other cultural festivities with authentic decorations and traditional menus.",
    descNl: "Diwali, Eid, Holi en andere culturele festiviteiten met authentieke decoraties en traditionele menu's.",
  },
];

const PrivateEvents = () => {
  const { t, language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={interiorDining}
            alt="Private dining at Light of India"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/60 to-background" />
        </div>
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Sparkles className="w-12 h-12 text-secondary mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-6xl text-primary-foreground mb-6">
              {language === "nl" ? "Privé Evenementen" : "Private Events"}
            </h1>
            <p className="font-serif text-xl md:text-2xl text-primary-foreground/90 max-w-2xl mx-auto">
              {language === "nl"
                ? "Creëer onvergetelijke momenten in onze elegante ruimtes"
                : "Create unforgettable moments in our elegant spaces"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Event Spaces Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <SectionHeading
            title={language === "nl" ? "Onze Ruimtes" : "Our Spaces"}
            subtitle={language === "nl" ? "Elegante Locaties" : "Elegant Venues"}
          />

          <div className="space-y-16">
            {eventSpaces.map((space, index) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`grid md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <div className="relative overflow-hidden group">
                    <img
                      src={space.image}
                      alt={language === "nl" ? space.titleNl : space.titleEn}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute bottom-4 right-4 bg-secondary text-secondary-foreground px-4 py-2 font-serif">
                      <Users className="inline w-4 h-4 mr-2" />
                      {space.capacity} {language === "nl" ? "gasten" : "guests"}
                    </div>
                  </div>
                </div>
                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  <h3 className="font-display text-3xl text-primary mb-4">
                    {language === "nl" ? space.titleNl : space.titleEn}
                  </h3>
                  <p className="font-serif text-muted-foreground text-lg leading-relaxed mb-6">
                    {language === "nl" ? space.descNl : space.descEn}
                  </p>
                  <a
                    href="#inquiry"
                    className="inline-flex items-center gap-2 text-primary hover:text-secondary transition-colors font-serif"
                  >
                    {language === "nl" ? "Informeer naar beschikbaarheid" : "Inquire about availability"}
                    <ChevronRight className="w-4 h-4" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Types Section */}
      <section className="py-24 bg-cream/30">
        <div className="container mx-auto px-6">
          <SectionHeading
            title={language === "nl" ? "Evenementen" : "Event Types"}
            subtitle={language === "nl" ? "Voor Elke Gelegenheid" : "For Every Occasion"}
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {eventTypes.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-background p-8 border border-border hover:border-secondary transition-colors group"
              >
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-secondary/20 transition-colors">
                  <span className="font-display text-primary text-lg">
                    {language === "nl" ? event.iconNl.charAt(0) : event.iconEn.charAt(0)}
                  </span>
                </div>
                <h3 className="font-display text-xl text-primary mb-3">
                  {language === "nl" ? event.titleNl : event.titleEn}
                </h3>
                <p className="font-serif text-muted-foreground">
                  {language === "nl" ? event.descNl : event.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <motion.img
                src={chefPlating}
                alt="Our culinary team"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-full aspect-square object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-display text-3xl md:text-4xl text-primary mb-6">
                {language === "nl" ? "Wat Wij Bieden" : "What We Offer"}
              </h2>
              <ul className="space-y-4 font-serif text-muted-foreground">
                {[
                  { en: "Customized multi-course menus tailored to your preferences", nl: "Gepersonaliseerde meergangenmenu's op maat" },
                  { en: "Dedicated event coordinator for seamless planning", nl: "Toegewijde evenementcoördinator voor naadloze planning" },
                  { en: "Premium bar packages with signature cocktails", nl: "Premium barpakketten met signature cocktails" },
                  { en: "Elegant floral arrangements and decorations", nl: "Elegante bloemarrangementen en decoraties" },
                  { en: "Professional audio-visual equipment available", nl: "Professionele audiovisuele apparatuur beschikbaar" },
                  { en: "Complimentary valet parking for larger events", nl: "Gratis valetparkeren voor grotere evenementen" },
                  { en: "Live music and entertainment coordination", nl: "Live muziek en entertainment coördinatie" },
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Wine className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                    <span>{language === "nl" ? item.nl : item.en}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Inquiry Form Section */}
      <section id="inquiry" className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <Sparkles className="w-10 h-10 text-secondary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              {language === "nl" ? "Plan Uw Evenement" : "Plan Your Event"}
            </h2>
            <p className="font-serif text-primary-foreground/80 text-lg">
              {language === "nl"
                ? "Neem contact op met ons evenementenream om uw perfecte bijeenkomst te plannen"
                : "Contact our events team to plan your perfect gathering"}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display text-xl mb-2">
                    {language === "nl" ? "Bel Ons" : "Call Us"}
                  </h3>
                  <p className="font-serif text-primary-foreground/80">+31 10 123 4567</p>
                  <p className="font-serif text-primary-foreground/60 text-sm mt-1">
                    {language === "nl" ? "Ma-Za: 10:00 - 22:00" : "Mon-Sat: 10:00 AM - 10:00 PM"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display text-xl mb-2">
                    {language === "nl" ? "E-mail Ons" : "Email Us"}
                  </h3>
                  <a
                    href="mailto:events@lightofindia.nl"
                    className="font-serif text-secondary hover:text-secondary/80 transition-colors"
                  >
                    events@lightofindia.nl
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <h3 className="font-display text-xl mb-2">
                    {language === "nl" ? "Bezoek Ons" : "Visit Us"}
                  </h3>
                  <p className="font-serif text-primary-foreground/80">Kortekade 1</p>
                  <p className="font-serif text-primary-foreground/80">Rotterdam, Netherlands</p>
                </div>
              </div>
            </div>

            <form className="space-y-4">
              <input
                type="text"
                placeholder={language === "nl" ? "Uw naam" : "Your name"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:outline-none font-serif"
              />
              <input
                type="email"
                placeholder={language === "nl" ? "E-mailadres" : "Email address"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:outline-none font-serif"
              />
              <input
                type="text"
                placeholder={language === "nl" ? "Type evenement" : "Event type"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:outline-none font-serif"
              />
              <input
                type="text"
                placeholder={language === "nl" ? "Aantal gasten" : "Number of guests"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:outline-none font-serif"
              />
              <textarea
                rows={4}
                placeholder={language === "nl" ? "Vertel ons over uw evenement..." : "Tell us about your event..."}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:outline-none font-serif resize-none"
              />
              <button
                type="submit"
                className="w-full bg-secondary text-secondary-foreground py-4 font-serif hover:bg-secondary/90 transition-colors"
              >
                {language === "nl" ? "Verstuur Aanvraag" : "Submit Inquiry"}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PrivateEvents;
