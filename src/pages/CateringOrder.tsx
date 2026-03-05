import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  FileText,
  Loader2,
  AlertCircle,
  CreditCard
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n';
import { cateringApi, CateringPack } from '@/lib/user-api';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const CateringOrder = () => {
  const navigate = useNavigate();
  const { packId } = useParams<{ packId: string }>();
  const { language } = useLanguage();
  
  const [pack, setPack] = useState<CateringPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [peopleCount, setPeopleCount] = useState<number>(10);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Fetch pack details
  useEffect(() => {
    const fetchPack = async () => {
      if (!packId) {
        setError('No pack ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await cateringApi.getPack(packId);
        setPack(response.pack);
        setPeopleCount(response.pack.minPeople);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pack');
      } finally {
        setLoading(false);
      }
    };

    fetchPack();
  }, [packId]);

  // Calculate total price
  const totalPrice = pack ? pack.pricePerPerson * peopleCount : 0;

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Generate time options
  const timeOptions = () => {
    const options: string[] = [];
    for (let h = 10; h <= 21; h++) {
      for (const m of ['00', '30']) {
        const time = `${h.toString().padStart(2, '0')}:${m}`;
        options.push(time);
      }
    }
    return options;
  };

  // Validate form
  const isFormValid = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      pack &&
      peopleCount >= pack.minPeople &&
      deliveryDate !== '' &&
      deliveryTime !== '' &&
      street.trim() !== '' &&
      houseNumber.trim() !== '' &&
      city.trim() !== '' &&
      postalCode.trim() !== '' &&
      customerName.trim() !== '' &&
      customerEmail.trim() !== '' &&
      emailRegex.test(customerEmail) &&
      customerPhone.trim() !== ''
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pack || !isFormValid()) {
      setError(language === 'nl' 
        ? 'Vul alle verplichte velden in' 
        : 'Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderData = {
        cateringPackId: pack._id,
        peopleCount,
        deliveryDate,
        deliveryTime,
        deliveryAddress: {
          street: street.trim(),
          houseNumber: houseNumber.trim(),
          city: city.trim(),
          postalCode: postalCode.trim(),
          additionalInfo: additionalInfo.trim() || undefined,
        },
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        notes: notes.trim() || undefined,
      };

      const response = await cateringApi.initiatePayment(orderData);
      
      // Store payment ID in sessionStorage
      sessionStorage.setItem('pendingCateringPaymentId', response.paymentId);
      
      // Redirect to Mollie payment page
      window.location.href = response.paymentUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate payment');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <Loader2 size={48} className="mx-auto text-primary animate-spin mb-4" />
              <p className="text-muted-foreground font-serif">
                {language === 'nl' ? 'Pakket laden...' : 'Loading package...'}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error && !pack) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 pb-20">
          <div className="container mx-auto px-6">
            <div className="max-w-lg mx-auto text-center py-16">
              <AlertCircle size={48} className="mx-auto text-destructive mb-4" />
              <p className="text-destructive font-serif mb-6">{error}</p>
              <button
                onClick={() => navigate('/catering')}
                className="flex items-center gap-2 text-primary hover:text-primary/80 font-serif mx-auto"
              >
                <ArrowLeft size={20} />
                {language === 'nl' ? 'Terug naar catering' : 'Back to catering'}
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
          {/* Back Button */}
          <button
            onClick={() => navigate('/catering')}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-serif mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            {language === 'nl' ? 'Terug naar pakketten' : 'Back to packages'}
          </button>

          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Order Form */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg shadow-lg p-6 md:p-8">
                  <h1 className="font-display text-2xl text-foreground mb-6">
                    {language === 'nl' ? 'Bestelling plaatsen' : 'Place Your Order'}
                  </h1>

                  {error && (
                    <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-3 text-destructive">
                      <AlertCircle size={20} />
                      <span className="font-serif text-sm">{error}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* People Count */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <Users size={18} className="text-primary" />
                        {language === 'nl' ? 'Aantal personen' : 'Number of people'} *
                      </label>
                      <input
                        type="number"
                        min={pack?.minPeople || 1}
                        value={peopleCount}
                        onChange={(e) => setPeopleCount(Math.max(pack?.minPeople || 1, parseInt(e.target.value) || 0))}
                        className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {language === 'nl' 
                          ? `Minimaal ${pack?.minPeople} personen` 
                          : `Minimum ${pack?.minPeople} people`}
                      </p>
                    </div>

                    {/* Delivery Date & Time */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                          <Calendar size={18} className="text-primary" />
                          {language === 'nl' ? 'Bezorgdatum' : 'Delivery date'} *
                        </label>
                        <input
                          type="date"
                          min={getMinDate()}
                          value={deliveryDate}
                          onChange={(e) => setDeliveryDate(e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                          <Clock size={18} className="text-primary" />
                          {language === 'nl' ? 'Bezorgtijd' : 'Delivery time'} *
                        </label>
                        <select
                          value={deliveryTime}
                          onChange={(e) => setDeliveryTime(e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        >
                          <option value="">{language === 'nl' ? 'Selecteer tijd' : 'Select time'}</option>
                          {timeOptions().map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 font-medium text-foreground">
                        <MapPin size={18} className="text-primary" />
                        {language === 'nl' ? 'Bezorgadres' : 'Delivery address'}
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <label className="text-sm text-muted-foreground mb-1 block">
                            {language === 'nl' ? 'Straat' : 'Street'} *
                          </label>
                          <input
                            type="text"
                            value={street}
                            onChange={(e) => setStreet(e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">
                            {language === 'nl' ? 'Huisnr.' : 'House no.'} *
                          </label>
                          <input
                            type="text"
                            value={houseNumber}
                            onChange={(e) => setHouseNumber(e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">
                            {language === 'nl' ? 'Postcode' : 'Postal code'} *
                          </label>
                          <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="1234 AB"
                            className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-muted-foreground mb-1 block">
                            {language === 'nl' ? 'Stad' : 'City'} *
                          </label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">
                          {language === 'nl' ? 'Extra informatie (optioneel)' : 'Additional info (optional)'}
                        </label>
                        <input
                          type="text"
                          value={additionalInfo}
                          onChange={(e) => setAdditionalInfo(e.target.value)}
                          placeholder={language === 'nl' ? 'bijv. appartementnummer, bedrijfsnaam' : 'e.g. apartment number, company name'}
                          className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        />
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-4">
                      <h3 className="flex items-center gap-2 font-medium text-foreground">
                        <User size={18} className="text-primary" />
                        {language === 'nl' ? 'Uw gegevens' : 'Your details'}
                      </h3>
                      <div>
                        <label className="text-sm text-muted-foreground mb-1 block">
                          {language === 'nl' ? 'Naam' : 'Name'} *
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Mail size={14} />
                            {language === 'nl' ? 'E-mail' : 'Email'} *
                          </label>
                          <input
                            type="email"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Phone size={14} />
                            {language === 'nl' ? 'Telefoon' : 'Phone'} *
                          </label>
                          <input
                            type="tel"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                        <FileText size={18} className="text-primary" />
                        {language === 'nl' ? 'Opmerkingen (optioneel)' : 'Notes (optional)'}
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder={language === 'nl' 
                          ? 'Speciale wensen of dieetvereisten...' 
                          : 'Special requests or dietary requirements...'}
                        className="w-full px-4 py-3 border border-border rounded-lg font-serif focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background resize-none"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !isFormValid()}
                      className="w-full flex items-center justify-center gap-3 py-4 bg-primary text-primary-foreground font-serif text-lg hover:bg-primary/90 transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          {language === 'nl' ? 'Bezig met verwerken...' : 'Processing...'}
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          {language === 'nl' ? 'Betaal nu' : 'Pay now'} - €{totalPrice.toFixed(2)}
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>

              {/* Order Summary Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg shadow-lg p-6 sticky top-28">
                  <h2 className="font-display text-lg text-foreground mb-4">
                    {language === 'nl' ? 'Overzicht' : 'Summary'}
                  </h2>

                  {/* Pack Info */}
                  {pack && (
                    <>
                      {pack.image && (
                        <div className="rounded-lg overflow-hidden mb-4">
                          <img src={pack.image} alt={pack.name} className="w-full h-32 object-cover" />
                        </div>
                      )}
                      <h3 className="font-serif font-medium text-foreground mb-2">{pack.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {language === 'nl' ? pack.descriptionNl : pack.description}
                      </p>

                      {/* Menu Items */}
                      {pack.menuItems.length > 0 && (
                        <div className="mb-4 pb-4 border-b border-border">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                            {language === 'nl' ? 'Inbegrepen items' : 'Included items'}
                          </p>
                          <ul className="space-y-1">
                            {pack.menuItems.map((item) => (
                              <li key={item._id} className="text-sm text-foreground">
                                • {item.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Price Breakdown */}
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {language === 'nl' ? 'Prijs per persoon' : 'Price per person'}
                          </span>
                          <span className="text-foreground">€{pack.pricePerPerson.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {language === 'nl' ? 'Aantal personen' : 'Number of people'}
                          </span>
                          <span className="text-foreground">× {peopleCount}</span>
                        </div>
                      </div>

                      {/* Total */}
                      <div className="pt-4 border-t border-border">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">
                            {language === 'nl' ? 'Totaal' : 'Total'}
                          </span>
                          <span className="font-display text-2xl text-primary">
                            €{totalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CateringOrder;
