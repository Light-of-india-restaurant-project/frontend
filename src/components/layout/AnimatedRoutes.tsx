import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import Index from "@/pages/Index";
import Menu from "@/pages/Menu";
import PrivateEvents from "@/pages/PrivateEvents";
import NotFound from "@/pages/NotFound";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Orders from "@/pages/Orders";
import PaymentSuccess from "@/pages/PaymentSuccess";
import PaymentCancelled from "@/pages/PaymentCancelled";
import Catering from "@/pages/Catering";
import CateringPackDetail from "@/pages/CateringPackDetail";
import CateringOrder from "@/pages/CateringOrder";
import CateringSuccess from "@/pages/CateringSuccess";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminPhotos from "@/pages/admin/AdminPhotos";
import AdminPhotoUpload from "@/pages/admin/AdminPhotoUpload";
import AdminPhotoEdit from "@/pages/admin/AdminPhotoEdit";

export const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Index />
            </PageTransition>
          }
        />
        <Route
          path="/menu"
          element={
            <PageTransition>
              <Menu />
            </PageTransition>
          }
        />
        <Route
          path="/private-events"
          element={
            <PageTransition>
              <PrivateEvents />
            </PageTransition>
          }
        />
        <Route
          path="/checkout"
          element={
            <PageTransition>
              <Checkout />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PageTransition>
              <ForgotPassword />
            </PageTransition>
          }
        />
        <Route
          path="/orders"
          element={
            <PageTransition>
              <Orders />
            </PageTransition>
          }
        />
        <Route
          path="/payment/success"
          element={
            <PageTransition>
              <PaymentSuccess />
            </PageTransition>
          }
        />
        <Route
          path="/payment/cancelled"
          element={
            <PageTransition>
              <PaymentCancelled />
            </PageTransition>
          }
        />
        
        {/* Catering Routes */}
        <Route
          path="/catering"
          element={
            <PageTransition>
              <Catering />
            </PageTransition>
          }
        />
        <Route
          path="/catering/order/:packId"
          element={
            <PageTransition>
              <CateringOrder />
            </PageTransition>
          }
        />
        <Route
          path="/catering/success"
          element={
            <PageTransition>
              <CateringSuccess />
            </PageTransition>
          }
        />
        <Route
          path="/catering/:packId"
          element={
            <PageTransition>
              <CateringPackDetail />
            </PageTransition>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin/login"
          element={
            <AdminAuthProvider>
              <AdminLogin />
            </AdminAuthProvider>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminAuthProvider>
              <AdminLayout />
            </AdminAuthProvider>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="photos" element={<AdminPhotos />} />
          <Route path="photos/upload" element={<AdminPhotoUpload />} />
          <Route path="photos/:id/edit" element={<AdminPhotoEdit />} />
        </Route>

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};
