import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, Loader2, AlertCircle, Leaf, Drumstick, UtensilsCrossed, ShoppingCart, Plus, Eye, Check } from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { cateringApi, CateringPack } from '@/lib/user-api';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';

const Catering = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { addCateringPack, isCateringPackInCart, cateringItemCount, cateringTotal } = useCart();
  const [packs, setPacks] = useState<CateringPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [addedPackId, setAddedPackId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await cateringApi.getPacks();
        setPacks(response.packs || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load catering packs');
      } finally {
        setLoading(false);
      }
    };

    fetchPacks();
  }, []);

  const categories = [
    { value: 'all', label: language === 'nl' ? 'Alle' : 'All', icon: UtensilsCrossed },
    { value: 'vegetarian', label: language === 'nl' ? 'Vegetarisch' : 'Vegetarian', icon: Leaf },
    { value: 'non-vegetarian', label: language === 'nl' ? 'Niet-Vegetarisch' : 'Non-Vegetarian', icon: Drumstick },
    { value: 'mixed', label: language === 'nl' ? 'Gemengd' : 'Mixed', icon: UtensilsCrossed },
  ];

  const filteredPacks = selectedCategory === 'all' 
    ? packs 
    : packs.filter(pack => pack.category === selectedCategory);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'vegetarian': return language === 'nl' ? 'Vegetarisch' : 'Vegetarian';
      case 'non-vegetarian': return language === 'nl' ? 'Niet-Vegetarisch' : 'Non-Vegetarian';
      case 'mixed': return language === 'nl' ? 'Gemengd' : 'Mixed';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vegetarian': return 'bg-green-100 text-green-700';
      case 'non-vegetarian': return 'bg-red-100 text-red-700';
      case 'mixed': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleQuickAdd = (pack: CateringPack) => {
    console.log('handleQuickAdd called for:', pack.name, 'id:', pack._id);
    addCateringPack(pack, pack.minPeople);
    setAddedPackId(pack._id);
    toast({
      title: language === 'nl' ? 'Toegevoegd aan winkelwagen' : 'Added to cart',
      description: `${pack.name} (${pack.minPeople} ${language === 'nl' ? 'personen' : 'people'})`,
    });
    setTimeout(() => setAddedPackId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        {/* Hero Section */}
        <section className="relative py-16 bg-gradient-to-b from-primary/10 to-background overflow-hidden">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h1 className="font-display text-4xl md:text-5xl text-foreground mb-6">
                {language === 'nl' ? 'Catering Services' : 'Catering Services'}
              </h1>
              <p className="font-serif text-lg text-muted-foreground">
                {language === 'nl'
                  ? 'Maak uw evenement onvergetelijk met onze authentieke Indiase catering. Kies uit onze zorgvuldig samengestelde pakketten.'
                  : 'Make your event unforgettable with our authentic Indian catering. Choose from our carefully curated packages.'}
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-serif transition-all ${
                    selectedCategory === cat.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                  }`}
                >
                  <cat.icon size={18} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Packs Grid */}
        <section className="py-12">
          <div className="container mx-auto px-6">
            {loading ? (
              <div className="text-center py-20">
                <Loader2 size={48} className="mx-auto text-primary animate-spin" />
                <p className="text-muted-foreground mt-4 font-serif">
                  {language === 'nl' ? 'Pakketten laden...' : 'Loading packages...'}
                </p>
              </div>
            ) : error ? (
              <div className="max-w-md mx-auto text-center py-20">
                <AlertCircle size={48} className="mx-auto text-destructive mb-4" />
                <p className="text-destructive font-serif">{error}</p>
              </div>
            ) : filteredPacks.length === 0 ? (
              <div className="text-center py-20">
                <UtensilsCrossed size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-serif">
                  {language === 'nl' 
                    ? 'Geen pakketten gevonden in deze categorie.' 
                    : 'No packages found in this category.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPacks.map((pack, index) => (
                  <motion.div
                    key={pack._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="bg-card rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                  >
                    {/* Pack Image */}
                    {pack.image ? (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={pack.image}
                          alt={pack.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(pack.category)}`}>
                            {getCategoryLabel(pack.category)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <UtensilsCrossed size={64} className="text-primary/30" />
                        <div className="absolute top-3 right-3">
                          <span className={`text-xs px-3 py-1 rounded-full font-medium ${getCategoryColor(pack.category)}`}>
                            {getCategoryLabel(pack.category)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Pack Content */}
                    <div className="p-6">
                      <h3 className="font-display text-xl text-foreground mb-2">{pack.name}</h3>
                      <p className="font-serif text-sm text-muted-foreground mb-4 line-clamp-2">
                        {language === 'nl' ? pack.descriptionNl : pack.description}
                      </p>

                      {/* Menu Items Preview */}
                      {pack.menuItems.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                            {language === 'nl' ? 'Inclusief' : 'Includes'}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {pack.menuItems.slice(0, 4).map((item) => (
                              <span key={item._id} className="text-xs bg-muted px-2 py-1 rounded">
                                {item.name}
                              </span>
                            ))}
                            {pack.menuItems.length > 4 && (
                              <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                                +{pack.menuItems.length - 4} {language === 'nl' ? 'meer' : 'more'}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Price & Min People */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="font-display text-2xl text-primary">
                            €{pack.pricePerPerson.toFixed(2)}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {language === 'nl' ? ' /persoon' : ' /person'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Users size={16} />
                          <span className="text-sm">
                            {language === 'nl' ? `Min. ${pack.minPeople}` : `Min. ${pack.minPeople}`}
                          </span>
                        </div>
                      </div>

                      {/* Order Button */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/catering/${pack._id}`)}
                          className="flex-1 flex items-center justify-center gap-2 py-3 border border-primary text-primary font-serif hover:bg-primary/5 transition-colors rounded-lg"
                        >
                          <Eye size={18} />
                          {language === 'nl' ? 'Details' : 'View Details'}
                        </button>
                        <button
                          onClick={() => handleQuickAdd(pack)}
                          disabled={addedPackId === pack._id}
                          className={`flex-1 flex items-center justify-center gap-2 py-3 font-serif transition-colors rounded-lg ${
                            addedPackId === pack._id
                              ? 'bg-green-500 text-white'
                              : isCateringPackInCart(pack._id)
                              ? 'bg-primary/80 text-primary-foreground hover:bg-primary'
                              : 'bg-primary text-primary-foreground hover:bg-primary/90'
                          }`}
                        >
                          {addedPackId === pack._id ? (
                            <>
                              <Check size={18} />
                              {language === 'nl' ? 'Toegevoegd!' : 'Added!'}
                            </>
                          ) : isCateringPackInCart(pack._id) ? (
                            <>
                              <Plus size={18} />
                              {language === 'nl' ? 'Nog een' : 'Add more'}
                            </>
                          ) : (
                            <>
                              <ShoppingCart size={18} />
                              {language === 'nl' ? 'Toevoegen' : 'Add to Cart'}
                            </>
                          )}
                        </button>
                      </div>
                      {isCateringPackInCart(pack._id) && addedPackId !== pack._id && (
                        <p className="text-center text-xs text-green-600 mt-2 font-serif">
                          ✓ {language === 'nl' ? 'In winkelwagen' : 'In cart'}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-2xl text-foreground mb-4">
                {language === 'nl' ? 'Hoe werkt het?' : 'How it works'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-display text-xl">
                    1
                  </div>
                  <h3 className="font-serif font-medium text-foreground mb-2">
                    {language === 'nl' ? 'Kies een pakket' : 'Choose a package'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' 
                      ? 'Selecteer het pakket dat past bij uw evenement' 
                      : 'Select the package that fits your event'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-display text-xl">
                    2
                  </div>
                  <h3 className="font-serif font-medium text-foreground mb-2">
                    {language === 'nl' ? 'Vul details in' : 'Fill in details'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' 
                      ? 'Geef het aantal personen en bezorgadres op' 
                      : 'Provide the number of people and delivery address'}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-display text-xl">
                    3
                  </div>
                  <h3 className="font-serif font-medium text-foreground mb-2">
                    {language === 'nl' ? 'Betaal & Geniet' : 'Pay & Enjoy'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {language === 'nl' 
                      ? 'Betaal veilig online en wij bezorgen op de gewenste datum' 
                      : 'Pay securely online and we deliver on your chosen date'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Catering;
