
import React from "react";

const HeroBanner = () => {
  return (
    <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        <img 
          src="/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png" 
          alt="Drammen by med elv og broer" 
          className="w-full h-[360px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/30 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                Finn ledige lokaler i Drammen Kommune
              </h1>
              <p className="text-lg text-blue-100 mb-6 max-w-lg">
                Søk og reserver kommunale lokaler til møter, arrangementer og aktiviteter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
