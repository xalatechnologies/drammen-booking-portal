
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Logo from "@/components/header/Logo";
import LanguageToggle from "@/components/header/LanguageToggle";
import ProfileMenu from "@/components/header/ProfileMenu";
import MobileMenu from "@/components/header/MobileMenu";
import { useLanguage } from "@/contexts/LanguageContext";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  
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

  return (
    <header className="bg-white dark:bg-gray-900 py-2 px-4 shadow-md sticky top-0 z-10 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo (left) */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          className="lg:hidden p-2" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Right side: Language toggle & Login/Profile */}
        <div className="hidden lg:flex items-center space-x-2">
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
            language={language}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        language={language}
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
