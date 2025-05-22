
import React from "react";

const HeroBanner = () => {
  return (
    <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
      <div className="relative">
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Drammen Kommune Facilities" 
          className="w-full h-[360px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/30 flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 leading-tight">
                Finn ledige lokaler i Drammen Kommune
              </h1>
              <p className="text-lg text-blue-100 mb-6 max-w-lg">
                Søk og book kommunale lokaler til møter, arrangementer og aktiviteter.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
