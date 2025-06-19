
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from '@/contexts/QueryClient';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import { BookingStateProvider } from '@/contexts/BookingStateContext';
import Index from '@/pages/Index';
import FacilityDetailsPage from '@/pages/facilities/[id]';
import BookingConfirmationPage from '@/pages/BookingConfirmationPage';
import CheckoutPage from '@/pages/checkout';
import LoginPage from '@/pages/LoginPage';
import LoginSelectionPage from '@/pages/LoginSelection';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <Router>
      <QueryClient>
        <LanguageProvider>
          <AuthProvider>
            <CartProvider>
              <BookingStateProvider>
                <div className="App">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/facility/:id" element={<FacilityDetailsPage />} />
                    <Route path="/booking/:facilityId/confirm" element={<BookingConfirmationPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/login-selection" element={<LoginSelectionPage />} />
                  </Routes>
                  <Toaster />
                </div>
              </BookingStateProvider>
            </CartProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClient>
    </Router>
  );
}

export default App;
