import { useState } from "react";
import { Leaf, Flame, Star } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";

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
          name: t("menu.lobster.malabar"),
          description: t("menu.lobster.malabar.desc"),
          price: 48.0,
          isSignature: true,
        },
        {
          id: "5",
          name: t("menu.venison.nalli"),
          description: t("menu.venison.nalli.desc"),
          price: 42.0,
          isSpicy: true,
          isSignature: true,
        },
        {
          id: "6",
          name: t("menu.duck.chettinad"),
          description: t("menu.duck.chettinad.desc"),
          price: 38.0,
          isSpicy: true,
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
        <div className="max-w-5xl mx-auto space-y-16">
          {menuCategories.map((category) => (
            <div key={category.name}>
              {/* Category Header */}
              <div className="text-center mb-10">
                <h3 className="font-display text-2xl md:text-3xl text-primary tracking-wide uppercase">
                  {category.name}
                </h3>
                <div className="w-24 h-px bg-secondary mx-auto mt-4" />
              </div>

              {/* Menu Items */}
              <div className="space-y-6">
                {category.items.map((item) => (
                  <div
                    key={item.id}
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
                              <span title="Signature Dish">
                                <Star size={16} className="text-secondary fill-secondary" />
                              </span>
                            )}
                            {item.isVegetarian && (
                              <span title="Vegetarian">
                                <Leaf size={16} className="text-green-600" />
                              </span>
                            )}
                            {item.isSpicy && (
                              <span title="Spicy">
                                <Flame size={16} className="text-red-500" />
                              </span>
                            )}
                          </div>
                        </div>
                        <p className="font-serif text-muted-foreground leading-relaxed text-base md:text-lg">
                          {item.description}
                        </p>
                      </div>
                      <span className="font-display text-xl md:text-2xl text-secondary whitespace-nowrap">
                        €{item.price.toFixed(0)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

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
