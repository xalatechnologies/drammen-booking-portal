import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient } from 'react-query';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import { BookingStateProvider } from '@/contexts/BookingStateContext';
import FacilityList from '@/pages/FacilityList';
import FacilityDetailsPage from '@/pages/FacilityDetailsPage';
import BookingConfirmationPage from '@/pages/BookingConfirmationPage';
import CheckoutPage from '@/pages/checkout';
import LoginPage from '@/pages/LoginPage';
import LoginSelectionPage from '@/pages/LoginSelectionPage';
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/contexts/AuthContext";

function App() {
  return (
    <Router>
      <QueryClient>
        <LocalizationProvider>
          <LanguageProvider>
            <AuthProvider>
              <CartProvider>
                <BookingStateProvider>
                  <div className="App">
                    <Routes>
                      <Route path="/" element={<FacilityList />} />
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
        </LocalizationProvider>
      </QueryClient>
    </Router>
  );
}

export default App;
