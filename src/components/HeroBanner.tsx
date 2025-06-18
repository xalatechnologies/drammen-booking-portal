import React from "react";
const HeroBanner = () => {
  return <div className="mb-8 rounded-3xl overflow-hidden shadow-strong hover-lift animate-fade-in">
      <div className="relative">
        <img src="/lovable-uploads/5a43abf2-1c2e-44cb-96a6-6509c7fe3281.png" alt="Drammen by med elv og broer" className="w-full h-[200px] md:h-[240px] object-cover" />
        <div className="absolute inset-0 gradient-primary opacity-90 flex items-center">
          <div className="container py-[61px] px-[36px] mx-0 my-[2px] pt-10 ">
            <div className="max-w-3xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white mb-4 leading-tight animate-slide-up">
                Finn ledige lokaler<br />
                <span className="text-purple-200">Drammen Kommune</span>
              </h1>
              <p style={{
              animationDelay: '0.2s'
            }} className="text-base sm:text-lg md:text-xl text-navy-100 max-w-2xl mb-8 animate-slide-up my-[6px]">
                Søk og reserver kommunale lokaler til møter, arrangementer og aktiviteter med vårt moderne bookingsystem.
              </p>
              
            </div>
          </div>
        </div>
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-500/20 to-transparent"></div>
      </div>
    </div>;
};
export default HeroBanner;