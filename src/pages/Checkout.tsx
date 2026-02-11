import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Clock, FileText, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/contexts/CartContext";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { orderApi } from "@/lib/user-api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Checkout = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { items, total, itemCount, clearCart } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useUserAuth();
  
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{ orderNumber: string } | null>(null);

  // Generate pickup time options (next 2 hours in 15-min intervals)
  const pickupTimeOptions = () => {
    const options: string[] = [];
    const now = new Date();
    const start = new Date(now.getTime() + 30 * 60000); // 30 min from now
    start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0); // Round to next 15 min
    
    for (let i = 0; i < 8; i++) {
      const time = new Date(start.getTime() + i * 15 * 60000);
      options.push(time.toLocaleTimeString("nl-NL", { hour: "2-digit", minute: "2-digit" }));
    }
    return options;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
      return;
    }
    
    if (items.length === 0) {
      setError(language === "nl" ? "Je winkelwagen is leeg" : "Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        items: items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })),
        pickupTime: pickupTime ? new Date(`${new Date().toDateString()} ${pickupTime}`).toISOString() : undefined,
        notes: notes || undefined,
      };

      const response = await orderApi.createOrder(orderData);
      
      setOrderSuccess({ orderNumber: response.order.orderNumber });
      clearCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to place order");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order success view
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
              </motion.div>
              <h1 className="font-display text-4xl text-foreground mb-4">
                {language === "nl" ? "Bestelling Geplaatst!" : "Order Placed!"}
              </h1>
              <p className="font-serif text-xl text-muted-foreground mb-2">
                {language === "nl" ? "Bestelnummer" : "Order Number"}:
              </p>
              <p className="font-display text-2xl text-primary mb-8">
                {orderSuccess.orderNumber}
              </p>
              <p className="font-serif text-muted-foreground mb-8">
                {language === "nl"
                  ? "We sturen je een bevestiging wanneer je bestelling klaar is voor afhaling."
                  : "We'll notify you when your order is ready for pickup."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/orders")}
                  className="px-6 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
                >
                  {language === "nl" ? "Bekijk Bestellingen" : "View Orders"}
                </button>
                <button
                  onClick={() => navigate("/menu")}
                  className="px-6 py-3 bg-muted text-foreground font-serif hover:bg-muted/80 transition-colors"
                >
                  {language === "nl" ? "Terug naar Menu" : "Back to Menu"}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Empty cart view
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <ShoppingCart size={64} className="mx-auto text-muted-foreground/50 mb-6" />
              <h1 className="font-display text-3xl text-foreground mb-4">
                {language === "nl" ? "Je winkelwagen is leeg" : "Your cart is empty"}
              </h1>
              <p className="font-serif text-muted-foreground mb-8">
                {language === "nl"
                  ? "Voeg items toe aan je winkelwagen vanuit het takeaway menu."
                  : "Add items to your cart from the takeaway menu."}
              </p>
              <button
                onClick={() => navigate("/menu")}
                className="px-8 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
              >
                {language === "nl" ? "Bekijk Menu" : "Browse Menu"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-serif mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            {language === "nl" ? "Terug" : "Back"}
          </button>

          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-4xl text-foreground mb-8">
              {language === "nl" ? "Afrekenen" : "Checkout"}
            </h1>

            {/* Login Required Notice */}
            {!authLoading && !isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-8"
              >
                <div className="flex items-start gap-4">
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-display text-lg text-amber-800 mb-2">
                      {language === "nl" ? "Login Vereist" : "Login Required"}
                    </h3>
                    <p className="font-serif text-amber-700 mb-4">
                      {language === "nl"
                        ? "Je moet ingelogd zijn om een bestelling te plaatsen."
                        : "You need to be logged in to place an order."}
                    </p>
                    <button
                      onClick={() => navigate("/login?redirect=/checkout")}
                      className="px-6 py-2 bg-amber-600 text-white font-serif hover:bg-amber-700 transition-colors rounded"
                    >
                      {language === "nl" ? "Inloggen" : "Login"}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="grid md:grid-cols-[1fr,400px] gap-8">
              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Pickup Time */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="text-primary" size={24} />
                    <h2 className="font-display text-xl text-foreground">
                      {language === "nl" ? "Afhaaltijd" : "Pickup Time"}
                    </h2>
                  </div>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    className="w-full p-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">
                      {language === "nl" ? "Zo snel mogelijk" : "As soon as possible"}
                    </option>
                    {pickupTimeOptions().map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FileText className="text-primary" size={24} />
                    <h2 className="font-display text-xl text-foreground">
                      {language === "nl" ? "Opmerkingen" : "Special Instructions"}
                    </h2>
                  </div>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={
                      language === "nl"
                        ? "Eventuele speciale verzoeken of allergieën..."
                        : "Any special requests or allergies..."
                    }
                    rows={4}
                    maxLength={500}
                    className="w-full p-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                  <p className="text-sm text-muted-foreground mt-2 text-right">
                    {notes.length}/500
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 flex items-center gap-3">
                    <AlertCircle className="text-destructive" size={20} />
                    <p className="font-serif text-destructive">{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !isAuthenticated}
                  className="w-full py-4 bg-primary text-primary-foreground font-serif text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {language === "nl" ? "Bezig met bestellen..." : "Placing Order..."}
                    </>
                  ) : (
                    <>
                      {language === "nl" ? "Bestelling Plaatsen" : "Place Order"}
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-muted-foreground font-serif">
                  {language === "nl"
                    ? "Betaling geschiedt bij afhaling"
                    : "Payment is collected at pickup"}
                </p>
              </form>

              {/* Order Summary */}
              <div className="bg-card border border-border rounded-lg p-6 h-fit">
                <h2 className="font-display text-xl text-foreground mb-6">
                  {language === "nl" ? "Besteloverzicht" : "Order Summary"}
                </h2>

                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-serif text-foreground">
                          {language === "nl" && item.nameNl ? item.nameNl : item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × €{item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="font-serif text-foreground">
                        €{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg text-foreground">
                      {language === "nl" ? "Totaal" : "Total"} ({itemCount} items)
                    </span>
                    <span className="font-display text-2xl text-secondary">
                      €{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
