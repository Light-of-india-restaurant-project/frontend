import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "@/lib/i18n";
import { AnimatedRoutes } from "@/components/layout/AnimatedRoutes";
import { CartProvider } from "@/contexts/CartContext";
import { UserAuthProvider } from "@/contexts/UserAuthContext";
import ScrollToTop from "@/components/layout/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <UserAuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <AnimatedRoutes />
              <CookieConsent />
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </UserAuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
