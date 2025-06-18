
import React from "react";

const HeroBanner = () => {
  return (
    <div className="mb-8 rounded-3xl overflow-hidden shadow-strong hover-lift animate-fade-in">
      <div className="relative">
        <img 
          src="/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png" 
          alt="Drammen by med elv og broer" 
          className="w-full h-[200px] md:h-[240px] object-cover" 
        />
        <div className="absolute inset-0 gradient-primary opacity-90 flex items-center">
          <div className="container mx-auto px-8 py-12">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight animate-slide-up">
                Finn ledige lokaler<br />
                <span className="text-purple-200">Drammen Kommune</span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-navy-100 max-w-2xl mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                Søk og reserver kommunale lokaler til møter, arrangementer og aktiviteter med vårt moderne bookingsystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
                <button className="glass px-8 py-4 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 focus-ring">
                  Utforsk Lokaler
                </button>
                <button className="bg-white/10 backdrop-blur-sm border border-white/20 px-8 py-4 rounded-2xl text-white font-semibold hover:bg-white/20 transition-all duration-300 hover:scale-105 focus-ring">
                  Kom i gang
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-500/20 to-transparent"></div>
      </div>
    </div>
  );
};

export default HeroBanner;
