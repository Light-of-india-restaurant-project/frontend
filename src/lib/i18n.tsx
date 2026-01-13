import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "en" | "nl";

type Translations = {
  [key: string]: {
    en: string;
    nl: string;
  };
};

export const translations: Translations = {
  // Navigation
  "nav.menu": { en: "Menu", nl: "Menu" },
  "nav.about": { en: "About", nl: "Over Ons" },
  "nav.gallery": { en: "Gallery", nl: "Galerij" },
  "nav.contact": { en: "Contact", nl: "Contact" },
  "nav.reserve": { en: "Reserve Table", nl: "Reserveren" },

  // Hero
  "hero.tagline": { en: "Authentic Indian Cuisine", nl: "Authentieke Indiase Keuken" },
  "hero.subtitle": {
    en: "Experience the rich flavors and aromatic spices of India in every dish",
    nl: "Beleef de rijke smaken en aromatische kruiden van India in elk gerecht",
  },
  "hero.cta.menu": { en: "View Menu", nl: "Bekijk Menu" },
  "hero.cta.reserve": { en: "Reserve a Table", nl: "Reserveer een Tafel" },

  // About
  "about.title": { en: "Our Story", nl: "Ons Verhaal" },
  "about.subtitle": { en: "A Journey of Flavors", nl: "Een Reis van Smaken" },
  "about.p1": {
    en: "Welcome to Shahi Darbar, where centuries-old recipes meet contemporary culinary artistry. Our name, meaning 'Royal Court,' reflects our commitment to serving dishes fit for royalty.",
    nl: "Welkom bij Shahi Darbar, waar eeuwenoude recepten samenkomen met hedendaagse culinaire kunst. Onze naam, wat 'Koninklijk Hof' betekent, weerspiegelt onze toewijding om gerechten te serveren die een koning waardig zijn.",
  },
  "about.p2": {
    en: "Every dish tells a story of tradition, passed down through generations and perfected with love. Our chefs bring authentic flavors from various regions of India, using only the finest ingredients and freshly ground spices.",
    nl: "Elk gerecht vertelt een verhaal van traditie, doorgegeven door generaties en geperfectioneerd met liefde. Onze chef-koks brengen authentieke smaken uit verschillende regio's van India, met alleen de beste ingrediënten en vers gemalen kruiden.",
  },
  "about.experience": { en: "Years of Experience", nl: "Jaar Ervaring" },
  "about.recipes": { en: "Authentic Recipes", nl: "Authentieke Recepten" },
  "about.chefs": { en: "Master Chefs", nl: "Meesterkoks" },

  // Menu
  "menu.title": { en: "Our Menu", nl: "Ons Menu" },
  "menu.subtitle": { en: "Culinary Excellence", nl: "Culinaire Uitmuntendheid" },
  "menu.dinein": { en: "Dine-in", nl: "Afhalen" },
  "menu.takeaway": { en: "Takeaway", nl: "Bezorgen" },
  "menu.popular": { en: "Popular", nl: "Populair" },
  "menu.viewfull": { en: "View Full Menu", nl: "Bekijk Volledig Menu" },

  // Menu items - Starters
  "menu.gilafi.seekh": { en: "Gilafi Seekh Kebab", nl: "Gilafi Seekh Kebab" },
  "menu.gilafi.seekh.desc": {
    en: "Heritage recipe lamb mince with saffron, wrapped in peppers, charred in the tandoor",
    nl: "Erfgoedrecept lamgehakt met saffraan, gewikkeld in paprika, gegrild in de tandoor",
  },
  "menu.scallops": { en: "Tandoori Scottish Scallops", nl: "Tandoori Schotse Coquilles" },
  "menu.scallops.desc": {
    en: "Hand-dived scallops, kokum butter, pickled mooli, crispy curry leaves",
    nl: "Handgedoken coquilles, kokumboter, ingelegde mooli, knapperige kerriebladeren",
  },
  "menu.burrata": { en: "Charred Burrata", nl: "Gegrilde Burrata" },
  "menu.burrata.desc": {
    en: "Flame-kissed burrata, heritage tomato chutney, micro coriander, truffle naan crisps",
    nl: "Met vlammen gegrilde burrata, erfgoed tomatenchutney, micro koriander, truffel naan chips",
  },

  // Menu items - Mains
  "menu.halibut.tikka": { en: "Tandoori Halibut", nl: "Tandoori Heilbot" },
  "menu.halibut.tikka.desc": {
    en: "Wild halibut fillet, ajwain crust, coconut moilee, curry leaf oil, charred lime",
    nl: "Wilde heilbotfilet, ajwainkorst, kokos moilee, kerriebladolie, gegrilde limoen",
  },
  "menu.lamb.rogan": { en: "Kashmiri Lamb Rogan Josh", nl: "Kashmiri Lam Rogan Josh" },
  "menu.lamb.rogan.desc": {
    en: "Slow-braised lamb shoulder, Kashmiri chillies, fennel, saffron, 12-hour reduction",
    nl: "Langzaam gestoofde lamschouder, Kashmiri pepers, venkel, saffraan, 12-uurs reductie",
  },
  "menu.prawn.koliwada": { en: "Koliwada Tiger Prawns", nl: "Koliwada Tijgergarnalen" },
  "menu.prawn.koliwada.desc": {
    en: "Jumbo tiger prawns, Mumbai-style spiced batter, tamarind aioli, curry leaf dust",
    nl: "Jumbo tijgergarnalen, Mumbai-stijl gekruide beslag, tamarinde aioli, kerriebladpoeder",
  },
  "menu.lamb.chops": { en: "Champaran Lamb Chops", nl: "Champaran Lamskoteletten" },
  "menu.lamb.chops.desc": {
    en: "Double-cut lamb chops, handi-smoked, mustard oil glaze, mint chutney",
    nl: "Dubbel gesneden lamskoteletten, handi-gerookt, mosterolieglazuur, muntchutney",
  },

  // Menu items - Vegetarian
  "menu.truffle.paneer": { en: "Black Truffle Paneer", nl: "Zwarte Truffel Paneer" },
  "menu.truffle.paneer.desc": {
    en: "Aged paneer, Périgord truffle, wild mushroom reduction, micro herbs",
    nl: "Gerijpte paneer, Périgord truffel, wilde paddestoelreductie, micro kruiden",
  },
  "menu.jackfruit.biryani": { en: "Jackfruit Dum Biryani", nl: "Jackfruit Dum Biryani" },
  "menu.jackfruit.biryani.desc": {
    en: "Young jackfruit, aged basmati, caramelised onions, saffron, edible gold",
    nl: "Jonge jackfruit, gerijpte basmati, gekaramelliseerde uien, saffraan, eetbaar goud",
  },

  // Menu items - Signatures
  "menu.butter.chicken": { en: "Old Delhi Butter Chicken", nl: "Old Delhi Butter Chicken" },
  "menu.butter.chicken.desc": {
    en: "Heritage 1947 recipe, charcoal-smoked chicken, sun-dried tomato makhani, kasuri methi",
    nl: "Erfgoedrecept uit 1947, houtskool-gerookte kip, zongedroogde tomaat makhani, kasuri methi",
  },
  "menu.biryani.signature": { en: "Lucknowi Gosht Biryani", nl: "Lucknowi Gosht Biryani" },
  "menu.biryani.signature.desc": {
    en: "72-hour marinated lamb, aged basmati, saffron, sealed & slow-cooked dum style",
    nl: "72 uur gemarineerd lam, gerijpte basmati, saffraan, verzegeld & langzaam dum-stijl gekookt",
  },

  // Gallery
  "gallery.title": { en: "Gallery", nl: "Galerij" },
  "gallery.subtitle": { en: "Visual Feast", nl: "Visueel Feest" },

  // Reservation
  "reservation.title": { en: "Reservations", nl: "Reserveringen" },
  "reservation.subtitle": { en: "Book Your Table", nl: "Reserveer Uw Tafel" },
  "reservation.name": { en: "Full Name", nl: "Volledige Naam" },
  "reservation.email": { en: "Email", nl: "E-mail" },
  "reservation.phone": { en: "Phone", nl: "Telefoon" },
  "reservation.date": { en: "Date", nl: "Datum" },
  "reservation.time": { en: "Time", nl: "Tijd" },
  "reservation.guests": { en: "Number of Guests", nl: "Aantal Gasten" },
  "reservation.requests": { en: "Special Requests", nl: "Speciale Verzoeken" },
  "reservation.submit": { en: "Reserve Table", nl: "Reserveer Tafel" },
  "reservation.submitting": { en: "Reserving...", nl: "Reserveren..." },
  "reservation.success": { en: "Reservation submitted successfully!", nl: "Reservering succesvol verzonden!" },
  "reservation.confirm": { en: "We'll confirm your booking shortly.", nl: "We bevestigen uw boeking binnenkort." },

  // Contact
  "contact.title": { en: "Contact Us", nl: "Neem Contact Op" },
  "contact.subtitle": { en: "Get in Touch", nl: "Neem Contact Op" },
  "contact.name": { en: "Your Name", nl: "Uw Naam" },
  "contact.email": { en: "Your Email", nl: "Uw E-mail" },
  "contact.subject": { en: "Subject", nl: "Onderwerp" },
  "contact.message": { en: "Message", nl: "Bericht" },
  "contact.send": { en: "Send Message", nl: "Verstuur Bericht" },
  "contact.sending": { en: "Sending...", nl: "Verzenden..." },
  "contact.success": { en: "Message sent successfully!", nl: "Bericht succesvol verzonden!" },
  "contact.reply": { en: "We'll get back to you soon.", nl: "We nemen snel contact met u op." },
  "contact.address": { en: "Address", nl: "Adres" },
  "contact.phone": { en: "Phone", nl: "Telefoon" },
  "contact.hours": { en: "Hours", nl: "Openingstijden" },

  // Newsletter
  "newsletter.title": { en: "Stay Updated", nl: "Blijf Op de Hoogte" },
  "newsletter.subtitle": {
    en: "Subscribe to our newsletter for exclusive offers and updates",
    nl: "Abonneer u op onze nieuwsbrief voor exclusieve aanbiedingen en updates",
  },
  "newsletter.placeholder": { en: "Enter your email", nl: "Voer uw e-mail in" },
  "newsletter.subscribe": { en: "Subscribe", nl: "Abonneren" },
  "newsletter.subscribing": { en: "Subscribing...", nl: "Abonneren..." },
  "newsletter.success": { en: "Successfully subscribed!", nl: "Succesvol geabonneerd!" },
  "newsletter.welcome": { en: "Welcome to our newsletter.", nl: "Welkom bij onze nieuwsbrief." },

  // Footer
  "footer.tagline": {
    en: "Experience the royal taste of authentic Indian cuisine",
    nl: "Beleef de koninklijke smaak van authentieke Indiase keuken",
  },
  "footer.hours": { en: "Opening Hours", nl: "Openingstijden" },
  "footer.monthurs": { en: "Mon - Thu", nl: "Ma - Do" },
  "footer.frisat": { en: "Fri - Sat", nl: "Vrij - Za" },
  "footer.sunday": { en: "Sunday", nl: "Zondag" },
  "footer.quicklinks": { en: "Quick Links", nl: "Snelle Links" },
  "footer.contact": { en: "Contact", nl: "Contact" },
  "footer.rights": { en: "All rights reserved.", nl: "Alle rechten voorbehouden." },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const defaultValue: LanguageContextType = {
  language: "en",
  setLanguage: () => {},
  t: (key: string) => translations[key]?.en || key,
};

const LanguageContext = createContext<LanguageContextType>(defaultValue);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    return (stored as Language) || "en";
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
