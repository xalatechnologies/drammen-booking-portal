import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import FacilityPage from "./pages/facilities/[id]";
import BookingPage from "./pages/booking/[facilityId]";
import { BookingSuccessPage } from "./components/facility/booking/BookingSuccessPage";
import BookingsPage from "./pages/bookings/index";
import LoginPage from "./pages/LoginSelection";
import ProfilePage from "./pages/profile/index";
import SettingsPage from "./pages/settings/index";
import AdminDashboard from "./pages/admin/Dashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/facilities/:facilityId" element={<FacilityPage />} />
            <Route path="/facilities/:facilityId/book" element={<BookingPage />} />
            <Route path="/booking/success/:bookingReference" element={<BookingSuccessPage bookingReference="" facilityId="" />} />
            <Route path="/bookings" element={<BookingsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;

