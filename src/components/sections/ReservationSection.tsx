import { useState } from "react";
import { Calendar, Clock, Users, Check, AlertCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { api, ReservationData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const ReservationSection = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "2",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare reservation data for API
      const reservationData: ReservationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        date: formData.date,
        time: formData.time,
        guests: parseInt(formData.guests, 10),
        specialRequests: formData.specialRequests.trim() || undefined,
      };

      // Call the actual backend API
      await api.createReservation(reservationData);

      setIsSuccess(true);
      toast({
        title: language === "nl" ? "Reservering bevestigd!" : "Reservation confirmed!",
        description: language === "nl" 
          ? "U ontvangt een bevestigingsmail." 
          : "You will receive a confirmation email.",
        duration: 5000,
      });

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          guests: "2",
          specialRequests: "",
        });
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: language === "nl" ? "Reservering mislukt" : "Reservation failed",
        description: language === "nl" 
          ? "Probeer het opnieuw of bel ons direct." 
          : "Please try again or call us directly.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="reservation" className="py-24 bg-brown text-cream">
      <div className="container mx-auto px-6">
        <SectionHeading
          title={t("reservation.title")}
          subtitle={t("reservation.subtitle")}
        />

        <div className="max-w-2xl mx-auto">
          {isSuccess ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-green-400" />
              </div>
              <h3 className="font-display text-2xl mb-4">{t("reservation.success")}</h3>
              <p className="font-serif text-cream/80">{t("reservation.confirm")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/40 text-red-200 rounded">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <p className="font-serif text-sm">{error}</p>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block font-serif mb-2 text-cream/80">
                    {t("reservation.name")} *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none transition-colors font-serif"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block font-serif mb-2 text-cream/80">
                    {t("reservation.email")} *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none transition-colors font-serif"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block font-serif mb-2 text-cream/80">
                  {t("reservation.phone")} *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none transition-colors font-serif"
                  placeholder="+31 6 1234 5678"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="date" className="block font-serif mb-2 text-cream/80">
                    <Calendar size={16} className="inline mr-2" />
                    {t("reservation.date")} *
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-secondary focus:outline-none transition-colors font-serif"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block font-serif mb-2 text-cream/80">
                    <Clock size={16} className="inline mr-2" />
                    {t("reservation.time")} *
                  </label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-secondary focus:outline-none transition-colors font-serif"
                  >
                    <option value="">Select time</option>
                    <option value="17:00">17:00</option>
                    <option value="17:30">17:30</option>
                    <option value="18:00">18:00</option>
                    <option value="18:30">18:30</option>
                    <option value="19:00">19:00</option>
                    <option value="19:30">19:30</option>
                    <option value="20:00">20:00</option>
                    <option value="20:30">20:30</option>
                    <option value="21:00">21:00</option>
                    <option value="21:30">21:30</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="guests" className="block font-serif mb-2 text-cream/80">
                    <Users size={16} className="inline mr-2" />
                    {t("reservation.guests")} *
                  </label>
                  <select
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-secondary focus:outline-none transition-colors font-serif"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </option>
                    ))}
                    <option value="9+">9+ (Call us)</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="specialRequests" className="block font-serif mb-2 text-cream/80">
                  {t("reservation.requests")}
                </label>
                <textarea
                  id="specialRequests"
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none transition-colors font-serif resize-none"
                  placeholder="Dietary requirements, special occasions, seating preferences..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-secondary text-secondary-foreground py-4 font-serif text-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? t("reservation.submitting") : t("reservation.submit")}
              </button>

              <p className="text-center text-cream/60 text-sm font-serif">
                For parties larger than 8, please call us at{" "}
                <a href="tel:+31101234567" className="text-secondary hover:underline">
                  +31 10 123 4567
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ReservationSection;
