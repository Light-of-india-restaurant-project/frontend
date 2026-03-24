import { useState } from "react";
import { Phone, Mail, MapPin, Clock, Send, AlertCircle } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { api, ContactData } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useOperatingHours } from "@/hooks/use-operating-hours";

const ContactSection = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const { getGroupedHours } = useOperatingHours();
  const hoursGroups = getGroupedHours(language);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare contact data for API
      const contactData: ContactData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
        language: language as 'en' | 'nl',
      };

      // Call the actual backend API
      await api.sendContactMessage(contactData);

      setIsSuccess(true);
      toast({
        title: language === "nl" ? "Bericht verzonden!" : "Message sent!",
        description: language === "nl" 
          ? "We nemen zo snel mogelijk contact met u op." 
          : "We'll get back to you as soon as possible.",
        duration: 5000,
      });

      // Reset after 5 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: "", email: "", subject: "", message: "" });
      }, 5000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: language === "nl" ? "Verzenden mislukt" : "Failed to send",
        description: language === "nl" 
          ? "Probeer het opnieuw of mail ons direct." 
          : "Please try again or email us directly.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="py-24 bg-muted">
      <div className="container mx-auto px-6">
        <SectionHeading
          title={t("contact.title")}
          subtitle={t("contact.subtitle")}
        />

        <div className="grid md:grid-cols-2 gap-16 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2">{t("contact.address")}</h3>
                  <p className="font-serif text-muted-foreground">
                    Kortekade 1<br />
                    Rotterdam, Netherlands
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2">{t("contact.phone")}</h3>
                  <a
                    href="tel:+31103072299"
                    className="font-serif text-muted-foreground hover:text-primary transition-colors"
                  >
                    010 307 22 99
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2">{t("contact.email")}</h3>
                  <a
                    href="mailto:zafar@LightofIndia.nl"
                    className="font-serif text-muted-foreground hover:text-primary transition-colors"
                  >
                    zafar@LightofIndia.nl
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg mb-2">{t("contact.hours")}</h3>
                  <div className="font-serif text-muted-foreground space-y-1">
                    {hoursGroups.map((group, idx) => (
                      <p key={idx} className={group.isOpen ? "" : "text-muted-foreground/60"}>
                        {group.days}: {group.hours}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="mt-8 aspect-video bg-card border border-border overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2460.548!2d4.4895!3d51.9175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c4335e4ef6e8d1%3A0x0!2sKortekade%201%2C%20Rotterdam!5e0!3m2!1sen!2snl!4v1700000000000!5m2!1sen!2snl"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Light of India - Kortekade 1, Rotterdam"
              />
            </div>
          </div>

          {/* Contact Form */}
          <div>
            {isSuccess ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
                    <Send size={32} className="text-green-600" />
                  </div>
                  <h3 className="font-display text-2xl mb-4">{t("contact.success")}</h3>
                  <p className="font-serif text-muted-foreground">{t("contact.reply")}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/40 text-destructive rounded">
                    <AlertCircle size={20} className="flex-shrink-0" />
                    <p className="font-serif text-sm">{error}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="contact-name" className="block font-serif mb-2 text-foreground">
                      {t("contact.name")} *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors font-serif"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block font-serif mb-2 text-foreground">
                      {t("contact.email")} *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors font-serif"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-subject" className="block font-serif mb-2 text-foreground">
                    {t("contact.subject")} *
                  </label>
                  <select
                    id="contact-subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-card border border-border text-foreground focus:border-primary focus:outline-none transition-colors font-serif"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="reservation">Reservation Question</option>
                    <option value="private-event">Private Event Booking</option>
                    <option value="catering">Catering Services</option>
                    <option value="feedback">Feedback</option>
                    <option value="careers">Careers</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block font-serif mb-2 text-foreground">
                    {t("contact.message")} *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-card border border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors font-serif resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground py-4 font-serif text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    t("contact.sending")
                  ) : (
                    <>
                      <Send size={18} />
                      {t("contact.send")}
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
