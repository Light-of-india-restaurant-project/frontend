import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Clock, CheckCircle, XCircle, ChefHat, Loader2, RefreshCw, Check } from "lucide-react";
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
  ready: { icon: Package, color: "text-green-500", labelEn: "Ready", labelNl: "Klaar" },
  completed: { icon: CheckCircle, color: "text-green-600", labelEn: "Completed", labelNl: "Voltooid" },
  cancelled: { icon: XCircle, color: "text-red-500", labelEn: "Cancelled", labelNl: "Geannuleerd" },
};

// Order of statuses for the stepper (excluding cancelled)
const statusOrder: Array<Exclude<Order["status"], "cancelled">> = ["pending", "confirmed", "preparing", "ready", "completed"];

interface OrderStatusStepperProps {
  currentStatus: Order["status"];
  language: "en" | "nl";
}

const OrderStatusStepper = ({ currentStatus, language }: OrderStatusStepperProps) => {
  // If cancelled, show a different view
  if (currentStatus === "cancelled") {
    const config = statusConfig.cancelled;
    const Icon = config.icon;
    return (
      <div className="flex items-center justify-center gap-2 py-4 px-6 bg-red-50 dark:bg-red-950/20 rounded-lg">
        <Icon size={24} className="text-red-500" />
        <span className="font-serif text-red-500 font-medium">
          {language === "nl" ? config.labelNl : config.labelEn}
        </span>
      </div>
    );
  }

  const currentIndex = statusOrder.indexOf(currentStatus as Exclude<Order["status"], "cancelled">);
  const totalSteps = statusOrder.length;
  const stepWidth = 100 / totalSteps; // Each step takes this percentage
  const lineStart = stepWidth / 2; // Start from center of first circle
  const lineEnd = stepWidth / 2; // End at center of last circle

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress Line Background */}
        <div 
          className="absolute top-5 h-0.5 bg-border"
          style={{ left: `${lineStart}%`, right: `${lineEnd}%` }}
        />
        
        {/* Progress Line Filled */}
        <div 
          className="absolute top-5 h-0.5 bg-primary transition-all duration-500"
          style={{ 
            left: `${lineStart}%`, 
            width: currentIndex === 0 ? "0%" : `${(currentIndex / (totalSteps - 1)) * (100 - lineStart - lineEnd)}%`
          }}
        />

        {statusOrder.map((status, index) => {
          const config = statusConfig[status];
          const Icon = config.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <div key={status} className="flex flex-col items-center z-10 flex-1">
              {/* Circle with Icon */}
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300
                  ${isCompleted ? "bg-primary text-primary-foreground" : ""}
                  ${isCurrent ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : ""}
                  ${isPending ? "bg-muted text-muted-foreground" : ""}
                `}
              >
                {isCompleted ? (
                  <Check size={20} />
                ) : (
                  <Icon size={18} />
                )}
              </div>

              {/* Status Label */}
              <span
                className={`
                  font-serif text-xs mt-2 text-center max-w-[80px] leading-tight
                  ${isCompleted || isCurrent ? "text-foreground font-medium" : "text-muted-foreground"}
                `}
              >
                {language === "nl" ? config.labelNl : config.labelEn}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
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
                {orders.map((order, index) => (
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
                          <div className="text-right">
                            <span className="font-display text-2xl text-secondary">
                              €{order.total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Status Stepper */}
                        <div className="mt-4">
                          <OrderStatusStepper currentStatus={order.status} language={language} />
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
                      </div>
                    </motion.div>
                ))}
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
