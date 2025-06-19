import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import "./App.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <LanguageProvider>
        <LocalizationProvider>
          <TooltipProvider>
            <Toaster />
            <Router>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/facilities/:id" element={<FacilityPage />} />
                <Route path="/booking/:facilityId" element={<BookingPage />} />
                <Route path="/booking/success/:bookingReference" element={<BookingSuccessPage bookingReference="" facilityId="" />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </LocalizationProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
