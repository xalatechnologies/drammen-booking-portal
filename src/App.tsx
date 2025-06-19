
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Index from "@/pages/Index";
import FacilityDetail from "@/pages/facilities/[id]";
import BookingPage from "@/pages/booking/[facilityId]";
import CheckoutPage from "@/pages/checkout";
import ConfirmationPage from "@/pages/confirmation";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { QueryClient } from "@/contexts/QueryClient";
import { CartProvider } from "@/contexts/CartContext";

function App() {
  return (
    <CartProvider>
      <QueryClient>
        <Router>
          <LanguageProvider>
            <LocalizationProvider>
              <div className="flex flex-col min-h-screen w-full">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/facilities/:id" element={<FacilityDetail />} />
                  <Route path="/booking/:id" element={<BookingPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/confirmation" element={<ConfirmationPage />} />
                </Routes>
              </div>
            </LocalizationProvider>
          </LanguageProvider>
        </Router>
      </QueryClient>
    </CartProvider>
  );
}

export default App;
