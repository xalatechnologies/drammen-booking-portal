
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
    <div className="mb-8 rounded-2xl overflow-hidden shadow-xl">
      <div className="relative">
        <img 
          src="/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png" 
          alt="Drammen by med elv og broer" 
          className="w-full h-[280px] object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/40 flex items-center">
          <div className="container mx-auto px-8 py-12">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {t.title}
                <span className="block text-blue-200 mt-1">{t.subtitle}</span>
              </h1>
              <p className="text-base sm:text-lg text-blue-100 max-w-lg leading-relaxed">
                {t.description}
              </p>
              <div className="mt-6">
                <a 
                  href="#main-content" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300 text-base"
                >
                  Utforsk lokaler
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
