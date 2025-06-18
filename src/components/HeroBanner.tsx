
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
    <div className="mb-8 rounded-2xl overflow-hidden shadow-xl relative">
      <div className="relative">
        <img 
          src="/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png" 
          alt="Drammen by med elv og broer" 
          className="w-full h-[320px] object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/40 flex items-center justify-start">
          <div className="container mx-auto px-8 py-12 relative z-10">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                {t.title}
                <span className="block text-blue-200 mt-2 text-2xl sm:text-3xl">{t.subtitle}</span>
              </h1>
              <p className="text-base sm:text-xl text-blue-100 max-w-lg leading-relaxed">
                {t.description}
              </p>
              <div className="mt-8">
                <a 
                  href="#main-content" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-full shadow-lg hover:bg-blue-50 transition-all duration-300 text-lg transform hover:translate-y-[-2px] hover:shadow-xl"
                >
                  Utforsk lokaler
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 right-0 w-1/3 h-24 bg-gradient-to-l from-blue-500/20 to-transparent"></div>
        <div className="absolute top-0 right-0 w-1/4 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent"></div>
      </div>
    </div>
  );
};

export default HeroBanner;
