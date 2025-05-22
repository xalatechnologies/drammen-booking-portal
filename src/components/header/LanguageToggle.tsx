
import React from "react";
import { Toggle } from "@/components/ui/toggle";

interface LanguageToggleProps {
  language: 'NO' | 'EN';
  toggleLanguage: () => void;
}

const LanguageToggle: React.FC<LanguageToggleProps> = ({ language, toggleLanguage }) => {
  return (
    <Toggle 
      pressed={language === 'EN'}
      onPressedChange={toggleLanguage}
      className="border rounded-md px-3 py-1"
    >
      {language === 'NO' ? 'NO' : 'EN'}
    </Toggle>
  );
};

export default LanguageToggle;
