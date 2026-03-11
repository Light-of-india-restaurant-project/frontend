import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Phone, Loader2, Eye, EyeOff, User, MapPin, Hash, Home, Building, AlertTriangle, CheckCircle } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { orderApi } from "@/lib/user-api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type AuthMode = "login" | "register";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";
  const { language } = useLanguage();
  const { login, register, isAuthenticated } = useUserAuth();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [streetName, setStreetName] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [city, setCity] = useState("Rotterdam");
  const [postalCode, setPostalCode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Postal code delivery zone validation
  const [isCheckingPostalCode, setIsCheckingPostalCode] = useState(false);
  const [postalCodeDeliverable, setPostalCodeDeliverable] = useState<boolean | null>(null);
  const [postalCodeWarning, setPostalCodeWarning] = useState<string | null>(null);

  // Check postal code deliverability (warn but allow)
  const checkPostalCodeDeliverable = useCallback(async (code: string) => {
    if (!code || code.replace(/\s/g, '').length < 6) {
      setPostalCodeDeliverable(null);
      setPostalCodeWarning(null);
      return;
    }

    setIsCheckingPostalCode(true);
    try {
      const result = await orderApi.checkDeliveryArea(code);
      setPostalCodeDeliverable(result.deliverable);
      if (!result.deliverable) {
        setPostalCodeWarning(
          language === "nl"
            ? "Let op: We bezorgen momenteel niet in dit gebied. U kunt uw bestelling nog steeds afhalen."
            : "Note: We don't currently deliver to this area. You can still pick up your order."
        );
      } else {
        setPostalCodeWarning(null);
      }
    } catch {
      setPostalCodeDeliverable(null);
      setPostalCodeWarning(null);
    } finally {
      setIsCheckingPostalCode(false);
    }
  }, [language]);

  // Debounced postal code check
  useEffect(() => {
    const timer = setTimeout(() => {
      if (postalCode.replace(/\s/g, '').length >= 6) {
        checkPostalCodeDeliverable(postalCode);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [postalCode, checkPostalCodeDeliverable]);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate(redirectTo);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (mode === "login") {
        const result = await login(email, password);
        if (result.success) {
          navigate(redirectTo);
        } else {
          setError(result.error || "Login failed");
        }
      } else {
        // Register
        // Check if passwords match
        if (password !== confirmPassword) {
          setError(language === "nl"
            ? "Wachtwoorden komen niet overeen"
            : "Passwords do not match");
          setIsSubmitting(false);
          return;
        }

        if (!mobile.startsWith("+")) {
          setError(language === "nl" 
            ? "Telefoonnummer moet beginnen met + en landcode (bijv. +31)" 
            : "Phone number must start with + and country code (e.g. +31)");
          setIsSubmitting(false);
          return;
        }

        // Validate postal code format (Dutch: 1234 AB)
        if (postalCode && !/^[0-9]{4}\s?[A-Za-z]{2}$/.test(postalCode)) {
          setError(language === "nl"
            ? "Ongeldige postcode (bijv. 1234 AB)"
            : "Invalid postal code format (e.g., 1234 AB)");
          setIsSubmitting(false);
          return;
        }
        
        const result = await register({
          email,
          password,
          mobile,
          fullName: fullName || undefined,
          postalCode: postalCode || undefined,
          streetName: streetName || undefined,
          houseNumber: houseNumber || undefined,
          city: city || undefined,
        });
        if (result.success) {
          setSuccess(
            language === "nl"
              ? "Account aangemaakt! U kunt nu inloggen."
              : "Account created! You can now login."
          );
          setMode("login");
        } else {
          setError(result.error || "Registration failed");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-serif mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            {language === "nl" ? "Terug" : "Back"}
          </button>

          <div className="max-w-md mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-lg p-8"
            >
              <h1 className="font-display text-3xl text-foreground text-center mb-2">
                {mode === "login"
                  ? language === "nl" ? "Inloggen" : "Login"
                  : language === "nl" ? "Registreren" : "Register"}
              </h1>
              <p className="font-serif text-muted-foreground text-center mb-8">
                {mode === "login"
                  ? language === "nl"
                    ? "Log in om je bestelling te plaatsen"
                    : "Login to place your order"
                  : language === "nl"
                    ? "Maak een account aan om te bestellen"
                    : "Create an account to place orders"}
              </p>

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <p className="font-serif text-green-700">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
                  <p className="font-serif text-destructive">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block font-serif text-foreground mb-2">
                    {language === "nl" ? "E-mailadres" : "Email"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder={language === "nl" ? "jouw@email.nl" : "your@email.com"}
                      className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Phone (Register only) */}
                {mode === "register" && (
                  <div>
                    <label className="block font-serif text-foreground mb-2">
                      {language === "nl" ? "Telefoonnummer" : "Phone Number"}
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        required
                        placeholder="+31 612345678"
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "nl" 
                        ? "Inclusief landcode (bijv. +31 voor Nederland)" 
                        : "Include country code (e.g. +31 for Netherlands)"}
                    </p>
                  </div>
                )}

                {/* Full Name (Register only) */}
                {mode === "register" && (
                  <div>
                    <label className="block font-serif text-foreground mb-2">
                      {language === "nl" ? "Volledige naam" : "Full Name"}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        placeholder={language === "nl" ? "Jan de Vries" : "John Doe"}
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Street Name (Register only) */}
                {mode === "register" && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block font-serif text-foreground mb-2">
                        {language === "nl" ? "Straatnaam" : "Street Name"}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                          type="text"
                          value={streetName}
                          onChange={(e) => setStreetName(e.target.value)}
                          required
                          placeholder={language === "nl" ? "Coolsingel" : "Main Street"}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block font-serif text-foreground mb-2">
                        {language === "nl" ? "Huisnummer" : "House Number"}
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                          type="text"
                          value={houseNumber}
                          onChange={(e) => setHouseNumber(e.target.value)}
                          required
                          placeholder={language === "nl" ? "42A" : "42A"}
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* City (Register only) */}
                {mode === "register" && (
                  <div>
                    <label className="block font-serif text-foreground mb-2">
                      {language === "nl" ? "Stad" : "City"}
                    </label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        placeholder="Rotterdam"
                        className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                )}

                {/* Postal Code (Register only) */}
                {mode === "register" && (
                  <div>
                    <label className="block font-serif text-foreground mb-2">
                      {language === "nl" ? "Postcode" : "Postal Code"}
                    </label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => {
                          setPostalCode(e.target.value.toUpperCase());
                          setPostalCodeDeliverable(null);
                          setPostalCodeWarning(null);
                        }}
                        required
                        placeholder="1234 AB"
                        maxLength={7}
                        className={`w-full pl-10 pr-12 py-3 bg-background border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary ${
                          postalCodeDeliverable === true ? 'border-green-500' : 
                          postalCodeDeliverable === false ? 'border-amber-500' : 'border-border'
                        }`}
                      />
                      {isCheckingPostalCode && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
                      )}
                      {!isCheckingPostalCode && postalCodeDeliverable === true && (
                        <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                      )}
                      {!isCheckingPostalCode && postalCodeDeliverable === false && (
                        <AlertTriangle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "nl" 
                        ? "Nederlandse postcode (bijv. 1234 AB)" 
                        : "Dutch postal code (e.g., 1234 AB)"}
                    </p>
                    {postalCodeWarning && (
                      <div className="mt-2 p-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded">
                        <p className="text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
                          <AlertTriangle size={16} />
                          {postalCodeWarning}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Password */}
                <div>
                  <label className="block font-serif text-foreground mb-2">
                    {language === "nl" ? "Wachtwoord" : "Password"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {mode === "register" && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {language === "nl" 
                        ? "Minimaal 8 tekens" 
                        : "Minimum 8 characters"}
                    </p>
                  )}
                </div>

                {/* Confirm Password (Register only) */}
                {mode === "register" && (
                  <div>
                    <label className="block font-serif text-foreground mb-2">
                      {language === "nl" ? "Bevestig wachtwoord" : "Confirm Password"}
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded font-serif focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                    {password && confirmPassword && password !== confirmPassword && (
                      <p className="text-sm text-destructive mt-1">
                        {language === "nl" 
                          ? "Wachtwoorden komen niet overeen" 
                          : "Passwords do not match"}
                      </p>
                    )}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-primary text-primary-foreground font-serif text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      {language === "nl" ? "Even geduld..." : "Please wait..."}
                    </>
                  ) : mode === "login" ? (
                    language === "nl" ? "Inloggen" : "Login"
                  ) : (
                    language === "nl" ? "Registreren" : "Register"
                  )}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-6 text-center">
                <p className="font-serif text-muted-foreground">
                  {mode === "login" ? (
                    <>
                      {language === "nl" ? "Nog geen account? " : "Don't have an account? "}
                      <button
                        onClick={() => { setMode("register"); setError(null); setSuccess(null); }}
                        className="text-primary hover:underline"
                      >
                        {language === "nl" ? "Registreer" : "Register"}
                      </button>
                    </>
                  ) : (
                    <>
                      {language === "nl" ? "Al een account? " : "Already have an account? "}
                      <button
                        onClick={() => { setMode("login"); setError(null); setSuccess(null); }}
                        className="text-primary hover:underline"
                      >
                        {language === "nl" ? "Inloggen" : "Login"}
                      </button>
                    </>
                  )}
                </p>
              </div>

              {/* Forgot Password */}
              {mode === "login" && (
                <div className="mt-4 text-center">
                  <button
                    onClick={() => navigate("/forgot-password")}
                    className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {language === "nl" ? "Wachtwoord vergeten?" : "Forgot password?"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Login;
