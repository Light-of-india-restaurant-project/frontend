import { useState } from "react";
import { Leaf, Flame } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState<"dine-in" | "takeaway">("dine-in");
  const { t } = useLanguage();

  const menuItems = [
    {
      id: "1",
      name: t("menu.butterchicken"),
      description: t("menu.butterchicken.desc"),
      price: 18.5,
      category: "Main Course",
      isSpicy: false,
    },
    {
      id: "2",
      name: t("menu.biryani"),
      description: t("menu.biryani.desc"),
      price: 22.0,
      category: "Main Course",
      isSpicy: true,
    },
    {
      id: "3",
      name: t("menu.paneer"),
      description: t("menu.paneer.desc"),
      price: 16.5,
      category: "Main Course",
      isVegetarian: true,
    },
    {
      id: "4",
      name: t("menu.tandoori"),
      description: t("menu.tandoori.desc"),
      price: 24.0,
      category: "Starters",
      isSpicy: true,
    },
    {
      id: "5",
      name: t("menu.dal"),
      description: t("menu.dal.desc"),
      price: 14.0,
      category: "Main Course",
      isVegetarian: true,
    },
    {
      id: "6",
      name: t("menu.samosa"),
      description: t("menu.samosa.desc"),
      price: 8.0,
      category: "Starters",
      isVegetarian: true,
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
        <div className="flex justify-center gap-4 mb-12">
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

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="bg-card p-6 border border-border hover:border-secondary/50 transition-colors group"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-display text-xl text-foreground group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    {item.isVegetarian && (
                      <span title="Vegetarian"><Leaf size={16} className="text-green-600" /></span>
                    )}
                    {item.isSpicy && (
                      <span title="Spicy"><Flame size={16} className="text-red-500" /></span>
                    )}
                  </div>
                  <p className="font-serif text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <span className="font-display text-xl text-secondary whitespace-nowrap">
                  €{item.price.toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View Full Menu CTA */}
        <div className="text-center mt-12">
          <a
            href="/menu"
            className="inline-flex items-center gap-2 border-2 border-primary text-primary px-8 py-3 font-serif text-lg hover:bg-primary hover:text-primary-foreground transition-all"
          >
            {t("menu.viewfull")}
          </a>
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-8 mt-8 text-sm text-muted-foreground">
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
