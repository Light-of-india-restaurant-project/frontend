import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Clock, FileText, AlertCircle, Loader2, CreditCard, MapPin, Phone, CheckCircle, Mail, Truck, Store, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/contexts/CartContext";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { paymentApi, orderApi, discountApi, Discount } from "@/lib/user-api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { formatPrice } from "@/lib/formatPrice";

type OrderType = "pickup" | "delivery";
type AddressSource = "saved" | "new";

const Checkout = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { items, total, itemCount, cateringItems, cateringTotal, cateringItemCount, offerItems, offerTotal, offerItemCount, totalItemCount, grandTotal } = useCart();
  const { isAuthenticated, isLoading: authLoading, user } = useUserAuth();
  
  const [pickupTime, setPickupTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if cart only has specials/offers (no delivery needed - dine-in only)
  const isOffersOnly = offerItems.length > 0 && items.length === 0 && cateringItems.length === 0;

  // Order type selection (pickup or delivery)
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [addressSource, setAddressSource] = useState<AddressSource>("saved");

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

  // Check if user has saved address (at least postal code or street info)
  const hasSavedAddress = !!(user?.postalCode || user?.streetName);
  const hasCompleteAddress = !!(user?.postalCode && user?.streetName && user?.houseNumber && user?.city);
  
  // Track if saved address is deliverable
  const [savedAddressDeliverable, setSavedAddressDeliverable] = useState<boolean | null>(null);
  
  // Discount state
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);

  // Fetch active discounts
  useEffect(() => {
    const fetchDiscounts = async () => {
      try {
        const result = await discountApi.getActiveDiscounts();
        if (result.success) {
          setDiscounts(result.discounts);
        }
      } catch (err) {
        console.error('Failed to fetch discounts:', err);
      }
    };
    fetchDiscounts();
  }, []);

  // Update active discount based on order type
  useEffect(() => {
    const discountType = (isOffersOnly || orderType === "pickup") ? "pickup" : "delivery";
    const discount = discounts.find(d => d.type === discountType && d.isActive);
    setActiveDiscount(discount || null);
  }, [orderType, discounts, isOffersOnly]);

  // Calculate discounted total
  const discountAmount = activeDiscount ? (grandTotal * activeDiscount.percentage) / 100 : 0;
  const finalTotal = grandTotal - discountAmount;

  // Get discounts for showing badges on buttons
  const deliveryDiscount = discounts.find(d => d.type === "delivery" && d.isActive && d.percentage > 0);
  const pickupDiscount = discounts.find(d => d.type === "pickup" && d.isActive && d.percentage > 0);

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

  // Check saved address deliverability on mount
  useEffect(() => {
    const checkSavedAddressDeliverable = async () => {
      if (hasSavedAddress && user?.postalCode) {
        try {
          const result = await orderApi.checkDeliveryArea(user.postalCode);
          setSavedAddressDeliverable(result.deliverable);
          // Don't force new address - let user see their saved address and the warning
        } catch {
          setSavedAddressDeliverable(false);
        }
      }
    };
    checkSavedAddressDeliverable();
  }, [hasSavedAddress, user?.postalCode]);

  // Load saved address when addressSource changes to "saved" or when user data loads
  useEffect(() => {
    if (addressSource === "saved" && hasSavedAddress && user) {
      setPostalCode(user.postalCode || "");
      setStreetName(user.streetName || "");
      setHouseNumber(user.houseNumber || "");
      setCity(user.city || "");
      // Trigger postal code validation for saved address
      if (user.postalCode) {
        checkPostalCode(user.postalCode);
      }
    } else if (addressSource === "new") {
      // Clear form for new address entry
      setPostalCode("");
      setStreetName("");
      setHouseNumber("");
      setCity("Rotterdam");
      setPostalCodeValid(null);
      setPostalCodeMessage(null);
    }
  }, [addressSource, user, hasSavedAddress, checkPostalCode, savedAddressDeliverable]);

  // Pre-fill contact info from user profile
  useEffect(() => {
    if (user) {
      if (!contactMobile && user.mobile) {
        setContactMobile(user.mobile);
      }
      if (!email && user.email) {
        setEmail(user.email);
      }
    }
  }, [user]);

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
    
    // Basic contact info required for all orders
    const hasValidContact = (
      contactMobile.trim() !== "" &&
      email.trim() !== "" &&
      emailRegex.test(email)
    );

    if (!hasValidContact) return false;
    
    // For offers only (dine-in specials), only need contact info
    if (isOffersOnly) {
      return true;
    }
    
    // For pickup orders, no address needed
    if (orderType === "pickup") {
      return true;
    }
    
    // For delivery orders, need full address and valid postal code
    return (
      postalCodeValid === true &&
      streetName.trim() !== "" &&
      houseNumber.trim() !== "" &&
      city.trim() !== ""
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
      if (isOffersOnly) {
        setError(language === "nl" 
          ? "Vul uw contactgegevens in" 
          : "Please fill in your contact details");
      } else if (orderType === "delivery" && postalCodeValid === false) {
        setError(language === "nl"
          ? "Sorry, we bezorgen niet in dit gebied. Kies alstublieft voor afhalen."
          : "Sorry, we don't deliver to this area. Please choose pickup instead.");
      } else if (orderType === "delivery") {
        setError(language === "nl" 
          ? "Vul alle bezorggegevens in en zorg ervoor dat uw postcode binnen ons bezorggebied valt" 
          : "Please fill in all delivery details and ensure your postal code is within our delivery area");
      } else {
        setError(language === "nl"
          ? "Vul uw contactgegevens in"
          : "Please fill in your contact details");
      }
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
        // Only include delivery address for delivery orders (not pickup or offers-only)
        deliveryAddress: (isOffersOnly || orderType === "pickup") ? undefined : {
          postalCode: postalCode.trim(),
          streetName: streetName.trim(),
          houseNumber: houseNumber.trim(),
          city: city.trim(),
        },
        isPickup: isOffersOnly || orderType === "pickup", // Flag for pickup/dine-in orders
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

            {/* Login Required Notice - Show full page block if not authenticated */}
            {!authLoading && !isAuthenticated && (
              <div className="max-w-xl mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-lg p-8 mb-8 text-center"
                >
                  <AlertCircle className="text-amber-600 mx-auto mb-4" size={48} />
                  <h3 className="font-display text-2xl text-amber-800 mb-4">
                    {language === "nl" ? "Login Vereist" : "Login Required"}
                  </h3>
                  <p className="font-serif text-amber-700 mb-6">
                    {language === "nl"
                      ? "Je moet ingelogd zijn om een bestelling te plaatsen. Log in of maak een account aan om door te gaan."
                      : "You need to be logged in to place an order. Login or create an account to continue."}
                  </p>
                  <button
                    onClick={() => navigate("/login?redirect=/checkout")}
                    className="px-8 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors rounded"
                  >
                    {language === "nl" ? "Inloggen / Registreren" : "Login / Register"}
                  </button>
                </motion.div>

                {/* Order Summary for non-authenticated users */}
                <div className="bg-card border border-border rounded-lg p-6">
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

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-serif text-foreground">
                        {language === "nl" ? "Subtotaal" : "Subtotal"} ({totalItemCount} items)
                      </span>
                      <span className="font-serif text-foreground">
                        €{formatPrice(grandTotal)}
                      </span>
                    </div>
                    
                    {activeDiscount && activeDiscount.percentage > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span className="font-serif flex items-center gap-2">
                          <Tag size={16} />
                          {activeDiscount.type === "pickup" 
                            ? (language === "nl" ? "Afhaalkorting" : "Pickup Discount")
                            : (language === "nl" ? "Bezorgkorting" : "Delivery Discount")
                          } ({activeDiscount.percentage}%)
                        </span>
                        <span className="font-serif">
                          -€{formatPrice(discountAmount)}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-2 border-t border-border/50">
                      <span className="font-serif text-lg text-foreground">
                        {language === "nl" ? "Totaal" : "Total"}
                      </span>
                      <span className="font-display text-2xl text-secondary">
                        €{formatPrice(finalTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main checkout form - Only show when authenticated */}
            {isAuthenticated && (
            <div className="grid md:grid-cols-[1fr,400px] gap-8">
              {/* Order Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Order Type Selection - Pickup or Delivery (hidden for offers-only) */}
                {!isOffersOnly && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Truck className="text-primary" size={24} />
                      <h2 className="font-display text-xl text-foreground">
                        {language === "nl" ? "Bestelmethode" : "Order Type"}
                      </h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setOrderType("delivery")}
                        className={`p-4 rounded-lg border transition-all flex flex-col items-center gap-2 relative ${
                          orderType === "delivery"
                            ? "border-primary/50 bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        {deliveryDiscount && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            -{deliveryDiscount.percentage}%
                          </span>
                        )}
                        <Truck size={32} className={orderType === "delivery" ? "text-primary" : "text-muted-foreground"} />
                        <span className={`font-serif ${orderType === "delivery" ? "text-primary" : "text-foreground"}`}>
                          {language === "nl" ? "Bezorgen" : "Delivery"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setOrderType("pickup")}
                        className={`p-4 rounded-lg border transition-all flex flex-col items-center gap-2 relative ${
                          orderType === "pickup"
                            ? "border-primary/50 bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        }`}
                      >
                        {pickupDiscount && (
                          <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            -{pickupDiscount.percentage}%
                          </span>
                        )}
                        <Store size={32} className={orderType === "pickup" ? "text-primary" : "text-muted-foreground"} />
                        <span className={`font-serif ${orderType === "pickup" ? "text-primary" : "text-foreground"}`}>
                          {language === "nl" ? "Afhalen" : "Pickup"}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Pickup Time - Only show for pickup orders */}
                {(isOffersOnly || orderType === "pickup") && (
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
                )}

                {/* Delivery Address - Only show for delivery orders (not pickup or offers-only) */}
                {!isOffersOnly && orderType === "delivery" && (
                  <div className="bg-card border border-border rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="text-primary" size={24} />
                      <h2 className="font-display text-xl text-foreground">
                        {language === "nl" ? "Bezorgadres" : "Delivery Address"}
                      </h2>
                    </div>

                    {/* Address Source Selector - Show if user has saved address */}
                    {hasSavedAddress && (
                      <div className="mb-4">
                        <p className="font-serif font-medium text-foreground mb-3">
                          {language === "nl" ? "Kies bezorgadres:" : "Choose delivery address:"}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition-all ${addressSource === "saved" ? "bg-primary/10" : "bg-muted/30 hover:bg-muted/50"}`}>
                            <input
                              type="radio"
                              name="addressSource"
                              value="saved"
                              checked={addressSource === "saved"}
                              onChange={() => setAddressSource("saved")}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className={`font-serif ${addressSource === "saved" ? "text-primary" : "text-foreground"}`}>
                              {language === "nl" ? "Opgeslagen adres" : "Saved address"}
                            </span>
                          </label>
                          <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition-all ${addressSource === "new" ? "bg-primary/10" : "bg-muted/30 hover:bg-muted/50"}`}>
                            <input
                              type="radio"
                              name="addressSource"
                              value="new"
                              checked={addressSource === "new"}
                              onChange={() => setAddressSource("new")}
                              className="w-4 h-4 text-primary focus:ring-primary"
                            />
                            <span className={`font-serif ${addressSource === "new" ? "text-primary" : "text-foreground"}`}>
                              {language === "nl" ? "Nieuw adres" : "New address"}
                            </span>
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Notice when saved address is not deliverable */}
                    {hasSavedAddress && savedAddressDeliverable === false && addressSource === "saved" && (
                      <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                          <AlertCircle size={16} />
                          {language === "nl" 
                            ? "Dit adres valt buiten ons bezorggebied. Kies een nieuw adres of wijzig naar afhalen."
                            : "This address is outside our delivery area. Choose a new address or switch to pickup."}
                        </p>
                      </div>
                    )}

                    {/* Notice when saved address is incomplete */}
                    {hasSavedAddress && !hasCompleteAddress && addressSource === "saved" && (
                      <div className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                        <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                          <AlertCircle size={16} />
                          {language === "nl" 
                            ? "Uw opgeslagen adres is onvolledig. Kies 'Nieuw adres' om alle adresgegevens in te vullen."
                            : "Your saved address is incomplete. Choose 'New address' to fill in all address details."}
                        </p>
                      </div>
                    )}

                    {/* Saved Address Display */}
                    {hasSavedAddress && addressSource === "saved" && user && (
                      <div className="mb-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="font-serif text-foreground">
                          {user.streetName || "-"} {user.houseNumber || ""}
                        </p>
                        <p className="font-serif text-foreground">
                          {user.postalCode || "-"}, {user.city || "-"}
                        </p>
                        {postalCodeValid === true && hasCompleteAddress && (
                          <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                            <CheckCircle size={16} />
                            {postalCodeMessage}
                          </p>
                        )}
                        {postalCodeValid === false && (
                          <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                            <AlertCircle size={16} />
                            {postalCodeMessage}
                          </p>
                        )}
                      </div>
                    )}
                    
                    {/* Address Form - Show for new address or if no saved address */}
                    {(!hasSavedAddress || addressSource === "new") && (
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
                    )}
                  </div>
                )}

                {/* Pickup Notice - Show when pickup is selected */}
                {!isOffersOnly && orderType === "pickup" && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <Store className="text-green-600 dark:text-green-400" size={24} />
                      <h2 className="font-display text-xl text-green-800 dark:text-green-200">
                        {language === "nl" ? "Afhalen in Restaurant" : "Restaurant Pickup"}
                      </h2>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      {language === "nl" 
                        ? "Uw bestelling is klaar voor afhalen op het opgegeven tijdstip. Ons adres: Witte de Withstraat 96, 3012 BS Rotterdam" 
                        : "Your order will be ready for pickup at the specified time. Our address: Witte de Withstraat 96, 3012 BS Rotterdam"}
                    </p>
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

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-serif text-foreground">
                      {language === "nl" ? "Subtotaal" : "Subtotal"} ({totalItemCount} items)
                    </span>
                    <span className="font-serif text-foreground">
                      €{formatPrice(grandTotal)}
                    </span>
                  </div>
                  
                  {activeDiscount && activeDiscount.percentage > 0 && (
                    <div className="flex justify-between items-center text-green-600">
                      <span className="font-serif flex items-center gap-2">
                        <Tag size={16} />
                        {activeDiscount.type === "pickup" 
                          ? (language === "nl" ? "Afhaalkorting" : "Pickup Discount")
                          : (language === "nl" ? "Bezorgkorting" : "Delivery Discount")
                        } ({activeDiscount.percentage}%)
                      </span>
                      <span className="font-serif">
                        -€{formatPrice(discountAmount)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pt-2 border-t border-border/50">
                    <span className="font-serif text-lg text-foreground">
                      {language === "nl" ? "Totaal" : "Total"}
                    </span>
                    <span className="font-display text-2xl text-secondary">
                      €{formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;
