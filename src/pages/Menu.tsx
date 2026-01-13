import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Leaf, Flame, Star, Wine, Coffee, IceCream, ZoomIn } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/lightbox";
import { useLightbox } from "@/hooks/use-lightbox";
import { MenuCategorySkeleton } from "@/components/menu/MenuItemSkeleton";
import { useMenu } from "@/hooks/use-menu";

// Import food images for local fallback
import gilafiSeekhImg from "@/assets/menu/gilafi-seekh.jpg";
import scallopsImg from "@/assets/menu/scallops.jpg";
import halibutTikkaImg from "@/assets/menu/halibut-tikka.jpg";
import lambRoganImg from "@/assets/menu/lamb-rogan.jpg";
import trufflePaneerImg from "@/assets/menu/truffle-paneer.jpg";
import dalMakhaniImg from "@/assets/menu/dal-makhani.jpg";
import butterChickenImg from "@/assets/menu/butter-chicken.jpg";
import biryaniImg from "@/assets/menu/biryani.jpg";
import gulabJamunImg from "@/assets/menu/gulab-jamun.jpg";
import spiceMartiniImg from "@/assets/menu/spice-martini.jpg";

// Local image map for fallback when API images are not available
const localImageMap: Record<string, string> = {
  "gilafi-seekh": gilafiSeekhImg,
  "scallops": scallopsImg,
  "halibut-tikka": halibutTikkaImg,
  "lamb-rogan": lambRoganImg,
  "truffle-paneer": trufflePaneerImg,
  "dal-makhani": dalMakhaniImg,
  "butter-chicken": butterChickenImg,
  "biryani": biryaniImg,
  "gulab-jamun": gulabJamunImg,
  "spice-martini": spiceMartiniImg,
};

const Menu = () => {
  const [activeTab, setActiveTab] = useState<"dine-in" | "takeaway">("dine-in");
  const { t, language } = useLanguage();
  
  // Fetch menu data from API
  const { data: menuData, isLoading, isError } = useMenu(activeTab);

  // Fallback menu data when API is unavailable
  const fallbackMenuCategories = useMemo(() => [
    {
      name: "Starters",
      nameNl: "Voorgerechten",
      icon: null,
      items: [
        {
          id: "1",
          name: t("menu.gilafi.seekh"),
          description: t("menu.gilafi.seekh.desc"),
          price: 18.0,
          isSignature: true,
          image: gilafiSeekhImg,
        },
        {
          id: "2",
          name: t("menu.scallops"),
          description: t("menu.scallops.desc"),
          price: 26.0,
          isSignature: true,
          image: scallopsImg,
        },
        {
          id: "3",
          name: t("menu.burrata"),
          description: t("menu.burrata.desc"),
          price: 19.0,
          isVegetarian: true,
        },
        {
          id: "s4",
          name: language === "nl" ? "Amritsari Fish Tikka" : "Amritsari Fish Tikka",
          description: language === "nl" 
            ? "Kabeljauwfilet, ajwain-beslag, tamarindesaus, groene chutney" 
            : "Cod fillet, ajwain batter, tamarind sauce, green chutney",
          price: 22.0,
        },
        {
          id: "s5",
          name: language === "nl" ? "Raj Kachori Chaat" : "Raj Kachori Chaat",
          description: language === "nl" 
            ? "Krokante bol gevuld met kekers, aardappelen, yoghurt, tamarinde, groene chutney" 
            : "Crispy shell filled with chickpeas, potatoes, yogurt, tamarind, green chutney",
          price: 16.0,
          isVegetarian: true,
        },
      ],
    },
    {
      name: "Signature Mains",
      nameNl: "Signature Hoofdgerechten",
      icon: null,
      items: [
        {
          id: "4",
          name: t("menu.halibut.tikka"),
          description: t("menu.halibut.tikka.desc"),
          price: 46.0,
          isSignature: true,
          image: halibutTikkaImg,
        },
        {
          id: "5",
          name: t("menu.lamb.rogan"),
          description: t("menu.lamb.rogan.desc"),
          price: 42.0,
          isSpicy: true,
          isSignature: true,
          image: lambRoganImg,
        },
        {
          id: "6",
          name: t("menu.prawn.koliwada"),
          description: t("menu.prawn.koliwada.desc"),
          price: 38.0,
          isSignature: true,
        },
        {
          id: "7",
          name: t("menu.lamb.chops"),
          description: t("menu.lamb.chops.desc"),
          price: 44.0,
          isSignature: true,
        },
        {
          id: "m5",
          name: language === "nl" ? "Goan Zeebaars Curry" : "Goan Sea Bass Curry",
          description: language === "nl" 
            ? "Wilde zeebaars, kokos en tamarindecurry, kerrieblaadolie" 
            : "Wild sea bass, coconut and tamarind curry, curry leaf oil",
          price: 40.0,
          isSpicy: true,
        },
      ],
    },
    {
      name: "Vegetarian",
      nameNl: "Vegetarisch",
      icon: null,
      items: [
        {
          id: "8",
          name: t("menu.truffle.paneer"),
          description: t("menu.truffle.paneer.desc"),
          price: 28.0,
          isVegetarian: true,
          isSignature: true,
          image: trufflePaneerImg,
        },
        {
          id: "9",
          name: t("menu.jackfruit.biryani"),
          description: t("menu.jackfruit.biryani.desc"),
          price: 32.0,
          isVegetarian: true,
        },
        {
          id: "v3",
          name: language === "nl" ? "Dal Makhani" : "Dal Makhani",
          description: language === "nl" 
            ? "24-uurs gestoofde zwarte linzen, huisgemaakte boter, roomreductie" 
            : "24-hour slow-cooked black lentils, house-churned butter, cream reduction",
          price: 22.0,
          isVegetarian: true,
          isSignature: true,
          image: dalMakhaniImg,
        },
        {
          id: "v4",
          name: language === "nl" ? "Palak Makai" : "Palak Makai",
          description: language === "nl" 
            ? "Babyspinazie, geroosterde maïs, knoflook, zwarte komijn" 
            : "Baby spinach, roasted corn, garlic, black cumin",
          price: 20.0,
          isVegetarian: true,
        },
        {
          id: "v5",
          name: language === "nl" ? "Bharwan Mirchi" : "Bharwan Mirchi",
          description: language === "nl" 
            ? "Grote groene pepers gevuld met gekruide aardappel, pinda crush" 
            : "Large green chillies stuffed with spiced potato, peanut crush",
          price: 18.0,
          isVegetarian: true,
          isSpicy: true,
        },
      ],
    },
    {
      name: "Classics Reimagined",
      nameNl: "Klassiekers Opnieuw Uitgevonden",
      icon: null,
      items: [
        {
          id: "10",
          name: t("menu.butter.chicken"),
          description: t("menu.butter.chicken.desc"),
          price: 32.0,
          isSignature: true,
          image: butterChickenImg,
        },
        {
          id: "11",
          name: t("menu.biryani.signature"),
          description: t("menu.biryani.signature.desc"),
          price: 38.0,
          isSignature: true,
          image: biryaniImg,
        },
        {
          id: "c3",
          name: language === "nl" ? "Lamb Keema Pao" : "Lamb Keema Pao",
          description: language === "nl" 
            ? "Gekruid lamgehakt, zachte briochebol, ingelegde ui, groene chutney" 
            : "Spiced lamb mince, soft brioche bun, pickled onion, green chutney",
          price: 28.0,
        },
      ],
    },
    {
      name: "Rice & Breads",
      nameNl: "Rijst & Brood",
      icon: null,
      items: [
        {
          id: "r1",
          name: language === "nl" ? "Saffraan Basmati" : "Saffron Basmati",
          description: language === "nl" 
            ? "Gerijpte basmatirijst, saffraan, gebakken uien" 
            : "Aged basmati rice, saffron, fried onions",
          price: 8.0,
          isVegetarian: true,
        },
        {
          id: "r2",
          name: language === "nl" ? "Truffel Naan" : "Truffle Naan",
          description: language === "nl" 
            ? "Verse naan, truffelolie, parmezaan" 
            : "Fresh naan, truffle oil, parmesan",
          price: 9.0,
          isVegetarian: true,
          isSignature: true,
        },
        {
          id: "r3",
          name: language === "nl" ? "Laccha Paratha" : "Laccha Paratha",
          description: language === "nl" 
            ? "Gelaagd volkoren brood, ghee" 
            : "Layered whole wheat bread, ghee",
          price: 6.0,
          isVegetarian: true,
        },
        {
          id: "r4",
          name: language === "nl" ? "Knoflook & Koriander Naan" : "Garlic & Coriander Naan",
          description: language === "nl" 
            ? "Klassieke naan, geroosterde knoflook, verse koriander" 
            : "Classic naan, roasted garlic, fresh coriander",
          price: 7.0,
          isVegetarian: true,
        },
      ],
    },
    {
      name: "Desserts",
      nameNl: "Desserts",
      icon: IceCream,
      items: [
        {
          id: "d1",
          name: language === "nl" ? "Gulab Jamun Brûlée" : "Gulab Jamun Brûlée",
          description: language === "nl" 
            ? "Gedeconstructeerde gulab jamun, kardemom crème brûlée, rozenijs" 
            : "Deconstructed gulab jamun, cardamom crème brûlée, rose ice cream",
          price: 16.0,
          isVegetarian: true,
          isSignature: true,
          image: gulabJamunImg,
        },
        {
          id: "d2",
          name: language === "nl" ? "Saffraansoufflé" : "Saffron Soufflé",
          description: language === "nl" 
            ? "Luchtige saffraan- en pistachesoufflé, rabri saus" 
            : "Light saffron and pistachio soufflé, rabri sauce",
          price: 18.0,
          isVegetarian: true,
        },
        {
          id: "d3",
          name: language === "nl" ? "Chocolate Chai Fondant" : "Chocolate Chai Fondant",
          description: language === "nl" 
            ? "Warme chocoladefondant met masala chai, vanille-ijs" 
            : "Warm chocolate fondant with masala chai, vanilla ice cream",
          price: 17.0,
          isVegetarian: true,
        },
        {
          id: "d4",
          name: language === "nl" ? "Kulfi Selectie" : "Kulfi Selection",
          description: language === "nl" 
            ? "Drie smaken: mango, pistache, malai - geserveerd met falooda" 
            : "Three flavours: mango, pistachio, malai - served with falooda",
          price: 14.0,
          isVegetarian: true,
        },
        {
          id: "d5",
          name: language === "nl" ? "Rasmalai Tiramisu" : "Rasmalai Tiramisu",
          description: language === "nl" 
            ? "Fusion van Italiaanse tiramisu en Bengaalse rasmalai, saffraan mascarpone" 
            : "Fusion of Italian tiramisu and Bengali rasmalai, saffron mascarpone",
          price: 16.0,
          isVegetarian: true,
          isSignature: true,
        },
      ],
    },
    {
      name: "Beverages",
      nameNl: "Dranken",
      icon: Coffee,
      items: [
        {
          id: "b1",
          name: language === "nl" ? "Masala Chai" : "Masala Chai",
          description: language === "nl" 
            ? "Traditionele Indiase thee met verse specerijen" 
            : "Traditional Indian tea with fresh spices",
          price: 6.0,
          isVegetarian: true,
        },
        {
          id: "b2",
          name: language === "nl" ? "Mango Lassi" : "Mango Lassi",
          description: language === "nl" 
            ? "Alphonso mango, karnemelk, kardemom" 
            : "Alphonso mango, buttermilk, cardamom",
          price: 8.0,
          isVegetarian: true,
        },
        {
          id: "b3",
          name: language === "nl" ? "Rose Sherbet" : "Rose Sherbet",
          description: language === "nl" 
            ? "Huisgemaakte rozensiroop, basilicumzaden, crushed ijs" 
            : "House-made rose syrup, basil seeds, crushed ice",
          price: 7.0,
          isVegetarian: true,
        },
        {
          id: "b4",
          name: language === "nl" ? "Saffraan Limonade" : "Saffron Lemonade",
          description: language === "nl" 
            ? "Verse citroen, saffraan, honing, sodawater" 
            : "Fresh lemon, saffron, honey, soda water",
          price: 8.0,
          isVegetarian: true,
        },
      ],
    },
    {
      name: "Wine & Cocktails",
      nameNl: "Wijn & Cocktails",
      icon: Wine,
      items: [
        {
          id: "w1",
          name: language === "nl" ? "Signature Spice Martini" : "Signature Spice Martini",
          description: language === "nl" 
            ? "Wodka, kardemom, saffraan, vanille, eetbaar goud" 
            : "Vodka, cardamom, saffron, vanilla, edible gold",
          price: 18.0,
          isSignature: true,
          image: spiceMartiniImg,
        },
        {
          id: "w2",
          name: language === "nl" ? "Mango & Chilli Margarita" : "Mango & Chilli Margarita",
          description: language === "nl" 
            ? "Tequila, Alphonso mango, kashmiri chilli, limoen" 
            : "Tequila, Alphonso mango, kashmiri chilli, lime",
          price: 16.0,
          isSpicy: true,
        },
        {
          id: "w3",
          name: language === "nl" ? "Rose & Lychee Bellini" : "Rose & Lychee Bellini",
          description: language === "nl" 
            ? "Prosecco, rozenwater, lychee, rozenblaadjes" 
            : "Prosecco, rose water, lychee, rose petals",
          price: 15.0,
        },
        {
          id: "w4",
          name: language === "nl" ? "Curated Wine Selection" : "Curated Wine Selection",
          description: language === "nl" 
            ? "Door sommelier geselecteerde wijnen, speciaal gekozen om te paren met Indiase smaken" 
            : "Sommelier-selected wines, specially chosen to pair with Indian flavours",
          price: 14.0,
        },
      ],
    },
  ], [t, language]);

  // Use API data or fallback to local data
  const menuCategories = useMemo(() => {
    if (menuData?.categories) {
      // Map API data and resolve local images
      return menuData.categories.map(category => ({
        ...category,
        name: language === "nl" && category.nameNl ? category.nameNl : category.name,
        items: category.items.map(item => ({
          ...item,
          name: language === "nl" && item.nameNl ? item.nameNl : item.name,
          description: language === "nl" && item.descriptionNl ? item.descriptionNl : item.description,
          image: item.image?.startsWith("http") 
            ? item.image 
            : item.image 
              ? localImageMap[item.image] || item.image 
              : undefined,
        })),
      }));
    }
    // Fallback to static data defined above
    return fallbackMenuCategories;
  }, [menuData, language]);

  // Collect all images for lightbox
  const lightboxImages = useMemo(() => {
    const allItems: { src: string; alt: string; title: string }[] = [];
    menuCategories.forEach((category) => {
      category.items.forEach((item) => {
        if (item.image) {
          allItems.push({
            src: item.image,
            alt: item.name,
            title: item.name,
          });
        }
      });
    });
    return allItems;
  }, [menuCategories]);

  const lightbox = useLightbox(lightboxImages);

  const getImageIndex = (imageSrc: string) => {
    return lightboxImages.findIndex((img) => img.src === imageSrc);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-6 text-center">
            <span className="inline-block text-secondary font-serif tracking-[0.3em] uppercase text-sm mb-4">
              {language === "nl" ? "Culinaire Reis" : "Culinary Journey"}
            </span>
            <h1 className="font-display text-5xl md:text-7xl text-foreground mb-6">
              {t("menu.title")}
            </h1>
            <p className="font-serif text-xl text-muted-foreground max-w-2xl mx-auto">
              {language === "nl" 
                ? "Een verfijnde selectie van traditionele Indiase gerechten, opnieuw geïnterpreteerd met moderne culinaire technieken"
                : "A refined selection of traditional Indian dishes, reimagined with modern culinary techniques"}
            </p>
          </div>
        </section>

        {/* Menu Type Tabs */}
        <section className="py-12 bg-background border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setActiveTab("dine-in")}
                className={`px-8 py-3 font-serif text-lg transition-all ${
                  activeTab === "dine-in"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {t("menu.dinein")}
              </button>
              <button
                onClick={() => setActiveTab("takeaway")}
                className={`px-8 py-3 font-serif text-lg transition-all ${
                  activeTab === "takeaway"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {t("menu.takeaway")}
              </button>
            </div>
          </div>
        </section>

        {/* Menu Categories */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto space-y-24">
              {isLoading ? (
                <MenuCategorySkeleton />
              ) : (
              menuCategories.map((category, categoryIndex) => (
                <motion.div 
                  key={category.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                >
                  {/* Category Header */}
                  <motion.div 
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex items-center justify-center gap-3 mb-4">
                      {category.icon && <category.icon size={28} className="text-secondary" />}
                      <h2 className="font-display text-3xl md:text-4xl text-primary tracking-wide uppercase">
                        {language === "nl" ? category.nameNl : category.name}
                      </h2>
                    </div>
                    <motion.div 
                      className="w-32 h-px bg-secondary mx-auto"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </motion.div>

                  {/* Menu Items Grid */}
                  <div className="grid gap-8">
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: itemIndex % 2 === 0 ? -30 : 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: itemIndex * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className={`group relative bg-card border border-border hover:border-secondary/50 transition-all duration-300 overflow-hidden ${
                          item.image ? 'grid md:grid-cols-[280px,1fr]' : ''
                        }`}
                      >
                        {/* Food Image */}
                        {item.image && (
                          <motion.div 
                            className="relative h-56 md:h-full overflow-hidden cursor-pointer"
                            whileHover="hover"
                            onClick={() => lightbox.open(getImageIndex(item.image!))}
                          >
                            <motion.img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              initial={{ scale: 1 }}
                              variants={{
                                hover: { scale: 1.15, transition: { duration: 0.6, ease: "easeOut" } }
                              }}
                            />
                            <motion.div 
                              className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0"
                              variants={{
                                hover: { opacity: 1, transition: { duration: 0.3 } }
                              }}
                            />
                            <motion.div 
                              className="absolute inset-0 flex items-center justify-center opacity-0"
                              variants={{
                                hover: { opacity: 1, transition: { duration: 0.3, delay: 0.1 } }
                              }}
                            >
                              <motion.span 
                                className="text-white font-serif text-lg px-4 py-2 border border-white/50 backdrop-blur-sm flex items-center gap-2"
                                initial={{ y: 20 }}
                                variants={{
                                  hover: { y: 0, transition: { duration: 0.3, delay: 0.15 } }
                                }}
                              >
                                <ZoomIn size={18} />
                                {language === "nl" ? "Bekijk volledig" : "View Full"}
                              </motion.span>
                            </motion.div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/20 pointer-events-none" />
                          </motion.div>
                        )}
                        
                        {/* Content */}
                        <div className="p-6 md:p-8 flex flex-col justify-center">
                          <div className="flex justify-between items-start gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="font-display text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors">
                                  {item.name}
                                </h3>
                                <div className="flex items-center gap-2">
                                  {item.isSignature && (
                                    <motion.span 
                                      title="Signature Dish"
                                      whileHover={{ scale: 1.2, rotate: 15 }}
                                      transition={{ type: "spring", stiffness: 400 }}
                                    >
                                      <Star size={16} className="text-secondary fill-secondary" />
                                    </motion.span>
                                  )}
                                  {item.isVegetarian && (
                                    <motion.span 
                                      title="Vegetarian"
                                      whileHover={{ scale: 1.2 }}
                                      transition={{ type: "spring", stiffness: 400 }}
                                    >
                                      <Leaf size={16} className="text-green-600" />
                                    </motion.span>
                                  )}
                                  {item.isSpicy && (
                                    <motion.span 
                                      title="Spicy"
                                      whileHover={{ scale: 1.2 }}
                                      transition={{ type: "spring", stiffness: 400 }}
                                    >
                                      <Flame size={16} className="text-red-500" />
                                    </motion.span>
                                  )}
                                </div>
                              </div>
                              <p className="font-serif text-muted-foreground leading-relaxed text-base md:text-lg">
                                {item.description}
                              </p>
                            </div>
                            <motion.span 
                              className="font-display text-xl md:text-2xl text-secondary whitespace-nowrap"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400 }}
                            >
                              €{item.price.toFixed(0)}
                            </motion.span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star size={14} className="text-secondary fill-secondary" />
                <span className="font-serif">{language === "nl" ? "Signature Gerecht" : "Signature Dish"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Leaf size={14} className="text-green-600" />
                <span className="font-serif">{language === "nl" ? "Vegetarisch" : "Vegetarian"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame size={14} className="text-red-500" />
                <span className="font-serif">{language === "nl" ? "Pittig" : "Spicy"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Takeaway Notice */}
        {activeTab === "takeaway" && (
          <section className="py-12 bg-muted">
            <div className="container mx-auto px-6 text-center">
              <p className="font-serif text-lg text-muted-foreground">
                {language === "nl" 
                  ? "Afhaal- en bezorgbestellingen: Bel ons op +31 20 123 4567 of bestel online via onze app"
                  : "Takeaway and delivery orders: Call us at +31 20 123 4567 or order online via our app"}
              </p>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
      
      {/* Lightbox */}
      <Lightbox
        images={lightboxImages}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onNext={lightbox.next}
        onPrev={lightbox.prev}
      />
    </div>
  );
};

export default Menu;
