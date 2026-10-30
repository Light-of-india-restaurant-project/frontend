import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, RefreshCw, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/lib/i18n";
import { api } from "@/lib/api";

interface ReservationSummary {
  reservationId: string;
  confirmationCode: string;
}

const EventPaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [reservation, setReservation] = useState<ReservationSummary | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const paymentId = searchParams.get("paymentId");

  useEffect(() => {
    const checkStatus = async () => {
      if (!paymentId) {
        setError(language === "nl" ? "Geen betalings-ID gevonden." : "No payment ID found.");
        setLoading(false);
        return;
      }

      try {
        const response = await api.getEventPaymentStatus(paymentId);
        setStatus(response.status);
        setIsPaid(response.isPaid);
        setReservation(response.reservation || null);

        if (!response.isPaid && response.status === "pending" && retryCount < 10) {
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
          }, 2000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to verify payment");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [paymentId, retryCount, language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <Loader2 size={56} className="mx-auto text-primary animate-spin mb-5" />
              <h1 className="font-display text-3xl text-foreground mb-2">
                {language === "nl" ? "Betaling controleren" : "Verifying payment"}
              </h1>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <XCircle size={64} className="mx-auto text-destructive mb-4" />
              <h1 className="font-display text-3xl text-foreground mb-3">
                {language === "nl" ? "Er ging iets mis" : "Something went wrong"}
              </h1>
              <p className="font-serif text-muted-foreground mb-8">{error}</p>
              <button
                onClick={() => navigate("/upcoming-events")}
                className="px-6 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
              >
                {language === "nl" ? "Terug naar event" : "Back to event"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isPaid && status === "pending") {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <RefreshCw size={56} className="mx-auto text-amber-500 animate-spin mb-5" />
              <h1 className="font-display text-3xl text-foreground mb-3">
                {language === "nl" ? "Betaling wordt verwerkt" : "Payment processing"}
              </h1>
              <button
                onClick={() => setRetryCount((prev) => prev + 1)}
                className="px-6 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors mt-4"
              >
                {language === "nl" ? "Opnieuw controleren" : "Check again"}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isPaid) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <XCircle size={64} className="mx-auto text-destructive mb-4" />
              <h1 className="font-display text-3xl text-foreground mb-3">
                {language === "nl" ? "Betaling niet voltooid" : "Payment not completed"}
              </h1>
              <button
                onClick={() => navigate("/upcoming-events")}
                className="px-6 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors mt-4"
              >
                {language === "nl" ? "Probeer opnieuw" : "Try again"}
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
          <div className="max-w-lg mx-auto text-center py-16">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220 }}>
              <CheckCircle size={70} className="mx-auto text-green-500 mb-5" />
            </motion.div>
            <h1 className="font-display text-4xl text-foreground mb-3">
              {language === "nl" ? "Reservering bevestigd" : "Reservation confirmed"}
            </h1>
            <p className="font-serif text-muted-foreground mb-2">
              {language === "nl" ? "Unieke bevestigingscode" : "Unique confirmation code"}
            </p>
            <p className="font-display text-3xl text-primary mb-8">{reservation?.confirmationCode || "-"}</p>
            <p className="font-serif text-muted-foreground mb-8">
              {language === "nl"
                ? "Neem deze e-mail met code mee naar het restaurant op de eventdag."
                : "Please bring this confirmation email with the code on the event day."}
            </p>
            <button
              onClick={() => navigate("/upcoming-events")}
              className="px-6 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
            >
              {language === "nl" ? "Terug naar Upcoming Events" : "Back to Upcoming Events"}
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventPaymentSuccess;
