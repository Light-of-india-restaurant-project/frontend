import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Flame, Star, ShoppingCart, Plus, Minus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { useMenu } from "@/hooks/use-menu";
import { useCart } from "@/contexts/CartContext";
import type { MenuItem } from "@/lib/api";
import { formatPrice } from "@/lib/formatPrice";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const categoryVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState<"dine-in" | "takeaway">("dine-in");
  const { t, language } = useLanguage();
  const { data: menuData, isLoading, isError } = useMenu(activeTab);
  const { addItem, isInCart, getItemQuantity, updateQuantity } = useCart();

  // Transform API data - limit to 3 items per category for preview
  const menuCategories = menuData?.categories
    ?.filter(cat => cat.isActive !== false)
    ?.slice(0, 4) // Show max 4 categories on homepage
    ?.map(category => ({
      _id: category._id,
      name: language === "nl" && category.nameNl ? category.nameNl : category.name,
      items: category.items
        ?.filter(item => item.isActive !== false)
        ?.slice(0, 3) // Show max 3 items per category
        ?.map(item => ({
          _id: item._id,
          id: item._id,
          name: item.name,
          nameNl: item.nameNl,
          displayName: language === "nl" && item.nameNl ? item.nameNl : item.name,
          description: item.description,
          displayDescription: language === "nl" && item.descriptionNl ? item.descriptionNl : item.description,
          price: item.price,
          isSignature: item.isSignature,
          isVegetarian: item.isVegetarian,
          isSpicy: item.isSpicy,
          isDoubleSpicy: item.isDoubleSpicy,
          image: item.image,
          category: category._id,
        })) || [],
    })) || [];

  return (
    <section id="menu" className="py-24 bg-muted">
      <div className="container mx-auto px-6">
        <SectionHeading
          title={t("menu.title")}
          subtitle={t("menu.subtitle")}
        />

        {/* Menu Type Tabs */}
        <div className="flex justify-center gap-4 mb-16">
          <button
            onClick={() => setActiveTab("dine-in")}
            className={`px-8 py-3 font-serif text-lg transition-all ${
              activeTab === "dine-in"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-card/80"
            }`}
          >
            {t("menu.dinein")}
          </button>
          <button
            onClick={() => setActiveTab("takeaway")}
            className={`px-8 py-3 font-serif text-lg transition-all ${
              activeTab === "takeaway"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-card/80"
            }`}
          >
            {t("menu.takeaway")}
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="max-w-5xl mx-auto space-y-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="text-center mb-10">
                  <div className="h-8 bg-muted-foreground/20 rounded w-48 mx-auto mb-4" />
                  <div className="w-24 h-px bg-muted-foreground/20 mx-auto" />
                </div>
                <div className="space-y-6">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="bg-card p-6 md:p-8 border border-border">
                      <div className="flex justify-between items-start gap-6">
                        <div className="flex-1">
                          <div className="h-6 bg-muted-foreground/20 rounded w-48 mb-3" />
                          <div className="h-4 bg-muted-foreground/20 rounded w-full mb-2" />
                          <div className="h-4 bg-muted-foreground/20 rounded w-3/4" />
                        </div>
                        <div className="h-6 bg-muted-foreground/20 rounded w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && !isLoading && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {t("menu.error") || "Unable to load menu. Please try again later."}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && menuCategories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {t("menu.empty") || "No menu items available at the moment."}
            </p>
          </div>
        )}

        {/* Menu Categories */}
        {!isLoading && !isError && menuCategories.length > 0 && (
          <motion.div
            key={activeTab}
            className="max-w-5xl mx-auto space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
          {menuCategories.map((category, categoryIndex) => (
            <motion.div
              key={`${activeTab}-${category.name}`}
              variants={categoryVariants}
              custom={categoryIndex}
            >
              {/* Category Header */}
              <motion.div
                className="text-center mb-10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                <h3 className="font-display text-2xl md:text-3xl text-primary tracking-wide uppercase">
                  {category.name}
                </h3>
                <motion.div
                  className="w-24 h-px bg-secondary mx-auto mt-4"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + categoryIndex * 0.1 }}
                />
              </motion.div>

              {/* Menu Items */}
              <motion.div
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={`${activeTab}-${item.id}`}
                    variants={itemVariants}
                    custom={itemIndex}
                    whileHover={{ scale: 1.01, x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative bg-card p-6 md:p-8 border border-border hover:border-secondary/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start gap-6">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h4 className="font-display text-xl md:text-2xl text-foreground group-hover:text-primary transition-colors">
                            {item.displayName}
                          </h4>
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
                                  const menuItem: MenuItem = {
                                    _id: item._id,
                                    name: item.name,
                                    nameNl: item.nameNl,
                                    description: item.description,
                                    price: item.price,
                                    category: item.category,
                                    image: item.image,
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
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
        )}

        {/* View Full Menu CTA */}
        <div className="text-center mt-16">
          <a
            href="/menu"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 font-serif text-lg hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {t("menu.viewfull")}
          </a>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-8 mt-10 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Star size={14} className="text-secondary fill-secondary" />
            <span>Signature</span>
          </div>
          <div className="flex items-center gap-2">
            <Leaf size={14} className="text-green-600" />
            <span>Vegetarian</span>
          </div>
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-red-500" />
            <span>Spicy</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
