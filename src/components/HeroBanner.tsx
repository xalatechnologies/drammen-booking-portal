
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const HeroBanner = () => {
  const { language } = useLanguage();
  
  const translations = {
    NO: {
      title: "Finn ditt perfekte lokale",
      subtitle: "Drammen Kommune",
      description: "Oppdag og reserver kommunale lokaler til møter, arrangementer og aktiviteter. Enkelt, raskt og oversiktlig."
    },
    EN: {
      title: "Find your perfect space",
      subtitle: "Drammen Municipality",
      description: "Discover and book municipal facilities for meetings, events and activities. Simple, fast and clear."
    }
  };

  const t = translations[language];

  return (
    <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl">
      <div className="relative">
        <img 
          src="/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png" 
          alt="Drammen by med elv og broer" 
          className="w-full h-[200px] md:h-[240px] object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/60 to-transparent flex items-center">
          <div className="container mx-auto px-8 py-8">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {t.title}
              </h1>
              <p className="text-pink-500 font-semibold text-lg mb-2">
                {t.subtitle}
              </p>
              <p className="text-base sm:text-lg text-gray-100 max-w-xl leading-relaxed">
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
