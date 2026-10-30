import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { CalendarDays, Clock3, Loader2, MapPin, Sparkles, Users } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { api, type EventReservationPaymentData, type OpenDate } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

import heroImage from "@/assets/gallery/interior-dining.jpg";

type EventSettingsData = {
  titleEn: string;
  titleNl: string;
  subtitleEn: string;
  subtitleNl: string;
  descriptionEn: string;
  descriptionNl: string;
  timeEn: string;
  timeNl: string;
  locationEn: string;
  locationNl: string;
  host: string;
  contactPhonePrimary: string;
  contactPhoneSecondary: string;
  contactEmail: string;
  pricePerPerson: number;
  currency: string;
  isActive: boolean;
};

const formatDateOption = (language: "en" | "nl", dateStr: string, dayName: string) => {
  const date = new Date(dateStr);
  const dayNameNl: Record<string, string> = {
    sunday: "Zondag",
    monday: "Maandag",
    tuesday: "Dinsdag",
    wednesday: "Woensdag",
    thursday: "Donderdag",
    friday: "Vrijdag",
    saturday: "Zaterdag",
  };

  const displayDay =
    language === "nl"
      ? dayNameNl[dayName] || dayName
      : dayName.charAt(0).toUpperCase() + dayName.slice(1);

  const dateFormatted = date.toLocaleDateString(language === "nl" ? "nl-NL" : "en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return `${displayDay}, ${dateFormatted}`;
};

const toDateKey = (value: Date | string): string => {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const UpcomingEvents = () => {
  const { language } = useLanguage();
  const { toast } = useToast();

  const [eventSettings, setEventSettings] = useState<EventSettingsData | null>(null);
  const [openDates, setOpenDates] = useState<OpenDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<EventReservationPaymentData>({
    name: "",
    email: "",
    contactNumber: "",
    numberOfGuests: 2,
    reservationDate: "",
  });

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [settingsRes, datesRes] = await Promise.all([api.getEventSettings(), api.getEventOpenDates()]);
        setEventSettings(settingsRes.data);
        setOpenDates(datesRes.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const selectedDateClosureReason = useMemo(() => {
    const match = openDates.find((entry) => toDateKey(entry.date) === formData.reservationDate);
    return match?.closureReason || null;
  }, [formData.reservationDate, openDates]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfGuests" ? Number(value) : value,
    }));
  };

  const scrollToReserveSection = () => {
    const section = document.getElementById("event-reserve");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (selectedDateClosureReason) {
      setError(selectedDateClosureReason);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await api.initiateEventPayment({
        ...formData,
        name: formData.name.trim(),
        email: formData.email.trim(),
        contactNumber: formData.contactNumber.trim(),
      });

      sessionStorage.setItem("pendingEventPaymentId", response.paymentId);
      window.location.href = response.paymentUrl;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start payment";
      setError(message);
      toast({
        variant: "destructive",
        title: language === "nl" ? "Reservering mislukt" : "Reservation failed",
        description: message,
      });
      setIsSubmitting(false);
    }
  };

  if (isLoading || !eventSettings) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-28 pb-20">
          <div className="container mx-auto px-6 text-center">
            <Loader2 className="mx-auto animate-spin text-primary" size={42} />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <section className="relative h-[55vh] min-h-[460px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={language === "nl" ? "Aankomende evenementen" : "Upcoming events"}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/65 to-background" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Sparkles className="w-12 h-12 text-secondary mx-auto mb-6" />
            <h1 className="font-display text-4xl md:text-6xl text-primary-foreground mb-5">
              {language === "nl" ? "Aankomende Evenementen" : "Upcoming Events"}
            </h1>
            <p className="font-serif text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              {language === "nl"
                ? "Ontdek wat er binnenkort op onze agenda staat en reserveer op tijd."
                : "Discover what is coming next at our restaurant and reserve your seats early."}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <SectionHeading
            title={language === "nl" ? "Aankomend Event" : "Featured Event"}
            subtitle={language === "nl" ? "Eén speciale avond" : "One special evening"}
          />

          <motion.article
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-5xl mx-auto border border-border bg-card/70 backdrop-blur-sm shadow-sm overflow-hidden"
          >
            <div className="relative px-6 py-8 md:px-10 md:py-12 bg-gradient-to-b from-primary/95 via-primary/90 to-primary text-primary-foreground">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.35),transparent_45%),radial-gradient(circle_at_80%_30%,rgba(255,215,128,.25),transparent_40%)]" />

              <div className="relative z-10 text-center">
                <p className="font-serif tracking-[0.3em] uppercase text-primary-foreground/85 text-xs md:text-sm mb-4">
                  {language === "nl" ? "Presents Live" : "Presents Live"}
                </p>
                <h2 className="font-display text-3xl md:text-5xl leading-tight mb-3">
                  {language === "nl" ? eventSettings.titleNl : eventSettings.titleEn}
                </h2>
                <p className="font-serif text-lg md:text-2xl text-secondary mb-6">
                  {language === "nl" ? eventSettings.subtitleNl : eventSettings.subtitleEn}
                </p>
                <p className="font-serif text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
                  {language === "nl" ? eventSettings.descriptionNl : eventSettings.descriptionEn}
                </p>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="grid md:grid-cols-3 gap-5 mb-8">
                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    {language === "nl" ? "Datum" : "Date"}
                  </p>
                  <div className="flex items-center gap-2 text-foreground font-serif">
                    <CalendarDays className="w-4 h-4 text-secondary" />
                    <span>{language === "nl" ? "Elke zondag" : "Every Sunday"}</span>
                  </div>
                </div>

                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    {language === "nl" ? "Tijden" : "Timings"}
                  </p>
                  <div className="flex items-center gap-2 text-foreground font-serif">
                    <Clock3 className="w-4 h-4 text-secondary" />
                    <span>{language === "nl" ? eventSettings.timeNl : eventSettings.timeEn}</span>
                  </div>
                </div>

                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                    {language === "nl" ? "Locatie" : "Location"}
                  </p>
                  <div className="flex items-center gap-2 text-foreground font-serif">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>{language === "nl" ? eventSettings.locationNl : eventSettings.locationEn}</span>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-5 text-center">
                <div className="border border-secondary/40 bg-secondary/10 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {language === "nl" ? "Buffet" : "Buffet Open"}
                  </p>
                  <p className="font-display text-3xl text-foreground">
                    {eventSettings.currency} {eventSettings.pricePerPerson.toFixed(2)} p/p
                  </p>
                </div>
                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {language === "nl" ? "Gastheer" : "Host"}
                  </p>
                  <p className="font-serif text-lg text-foreground">{eventSettings.host}</p>
                  <p className="font-serif text-muted-foreground">{eventSettings.contactPhonePrimary}</p>
                </div>
                <div className="border border-border/80 bg-background/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">
                    {language === "nl" ? "Contact" : "Contact"}
                  </p>
                  <p className="font-serif text-lg text-foreground">{eventSettings.contactPhoneSecondary}</p>
                  <p className="font-serif text-muted-foreground break-all">{eventSettings.contactEmail}</p>
                </div>
              </div>

              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={scrollToReserveSection}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground font-serif text-lg hover:bg-primary/90 transition-colors"
                >
                  <Users className="w-5 h-5" />
                  {language === "nl" ? "Betaal & Reserveer" : "Pay & Reserve"}
                </button>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      <section id="event-reserve" className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h2 className="font-display text-3xl md:text-4xl mb-4">
              {language === "nl" ? "Reserveer uw plek" : "Reserve your seat"}
            </h2>
            <p className="font-serif text-primary-foreground/85">
              {language === "nl"
                ? "Vul uw gegevens in, betaal direct online en ontvang een bevestigingsmail met unieke code."
                : "Enter your details, pay online, and receive a confirmation email with a unique code."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            {error && (
              <div className="p-3 border border-red-300/50 bg-red-500/20 text-red-100">{error}</div>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={100}
                placeholder={language === "nl" ? "Volledige naam" : "Full name"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:outline-none font-serif"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder={language === "nl" ? "E-mailadres" : "Email address"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:outline-none font-serif"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <input
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                minLength={8}
                maxLength={20}
                placeholder={language === "nl" ? "Telefoonnummer" : "Phone number"}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-primary-foreground placeholder:text-primary-foreground/50 focus:border-secondary focus:outline-none font-serif"
              />
              <select
                name="numberOfGuests"
                value={formData.numberOfGuests}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-white/20 text-primary-foreground focus:border-secondary focus:outline-none font-serif"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
              >
                {Array.from({ length: 20 }, (_, idx) => idx + 1).map((guests) => (
                  <option key={guests} value={guests} style={{ backgroundColor: "hsl(25, 30%, 18%)" }}>
                    {guests} {language === "nl" ? "gasten" : "guests"}
                  </option>
                ))}
              </select>
            </div>

            <select
              name="reservationDate"
              value={formData.reservationDate}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-white/20 text-primary-foreground focus:border-secondary focus:outline-none font-serif"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
            >
              <option value="" style={{ backgroundColor: "hsl(25, 30%, 18%)" }}>
                {language === "nl" ? "Selecteer eventdatum" : "Select event date"}
              </option>
              {openDates.map((dateItem) => {
                const dateKey = toDateKey(dateItem.date);
                return (
                  <option
                    key={dateKey}
                    value={dateItem.isOpen ? dateKey : ""}
                    disabled={!dateItem.isOpen}
                    style={{ backgroundColor: "hsl(25, 30%, 18%)" }}
                  >
                    {formatDateOption(language, dateItem.date, dateItem.dayName)}
                    {!dateItem.isOpen ? ` - ${dateItem.closureReason || (language === "nl" ? "Niet beschikbaar" : "Unavailable")}` : ""}
                  </option>
                );
              })}
            </select>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                !eventSettings.isActive ||
                !formData.name ||
                !formData.email ||
                !formData.contactNumber ||
                !formData.reservationDate
              }
              className="w-full bg-secondary text-secondary-foreground py-4 font-serif text-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {language === "nl" ? "Doorsturen naar betaling..." : "Redirecting to payment..."}
                </>
              ) : language === "nl" ? (
                "Betaal & Reserveer"
              ) : (
                "Pay & Reserve"
              )}
            </button>

            {!eventSettings.isActive && (
              <p className="text-sm text-amber-100 text-center font-serif">
                {language === "nl"
                  ? "Eventreserveringen zijn momenteel uitgeschakeld."
                  : "Event reservations are currently disabled."}
              </p>
            )}
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default UpcomingEvents;
