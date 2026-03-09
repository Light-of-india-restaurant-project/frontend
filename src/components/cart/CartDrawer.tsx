import { ShoppingCart, X, Plus, Minus, Trash2, Users, Package, Tag } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/formatPrice";

// Cart Button for Header
export const CartButton = () => {
  const { totalItemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 transition-colors"
        style={{ color: 'hsla(40, 33%, 96%, 0.85)' }}
        onMouseEnter={(e) => e.currentTarget.style.color = 'hsl(43, 74%, 49%)'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'hsla(40, 33%, 96%, 0.85)'}
        aria-label="Open cart"
      >
        <ShoppingCart size={24} />
        {totalItemCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1"
          >
            {totalItemCount > 99 ? "99+" : totalItemCount}
          </motion.span>
        )}
      </button>
      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

// Cart Drawer
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { 
    items, 
    total, 
    updateQuantity, 
    removeItem, 
    clearCart,
    cateringItems,
    cateringTotal,
    removeCateringPack,
    updateCateringPeopleCount,
    updateCateringQuantity,
    offerItems,
    offerTotal,
    updateOfferQuantity,
    removeOffer,
    totalItemCount,
    grandTotal,
    clearAllCarts
  } = useCart();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const isEmpty = items.length === 0 && cateringItems.length === 0 && offerItems.length === 0;

  // Use portal to render drawer outside header DOM hierarchy
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9999]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-screen w-full max-w-md bg-background border-l border-border z-[9999] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="font-display text-2xl text-foreground">
                {language === "nl" ? "Winkelwagen" : "Your Cart"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {isEmpty ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                  <p className="font-serif text-muted-foreground">
                    {language === "nl" ? "Je winkelwagen is leeg" : "Your cart is empty"}
                  </p>
                  <button
                    onClick={onClose}
                    className="mt-6 px-6 py-2 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
                  >
                    {language === "nl" ? "Bekijk Menu" : "Browse Menu"}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Menu Items Section */}
                  {items.length > 0 && (
                    <div>
                      <h3 className="font-serif text-sm text-muted-foreground uppercase tracking-wide mb-3">
                        {language === "nl" ? "Menu Items" : "Menu Items"}
                      </h3>
                      <div className="space-y-4">
                        {items.map((item) => (
                          <motion.div
                            key={item.menuItemId}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex gap-4 p-4 bg-muted rounded-lg"
                          >
                            {/* Item Image */}
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}

                            {/* Item Details */}
                            <div className="flex-1">
                              <h3 className="font-display text-lg text-foreground">
                                {language === "nl" && item.nameNl ? item.nameNl : item.name}
                              </h3>
                              <p className="font-serif text-secondary mt-1">
                                €{formatPrice(item.price)}
                              </p>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3 mt-3">
                                <button
                                  onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="font-serif text-foreground min-w-[2ch] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={18} />
                                </button>
                                <button
                                  onClick={() => removeItem(item.menuItemId)}
                                  className="ml-auto p-1 text-destructive hover:text-destructive/80 transition-colors"
                                  aria-label="Remove item"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Catering Packs Section */}
                  {cateringItems.length > 0 && (
                    <div>
                      <h3 className="font-serif text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Package size={16} />
                        {language === "nl" ? "Catering Pakketten" : "Catering Packs"}
                      </h3>
                      <div className="space-y-4">
                        {cateringItems.map((item) => (
                          <motion.div
                            key={item.packId}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="p-4 bg-muted rounded-lg border-l-4 border-primary"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-display text-lg text-foreground">
                                {item.pack.name}
                              </h3>
                              <button
                                onClick={() => removeCateringPack(item.packId)}
                                className="p-1 text-destructive hover:text-destructive/80 transition-colors"
                                aria-label="Remove pack"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                            
                            <p className="font-serif text-sm text-muted-foreground mb-3">
                              €{formatPrice(item.pack.pricePerPerson)} {language === "nl" ? "/persoon" : "/person"}
                            </p>

                            {/* People Count */}
                            <div className="flex items-center gap-2 mb-3">
                              <Users size={16} className="text-muted-foreground" />
                              <span className="font-serif text-sm text-muted-foreground">
                                {language === "nl" ? "Personen:" : "People:"}
                              </span>
                              <div className="flex items-center gap-2 ml-auto">
                                <button
                                  onClick={() => updateCateringPeopleCount(item.packId, item.peopleCount - 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                  disabled={item.peopleCount <= item.pack.minPeople}
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="font-serif text-foreground min-w-[3ch] text-center">
                                  {item.peopleCount}
                                </span>
                                <button
                                  onClick={() => updateCateringPeopleCount(item.packId, item.peopleCount + 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Quantity */}
                            <div className="flex items-center gap-2 mb-3">
                              <span className="font-serif text-sm text-muted-foreground">
                                {language === "nl" ? "Aantal pakketten:" : "Quantity:"}
                              </span>
                              <div className="flex items-center gap-2 ml-auto">
                                <button
                                  onClick={() => updateCateringQuantity(item.packId, item.quantity - 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="font-serif text-foreground min-w-[2ch] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateCateringQuantity(item.packId, item.quantity + 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Pack Subtotal */}
                            <div className="pt-2 border-t border-border">
                              <p className="font-serif text-secondary text-right">
                                €{formatPrice(item.pack.pricePerPerson * item.peopleCount * item.quantity)}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Offer Items Section */}
                  {offerItems.length > 0 && (
                    <div>
                      <h3 className="font-serif text-sm text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                        <Tag size={16} />
                        {language === "nl" ? "Aanbiedingen" : "Special Offers"}
                      </h3>
                      <div className="space-y-4">
                        {offerItems.map((item) => (
                          <motion.div
                            key={item.offerId}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            className="flex gap-4 p-4 bg-muted rounded-lg border-l-4 border-secondary"
                          >
                            {/* Item Image */}
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded"
                              />
                            )}

                            {/* Item Details */}
                            <div className="flex-1">
                              <h3 className="font-display text-lg text-foreground">
                                {item.name}
                              </h3>
                              <p className="font-serif text-secondary mt-1">
                                €{formatPrice(item.price)}
                              </p>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-3 mt-3">
                                <button
                                  onClick={() => updateOfferQuantity(item.offerId, item.quantity - 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus size={18} />
                                </button>
                                <span className="font-serif text-foreground min-w-[2ch] text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateOfferQuantity(item.offerId, item.quantity + 1)}
                                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                                  aria-label="Increase quantity"
                                >
                                  <Plus size={18} />
                                </button>
                                <button
                                  onClick={() => removeOffer(item.offerId)}
                                  className="ml-auto p-1 text-destructive hover:text-destructive/80 transition-colors"
                                  aria-label="Remove item"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!isEmpty && (
              <div className="border-t border-border p-6 space-y-4 flex-shrink-0">
                {/* Clear Cart */}
                <button
                  onClick={clearAllCarts}
                  className="w-full py-2 text-muted-foreground hover:text-destructive font-serif text-sm transition-colors"
                >
                  {language === "nl" ? "Winkelwagen leegmaken" : "Clear Cart"}
                </button>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-serif text-lg text-foreground">
                    {language === "nl" ? "Totaal" : "Total"} ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})
                  </span>
                  <span className="font-display text-2xl text-secondary">
                    €{formatPrice(grandTotal)}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-primary text-primary-foreground font-serif text-lg hover:bg-primary/90 transition-colors"
                >
                  {language === "nl" ? "Afrekenen" : "Checkout"}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default CartDrawer;
