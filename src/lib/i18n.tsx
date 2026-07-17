import { createContext, useContext, useState, ReactNode, useCallback } from "react";

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
  "nav.events": { en: "Private Events", nl: "Privé Evenementen" },
  "nav.contact": { en: "Contact", nl: "Contact" },
  "nav.reserve": { en: "Reserve Table", nl: "Reserveren" },
  "nav.reserveBreakfast": { en: "Reserve Breakfast", nl: "Ontbijt Reserveren" },
  "nav.specials": { en: "Specials", nl: "Aanbiedingen" },
  "nav.orderOnline": { en: "Order Online", nl: "Online Bestellen" },

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
    en: "Welcome to Light of India, where centuries-old recipes meet contemporary culinary artistry. Our name reflects our commitment to bringing the vibrant flavors of India to your table, serving dishes fit for royalty.",
    nl: "Welkom bij Light of India, waar eeuwenoude recepten samenkomen met hedendaagse culinaire kunst. Onze naam weerspiegelt onze toewijding om de levendige smaken van India naar uw tafel te brengen, met gerechten die een koning waardig zijn.",
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
  "menu.dinein": { en: "Dine-in", nl: "Dine-in" },
  "menu.takeaway": { en: "Takeaway & Delivery", nl: "Afhalen & Bezorgen" },
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

  // Breakfast Reservation
  "breakfastReservation.title": { en: "Breakfast Reservations", nl: "Ontbijtreserveringen" },
  "breakfastReservation.subtitle": { en: "Reserve Your Breakfast", nl: "Reserveer Uw Ontbijt" },
  "breakfastReservation.submit": { en: "Reserve Breakfast", nl: "Reserveer Ontbijt" },
  "breakfastReservation.submitting": { en: "Sending...", nl: "Versturen..." },
  "breakfastReservation.successTitle": { en: "Breakfast Request Sent!", nl: "Ontbijtverzoek verzonden!" },
  "breakfastReservation.successDescription": {
    en: "We have received your breakfast reservation request. We will contact you soon to confirm.",
    nl: "We hebben uw ontbijtreserveringsverzoek ontvangen. We nemen snel contact met u op om te bevestigen.",
  },

  // Restaurant closure messaging
  "closure.closedTodayTitle": { en: "Restaurant is closed today", nl: "Restaurant is vandaag gesloten" },
  "closure.closedTodayBadge": { en: "Closed today", nl: "Vandaag gesloten" },
  "closure.menuHidden": {
    en: "The menu is temporarily hidden while the restaurant is closed.",
    nl: "Het menu is tijdelijk verborgen zolang het restaurant gesloten is.",
  },
  "closure.homeMenuHidden": {
    en: "The homepage menu is temporarily hidden while the restaurant is closed.",
    nl: "Het menu op de homepage is tijdelijk verborgen zolang het restaurant gesloten is.",
  },
  "closure.reservationsDisabled": {
    en: "Reservations are temporarily disabled while the restaurant is closed.",
    nl: "Reserveringen zijn tijdelijk uitgeschakeld zolang het restaurant gesloten is.",
  },
  "closure.closedOnSelectedDate": {
    en: "Restaurant is closed on this date",
    nl: "Restaurant is gesloten op deze datum",
  },

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

  // Desi Nashta / Brunch page
  "nashta.badge": { en: "Saturday & Sunday", nl: "Zaterdag & Zondag" },
  "nashta.hero.title": { en: "Nashta / Brunch", nl: "Nashta / Brunch" },
  "nashta.hero.subtitle": {
    en: "A leisurely morning feast rooted in the rich breakfast traditions of India",
    nl: "Een ontspannen ochtendfestijn geworteld in de rijke ontbijttradities van India",
  },
  "nashta.hero.cta": { en: "Book Your Spot", nl: "Reserveer Uw Plek" },
  "nashta.about.title": { en: "What is Desi Nashta?", nl: "Wat is Desi Nashta?" },
  "nashta.about.p1": {
    en: "Nashta — Urdu and Hindi for morning meal — is far more than breakfast. It is a ritual. Across the subcontinent, families gather over steaming chai, sizzling parathas, and fragrant chutneys before the day begins in earnest. At Light of India, we bring that unhurried warmth to Rotterdam.",
    nl: "Nashta — Urdu en Hindi voor ochtendmaal — is veel meer dan ontbijt. Het is een ritueel. Op het hele subcontinent komen families samen bij dampende chai, ssissende paratha's en geurige chutneys voordat de dag echt begint. Bij Light of India brengen wij die rustige warmte naar Rotterdam.",
  },
  "nashta.about.p2": {
    en: "Our Desi Nashta & Brunch is a curated journey through regional Indian morning traditions — from the spiced street-food energy of Delhi and Mumbai to the delicate South Indian flavours of Chennai and Kerala. Everything is prepared fresh each weekend morning in our kitchen.",
    nl: "Onze Desi Nashta & Brunch is een samengestelde reis door regionale Indiase ochtendrituelen — van de gekruide straatvoedselenergie van Delhi en Mumbai tot de delicate Zuid-Indiase smaken van Chennai en Kerala. Alles wordt elke weekendochtend vers bereid in onze keuken.",
  },
  "nashta.hours.label": { en: "Brunch Hours", nl: "Brunch Tijden" },
  "nashta.hours.value": { en: "Saturday & Sunday · 10:00 — 13:30", nl: "Zaterdag & Zondag · 10:00 — 13:30" },
  "nashta.where.label": { en: "Where", nl: "Waar" },
  "nashta.where.value": { en: "Light of India · Veerhaven 7, Rotterdam", nl: "Light of India · Veerhaven 7, Rotterdam" },
  "nashta.experience.label": { en: "The Experience", nl: "De Beleving" },
  "nashta.experience.value": {
    en: "Shared platters, bottomless masala chai, freshly fried breads, and the aromas of a real Indian kitchen — all in our relaxed riverside setting.",
    nl: "Gedeelde schotels, onbeperkte masala chai, vers gebakken broden en de geuren van een echte Indiase keuken — allemaal in onze ontspannen oeverlocatie.",
  },
  "nashta.quote": {
    en: "\"The best mornings are slow ones — chai in hand, warm paratha on the plate, and good company around the table.\"",
    nl: "\"De beste ochtenden zijn de trage — chai in de hand, warme paratha op het bord, en goed gezelschap aan tafel.\"",
  },
  "nashta.highlights.title": { en: "Nashta Highlights", nl: "Nashta Hoogtepunten" },
  "nashta.highlights.subtitle": { en: "Signature Morning Dishes", nl: "Kenmerkende Ochtendhapjes" },
  "nashta.highlights.note": {
    en: "Menu items rotate seasonally. Vegetarian, vegan & gluten-free options available — ask your server.",
    nl: "Menu-items wisselen seizoensgebonden. Vegetarische, veganistische en glutenvrije opties beschikbaar — vraag uw bediening.",
  },
  "nashta.dish.chai.name": { en: "Masala Chai", nl: "Masala Chai" },
  "nashta.dish.chai.desc": {
    en: "Freshly brewed spiced tea with cardamom, ginger, and saffron-kissed milk — the soul of every Indian morning.",
    nl: "Vers gezette gekruide thee met kardemom, gember en saffraan-melk — de ziel van elke Indiase ochtend.",
  },
  "nashta.dish.paratha.name": { en: "Aloo Paratha", nl: "Aloo Paratha" },
  "nashta.dish.paratha.desc": {
    en: "Crisp whole-wheat flatbread stuffed with spiced potatoes, served with homemade yoghurt and mint chutney.",
    nl: "Knapperig volkorenbrood gevuld met gekruide aardappelen, geserveerd met zelfgemaakte yoghurt en muntchutney.",
  },
  "nashta.dish.poha.name": { en: "Poha", nl: "Poha" },
  "nashta.dish.poha.desc": {
    en: "Light flattened rice tossed with mustard seeds, turmeric, fresh curry leaves, peas, and roasted peanuts.",
    nl: "Lichte platte rijst gebakken met mosterdzaadjes, kurkuma, verse kerriebladen, erwten en geroosterde pinda's.",
  },
  "nashta.dish.chole.name": { en: "Chole Bhature", nl: "Chole Bhature" },
  "nashta.dish.chole.desc": {
    en: "Puffy fried bread paired with slow-cooked spiced chickpeas — a Punjabi classic that commands attention.",
    nl: "Luchtig gefrituurde brood met langzaam gegaarde gekruide kikkererwten — een Punjabi klassieker die aandacht trekt.",
  },
  "nashta.dish.dosa.name": { en: "Masala Dosa", nl: "Masala Dosa" },
  "nashta.dish.dosa.desc": {
    en: "Golden crispy South Indian crepe filled with seasoned potato masala, served with sambar and coconut chutney.",
    nl: "Goudkleurige knapperige Zuid-Indiase crêpe gevuld met gekruide aardappelmasala, geserveerd met sambar en kokosnotenkokoschutney.",
  },
  "nashta.dish.samosa.name": { en: "Samosa Chaat", nl: "Samosa Chaat" },
  "nashta.dish.samosa.desc": {
    en: "Flaky samosas crushed over tangy tamarind chutney, whipped yoghurt, sev, and pomegranate arils.",
    nl: "Bladerige samosa's gebroken over pittige tamarindechutney, opgeklopte yoghurt, sev en granaatappelpitjes.",
  },

  // Footer
  "footer.tagline": {
    en: "Experience the royal taste of authentic Indian cuisine",
    nl: "Beleef de koninklijke smaak van authentieke Indiase keuken",
  },
  "footer.hours": { en: "Opening Hours", nl: "Openingstijden" },
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

  const t = useCallback((key: string): string => {
    const translation = translations[key];
    if (!translation) {
      console.warn(`Missing translation for key: ${key}`);
      return key;
    }
    return translation[language];
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  return useContext(LanguageContext);
};
