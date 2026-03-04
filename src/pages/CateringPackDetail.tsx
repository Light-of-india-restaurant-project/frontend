import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Plus,
  Minus,
  ShoppingCart,
  Loader2,
  AlertCircle,
  Check,
  Leaf,
  Drumstick,
  UtensilsCrossed,
  ChefHat,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { cateringApi, CateringPack } from '@/lib/user-api';
import { useCart } from '@/contexts/CartContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';

const CateringPackDetail = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { toast } = useToast();
  const { addCateringPack, isCateringPackInCart, getCateringItem, updateCateringPeopleCount, cateringItemCount } = useCart();

  const [pack, setPack] = useState<CateringPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [peopleCount, setPeopleCount] = useState(10);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchPack = async () => {
      if (!packId) return;
      try {
        const response = await cateringApi.getPack(packId);
        setPack(response.pack);
        setPeopleCount(response.pack.minPeople);
        
        // Check if already in cart
        const cartItem = getCateringItem(packId);
        if (cartItem) {
          setPeopleCount(cartItem.peopleCount);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pack details');
      } finally {
        setLoading(false);
      }
    };

    fetchPack();
  }, [packId, getCateringItem]);

  const handlePeopleChange = (delta: number) => {
    if (!pack) return;
    const newCount = Math.max(pack.minPeople, peopleCount + delta);
    setPeopleCount(newCount);
    
    // Update cart if item is already in cart
    if (isCateringPackInCart(pack._id)) {
      updateCateringPeopleCount(pack._id, newCount);
    }
  };

  const handleAddToCart = () => {
    if (!pack) return;
    
    addCateringPack(pack, peopleCount);
    setAddedToCart(true);
    
    toast({
      title: language === 'nl' ? 'Toegevoegd aan winkelwagen' : 'Added to cart',
      description: `${pack.name} (${peopleCount} ${language === 'nl' ? 'personen' : 'people'})`,
    });
    
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'vegetarian': return language === 'nl' ? 'Vegetarisch' : 'Vegetarian';
      case 'non-vegetarian': return language === 'nl' ? 'Niet-Vegetarisch' : 'Non-Vegetarian';
      case 'mixed': return language === 'nl' ? 'Gemengd' : 'Mixed';
      default: return category;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'vegetarian': return Leaf;
      case 'non-vegetarian': return Drumstick;
      default: return UtensilsCrossed;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'vegetarian': return 'bg-green-100 text-green-700 border-green-200';
      case 'non-vegetarian': return 'bg-red-100 text-red-700 border-red-200';
      case 'mixed': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const totalPrice = pack ? pack.pricePerPerson * peopleCount : 0;
  const inCart = pack ? isCateringPackInCart(pack._id) : false;
  const CategoryIcon = pack ? getCategoryIcon(pack.category) : UtensilsCrossed;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 pb-20">
        {/* Back Button */}
        <div className="container mx-auto px-6 py-4">
          <button
            onClick={() => navigate('/catering')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-serif"
          >
            <ArrowLeft size={20} />
            {language === 'nl' ? 'Terug naar pakketten' : 'Back to packages'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <Loader2 size={48} className="mx-auto text-primary animate-spin" />
            <p className="text-muted-foreground mt-4 font-serif">
              {language === 'nl' ? 'Pakket laden...' : 'Loading package...'}
            </p>
          </div>
        ) : error || !pack ? (
          <div className="max-w-md mx-auto text-center py-20">
            <AlertCircle size={48} className="mx-auto text-destructive mb-4" />
            <p className="text-destructive font-serif">{error || 'Package not found'}</p>
            <button
              onClick={() => navigate('/catering')}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-serif"
            >
              {language === 'nl' ? 'Terug naar pakketten' : 'Back to packages'}
            </button>
          </div>
        ) : (
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Image & Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden shadow-xl mb-6">
                  {pack.image ? (
                    <img
                      src={pack.image}
                      alt={pack.name}
                      className="w-full h-80 object-cover"
                    />
                  ) : (
                    <div className="w-full h-80 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <ChefHat size={80} className="text-primary/30" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4">
                    <span className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium border ${getCategoryColor(pack.category)}`}>
                      <CategoryIcon size={18} />
                      {getCategoryLabel(pack.category)}
                    </span>
                  </div>
                </div>

                {/* Pack Info */}
                <h1 className="font-display text-3xl md:text-4xl text-foreground mb-4">
                  {pack.name}
                </h1>
                <p className="font-serif text-lg text-muted-foreground mb-6">
                  {language === 'nl' ? pack.descriptionNl : pack.description}
                </p>

                {/* Price & Min People Info */}
                <div className="flex items-center gap-6 p-4 bg-muted rounded-xl mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === 'nl' ? 'Prijs per persoon' : 'Price per person'}
                    </p>
                    <p className="font-display text-2xl text-primary">
                      €{pack.pricePerPerson.toFixed(2)}
                    </p>
                  </div>
                  <div className="h-12 w-px bg-border" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {language === 'nl' ? 'Minimum personen' : 'Minimum people'}
                    </p>
                    <p className="font-display text-2xl text-foreground flex items-center gap-2">
                      <Users size={20} className="text-muted-foreground" />
                      {pack.minPeople}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Menu Items & Add to Cart */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {/* Menu Items */}
                <div className="bg-card rounded-2xl shadow-lg p-6 mb-6">
                  <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
                    <ChefHat size={24} className="text-primary" />
                    {language === 'nl' ? 'Wat zit er in dit pakket' : "What's included"}
                  </h2>
                  
                  {pack.menuItems.length > 0 ? (
                    <div className="space-y-3">
                      {pack.menuItems.map((item, index) => (
                        <motion.div
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                          className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                        >
                          <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-serif font-medium text-foreground">
                              {item.name}
                            </h3>
                            {item.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {language === 'nl' && item.descriptionNl
                                  ? item.descriptionNl
                                  : item.description}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8 font-serif">
                      {language === 'nl'
                        ? 'Menu-items worden binnenkort toegevoegd'
                        : 'Menu items will be added soon'}
                    </p>
                  )}
                </div>

                {/* Add to Cart Section */}
                <div className="bg-card rounded-2xl shadow-lg p-6 sticky top-28">
                  <h3 className="font-display text-lg text-foreground mb-4">
                    {language === 'nl' ? 'Bestel dit pakket' : 'Order this package'}
                  </h3>

                  {/* People Count Selector */}
                  <div className="mb-6">
                    <label className="block text-sm text-muted-foreground mb-2 font-serif">
                      {language === 'nl' ? 'Aantal personen' : 'Number of people'}
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handlePeopleChange(-1)}
                        disabled={peopleCount <= pack.minPeople}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={20} />
                      </button>
                      <div className="flex-1 text-center">
                        <span className="font-display text-3xl text-foreground">
                          {peopleCount}
                        </span>
                        <span className="text-muted-foreground ml-2 font-serif">
                          {language === 'nl' ? 'personen' : 'people'}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePeopleChange(1)}
                        className="w-12 h-12 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                    {peopleCount === pack.minPeople && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        {language === 'nl'
                          ? `Minimum ${pack.minPeople} personen voor dit pakket`
                          : `Minimum ${pack.minPeople} people for this package`}
                      </p>
                    )}
                  </div>

                  {/* Total Price */}
                  <div className="flex items-center justify-between p-4 bg-primary/5 rounded-xl mb-6">
                    <span className="font-serif text-muted-foreground">
                      {language === 'nl' ? 'Totaal' : 'Total'}
                    </span>
                    <span className="font-display text-3xl text-primary">
                      €{totalPrice.toFixed(2)}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-serif text-lg transition-all ${
                      addedToCart
                        ? 'bg-green-500 text-white'
                        : inCart
                        ? 'bg-primary/80 text-primary-foreground hover:bg-primary'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check size={24} />
                        {language === 'nl' ? 'Toegevoegd!' : 'Added!'}
                      </>
                    ) : inCart ? (
                      <>
                        <Plus size={24} />
                        {language === 'nl' ? 'Nog een toevoegen' : 'Add another'}
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={24} />
                        {language === 'nl' ? 'Toevoegen aan winkelwagen' : 'Add to cart'}
                      </>
                    )}
                  </button>

                  {inCart && (
                    <p className="text-center text-sm text-green-600 mt-3 font-serif">
                      {language === 'nl'
                        ? '✓ Dit pakket zit al in je winkelwagen'
                        : '✓ This package is already in your cart'}
                    </p>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default CateringPackDetail;
