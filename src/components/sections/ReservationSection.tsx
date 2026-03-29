import { useState, useEffect } from "react";
import { Calendar, Users, Check, AlertCircle, Loader2, User, Mail, Phone, Clock } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { api, SimpleReservationData, OpenDate } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Time slots from 16:00 to 21:45 in 15-minute intervals
const TIME_SLOTS = [
  '16:00', '16:15', '16:30', '16:45',
  '17:00', '17:15', '17:30', '17:45',
  '18:00', '18:15', '18:30', '18:45',
  '19:00', '19:15', '19:30', '19:45',
  '20:00', '20:15', '20:30', '20:45',
  '21:00', '21:15', '21:30', '21:45',
];

const ReservationSection = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    numberOfGuests: "2",
    reservationDate: "",
    reservationTime: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Open dates state
  const [openDates, setOpenDates] = useState<OpenDate[]>([]);
  const [isLoadingDates, setIsLoadingDates] = useState(true);

  // Fetch open dates on mount
  useEffect(() => {
    const fetchOpenDates = async () => {
      setIsLoadingDates(true);
      try {
        const response = await api.getSimpleReservationOpenDates();
        setOpenDates(response.data);
      } catch (err) {
        console.error("Failed to fetch open dates:", err);
        toast({
          variant: "destructive",
          title: language === "nl" ? "Kon datums niet laden" : "Could not load dates",
          description: language === "nl" 
            ? "Probeer het opnieuw." 
            : "Please try again.",
        });
      } finally {
        setIsLoadingDates(false);
      }
    };
    fetchOpenDates();
  }, [language, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const reservationData: SimpleReservationData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        contactNumber: formData.contactNumber.trim(),
        numberOfGuests: parseInt(formData.numberOfGuests, 10),
        reservationDate: formData.reservationDate,
        reservationTime: formData.reservationTime,
      };

      await api.createSimpleReservation(reservationData);

      setIsSuccess(true);
      toast({
        title: language === "nl" ? "Reserveringsverzoek verzonden!" : "Reservation request sent!",
        description: language === "nl" 
          ? "We nemen zo snel mogelijk contact met u op om uw reservering te bevestigen." 
          : "We will contact you soon to confirm your reservation.",
        duration: 10000,
      });

      // Reset after 10 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: "",
          email: "",
          contactNumber: "",
          numberOfGuests: "2",
          reservationDate: "",
          reservationTime: "",
        });
      }, 10000);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Format date for display
  const formatDateOption = (dateStr: string, dayName: string) => {
    const date = new Date(dateStr);
    const dayNameNl: Record<string, string> = {
      sunday: 'Zondag',
      monday: 'Maandag',
      tuesday: 'Dinsdag',
      wednesday: 'Woensdag',
      thursday: 'Donderdag',
      friday: 'Vrijdag',
      saturday: 'Zaterdag'
    };
    const displayDay = language === "nl" ? dayNameNl[dayName] || dayName : dayName.charAt(0).toUpperCase() + dayName.slice(1);
    const dateFormatted = date.toLocaleDateString(language === "nl" ? "nl-NL" : "en-US", { 
      month: 'short', 
      day: 'numeric' 
    });
    return `${displayDay}, ${dateFormatted}`;
  };

  // Guest options (1-10)
  const guestOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <section id="reservation" className="py-24 bg-brown text-cream">
      <div className="container mx-auto px-6">
        <SectionHeading
          title={t("reservation.title")}
          subtitle={t("reservation.subtitle")}
        />

        <div className="max-w-lg mx-auto">
          {isSuccess ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                <Check size={32} className="text-green-400" />
              </div>
              <h3 className="font-display text-2xl mb-4">
                {language === "nl" ? "Verzoek verzonden!" : "Request Sent!"}
              </h3>
              <p className="font-serif text-cream/80 mb-4">
                {language === "nl" 
                  ? "We hebben uw reserveringsverzoek ontvangen. We nemen zo snel mogelijk contact met u op om uw reservering te bevestigen." 
                  : "We have received your reservation request. We will contact you soon to confirm your reservation."}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/40 text-red-200 rounded">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <p className="font-serif text-sm">{error}</p>
                </div>
              )}

              {/* Date Selection */}
              <div>
                <label htmlFor="reservationDate" className="block font-serif mb-2 text-cream/80">
                  <Calendar size={16} className="inline mr-2" />
                  {t("reservation.date")} *
                </label>
                {isLoadingDates ? (
                  <div className="flex items-center justify-center py-3 bg-cream/10 border border-cream/20">
                    <Loader2 className="animate-spin mr-2" size={16} />
                    <span className="font-serif text-cream/60">
                      {language === "nl" ? "Datums laden..." : "Loading dates..."}
                    </span>
                  </div>
                ) : openDates.filter(d => d.isOpen).length === 0 ? (
                  <div className="py-3 px-4 bg-cream/10 border border-cream/20 text-cream/60 font-serif text-center">
                    {language === "nl" 
                      ? "Geen beschikbare datums. Bel ons om te reserveren." 
                      : "No available dates. Please call us to make a reservation."}
                  </div>
                ) : (
                  <select
                    id="reservationDate"
                    name="reservationDate"
                    value={formData.reservationDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-cream/20 text-cream focus:border-secondary focus:outline-none transition-colors font-serif"
                    style={{ backgroundColor: "hsl(25, 30%, 20%)" }}
                  >
                    <option value="" style={{ backgroundColor: "hsl(25, 30%, 20%)", color: "hsl(40, 33%, 96%)" }}>
                      {language === "nl" ? "Selecteer een datum" : "Select a date"}
                    </option>
                    {openDates.map((dateObj) => (
                      <option 
                        key={dateObj.date} 
                        value={dateObj.isOpen ? dateObj.date : ""}
                        disabled={!dateObj.isOpen}
                        style={{ backgroundColor: "hsl(25, 30%, 20%)", color: dateObj.isOpen ? "hsl(40, 33%, 96%)" : "hsl(25, 25%, 50%)" }}
                      >
                        {formatDateOption(dateObj.date, dateObj.dayName)}{!dateObj.isOpen ? (language === "nl" ? " - Gesloten" : " - Closed") : ""}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Time Selection */}
              <div>
                <label htmlFor="reservationTime" className="block font-serif mb-2 text-cream/80">
                  <Clock size={16} className="inline mr-2" />
                  {language === "nl" ? "Tijd" : "Time"} *
                </label>
                <select
                  id="reservationTime"
                  name="reservationTime"
                  value={formData.reservationTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cream/20 text-cream focus:border-secondary focus:outline-none transition-colors font-serif"
                  style={{ backgroundColor: "hsl(25, 30%, 20%)" }}
                >
                  <option value="" style={{ backgroundColor: "hsl(25, 30%, 20%)", color: "hsl(40, 33%, 96%)" }}>
                    {language === "nl" ? "Selecteer een tijd" : "Select a time"}
                  </option>
                  {TIME_SLOTS.map((time) => (
                    <option 
                      key={time} 
                      value={time}
                      style={{ backgroundColor: "hsl(25, 30%, 20%)", color: "hsl(40, 33%, 96%)" }}
                    >
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="name" className="block font-serif mb-2 text-cream/80">
                  <User size={16} className="inline mr-2" />
                  {t("reservation.name")} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none transition-colors font-serif"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block font-serif mb-2 text-cream/80">
                  <Mail size={16} className="inline mr-2" />
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

              {/* Contact Number */}
              <div>
                <label htmlFor="contactNumber" className="block font-serif mb-2 text-cream/80">
                  <Phone size={16} className="inline mr-2" />
                  {t("reservation.phone")} *
                </label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  required
                  minLength={8}
                  maxLength={20}
                  className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream placeholder:text-cream/40 focus:border-secondary focus:outline-none transition-colors font-serif"
                  placeholder="0612345678"
                />
              </div>

              {/* Number of Guests */}
              <div>
                <label htmlFor="numberOfGuests" className="block font-serif mb-2 text-cream/80">
                  <Users size={16} className="inline mr-2" />
                  {t("reservation.guests")} *
                </label>
                <select
                  id="numberOfGuests"
                  name="numberOfGuests"
                  value={formData.numberOfGuests}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-cream/20 text-cream focus:border-secondary focus:outline-none transition-colors font-serif"
                  style={{ backgroundColor: "hsl(25, 30%, 20%)" }}
                >
                  {guestOptions.map((num) => (
                    <option key={num} value={num} style={{ backgroundColor: "hsl(25, 30%, 20%)", color: "hsl(40, 33%, 96%)" }}>
                      {num} {num === 1 ? (language === "nl" ? "Gast" : "Guest") : (language === "nl" ? "Gasten" : "Guests")}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.reservationDate || !formData.reservationTime || !formData.name || !formData.email || !formData.contactNumber}
                className="w-full bg-secondary text-secondary-foreground py-4 font-serif text-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    {language === "nl" ? "Versturen..." : "Sending..."}
                  </>
                ) : (
                  t("reservation.submit")
                )}
              </button>

              <p className="text-center text-cream/80 text-lg font-serif mt-4">
                {language === "nl" 
                  ? "Voor grotere groepen of speciale wensen, bel ons op " 
                  : "For larger parties or special requests, please call us at "}
                <a href="tel:+31103072299" className="text-secondary font-bold hover:underline">
                  010 307 22 99
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
