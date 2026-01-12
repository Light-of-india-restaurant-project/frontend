import { useState } from "react";
import { Leaf, Flame } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";

// Sample menu data (will be replaced with API data)
const sampleMenuItems = [
  {
    id: "1",
    name: "Butter Chicken",
    description: "Tender chicken in a rich, creamy tomato-based sauce with aromatic spices",
    price: 18.5,
    category: "Main Course",
    isSpicy: false,
  },
  {
    id: "2",
    name: "Lamb Biryani",
    description: "Fragrant basmati rice layered with tender lamb and saffron",
    price: 22.0,
    category: "Main Course",
    isSpicy: true,
  },
  {
    id: "3",
    name: "Paneer Tikka Masala",
    description: "Grilled cottage cheese in a spiced tomato gravy",
    price: 16.5,
    category: "Main Course",
    isVegetarian: true,
  },
  {
    id: "4",
    name: "Tandoori Prawns",
    description: "King prawns marinated in yogurt and spices, cooked in tandoor",
    price: 24.0,
    category: "Starters",
    isSpicy: true,
  },
  {
    id: "5",
    name: "Dal Makhani",
    description: "Black lentils slow-cooked with cream and butter",
    price: 14.0,
    category: "Main Course",
    isVegetarian: true,
    isVegan: false,
  },
  {
    id: "6",
    name: "Chicken Tikka",
    description: "Succulent pieces of chicken marinated and grilled to perfection",
    price: 15.0,
    category: "Starters",
    isSpicy: false,
  },
];

const MenuSection = () => {
  const [activeTab, setActiveTab] = useState<"dine-in" | "takeaway">("dine-in");

  return (
    <section id="menu" className="py-24 bg-muted">
      <div className="container mx-auto px-6">
        <SectionHeading
          title="Our Menu"
          subtitle="Discover the authentic flavors of India, prepared with love and tradition"
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
            Dine In
          </button>
          <button
            onClick={() => setActiveTab("takeaway")}
            className={`px-8 py-3 font-serif text-lg transition-all ${
              activeTab === "takeaway"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-card/80"
            }`}
          >
            Takeaway & Delivery
          </button>
        </div>

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {sampleMenuItems.map((item) => (
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
            View Full Menu
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
