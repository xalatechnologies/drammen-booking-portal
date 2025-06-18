
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroBanner = () => {
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      title: "Finn ledige lokaler",
      subtitle: "Drammen Kommune",
      description: "Søk og reserver kommunale lokaler til møter, arrangementer og aktiviteter."
    },
    EN: {
      title: "Find available facilities",
      subtitle: "Drammen Municipality",
      description: "Search and book municipal facilities for meetings, events and activities."
    }
  };

  const t = translations[language];

  return (
    <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        <img 
          src="/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png" 
          alt="Drammen by med elv og broer" 
          className="w-full h-[160px] object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/30 flex items-center">
          <div className="container mx-auto px-8 py-8">
            <div className="max-w-2xl">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                {t.title}<br />
                {t.subtitle}
              </h1>
              <p className="text-sm sm:text-base text-blue-100 max-w-lg">
                {t.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
