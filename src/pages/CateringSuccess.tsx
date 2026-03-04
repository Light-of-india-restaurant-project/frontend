import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, XCircle, RefreshCw, Calendar, Clock, MapPin, Users } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { cateringApi } from '@/lib/user-api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface PaymentStatus {
  status: string;
  isPaid: boolean;
  order?: {
    orderNumber: string;
    orderId: string;
  };
}

const CateringSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { language } = useLanguage();
  
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const hasProcessed = useRef(false);

  const paymentId = searchParams.get('paymentId');

  useEffect(() => {
    const checkPaymentStatus = async () => {
      if (!paymentId) {
        setError(language === 'nl' ? 'Geen betalings-ID gevonden' : 'No payment ID found');
        setLoading(false);
        return;
      }

      try {
        console.log('Checking catering payment status for:', paymentId);
        const status = await cateringApi.getPaymentStatus(paymentId);
        console.log('Catering payment status:', status);
        setPaymentStatus(status);

        // If payment is successful
        if (status.isPaid && status.order && !hasProcessed.current) {
          hasProcessed.current = true;
          sessionStorage.removeItem('pendingCateringPaymentId');
          console.log('Catering order confirmed:', status.order.orderNumber);
        } else if (status.status === 'pending' && retryCount < 10) {
          // Payment might still be processing, retry after a delay
          setTimeout(() => {
            setRetryCount(prev => prev + 1);
          }, 2000);
        }
      } catch (err) {
        console.error('Error checking catering payment status:', err);
        setError(err instanceof Error ? err.message : 'Failed to check payment status');
      } finally {
        setLoading(false);
      }
    };

    checkPaymentStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId, retryCount, language]);

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
                {language === 'nl' ? 'Betaling verifiëren...' : 'Verifying payment...'}
              </h1>
              <p className="font-serif text-muted-foreground">
                {language === 'nl'
                  ? 'Even geduld terwijl we je betaling controleren.'
                  : 'Please wait while we confirm your payment.'}
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
                {language === 'nl' ? 'Er ging iets mis' : 'Something went wrong'}
              </h1>
              <p className="font-serif text-muted-foreground mb-8">{error}</p>
              <button
                onClick={() => navigate('/catering')}
                className="px-8 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
              >
                {language === 'nl' ? 'Terug naar catering' : 'Back to catering'}
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
                {language === 'nl' ? 'Betaling wordt verwerkt' : 'Payment Processing'}
              </h1>
              <p className="font-serif text-muted-foreground mb-8">
                {language === 'nl'
                  ? 'Je betaling wordt nog verwerkt. Dit kan een moment duren.'
                  : 'Your payment is still being processed. This may take a moment.'}
              </p>
              <button
                onClick={() => setRetryCount(prev => prev + 1)}
                className="px-8 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
              >
                {language === 'nl' ? 'Controleer opnieuw' : 'Check Again'}
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Payment failed
  if (paymentStatus && !paymentStatus.isPaid) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <XCircle size={80} className="mx-auto text-destructive mb-6" />
              <h1 className="font-display text-3xl text-foreground mb-4">
                {language === 'nl' ? 'Betaling mislukt' : 'Payment Failed'}
              </h1>
              <p className="font-serif text-muted-foreground mb-8">
                {language === 'nl'
                  ? 'Je betaling is niet gelukt. Probeer het opnieuw.'
                  : 'Your payment was not successful. Please try again.'}
              </p>
              <button
                onClick={() => navigate('/catering')}
                className="px-8 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors"
              >
                {language === 'nl' ? 'Probeer opnieuw' : 'Try Again'}
              </button>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            >
              <CheckCircle size={100} className="mx-auto text-green-500 mb-6" />
            </motion.div>

            <h1 className="font-display text-3xl text-foreground mb-4">
              {language === 'nl' ? 'Bestelling bevestigd!' : 'Order Confirmed!'}
            </h1>

            {paymentStatus?.order && (
              <div className="bg-muted rounded-lg p-6 mb-6">
                <p className="font-serif text-muted-foreground mb-2">
                  {language === 'nl' ? 'Bestelnummer' : 'Order Number'}
                </p>
                <p className="font-mono text-2xl text-primary font-bold">
                  {paymentStatus.order.orderNumber}
                </p>
              </div>
            )}

            <p className="font-serif text-muted-foreground mb-8">
              {language === 'nl'
                ? 'Bedankt voor je bestelling! Je ontvangt een bevestigingsmail met alle details van je catering bestelling.'
                : 'Thank you for your order! You will receive a confirmation email with all the details of your catering order.'}
            </p>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/')}
                className="w-full px-8 py-3 bg-primary text-primary-foreground font-serif hover:bg-primary/90 transition-colors rounded-lg"
              >
                {language === 'nl' ? 'Terug naar home' : 'Back to Home'}
              </button>
              <button
                onClick={() => navigate('/catering')}
                className="w-full px-8 py-3 border border-primary text-primary font-serif hover:bg-primary/10 transition-colors rounded-lg"
              >
                {language === 'nl' ? 'Bekijk meer pakketten' : 'View More Packages'}
              </button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CateringSuccess;
