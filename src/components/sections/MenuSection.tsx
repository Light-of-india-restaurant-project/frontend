import { useState } from "react";
import { motion } from "framer-motion";
import { Leaf, Flame, Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";

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
  const { t } = useLanguage();

  const menuCategories = [
    {
      name: "Starters",
      nameNl: "Voorgerechten",
      items: [
        {
          id: "1",
          name: t("menu.gilafi.seekh"),
          description: t("menu.gilafi.seekh.desc"),
          price: 18.0,
          isSignature: true,
        },
        {
          id: "2",
          name: t("menu.scallops"),
          description: t("menu.scallops.desc"),
          price: 26.0,
          isSignature: true,
        },
        {
          id: "3",
          name: t("menu.burrata"),
          description: t("menu.burrata.desc"),
          price: 19.0,
          isVegetarian: true,
        },
      ],
    },
    {
      name: "Signature Mains",
      nameNl: "Signature Hoofdgerechten",
      items: [
        {
          id: "4",
          name: t("menu.halibut.tikka"),
          description: t("menu.halibut.tikka.desc"),
          price: 46.0,
          isSignature: true,
        },
        {
          id: "5",
          name: t("menu.lamb.rogan"),
          description: t("menu.lamb.rogan.desc"),
          price: 42.0,
          isSpicy: true,
          isSignature: true,
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
      ],
    },
    {
      name: "Vegetarian",
      nameNl: "Vegetarisch",
      items: [
        {
          id: "8",
          name: t("menu.truffle.paneer"),
          description: t("menu.truffle.paneer.desc"),
          price: 28.0,
          isVegetarian: true,
          isSignature: true,
        },
        {
          id: "9",
          name: t("menu.jackfruit.biryani"),
          description: t("menu.jackfruit.biryani.desc"),
          price: 32.0,
          isVegetarian: true,
        },
      ],
    },
    {
      name: "Classics Reimagined",
      nameNl: "Klassiekers Opnieuw Uitgevonden",
      items: [
        {
          id: "10",
          name: t("menu.butter.chicken"),
          description: t("menu.butter.chicken.desc"),
          price: 32.0,
          isSignature: true,
        },
        {
          id: "11",
          name: t("menu.biryani.signature"),
          description: t("menu.biryani.signature.desc"),
          price: 38.0,
          isSignature: true,
        },
      ],
    },
  ];

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

        {/* Menu Categories */}
        <motion.div
          className="max-w-5xl mx-auto space-y-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {menuCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
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
                    key={item.id}
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
                            {item.name}
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
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

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
