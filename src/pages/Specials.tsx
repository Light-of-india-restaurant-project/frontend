import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star, Clock, Tag, Plus, Minus, ShoppingCart, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { offerApi, Offer } from "@/lib/user-api";
import { useCart } from "@/contexts/CartContext";

const Specials = () => {
  const { language } = useLanguage();
  const { addOffer, isOfferInCart, getOfferQuantity, updateOfferQuantity, removeOffer } = useCart();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const data = await offerApi.getActiveOffers();
        setOffers(data.offers);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch offers:", err);
        setError(language === "nl" ? "Aanbiedingen laden mislukt" : "Failed to load offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, [language]);

  const handleAddToCart = (offer: Offer) => {
    addOffer(offer);
  };

  const handleIncrement = (offer: Offer) => {
    const currentQty = getOfferQuantity(offer._id);
    updateOfferQuantity(offer._id, currentQty + 1);
  };

  const handleDecrement = (offer: Offer) => {
    const currentQty = getOfferQuantity(offer._id);
    if (currentQty > 1) {
      updateOfferQuantity(offer._id, currentQty - 1);
    } else {
      removeOffer(offer._id);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "hsl(40, 33%, 96%)" }}>
      <Header />

      {/* Hero Banner */}
      <section
        className="relative pt-32 pb-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, hsl(25, 30%, 20%), hsl(25, 30%, 25%))",
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 border border-secondary rounded-full" />
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 border border-secondary rounded-full" />
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles
              className="mx-auto mb-4"
              size={48}
              style={{ color: "hsl(43, 74%, 49%)" }}
            />
            <h1
              className="text-4xl md:text-6xl font-display mb-4"
              style={{ color: "hsl(40, 33%, 96%)" }}
            >
              {language === "nl" ? "Speciale Aanbiedingen" : "Special Offers"}
            </h1>
            <p
              className="text-xl font-serif max-w-2xl mx-auto"
              style={{ color: "hsla(40, 33%, 96%, 0.8)" }}
            >
              {language === "nl"
                ? "Ontdek onze exclusieve aanbiedingen en seizoensgebonden specialiteiten"
                : "Discover our exclusive deals and seasonal specialties"}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Specials Content */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <SectionHeading
            title={language === "nl" ? "Wat is er speciaal?" : "What's Special?"}
            subtitle={
              language === "nl"
                ? "Onze chef-koks bereiden speciale gerechten en aanbiedingen voor u"
                : "Our chefs prepare special dishes and offers just for you"
            }
          />

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin" style={{ color: "hsl(43, 74%, 49%)" }} />
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-red-500 font-serif text-lg">{error}</p>
            </motion.div>
          )}

          {/* No Offers State */}
          {!loading && !error && offers.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-2xl mx-auto text-center mt-12"
            >
              <div
                className="rounded-2xl p-12 shadow-lg"
                style={{
                  backgroundColor: "hsl(25, 30%, 20%)",
                  border: "1px solid hsla(43, 74%, 49%, 0.3)",
                }}
              >
                <Star
                  className="mx-auto mb-6"
                  size={56}
                  style={{ color: "hsl(43, 74%, 49%)" }}
                />
                <h3
                  className="text-3xl font-display mb-4"
                  style={{ color: "hsl(43, 74%, 49%)" }}
                >
                  {language === "nl" ? "Binnenkort beschikbaar" : "Coming Soon"}
                </h3>
                <p
                  className="text-lg font-serif leading-relaxed mb-8"
                  style={{ color: "hsla(40, 33%, 96%, 0.8)" }}
                >
                  {language === "nl"
                    ? "We bereiden spannende speciale aanbiedingen voor u voor. Kom snel terug om onze exclusieve deals en seizoensgebonden specialiteiten te ontdekken!"
                    : "We're preparing exciting special offers for you. Check back soon to discover our exclusive deals and seasonal specialties!"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/#menu"
                    className="px-8 py-3 font-serif text-lg transition-all hover:scale-105"
                    style={{
                      backgroundColor: "hsl(43, 74%, 49%)",
                      color: "hsl(25, 30%, 15%)",
                    }}
                  >
                    {language === "nl" ? "Bekijk Menu" : "View Menu"}
                  </a>
                  <a
                    href="/#reservation"
                    className="px-8 py-3 font-serif text-lg transition-all hover:scale-105"
                    style={{
                      border: "2px solid hsl(43, 74%, 49%)",
                      color: "hsl(43, 74%, 49%)",
                    }}
                  >
                    {language === "nl" ? "Reserveer een Tafel" : "Reserve a Table"}
                  </a>
                </div>
              </div>
            </motion.div>
          )}

          {/* Offers Grid */}
          {!loading && !error && offers.length > 0 && (
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              {offers.map((offer, index) => (
                <motion.div
                  key={offer._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-2xl overflow-hidden shadow-lg group w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.5rem)] max-w-[400px]"
                  style={{
                    backgroundColor: "hsl(25, 30%, 20%)",
                    border: "1px solid hsla(43, 74%, 49%, 0.2)",
                  }}
                >
                  {/* Offer Image */}
                  <div className="relative h-56 overflow-hidden">
                    {offer.image ? (
                      <img
                        src={offer.image}
                        alt={offer.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: "hsl(25, 30%, 25%)" }}
                      >
                        <Tag size={48} style={{ color: "hsl(43, 74%, 49%)" }} />
                      </div>
                    )}
                    {/* Price Badge */}
                    <div
                      className="absolute top-4 right-4 px-4 py-2 rounded-full font-display text-lg"
                      style={{
                        backgroundColor: "hsl(43, 74%, 49%)",
                        color: "hsl(25, 30%, 15%)",
                      }}
                    >
                      €{offer.price.toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="p-6">
                    <h3
                      className="text-2xl font-display mb-3"
                      style={{ color: "hsl(43, 74%, 49%)" }}
                    >
                      {offer.name}
                    </h3>
                    <p
                      className="font-serif text-sm leading-relaxed mb-6"
                      style={{ color: "hsla(40, 33%, 96%, 0.8)" }}
                    >
                      {language === "nl" && offer.descriptionNl
                        ? offer.descriptionNl
                        : offer.description}
                    </p>

                    {/* Add to Cart / Quantity Controls */}
                    {!isOfferInCart(offer._id) ? (
                      <button
                        onClick={() => handleAddToCart(offer)}
                        className="w-full py-3 px-6 rounded-lg font-serif text-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
                        style={{
                          backgroundColor: "hsl(43, 74%, 49%)",
                          color: "hsl(25, 30%, 15%)",
                        }}
                      >
                        <ShoppingCart size={20} />
                        {language === "nl" ? "Toevoegen aan winkelwagen" : "Add to Cart"}
                      </button>
                    ) : (
                      <div
                        className="flex items-center gap-8 py-3 px-8 rounded-lg mx-auto"
                        style={{
                          backgroundColor: "hsla(43, 74%, 49%, 0.1)",
                          border: "1px solid hsl(43, 74%, 49%)",
                          width: "fit-content",
                        }}
                      >
                        <button
                          onClick={() => handleDecrement(offer)}
                          className="p-2 rounded-full transition-all hover:scale-110"
                          style={{
                            backgroundColor: "hsl(43, 74%, 49%)",
                            color: "hsl(25, 30%, 15%)",
                          }}
                        >
                          <Minus size={18} />
                        </button>
                        <span
                          className="font-display text-xl min-w-[2rem] text-center"
                          style={{ color: "hsl(43, 74%, 49%)" }}
                        >
                          {getOfferQuantity(offer._id)}
                        </span>
                        <button
                          onClick={() => handleIncrement(offer)}
                          className="p-2 rounded-full transition-all hover:scale-110"
                          style={{
                            backgroundColor: "hsl(43, 74%, 49%)",
                            color: "hsl(25, 30%, 15%)",
                          }}
                        >
                          <Plus size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Feature highlights */}
          <div className="grid md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
            {[
              {
                icon: Tag,
                titleEn: "Exclusive Deals",
                titleNl: "Exclusieve Deals",
                descEn: "Special pricing on selected dishes and combos",
                descNl: "Speciale prijzen op geselecteerde gerechten en combo's",
              },
              {
                icon: Clock,
                titleEn: "Seasonal Specials",
                titleNl: "Seizoensgebonden",
                descEn: "Limited-time dishes featuring seasonal ingredients",
                descNl: "Tijdelijke gerechten met seizoensgebonden ingrediënten",
              },
              {
                icon: Sparkles,
                titleEn: "Chef's Selection",
                titleNl: "Chef's Selectie",
                descEn: "Hand-picked specialties by our head chef",
                descNl: "Door onze chef-kok geselecteerde specialiteiten",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="text-center p-6"
              >
                <feature.icon
                  className="mx-auto mb-4"
                  size={36}
                  style={{ color: "hsl(43, 74%, 49%)" }}
                />
                <h4
                  className="text-xl font-display mb-2"
                  style={{ color: "hsl(25, 30%, 20%)" }}
                >
                  {language === "nl" ? feature.titleNl : feature.titleEn}
                </h4>
                <p className="font-serif text-muted-foreground">
                  {language === "nl" ? feature.descNl : feature.descEn}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Specials;
