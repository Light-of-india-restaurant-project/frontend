import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/i18n";
import { Cookie, X } from "lucide-react";

const COOKIE_CONSENT_KEY = "light-of-india-cookie-consent";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    setVisible(false);
  };

  if (!visible) return null;

  const isNl = language === "nl";

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center p-4 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-brown/10 p-6 animate-in slide-in-from-bottom-5 fade-in duration-500">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
            <Cookie className="w-5 h-5 text-secondary" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-display text-lg text-brown">
                {isNl ? "Cookies" : "Cookies"}
              </h3>
              <button
                onClick={handleReject}
                className="p-1 rounded-full hover:bg-brown/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4 text-brown/40" />
              </button>
            </div>
            <p className="font-serif text-sm text-brown/70 mb-4">
              {isNl
                ? "Wij gebruiken cookies om onze website goed te laten werken en uw ervaring te verbeteren. Door op \"Accepteren\" te klikken, stemt u in met het gebruik van cookies."
                : "We use cookies to ensure our website works properly and to improve your experience. By clicking \"Accept\", you consent to the use of cookies."}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={handleAccept}
                autoFocus
                className="px-5 py-2 bg-secondary text-brown font-serif text-sm font-medium rounded-lg hover:bg-secondary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2"
              >
                {isNl ? "Accepteren" : "Accept"}
              </button>
              <button
                onClick={handleReject}
                className="px-5 py-2 bg-brown/5 text-brown/70 font-serif text-sm font-medium rounded-lg hover:bg-brown/10 transition-colors"
              >
                {isNl ? "Weigeren" : "Reject"}
              </button>
              <a
                href="/privacy#cookies"
                className="px-3 py-2 text-secondary font-serif text-sm hover:underline transition-colors"
              >
                {isNl ? "Meer info" : "More details"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
