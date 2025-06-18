
import React from "react";

const HeroBanner = () => {
  return (
    <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
      <div className="relative">
        <img 
          src="/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png" 
          alt="Drammen by med elv og broer" 
          className="w-full h-[200px] md:h-[300px] object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/60 flex items-center">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                Finn ledige lokaler
                <br />
                <span className="text-purple-200">Drammen Kommune</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mb-6">
                Søk og reserver kommunale lokaler til møter, arrangementer og aktiviteter med vårt moderne bookingsystem.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
