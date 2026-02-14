import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Loader2, XCircle, RefreshCw } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";
import { useCart } from "@/contexts/CartContext";
import { paymentApi } from "@/lib/user-api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface PaymentStatus {
  status: string;
  isPaid: boolean;
  order?: {
    orderNumber: string;
    orderId: string;
  };
}

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  const { clearCart } = useCart();
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const hasCleared = useRef(false);

  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!paymentId) {
        setError("No payment ID found");
        setLoading(false);
        return;
      }

      try {
        console.log('Checking payment status for:', paymentId);
        const status = await paymentApi.getPaymentStatus(paymentId);
        console.log('Payment status:', status);
        setPaymentStatus(status);

        // If payment is successful, clear the cart (only once)
        if (status.isPaid && status.order && !hasCleared.current) {
          hasCleared.current = true;
          clearCart();
          sessionStorage.removeItem('pendingPaymentId');
          console.log('Cart cleared, order confirmed:', status.order.orderNumber);
        } else if (status.status === 'pending' && retryCount < 10) {
          // Payment might still be processing, retry after a delay
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
        setError(err instanceof Error ? err.message : "Failed to check payment status");
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, retryCount]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <Loader2 size={64} className="mx-auto text-primary animate-spin mb-6" />
              <h1 className="font-display text-3xl text-foreground mb-4">
                {language === "nl" ? "Betaling verifiëren..." : "Verifying payment..."}
              </h1>
              <p className="font-serif text-muted-foreground">
                {language === "nl"
                  ? "Even geduld terwijl we je betaling controleren."
                  : "Please wait while we confirm your payment."}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <XCircle size={80} className="mx-auto text-destructive mb-6" />
              <h1 className="font-display text-3xl text-foreground mb-4">
                {language === "nl" ? "Er ging iets mis" : "Something went wrong"}
              </h1>
              <p className="font-serif text-muted-foreground mb-8">{error}</p>
              <button
                onClick={() => navigate("/checkout")}
                className="px-8 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
              >
                {language === "nl" ? "Probeer opnieuw" : "Try Again"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Payment still pending (processing)
  if (paymentStatus && !paymentStatus.isPaid && paymentStatus.status === 'pending') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <RefreshCw size={64} className="mx-auto text-amber-500 animate-spin mb-6" />
              <h1 className="font-display text-3xl text-foreground mb-4">
                {language === "nl" ? "Betaling wordt verwerkt" : "Payment Processing"}
              </h1>
              <p className="font-serif text-muted-foreground mb-8">
                {language === "nl"
                  ? "Je betaling wordt nog verwerkt. Dit kan een moment duren."
                  : "Your payment is still being processed. This may take a moment."}
              </p>
              <button
                onClick={() => setRetryCount(prev => prev + 1)}
                className="px-8 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
              >
                {language === "nl" ? "Controleer opnieuw" : "Check Again"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Payment failed or cancelled
  if (paymentStatus && !paymentStatus.isPaid) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <XCircle size={80} className="mx-auto text-destructive mb-6" />
              <h1 className="font-display text-3xl text-foreground mb-4">
                {language === "nl" ? "Betaling mislukt" : "Payment Failed"}
              </h1>
              <p className="font-serif text-muted-foreground mb-8">
                {language === "nl"
                  ? "Je betaling is niet gelukt. Probeer het opnieuw."
                  : "Your payment was not successful. Please try again."}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/checkout")}
                  className="px-6 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
                >
                  {language === "nl" ? "Opnieuw proberen" : "Try Again"}
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

  // Payment successful
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
              {language === "nl" ? "Betaling Geslaagd!" : "Payment Successful!"}
            </h1>
            <p className="font-serif text-xl text-muted-foreground mb-2">
              {language === "nl" ? "Bestelnummer" : "Order Number"}:
            </p>
            <p className="font-display text-2xl text-primary mb-8">
              {paymentStatus?.order?.orderNumber}
            </p>
            <p className="font-serif text-muted-foreground mb-8">
              {language === "nl"
                ? "Bedankt voor je bestelling! We sturen je een bevestiging wanneer je bestelling klaar is voor afhaling."
                : "Thank you for your order! We'll notify you when your order is ready for pickup."}
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
};

export default PaymentSuccess;
