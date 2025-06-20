
import React from "react";
import { Button } from "@/components/ui/button";
import { LogIn, Shield, Cookie, Info, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n/hooks/useTranslation";
import { useGdpr } from "@/contexts/GdprContext";

interface MobileMenuProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  setLanguage: (lang: 'NO' | 'EN') => void;
  handleLogin: () => void;
  handleLogout: () => void;
  closeMobileMenu: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  isLoggedIn,
  setLanguage,
  handleLogin,
  handleLogout,
  closeMobileMenu,
}) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();
  const { showPreferences } = useGdpr();

  if (!isOpen) return null;

  const handleNavigation = (path: string) => {
    navigate(path);
    closeMobileMenu();
  };

  const handleGdprPreferences = () => {
    showPreferences();
    closeMobileMenu();
  };

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
            {t('common.actions.login', {}, 'Logg inn')}
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
            {t('common.actions.logout', {}, 'Logg ut')}
          </Button>
        )}
        
        <div className="border-t my-2"></div>
        
        {/* Privacy Menu Items */}
        <Button 
          variant="ghost" 
          className="w-full justify-start text-lg font-medium py-3"
          onClick={() => handleNavigation('/personvern')}
        >
          <Shield className="mr-2 h-5 w-5" />
          Personvern
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-lg font-medium py-3"
          onClick={handleGdprPreferences}
        >
          <Settings className="mr-2 h-5 w-5" />
          Cookie-innstillinger
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-lg font-medium py-3"
          onClick={() => handleNavigation('/cookies')}
        >
          <Cookie className="mr-2 h-5 w-5" />
          Cookies
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start text-lg font-medium py-3"
          onClick={() => handleNavigation('/tilgjengelighet')}
        >
          <Info className="mr-2 h-5 w-5" />
          Tilgjengelighet
        </Button>
        
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
