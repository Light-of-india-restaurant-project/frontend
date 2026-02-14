import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const PaymentCancelled = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="max-w-lg mx-auto text-center py-16">
            <XCircle size={80} className="mx-auto text-amber-500 mb-6" />
            <h1 className="font-display text-3xl text-foreground mb-4">
              {language === "nl" ? "Betaling Geannuleerd" : "Payment Cancelled"}
            </h1>
            <p className="font-serif text-muted-foreground mb-8">
              {language === "nl"
                ? "Je betaling is geannuleerd. Je winkelwagen is nog intact, dus je kunt het opnieuw proberen wanneer je wilt."
                : "Your payment was cancelled. Your cart is still intact, so you can try again whenever you're ready."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/checkout")}
                className="px-6 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
              >
                {language === "nl" ? "Terug naar Checkout" : "Back to Checkout"}
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

export default PaymentCancelled;
