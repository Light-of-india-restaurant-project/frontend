import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Clock, FileText, AlertCircle, Loader2, CreditCard, MapPin, Phone, CheckCircle, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/contexts/CartContext";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { paymentApi, orderApi } from "@/lib/user-api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/formatPrice";

const Checkout = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { items, total, itemCount, cateringItems, cateringTotal, cateringItemCount, offerItems, offerTotal, offerItemCount, totalItemCount, grandTotal } = useCart();
  const { isAuthenticated, isLoading: authLoading } = useUserAuth();
  
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if cart only has specials/offers (no delivery needed - dine-in only)
  const isOffersOnly = offerItems.length > 0 && items.length === 0 && cateringItems.length === 0;

  // Delivery address state
  const [postalCode, setPostalCode] = useState("");
  const [streetName, setStreetName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("Rotterdam");
  const [contactMobile, setContactMobile] = useState("");
  const [email, setEmail] = useState("");
  
  // Postal code validation state
  const [isCheckingPostalCode, setIsCheckingPostalCode] = useState(false);
  const [postalCodeValid, setPostalCodeValid] = useState<boolean | null>(null);
  const [postalCodeMessage, setPostalCodeMessage] = useState<string | null>(null);

  // Debounced postal code check
  const checkPostalCode = useCallback(async (code: string) => {
    if (!code || code.length < 6) {
      setPostalCodeValid(null);
      setPostalCodeMessage(null);
      return;
    }

    setIsCheckingPostalCode(true);
    try {
      const result = await orderApi.checkDeliveryArea(code);
      setPostalCodeValid(result.deliverable);
      setPostalCodeMessage(result.message);
      if (result.deliverable && result.postalCode) {
        setPostalCode(result.postalCode); // Use formatted postal code
      }
    } catch (err) {
      setPostalCodeValid(false);
      setPostalCodeMessage(language === "nl" ? "Kon postcode niet valideren" : "Could not validate postal code");
    } finally {
      setIsCheckingPostalCode(false);
    }
  }, [language]);

  // Check postal code with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (postalCode.replace(/\s/g, '').length >= 6) {
        checkPostalCode(postalCode);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [postalCode, checkPostalCode]);

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

  // Validate form before submission
  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // For offers only (dine-in specials), only need contact info
    if (isOffersOnly) {
      return (
        contactMobile.trim() !== "" &&
        email.trim() !== "" &&
        emailRegex.test(email)
      );
    }
    
    // For delivery orders, need full address
    return (
      postalCodeValid === true &&
      streetName.trim() !== "" &&
      houseNumber.trim() !== "" &&
      city.trim() !== "" &&
      contactMobile.trim() !== "" &&
      email.trim() !== "" &&
      emailRegex.test(email)
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate("/login?redirect=/checkout");
      return;
    }
    
    if (items.length === 0 && cateringItems.length === 0 && offerItems.length === 0) {
      setError(language === "nl" ? "Je winkelwagen is leeg" : "Your cart is empty");
      return;
    }

    if (!isFormValid()) {
      setError(isOffersOnly 
        ? (language === "nl" 
          ? "Vul uw contactgegevens in" 
          : "Please fill in your contact details")
        : (language === "nl" 
          ? "Vul alle bezorggegevens in en zorg ervoor dat uw postcode binnen ons bezorggebied valt" 
          : "Please fill in all delivery details and ensure your postal code is within our delivery area"));
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        items: items.length > 0 ? items.map((item) => ({
          menuItemId: item.menuItemId,
          quantity: item.quantity,
        })) : undefined,
        cateringItems: cateringItems.length > 0 ? cateringItems.map((item) => ({
          packId: item.packId,
          peopleCount: item.peopleCount,
          quantity: item.quantity,
        })) : undefined,
        offerItems: offerItems.length > 0 ? offerItems.map((item) => ({
          offerId: item.offerId,
          quantity: item.quantity,
        })) : undefined,
        pickupTime: pickupTime ? new Date(`${new Date().toDateString()} ${pickupTime}`).toISOString() : undefined,
        notes: notes || undefined,
        // Only include delivery address if not offers-only (dine-in)
        deliveryAddress: isOffersOnly ? undefined : {
          postalCode: postalCode.trim(),
          streetName: streetName.trim(),
          houseNumber: houseNumber.trim(),
          city: city.trim(),
        },
        isPickup: isOffersOnly, // Flag for pickup/dine-in orders
        contactMobile: contactMobile.trim(),
        email: email.trim(),
      };

      // Initiate payment and get Mollie checkout URL
      const response = await paymentApi.initiatePayment(orderData);
      
      // Store payment ID in sessionStorage for use after redirect
      sessionStorage.setItem('pendingPaymentId', response.paymentId);
      
      // Redirect to Mollie payment page
      window.location.href = response.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
      setIsSubmitting(false);
    }
  };

  // Empty cart view
  if (items.length === 0 && cateringItems.length === 0 && offerItems.length === 0) {
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
                  ? "Voeg items toe aan je winkelwagen vanuit het menu of catering."
                  : "Add items to your cart from the menu or catering."}
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

                {/* Delivery Address - Hidden for offers-only orders (dine-in specials) */}
                {!isOffersOnly && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="text-primary" size={24} />
                      <h2 className="font-display text-xl text-foreground">
                        {language === "nl" ? "Bezorgadres" : "Delivery Address"}
                      </h2>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {language === "nl" 
                        ? "Wij bezorgen alleen in Rotterdam (postcodes 3000-3199)" 
                        : "We only deliver to Rotterdam area (postal codes 3000-3199)"}
                    </p>
                    
                    <div className="space-y-4">
                      {/* Postal Code */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {language === "nl" ? "Postcode *" : "Postal Code *"}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => {
                              setPostalCode(e.target.value.toUpperCase());
                              setPostalCodeValid(null);
                            }}
                            placeholder={language === "nl" ? "bijv. 3011 AB" : "e.g. 3011 AB"}
                            maxLength={7}
                            className={`w-full p-3 bg-background border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary ${
                              postalCodeValid === true ? 'border-green-500' : 
                              postalCodeValid === false ? 'border-red-500' : 'border-border'
                            }`}
                          />
                          {isCheckingPostalCode && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
                          )}
                          {!isCheckingPostalCode && postalCodeValid === true && (
                            <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                          )}
                          {!isCheckingPostalCode && postalCodeValid === false && (
                            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-red-500" />
                          )}
                        </div>
                        {postalCodeMessage && (
                          <p className={`text-sm mt-1 ${postalCodeValid ? 'text-green-600' : 'text-red-600'}`}>
                            {postalCodeMessage}
                          </p>
                        )}
                      </div>

                      {/* Street Name and House Number */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            {language === "nl" ? "Straatnaam *" : "Street Name *"}
                          </label>
                          <input
                            type="text"
                            value={streetName}
                            onChange={(e) => setStreetName(e.target.value)}
                            placeholder={language === "nl" ? "bijv. Coolsingel" : "e.g. Coolsingel"}
                            className="w-full p-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1">
                            {language === "nl" ? "Huisnummer *" : "House Number *"}
                          </label>
                          <input
                            type="text"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            placeholder={language === "nl" ? "bijv. 42A" : "e.g. 42A"}
                            className="w-full p-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          {language === "nl" ? "Stad *" : "City *"}
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Rotterdam"
                          className="w-full p-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Notice for offers-only orders (dine-in specials) */}
                {isOffersOnly && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="text-amber-600 dark:text-amber-400" size={24} />
                      <h2 className="font-display text-xl text-amber-800 dark:text-amber-200">
                        {language === "nl" ? "Afhalen in Restaurant" : "Restaurant Pickup"}
                      </h2>
                    </div>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      {language === "nl" 
                        ? "Speciale aanbiedingen zijn alleen beschikbaar voor afhalen in het restaurant. Geen bezorging beschikbaar voor deze items." 
                        : "Special offers are only available for pickup at the restaurant. Delivery is not available for these items."}
                    </p>
                  </div>
                )}

                {/* Contact Mobile */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Phone className="text-primary" size={24} />
                    <h2 className="font-display text-xl text-foreground">
                      {language === "nl" ? "Contactnummer" : "Contact Number"}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "nl" 
                      ? "Wij gebruiken dit nummer om contact op te nemen over uw bezorging" 
                      : "We'll use this number to contact you about your delivery"}
                  </p>
                  <input
                    type="tel"
                    value={contactMobile}
                    onChange={(e) => setContactMobile(e.target.value)}
                    placeholder={language === "nl" ? "bijv. 0612345678 of +31612345678" : "e.g. 0612345678 or +31612345678"}
                    className="w-full p-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Email */}
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Mail className="text-primary" size={24} />
                    <h2 className="font-display text-xl text-foreground">
                      {language === "nl" ? "E-mailadres" : "Email Address"}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {language === "nl" 
                      ? "We sturen uw orderbevestiging naar dit e-mailadres" 
                      : "We'll send your order confirmation to this email"}
                  </p>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === "nl" ? "bijv. voorbeeld@email.nl" : "e.g. example@email.com"}
                    className="w-full p-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                  />
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
                  disabled={isSubmitting || !isAuthenticated || !isFormValid()}
                  className="w-full py-4 bg-primary text-primary-foreground font-serif text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {language === "nl" ? "Doorsturen naar betaling..." : "Redirecting to payment..."}
                    </>
                  ) : (
                    <>
                      <CreditCard size={20} />
                      {language === "nl" ? "Doorgaan naar Betaling" : "Proceed to Payment"}
                    </>
                  )}
                </button>

                <p className="text-center text-sm text-muted-foreground font-serif">
                  {language === "nl"
                    ? "Je wordt doorgestuurd naar onze beveiligde betaalpagina"
                    : "You will be redirected to our secure payment page"}
                </p>
              </form>

              {/* Order Summary */}
              <div className="bg-card border border-border rounded-lg p-6 h-fit">
                <h2 className="font-display text-xl text-foreground mb-6">
                  {language === "nl" ? "Besteloverzicht" : "Order Summary"}
                </h2>

                <div className="space-y-4 mb-6">
                  {/* Menu Items */}
                  {items.map((item) => (
                    <div key={item.menuItemId} className="flex justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-serif text-foreground">
                          {language === "nl" && item.nameNl ? item.nameNl : item.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × €{formatPrice(item.price)}
                        </p>
                      </div>
                      <span className="font-serif text-foreground">
                        €{formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                  
                  {/* Catering Packs */}
                  {cateringItems.map((item) => (
                    <div key={item.packId} className="flex justify-between gap-4 pt-2 border-t border-border/50">
                      <div className="flex-1">
                        <p className="font-serif text-foreground">
                          {item.pack.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × {item.peopleCount} {language === "nl" ? "personen" : "people"} × €{formatPrice(item.pack.pricePerPerson)}
                        </p>
                      </div>
                      <span className="font-serif text-foreground">
                        €{formatPrice(item.pack.pricePerPerson * item.peopleCount * item.quantity)}
                      </span>
                    </div>
                  ))}
                  
                  {/* Offer Items */}
                  {offerItems.map((item) => (
                    <div key={item.offerId} className="flex justify-between gap-4 pt-2 border-t border-border/50">
                      <div className="flex-1">
                        <p className="font-serif text-foreground">
                          {item.offer.name}
                          <span className="ml-2 text-xs px-2 py-0.5 bg-primary/10 text-primary rounded">
                            {language === "nl" ? "Aanbieding" : "Offer"}
                          </span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × €{formatPrice(item.offer.price)}
                        </p>
                      </div>
                      <span className="font-serif text-foreground">
                        €{formatPrice(item.offer.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-lg text-foreground">
                      {language === "nl" ? "Totaal" : "Total"} ({totalItemCount} items)
                    </span>
                    <span className="font-display text-2xl text-secondary">
                      €{formatPrice(grandTotal)}
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
