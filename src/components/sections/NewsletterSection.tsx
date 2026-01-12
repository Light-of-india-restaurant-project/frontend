import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const NewsletterSection = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSuccess(true);

    setTimeout(() => {
      setIsSuccess(false);
      setEmail("");
    }, 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles size={24} className="text-secondary" />
            <span className="uppercase tracking-widest text-sm font-serif text-secondary">
              Special Offers
            </span>
            <Sparkles size={24} className="text-secondary" />
          </div>

          <h2 className="font-display text-3xl md:text-4xl mb-4">
            {t("newsletter.title")}
          </h2>

          <p className="font-serif text-lg text-primary-foreground/80 mb-8">
            {t("newsletter.subtitle")}
          </p>

          {isSuccess ? (
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-green-500/20 px-6 py-3 rounded">
                <Mail size={20} className="text-green-300" />
                <span className="font-serif">{t("newsletter.success")}</span>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder={t("newsletter.placeholder")}
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:outline-none transition-colors font-serif"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-secondary text-secondary-foreground px-8 py-4 font-serif hover:bg-secondary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {isSubmitting ? t("newsletter.subscribing") : t("newsletter.subscribe")}
              </button>
            </form>
          )}

          <p className="mt-6 text-sm text-primary-foreground/60 font-serif">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
