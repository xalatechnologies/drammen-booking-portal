
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Menu, User, LogIn } from "lucide-react";

const GlobalHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
    <header className="bg-white py-2 px-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo (left) */}
        <div className="flex items-center">
          <a href="/" className="flex items-center">
            <img src="https://www.drammen.kommune.no/Logos/logo-drammen-new.svg" alt="Drammen Kommune Logo" className="h-16 w-auto" />
          </a>
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
        <div className="hidden lg:flex items-center space-x-4">
          {/* Language toggle replaces the two buttons */}
          <Toggle 
            pressed={language === 'EN'}
            onPressedChange={toggleLanguage}
            className="border rounded-md px-3 py-1"
          >
            {language === 'NO' ? 'NO' : 'EN'}
          </Toggle>
          
          {/* Conditionally show login button or profile based on login status */}
          {!isLoggedIn ? (
            <Button 
              variant="outline" 
              className="flex items-center gap-1 h-9 px-4 border-blue-200 text-blue-700 hover:bg-blue-50"
              onClick={handleLogin}
            >
              <LogIn className="w-4 h-4" />
              <span>Logg inn</span>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-blue-50 hover:bg-blue-100">
                  <span className="sr-only">User profile</span>
                  <User className="h-5 w-5 text-blue-700" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  Min profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  Innstillinger
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Logg ut
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Mobile Menu (full-screen, conditional rendering) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white lg:hidden pt-16 px-4">
          <div className="flex flex-col gap-4 p-4">
            {/* Show different buttons based on login state in mobile menu */}
            {!isLoggedIn ? (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-lg font-medium py-3"
                onClick={() => {
                  handleLogin();
                  setMobileMenuOpen(false);
                }}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Logg inn
              </Button>
            ) : (
              <Button 
                variant="ghost" 
                className="w-full justify-start text-lg font-medium py-3"
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
              >
                <LogIn className="mr-2 h-5 w-5" />
                Logg ut
              </Button>
            )}
            
            <div className="border-t my-2"></div>
            {/* Language toggle for mobile */}
            <div className="flex justify-around mt-4">
              <Button 
                variant={language === 'NO' ? "secondary" : "ghost"} 
                className="flex-1 h-10"
                onClick={() => setLanguage('NO')}
              >
                NO
              </Button>
              <span className="text-gray-300 flex items-center">|</span>
              <Button 
                variant={language === 'EN' ? "secondary" : "ghost"} 
                className="flex-1 h-10"
                onClick={() => setLanguage('EN')}
              >
                EN
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default GlobalHeader;
