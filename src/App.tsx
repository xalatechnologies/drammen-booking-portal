
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FacilityDetail from "./pages/facilities/[id]";
import BookingsPage from "./pages/bookings";
import AdminDashboard from "./pages/admin/Dashboard";
import LoginSelection from "./pages/LoginSelection";
import SettingsPage from "./pages/settings";
import ProfilePage from "./pages/profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<LoginSelection />} />
          <Route path="/facilities/:id" element={<FacilityDetail />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          
          {/* Redirect standalone routes to admin equivalents */}
          <Route path="/users" element={<Navigate to="/admin/users" replace />} />
          <Route path="/facilities" element={<Navigate to="/admin/facilities" replace />} />
          <Route path="/notifications" element={<Navigate to="/admin/notifications" replace />} />
          
          {/* Setting up admin routes correctly with nested paths */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
