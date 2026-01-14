import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "./PageTransition";
import Index from "@/pages/Index";
import Menu from "@/pages/Menu";
import PrivateEvents from "@/pages/PrivateEvents";
import NotFound from "@/pages/NotFound";
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
