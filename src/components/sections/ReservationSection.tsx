import { useState, useEffect } from "react";
import { Calendar, Clock, Users, Check, AlertCircle, Loader2, Armchair } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { useLanguage } from "@/lib/i18n";
import { api, ReservationData, AvailableSlot, ReservationSettingsResponse } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Selected table type
interface SelectedTable {
  id: string;
  name: string;
  capacity: number;
  floor?: { name: string; locationType: string };
  row?: { name: string };
}

const ReservationSection = () => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    guests: "",
    specialRequests: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Available slots state
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotsError, setSlotsError] = useState<string | null>(null);
  
  // Selected table state
  const [selectedTable, setSelectedTable] = useState<SelectedTable | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState<ReservationSettingsResponse["data"] | null>(null);

  // Fetch reservation settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.getReservationSettings();
        setSettings(response.data);
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  // Fetch available slots when date changes (fetch with guest=1 to get all available slots)
  useEffect(() => {
    const fetchSlots = async () => {
      if (!formData.date) {
        setAvailableSlots([]);
        return;
      }

      setIsLoadingSlots(true);
      setSlotsError(null);
      // Reset time and table when date changes
      setFormData(prev => ({ ...prev, time: "", guests: "" }));
      setSelectedTable(null);

      try {
        // Fetch with guest=1 to get all available slots
        const response = await api.getAvailableSlots(formData.date, 1);
        setAvailableSlots(response.data);
        
        if (response.data.length === 0) {
          setSlotsError(
            language === "nl" 
              ? "Geen beschikbare tijden voor deze datum." 
              : "No available times for this date."
          );
        }
      } catch (err) {
        console.error("Failed to fetch slots:", err);
        setSlotsError(
          language === "nl" 
            ? "Kon beschikbare tijden niet laden. Probeer het opnieuw." 
            : "Could not load available times. Please try again."
        );
        setAvailableSlots([]);
      } finally {
        setIsLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [formData.date, language]);

  // Get the selected time slot's tables
  const selectedSlot = availableSlots.find(slot => slot.time === formData.time);

  // Handle time slot selection
  const handleTimeSelect = (time: string) => {
    setFormData(prev => ({ ...prev, time, guests: "" }));
    setSelectedTable(null);
  };

  // Handle table selection
  const handleTableSelect = (table: SelectedTable) => {
    setSelectedTable(table);
    // Set default guests to 2 or table capacity if less
    const defaultGuests = Math.min(2, table.capacity);
    setFormData(prev => ({ ...prev, guests: defaultGuests.toString() }));
  };

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
      const response = await api.createReservation(reservationData);

      setConfirmationCode(response.data.confirmationCode);
      setIsSuccess(true);
      toast({
        title: language === "nl" ? "Reservering bevestigd!" : "Reservation confirmed!",
        description: language === "nl" 
          ? `Bevestigingscode: ${response.data.confirmationCode}` 
          : `Confirmation code: ${response.data.confirmationCode}`,
        duration: 10000,
      });

      // Reset after 10 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setConfirmationCode(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          guests: "",
          specialRequests: "",
        });
        setAvailableSlots([]);
        setSelectedTable(null);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Calculate min and max dates
  const today = new Date().toISOString().split("T")[0];
  const maxDate = settings 
    ? new Date(Date.now() + settings.maxAdvanceDays * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Generate guest options based on selected table capacity
  const maxGuests = selectedTable?.capacity || 1;
  const guestOptions = Array.from({ length: maxGuests }, (_, i) => i + 1);

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
              <p className="font-serif text-cream/80 mb-4">{t("reservation.confirm")}</p>
              {confirmationCode && (
                <div className="inline-block bg-cream/10 border border-cream/20 rounded-lg px-6 py-3">
                  <p className="text-sm text-cream/60 mb-1">
                    {language === "nl" ? "Bevestigingscode" : "Confirmation Code"}
                  </p>
                  <p className="font-mono text-xl text-secondary font-bold tracking-wider">
                    {confirmationCode}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-500/20 border border-red-500/40 text-red-200 rounded">
                  <AlertCircle size={20} className="flex-shrink-0" />
                  <p className="font-serif text-sm">{error}</p>
                </div>
              )}

              {/* Step 1: Select Date */}
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
                  min={today}
                  max={maxDate}
                  className="w-full px-4 py-3 bg-cream/10 border border-cream/20 text-cream focus:border-secondary focus:outline-none transition-colors font-serif"
                />
              </div>

              {/* Step 2: Select Time Slot */}
              <div>
                <label className="block font-serif mb-2 text-cream/80">
                  <Clock size={16} className="inline mr-2" />
                  {t("reservation.time")} *
                </label>
                {!formData.date ? (
                  <p className="text-cream/60 py-3 font-serif">
                    {language === "nl" 
                      ? "Selecteer eerst een datum." 
                      : "Please select a date first."}
                  </p>
                ) : isLoadingSlots ? (
                  <div className="flex items-center gap-3 py-3 text-cream/60">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="font-serif">
                      {language === "nl" ? "Beschikbare tijden laden..." : "Loading available times..."}
                    </span>
                  </div>
                ) : slotsError ? (
                  <p className="text-red-300 py-3 font-serif">{slotsError}</p>
                ) : availableSlots.length > 0 ? (
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => handleTimeSelect(slot.time)}
                        className={`px-3 py-2 border rounded font-serif text-sm transition-colors ${
                          formData.time === slot.time
                            ? "bg-secondary text-secondary-foreground border-secondary"
                            : "bg-cream/10 border-cream/20 text-cream hover:border-secondary hover:bg-cream/20"
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-cream/60 py-3 font-serif">
                    {language === "nl" 
                      ? "Geen beschikbare tijden gevonden." 
                      : "No available times found."}
                  </p>
                )}
              </div>

              {/* Step 3: Select Table (shown after time is selected) */}
              {formData.time && selectedSlot && (
                <div className="animate-fade-in">
                  <label className="block font-serif mb-3 text-cream/80">
                    <Armchair size={16} className="inline mr-2" />
                    {language === "nl" ? "Selecteer een tafel" : "Select a Table"} *
                  </label>
                  
                  {/* Group tables by location type and row */}
                  {(() => {
                    // Group tables by locationType -> floorName -> rowName
                    const groupedTables: Record<string, Record<string, Record<string, typeof selectedSlot.tables>>> = {};
                    
                    selectedSlot.tables.forEach(table => {
                      const locationType = table.floor?.locationType || 'other';
                      const floorName = table.floor?.name || 'General';
                      const rowName = table.row?.name || 'General';
                      
                      if (!groupedTables[locationType]) {
                        groupedTables[locationType] = {};
                      }
                      if (!groupedTables[locationType][floorName]) {
                        groupedTables[locationType][floorName] = {};
                      }
                      if (!groupedTables[locationType][floorName][rowName]) {
                        groupedTables[locationType][floorName][rowName] = [];
                      }
                      groupedTables[locationType][floorName][rowName].push(table);
                    });

                    // Define location order and labels
                    const locationOrder = ['inside', 'outside', 'terrace', 'other'];
                    const locationLabels: Record<string, { en: string; nl: string; icon: string }> = {
                      inside: { en: 'Inside', nl: 'Binnen', icon: '🏠' },
                      outside: { en: 'Outside', nl: 'Buiten', icon: '🌳' },
                      terrace: { en: 'Terrace', nl: 'Terras', icon: '☀️' },
                      other: { en: 'Other', nl: 'Overig', icon: '📍' }
                    };

                    const sortedLocations = Object.keys(groupedTables).sort(
                      (a, b) => locationOrder.indexOf(a) - locationOrder.indexOf(b)
                    );

                    return (
                      <div className="space-y-6">
                        {sortedLocations.map(locationType => {
                          const locationInfo = locationLabels[locationType] || locationLabels.other;
                          const floors = groupedTables[locationType];
                          const floorNames = Object.keys(floors);
                          
                          return (
                            <div key={locationType} className="bg-cream/5 rounded-xl p-4 border border-cream/10">
                              {/* Location Type Header */}
                              <div className="flex items-center gap-2 mb-4 pb-2 border-b border-cream/20">
                                <span className="text-xl">{locationInfo.icon}</span>
                                <h4 className="font-display text-lg text-secondary">
                                  {language === "nl" ? locationInfo.nl : locationInfo.en}
                                </h4>
                              </div>
                              
                              <div className="space-y-4">
                                {floorNames.map(floorName => {
                                  const rows = floors[floorName];
                                  const rowNames = Object.keys(rows);
                                  const showFloorHeader = floorNames.length > 1 || floorName !== 'General';
                                  
                                  return (
                                    <div key={floorName}>
                                      {/* Floor Header (only if multiple floors or named floor) */}
                                      {showFloorHeader && (
                                        <h5 className="font-serif text-sm text-cream/70 mb-2 ml-1">
                                          {floorName}
                                        </h5>
                                      )}
                                      
                                      <div className="space-y-3">
                                        {rowNames.map(rowName => {
                                          const tables = rows[rowName];
                                          const showRowHeader = rowNames.length > 1 || rowName !== 'General';
                                          
                                          return (
                                            <div key={rowName}>
                                              {/* Row Header (only if multiple rows or named row) */}
                                              {showRowHeader && (
                                                <p className="text-xs text-cream/50 mb-2 ml-2 uppercase tracking-wider">
                                                  {rowName}
                                                </p>
                                              )}
                                              
                                              {/* Tables Grid */}
                                              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                                {tables.map((table) => {
                                                  const isSelected = selectedTable?.id === table.id;
                                                  const isAvailable = table.isAvailable;
                                                  
                                                  return (
                                                    <button
                                                      key={table.id}
                                                      type="button"
                                                      onClick={() => isAvailable && handleTableSelect(table)}
                                                      disabled={!isAvailable}
                                                      className={`p-3 border rounded-lg font-serif transition-all text-left relative ${
                                                        isSelected
                                                          ? "bg-secondary text-secondary-foreground border-secondary shadow-lg scale-[1.02]"
                                                          : isAvailable
                                                            ? "bg-cream/10 border-cream/20 text-cream hover:border-secondary hover:bg-cream/15 cursor-pointer"
                                                            : "bg-cream/5 border-cream/10 text-cream/40 cursor-not-allowed opacity-50"
                                                      }`}
                                                    >
                                                      <span className={`block font-semibold ${!isAvailable && "line-through"}`}>
                                                        {table.name}
                                                      </span>
                                                      <span className={`text-xs flex items-center gap-1 mt-1 ${
                                                        isSelected 
                                                          ? "text-secondary-foreground/80" 
                                                          : isAvailable 
                                                            ? "text-cream/60"
                                                            : "text-cream/30"
                                                      }`}>
                                                        <Users size={12} />
                                                        {table.capacity} {table.capacity === 1 
                                                          ? (language === "nl" ? "stoel" : "seat") 
                                                          : (language === "nl" ? "stoelen" : "seats")}
                                                      </span>
                                                      {!isAvailable && (
                                                        <span className="text-xs text-red-400/80 mt-1 block">
                                                          {language === "nl" ? "Gereserveerd" : "Reserved"}
                                                        </span>
                                                      )}
                                                    </button>
                                                  );
                                                })}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Step 4: Select Guests (shown after table is selected) */}
              {selectedTable && (
                <div className="animate-fade-in">
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
                    {guestOptions.map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? (language === "nl" ? "Gast" : "Guest") : (language === "nl" ? "Gasten" : "Guests")}
                      </option>
                    ))}
                  </select>
                  <p className="text-cream/50 text-xs mt-1 font-serif">
                    {language === "nl" 
                      ? `Maximum ${selectedTable.capacity} gasten voor ${selectedTable.name}` 
                      : `Maximum ${selectedTable.capacity} guests for ${selectedTable.name}`}
                  </p>
                </div>
              )}

              {/* Step 5: Contact Info (shown after guests is selected) */}
              {formData.guests && (
                <div className="animate-fade-in space-y-6">
                  <div className="border-t border-cream/20 pt-6">
                    <h3 className="font-display text-lg mb-4 text-cream">
                      {language === "nl" ? "Uw gegevens" : "Your Details"}
                    </h3>
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

                    <div className="mt-6">
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

                    <div className="mt-6">
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
                        placeholder={language === "nl" 
                          ? "Dieetwensen, speciale gelegenheden, zitvoorkeuren..." 
                          : "Dietary requirements, special occasions, seating preferences..."}
                      />
                    </div>
                  </div>

                  {/* Booking Summary */}
                  <div className="bg-cream/5 border border-cream/20 rounded-lg p-4">
                    <h4 className="font-display text-sm text-cream/80 mb-3">
                      {language === "nl" ? "Uw reservering" : "Your Reservation"}
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm font-serif">
                      <span className="text-cream/60">{language === "nl" ? "Datum:" : "Date:"}</span>
                      <span className="text-cream">{new Date(formData.date).toLocaleDateString(language === "nl" ? "nl-NL" : "en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      <span className="text-cream/60">{language === "nl" ? "Tijd:" : "Time:"}</span>
                      <span className="text-cream">{formData.time}</span>
                      <span className="text-cream/60">{language === "nl" ? "Tafel:" : "Table:"}</span>
                      <span className="text-cream">{selectedTable?.name}</span>
                      <span className="text-cream/60">{language === "nl" ? "Gasten:" : "Guests:"}</span>
                      <span className="text-cream">{formData.guests}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
                    className="w-full bg-secondary text-secondary-foreground py-4 font-serif text-lg hover:bg-secondary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? t("reservation.submitting") : t("reservation.submit")}
                  </button>
                </div>
              )}

              <p className="text-center text-cream/60 text-sm font-serif">
                {language === "nl" 
                  ? "Voor grotere groepen, bel ons op " 
                  : "For larger parties, please call us at "}
                <a href="tel:+31103072299" className="text-secondary hover:underline">
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
