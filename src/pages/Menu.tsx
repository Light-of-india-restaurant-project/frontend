import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Leaf, Flame, Star, ZoomIn, AlertCircle, RefreshCw, ShoppingCart, Plus, Minus, Check } from "lucide-react";
import { useLanguage } from "@/lib/i18n";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Lightbox } from "@/components/ui/lightbox";
import { useLightbox } from "@/hooks/use-lightbox";
import { MenuCategorySkeleton } from "@/components/menu/MenuItemSkeleton";
import { useMenu } from "@/hooks/use-menu";
import { useCart } from "@/contexts/CartContext";
import type { MenuItem } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";

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
  const [activeTab, setActiveTab] = useState<"dine-in" | "takeaway">("takeaway");
  const { t, language } = useLanguage();
  const { addItem, isInCart, getItemQuantity, updateQuantity } = useCart();
  
  // Fetch menu data from API
  const { data: menuData, isLoading, isError, refetch } = useMenu(activeTab);

  // Map API data with language support and image resolution
  const menuCategories = useMemo(() => {
    if (!menuData?.categories) return [];
    
    return menuData.categories.map(category => ({
      ...category,
      id: category._id || category.name,
      displayName: language === "nl" && category.nameNl ? category.nameNl : category.name,
      items: category.items.map(item => ({
        ...item,
        id: item._id || item.id,
        displayName: language === "nl" && item.nameNl ? item.nameNl : item.name,
        displayDescription: language === "nl" && item.descriptionNl ? item.descriptionNl : item.description,
        resolvedImage: item.image?.startsWith("http") 
          ? item.image 
          : item.image 
            ? localImageMap[item.image] || item.image 
            : undefined,
      })),
    }));
  }, [menuData, language]);

  // Collect all images for lightbox
  const lightboxImages = useMemo(() => {
    const allItems: { src: string; alt: string; title: string }[] = [];
    menuCategories.forEach((category) => {
      category.items.forEach((item) => {
        if (item.resolvedImage) {
          allItems.push({
            src: item.resolvedImage,
            alt: item.displayName,
            title: item.displayName,
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
        <section className="py-10 bg-muted">
          <div className="container mx-auto px-6 text-center">
            <span className="inline-block text-secondary font-serif tracking-[0.3em] uppercase text-sm mb-2">
              {language === "nl" ? "Culinaire Reis" : "Culinary Journey"}
            </span>
            <h1 className="font-display text-4xl md:text-5xl text-foreground mb-3">
              {t("menu.title")}
            </h1>
            <p className="font-serif text-lg text-muted-foreground max-w-2xl mx-auto">
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
                onClick={() => setActiveTab("takeaway")}
                className={`px-8 py-3 font-serif text-lg transition-all ${
                  activeTab === "takeaway"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                {t("menu.takeaway")}
              </button>
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
            </div>
          </div>
        </section>

        {/* Menu Categories */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-6">
            <div className="max-w-6xl mx-auto space-y-24">
              {/* Loading State */}
              {isLoading && <MenuCategorySkeleton />}

              {/* Error State */}
              {isError && !isLoading && (
                <div className="text-center py-16">
                  <AlertCircle size={48} className="mx-auto text-destructive mb-4" />
                  <h3 className="font-display text-2xl text-foreground mb-2">
                    {language === "nl" ? "Menu kon niet worden geladen" : "Unable to load menu"}
                  </h3>
                  <p className="font-serif text-muted-foreground mb-6">
                    {language === "nl" 
                      ? "Er is een probleem opgetreden bij het ophalen van het menu." 
                      : "There was a problem fetching the menu."}
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
                  >
                    <RefreshCw size={18} />
                    {language === "nl" ? "Opnieuw proberen" : "Try again"}
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && !isError && menuCategories.length === 0 && (
                <div className="text-center py-16">
                  <p className="font-serif text-xl text-muted-foreground">
                    {language === "nl" 
                      ? "Geen menu-items beschikbaar voor deze categorie." 
                      : "No menu items available for this category."}
                  </p>
                </div>
              )}

              {/* Menu Content */}
              {!isLoading && !isError && menuCategories.map((category, categoryIndex) => (
                <motion.div 
                  key={category.id}
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
                      <h2 className="font-display text-3xl md:text-4xl text-primary tracking-wide uppercase">
                        {category.displayName}
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
                          item.resolvedImage ? 'grid md:grid-cols-[280px,1fr]' : ''
                        }`}
                      >
                        {/* Food Image */}
                        {item.resolvedImage && (
                          <motion.div 
                            className="relative h-56 md:h-full overflow-hidden cursor-pointer"
                            whileHover="hover"
                            onClick={() => lightbox.open(getImageIndex(item.resolvedImage!))}
                          >
                            <motion.img
                              src={item.resolvedImage}
                              alt={item.displayName}
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
                                  {item.displayName}
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
                                  {item.isDoubleSpicy && (
                                    <motion.span 
                                      title="Double Spicy"
                                      whileHover={{ scale: 1.2 }}
                                      transition={{ type: "spring", stiffness: 400 }}
                                    >
                                      <Flame size={16} className="text-orange-600 fill-orange-600" />
                                    </motion.span>
                                  )}
                                </div>
                              </div>
                              <p className="font-serif text-muted-foreground leading-relaxed text-base md:text-lg">
                                {item.displayDescription}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-3">
                              <motion.span 
                                className="font-display text-xl md:text-2xl text-secondary whitespace-nowrap"
                                whileHover={{ scale: 1.1 }}
                                transition={{ type: "spring", stiffness: 400 }}
                              >
                                €{formatPrice(item.price)}
                              </motion.span>
                              
                              {/* Add to Cart Button (only for takeaway) */}
                              {activeTab === "takeaway" && (
                                <>
                                  {isInCart(item._id) ? (
                                    <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const qty = getItemQuantity(item._id);
                                          updateQuantity(item._id, qty - 1);
                                        }}
                                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label="Decrease quantity"
                                      >
                                        <Minus size={16} />
                                      </button>
                                      <span className="font-serif text-foreground min-w-[2ch] text-center">
                                        {getItemQuantity(item._id)}
                                      </span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          const qty = getItemQuantity(item._id);
                                          updateQuantity(item._id, qty + 1);
                                        }}
                                        className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                                        aria-label="Increase quantity"
                                      >
                                        <Plus size={16} />
                                      </button>
                                    </div>
                                  ) : (
                                    <motion.button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Create a MenuItem object for the cart
                                        const menuItem: MenuItem = {
                                          _id: item._id,
                                          name: item.name,
                                          nameNl: item.nameNl,
                                          description: item.description,
                                          price: item.price,
                                          category: category._id,
                                          image: item.resolvedImage,
                                        };
                                        addItem(menuItem);
                                      }}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-serif text-sm hover:bg-primary/90 transition-colors rounded"
                                    >
                                      <ShoppingCart size={16} />
                                      {language === "nl" ? "Toevoegen" : "Add to Cart"}
                                    </motion.button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Legend */}
            {menuCategories.length > 0 && (
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
            )}
          </div>
        </section>

        {/* Takeaway Notice */}
        {activeTab === "takeaway" && menuCategories.length > 0 && (
          <section className="py-12 bg-muted">
            <div className="container mx-auto px-6 text-center">
              <p className="font-serif text-lg text-muted-foreground">
                {language === "nl" 
                  ? "Afhaal- en bezorgbestellingen: Bel ons op 010 307 22 99 of bestel online via onze app"
                  : "Takeaway and delivery orders: Call us at 010 307 22 99 or order online via our app"}
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
