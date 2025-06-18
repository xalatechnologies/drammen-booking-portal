
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";

interface MobileMenuProps {
  isOpen: boolean;
  language: 'NO' | 'EN';
  isLoggedIn: boolean;
  setLanguage: (lang: 'NO' | 'EN') => void;
  handleLogin: () => void;
  handleLogout: () => void;
  closeMobileMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  language,
  isLoggedIn,
  setLanguage,
  handleLogin,
  handleLogout,
  closeMobileMenu,
}) => {
  if (!isOpen) return null;

  const translations = {
    NO: {
      login: "Logg inn",
      logout: "Logg ut"
    },
    EN: {
      login: "Log in",
      logout: "Log out"
    }
  };

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-white lg:hidden pt-16 px-4">
      <div className="flex flex-col gap-4 p-4">
        {/* Show different buttons based on login state in mobile menu */}
        {!isLoggedIn ? (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-lg font-medium py-3"
            onClick={() => {
              handleLogin();
              closeMobileMenu();
            }}
          >
            <LogIn className="mr-2 h-5 w-5" />
            {t.login}
          </Button>
        ) : (
          <Button 
            variant="ghost" 
            className="w-full justify-start text-lg font-medium py-3"
            onClick={() => {
              handleLogout();
              closeMobileMenu();
            }}
          >
            <LogIn className="mr-2 h-5 w-5" />
            {t.logout}
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
  );
};

export default MobileMenu;
