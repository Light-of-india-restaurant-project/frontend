import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Lock, Key, Loader2, Eye, EyeOff, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/lib/i18n";
import { userApi } from "@/lib/user-api";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

type Step = "email" | "otp" | "success";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await userApi.requestPasswordReset(email);
      setStep("otp");
    } catch (err) {
      setError(err instanceof Error ? err.message : language === "nl" 
        ? "Er is een fout opgetreden" 
        : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setError(language === "nl" 
        ? "Wachtwoorden komen niet overeen" 
        : "Passwords do not match");
      return;
    }

    // Validate password length
    if (newPassword.length < 5) {
      setError(language === "nl"
        ? "Wachtwoord moet minimaal 5 tekens zijn"
        : "Password must be at least 5 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      await userApi.resetPassword(email, otp, newPassword, confirmPassword);
      setStep("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : language === "nl"
        ? "Er is een fout opgetreden"
        : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      await userApi.requestPasswordReset(email);
      setError(null);
      // Show success message briefly
      setError(language === "nl" ? "Nieuwe code verzonden!" : "New code sent!");
      setTimeout(() => setError(null), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : language === "nl"
        ? "Er is een fout opgetreden"
        : "An error occurred");
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
            onClick={() => step === "email" ? navigate(-1) : setStep("email")}
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
              {/* Step: Success */}
              {step === "success" && (
                <div className="text-center">
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h1 className="font-display text-3xl text-foreground mb-2">
                    {language === "nl" ? "Wachtwoord gewijzigd!" : "Password Changed!"}
                  </h1>
                  <p className="font-serif text-muted-foreground mb-8">
                    {language === "nl"
                      ? "Je wachtwoord is succesvol gewijzigd. Je kunt nu inloggen met je nieuwe wachtwoord."
                      : "Your password has been successfully changed. You can now login with your new password."}
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full py-3 bg-primary text-primary-foreground font-serif text-lg hover:bg-primary/90 transition-colors"
                  >
                    {language === "nl" ? "Naar inloggen" : "Go to Login"}
                  </button>
                </div>
              )}

              {/* Step: Email Input */}
              {step === "email" && (
                <>
                  <h1 className="font-display text-3xl text-foreground text-center mb-2">
                    {language === "nl" ? "Wachtwoord vergeten" : "Forgot Password"}
                  </h1>
                  <p className="font-serif text-muted-foreground text-center mb-8">
                    {language === "nl"
                      ? "Voer je e-mailadres in om een verificatiecode te ontvangen"
                      : "Enter your email address to receive a verification code"}
                  </p>

                  {error && (
                    <div className={`border rounded-lg p-4 mb-6 ${
                      error.includes("verzonden") || error.includes("sent")
                        ? "bg-green-50 border-green-200"
                        : "bg-destructive/10 border-destructive/20"
                    }`}>
                      <p className={`font-serif ${
                        error.includes("verzonden") || error.includes("sent")
                          ? "text-green-700"
                          : "text-destructive"
                      }`}>{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleRequestOtp} className="space-y-6">
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
                      ) : (
                        language === "nl" ? "Verstuur code" : "Send Code"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => navigate("/login")}
                      className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {language === "nl" ? "Terug naar inloggen" : "Back to login"}
                    </button>
                  </div>
                </>
              )}

              {/* Step: OTP and New Password */}
              {step === "otp" && (
                <>
                  <h1 className="font-display text-3xl text-foreground text-center mb-2">
                    {language === "nl" ? "Nieuw wachtwoord" : "New Password"}
                  </h1>
                  <p className="font-serif text-muted-foreground text-center mb-2">
                    {language === "nl"
                      ? "Voer de code in die naar je e-mail is verzonden"
                      : "Enter the code sent to your email"}
                  </p>
                  <p className="font-serif text-sm text-primary text-center mb-8">
                    {email}
                  </p>

                  {error && (
                    <div className={`border rounded-lg p-4 mb-6 ${
                      error.includes("verzonden") || error.includes("sent")
                        ? "bg-green-50 border-green-200"
                        : "bg-destructive/10 border-destructive/20"
                    }`}>
                      <p className={`font-serif ${
                        error.includes("verzonden") || error.includes("sent")
                          ? "text-green-700"
                          : "text-destructive"
                      }`}>{error}</p>
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-6">
                    {/* OTP */}
                    <div>
                      <label className="block font-serif text-foreground mb-2">
                        {language === "nl" ? "Verificatiecode" : "Verification Code"}
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                          maxLength={6}
                          placeholder="123456"
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded font-serif text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isSubmitting}
                          className="text-sm text-primary hover:underline font-serif disabled:opacity-50"
                        >
                          {language === "nl" ? "Code opnieuw versturen" : "Resend code"}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block font-serif text-foreground mb-2">
                        {language === "nl" ? "Nieuw wachtwoord" : "New Password"}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          minLength={5}
                          maxLength={15}
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
                      <p className="text-sm text-muted-foreground mt-1">
                        {language === "nl" ? "5-15 tekens" : "5-15 characters"}
                      </p>
                    </div>

                    {/* Confirm Password */}
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
                          minLength={5}
                          maxLength={15}
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
                      {newPassword && confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-sm text-destructive mt-1">
                          {language === "nl" 
                            ? "Wachtwoorden komen niet overeen" 
                            : "Passwords do not match"}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !otp || !newPassword || !confirmPassword}
                      className="w-full py-3 bg-primary text-primary-foreground font-serif text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          {language === "nl" ? "Even geduld..." : "Please wait..."}
                        </>
                      ) : (
                        language === "nl" ? "Wachtwoord wijzigen" : "Change Password"
                      )}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setStep("email")}
                      className="font-serif text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {language === "nl" ? "Ander e-mailadres gebruiken" : "Use different email"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ForgotPassword;
