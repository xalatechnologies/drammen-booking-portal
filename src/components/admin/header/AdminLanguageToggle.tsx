
import React from "react";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const AdminLanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button 
      variant="ghost" 
      onClick={toggleLanguage} 
      className="flex items-center px-4 py-2 h-11 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-lg" 
      aria-label={`Bytt språk til ${language === 'NO' ? 'Engelsk' : 'Norsk'}`}
    >
      <Globe className="mr-2 h-4 w-4" />
      <span>{language}</span>
    </Button>
  );
};

export default AdminLanguageToggle;
