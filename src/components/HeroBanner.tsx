
import React from "react";

const HeroBanner = () => {
  return (
    <div className="mb-4 rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        <img 
          src="/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png" 
          alt="Drammen by med elv og broer - vakker utsikt over kommunen" 
          className="w-full h-[160px] object-cover"
          role="img"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/30 flex items-center">
          <div className="container mx-auto px-8 py-12">
            <div className="max-w-2xl">
              <h1 
                className="text-lg sm:text-xl md:text-2xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 leading-tight"
                id="main-heading"
              >
                Finn ledige lokaler<br />
                Drammen Kommune
              </h1>
              <p 
                className="text-sm sm:text-base md:text-lg lg:text-xl text-blue-100 max-w-lg leading-relaxed"
                aria-describedby="main-heading"
              >
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
