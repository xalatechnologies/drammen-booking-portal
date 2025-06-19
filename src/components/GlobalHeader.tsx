
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Logo from "@/components/header/Logo";
import LanguageToggle from "@/components/header/LanguageToggle";
import ProfileMenu from "@/components/header/ProfileMenu";
import MobileMenu from "@/components/header/MobileMenu";
import GlobalSearch from "@/components/header/GlobalSearch";
import { CartDropdown } from "@/components/header/CartDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const { getItemCount } = useCart();
  
  // Add state to track if user is logged in (we'll use localStorage to persist this between refreshes)
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Check localStorage for login status on component mount
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // Function to handle login
  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
    navigate("/login");
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
  };

  const itemCount = getItemCount();

  return (
    <header className="bg-white dark:bg-gray-900 py-3 shadow-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700 w-full">
      <div className="content-center flex justify-between items-center gap-4">
        {/* Logo (left) */}
        <div className="flex items-center flex-shrink-0">
          <Logo />
        </div>

        {/* Global Search (center) - Hidden on mobile */}
        <div className="hidden md:flex flex-1 justify-center max-w-lg">
          <GlobalSearch />
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          className="md:hidden p-2" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Right side: Cart, Language toggle & Login/Profile */}
        <div className="hidden md:flex items-center space-x-2 flex-shrink-0">
          {/* Cart Icon with Dropdown */}
          <Popover open={cartOpen} onOpenChange={setCartOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="relative p-2">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white rounded-full"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 p-0" align="end">
              <CartDropdown onClose={() => setCartOpen(false)} />
            </PopoverContent>
          </Popover>
          
          {/* Language toggle */}
          <LanguageToggle 
            language={language} 
            toggleLanguage={toggleLanguage} 
          />
          
          {/* Profile menu (login button or dropdown) */}
          <ProfileMenu 
            isLoggedIn={isLoggedIn} 
            handleLogin={handleLogin} 
            handleLogout={handleLogout}
          />
        </div>
      </div>

      {/* Mobile Search Bar - Shown only on mobile */}
      <div className="md:hidden mt-3 px-6">
        <GlobalSearch />
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        isLoggedIn={isLoggedIn}
        setLanguage={(lang) => {
          if (lang === 'NO' || lang === 'EN') {
            // Use the context's setLanguage method
            const event = new CustomEvent('setLanguage', { detail: lang });
            window.dispatchEvent(event);
          }
        }}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};

export default GlobalHeader;
