
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useRoutes } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LocalizationProvider } from "@/contexts/LocalizationContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { CartProvider } from "@/contexts/CartContext";
import { GdprProvider } from "@/contexts/GdprContext";
import { AuthProvider } from "@/contexts/AuthContext";

// Import centralized routes configuration
import { routes } from "@/routes";

/**
 * AppRoutes Component
 * 
 * Following Single Responsibility Principle by focusing only on routing
 * This component renders the application routes using the centralized configuration
 */
const AppRoutes = () => {
  const element = useRoutes(routes);
  return element;
};

const queryClient = new QueryClient();

/**
 * Main App Component
 * 
 * Following Single Responsibility Principle by focusing only on providing
 * application context providers and routing.
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <GdprProvider>
        <LanguageProvider>
          <LocalizationProvider>
            <SearchProvider>
              <BrowserRouter>
                <TooltipProvider>
                  <Toaster />
                  <AppRoutes />
                </TooltipProvider>
              </BrowserRouter>
            </SearchProvider>
          </LocalizationProvider>
        </LanguageProvider>
      </GdprProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
