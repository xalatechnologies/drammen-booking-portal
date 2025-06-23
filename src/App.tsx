import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { CartProvider } from "@/contexts/CartContext";
import { GdprProvider } from "@/contexts/GdprContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import FacilityPage from "./pages/facilities/[id]";
import BookingPage from "./pages/booking/[facilityId]";
import { BookingSuccessPage } from "./components/facility/booking/BookingSuccessPage";
import BookingsPage from "./pages/user/Bookings";
import LoginPage from "./pages/LoginSelection";
import ProfilePage from "./pages/profile/index";
import SettingsPage from "./pages/settings/index";
import AdminDashboard from "./pages/admin/Dashboard";
import UmbrellaLayout from "./pages/umbrella/UmbrellaLayout";
import UmbrellaOverview from "./pages/umbrella/Overview";
import AllocatedTime from "./pages/umbrella/AllocatedTime";
import Distribution from "./pages/umbrella/Distribution";
import Users from "./pages/umbrella/Users";
import UserLayout from "./pages/user/UserLayout";
import UserOverviewPage from "./pages/user/Overview";
import ApplicationsPage from "./pages/user/Applications";
import HelpPage from "./pages/user/Help";
import UserProfilePage from "./pages/user/Profile";
import InvoicesPage from "./pages/user/Invoices";
import NotificationsPage from "./pages/user/Notifications";
import HistoryLogPage from "./pages/umbrella/HistoryLog";
import MessagesPage from "./pages/umbrella/Messages";
import ReleaseTimePage from "./pages/umbrella/ReleaseTime";
import CaseworkerDashboard from "./pages/caseworker";

import FacilityDetailsPage from '@/pages/facilities/[id]';
import BookingConfirmationPage from '@/pages/BookingConfirmationPage';
import CheckoutPage from '@/pages/checkout';
import LoginSelectionPage from '@/pages/LoginSelection';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GdprProvider>
        <LanguageProvider>
          <LocalizationProvider>
            <CartProvider>
              <SearchProvider>
                <TooltipProvider>
                  <Toaster />
                  <BrowserRouter>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/facility/:id" element={<FacilityDetailsPage />} />
                      <Route path="/facilities/:id" element={<FacilityDetailsPage />} />
                      <Route path="/booking/:facilityId/confirm" element={<BookingConfirmationPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/bookings" element={<BookingsPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/login-selection" element={<LoginSelectionPage />} />
                      
                      <Route path="/facilities/:facilityId" element={<FacilityPage />} />
                      <Route path="/facilities/:facilityId/book" element={<BookingPage />} />
                      <Route path="/booking/success/:bookingReference" element={<BookingSuccessPage bookingReference="" facilityId="" />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="/admin/*" element={<AdminDashboard />} />
                      <Route path="/minside/paraply" element={<UmbrellaLayout />}>
                        <Route index element={<UmbrellaOverview />} />
                        <Route path="rammetid" element={<AllocatedTime />} />
                        <Route path="fordeling" element={<Distribution />} />
                        <Route path="brukere" element={<Users />} />
                        <Route path="logg" element={<HistoryLogPage />} />
                        <Route path="meldinger" element={<MessagesPage />} />
                        <Route path="frigjor-tid" element={<ReleaseTimePage />} />
                      </Route>
                      <Route path="/minside/bruker" element={<UserLayout />}>
                        <Route index element={<UserOverviewPage />} />
                        <Route path="soknader" element={<ApplicationsPage />} />
                        <Route path="bookinger" element={<BookingsPage />} />
                        <Route path="varslinger" element={<NotificationsPage />} />
                        <Route path="hjelp" element={<HelpPage />} />
                        <Route path="profil" element={<UserProfilePage />} />
                        <Route path="fakturaer" element={<InvoicesPage />} />
                      </Route>
                      <Route path="/caseworker" element={<CaseworkerDashboard />} />
                    </Routes>
                  </BrowserRouter>
                </TooltipProvider>
              </SearchProvider>
            </CartProvider>
          </LocalizationProvider>
        </LanguageProvider>
      </GdprProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
