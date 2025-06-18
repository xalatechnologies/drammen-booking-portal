
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Logo from "@/components/header/Logo";
import LanguageToggle from "@/components/header/LanguageToggle";
import ProfileMenu from "@/components/header/ProfileMenu";
import MobileMenu from "@/components/header/MobileMenu";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [language, setLanguage] = useState<'NO' | 'EN'>('NO');
  
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
  
  // Toggle language
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'NO' ? 'EN' : 'NO');
  };

  return (
    <header className="glass sticky top-0 z-50 border-b border-white/20 shadow-soft animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo (left) */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            className="lg:hidden p-2 hover:bg-navy-50 focus-ring transition-all duration-200" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6 text-navy-700" />
          </Button>

          {/* Right side: Language toggle & Login/Profile */}
          <div className="hidden lg:flex items-center space-x-4">
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
      </div>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen}
        language={language}
        isLoggedIn={isLoggedIn}
        setLanguage={setLanguage}
        handleLogin={handleLogin}
        handleLogout={handleLogout}
        closeMobileMenu={() => setMobileMenuOpen(false)}
      />
    </header>
  );
};

export default GlobalHeader;
