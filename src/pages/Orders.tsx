import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, ChefHat, Loader2, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { orderApi, Order } from "@/lib/user-api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const statusConfig: Record<Order["status"], { icon: React.ElementType; color: string; labelEn: string; labelNl: string }> = {
  pending: { icon: Clock, color: "text-amber-500", labelEn: "Pending", labelNl: "In behandeling" },
  confirmed: { icon: CheckCircle, color: "text-blue-500", labelEn: "Confirmed", labelNl: "Bevestigd" },
  preparing: { icon: ChefHat, color: "text-orange-500", labelEn: "Preparing", labelNl: "In voorbereiding" },
  ready: { icon: Package, color: "text-green-500", labelEn: "Ready for Pickup", labelNl: "Klaar voor afhaling" },
  completed: { icon: CheckCircle, color: "text-green-600", labelEn: "Completed", labelNl: "Voltooid" },
  cancelled: { icon: XCircle, color: "text-red-500", labelEn: "Cancelled", labelNl: "Geannuleerd" },
};

const Orders = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { isAuthenticated, isLoading: authLoading } = useUserAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await orderApi.getOrders({ limit: 20 });
      setOrders(response.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchOrders();
    }
  }, [authLoading, isAuthenticated]);

  // Redirect to login if not authenticated
  if (!authLoading && !isAuthenticated) {
    navigate("/login?redirect=/orders");
    return null;
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm(language === "nl" ? "Weet je zeker dat je deze bestelling wilt annuleren?" : "Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await orderApi.cancelOrder(orderId);
      fetchOrders(); // Refresh the list
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to cancel order");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === "nl" ? "nl-NL" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            <div className="flex items-center justify-between mb-8">
              <h1 className="font-display text-4xl text-foreground">
                {language === "nl" ? "Mijn Bestellingen" : "My Orders"}
              </h1>
              <button
                onClick={fetchOrders}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-foreground font-serif transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                {language === "nl" ? "Vernieuwen" : "Refresh"}
              </button>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-16">
                <Loader2 size={48} className="mx-auto text-primary animate-spin mb-4" />
                <p className="font-serif text-muted-foreground">
                  {language === "nl" ? "Bestellingen laden..." : "Loading orders..."}
                </p>
              </div>
            )}

            {/* Error */}
            {error && !isLoading && (
              <div className="text-center py-16">
                <XCircle size={48} className="mx-auto text-destructive mb-4" />
                <p className="font-serif text-destructive mb-4">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="px-6 py-2 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
                >
                  {language === "nl" ? "Opnieuw proberen" : "Try Again"}
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && orders.length === 0 && (
              <div className="text-center py-16">
                <Package size={64} className="mx-auto text-muted-foreground/50 mb-6" />
                <h2 className="font-display text-2xl text-foreground mb-4">
                  {language === "nl" ? "Nog geen bestellingen" : "No orders yet"}
                </h2>
                <p className="font-serif text-muted-foreground mb-8">
                  {language === "nl"
                    ? "Je hebt nog geen bestellingen geplaatst."
                    : "You haven't placed any orders yet."}
                </p>
                <button
                  onClick={() => navigate("/menu")}
                  className="px-8 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
                >
                  {language === "nl" ? "Bekijk Menu" : "Browse Menu"}
                </button>
              </div>
            )}

            {/* Orders List */}
            {!isLoading && !error && orders.length > 0 && (
              <div className="space-y-6">
                {orders.map((order, index) => {
                  const status = statusConfig[order.status];
                  const StatusIcon = status.icon;

                  return (
                    <motion.div
                      key={order._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-card border border-border rounded-lg overflow-hidden"
                    >
                      {/* Order Header */}
                      <div className="p-6 border-b border-border">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-display text-xl text-foreground">
                              {order.orderNumber}
                            </p>
                            <p className="font-serif text-sm text-muted-foreground mt-1">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusIcon size={20} className={status.color} />
                            <span className={`font-serif ${status.color}`}>
                              {language === "nl" ? status.labelNl : status.labelEn}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="p-6">
                        <div className="space-y-3 mb-6">
                          {order.items.map((item, itemIndex) => (
                            <div key={itemIndex} className="flex justify-between gap-4">
                              <div className="flex-1">
                                <p className="font-serif text-foreground">{item.name}</p>
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

                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <span className="font-serif text-lg text-foreground">
                            {language === "nl" ? "Totaal" : "Total"}
                          </span>
                          <span className="font-display text-2xl text-secondary">
                            €{order.total.toFixed(2)}
                          </span>
                        </div>

                        {/* Pickup Time */}
                        {order.pickupTime && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="font-serif text-sm text-muted-foreground">
                              <Clock size={14} className="inline mr-2" />
                              {language === "nl" ? "Afhaaltijd" : "Pickup Time"}:{" "}
                              {new Date(order.pickupTime).toLocaleTimeString(language === "nl" ? "nl-NL" : "en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        )}

                        {/* Notes */}
                        {order.notes && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <p className="font-serif text-sm text-muted-foreground">
                              <strong>{language === "nl" ? "Opmerkingen" : "Notes"}:</strong> {order.notes}
                            </p>
                          </div>
                        )}

                        {/* Cancel Button (only for pending orders) */}
                        {order.status === "pending" && (
                          <div className="mt-4 pt-4 border-t border-border">
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="px-4 py-2 text-destructive hover:bg-destructive/10 font-serif text-sm transition-colors rounded"
                            >
                              {language === "nl" ? "Bestelling Annuleren" : "Cancel Order"}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Orders;
