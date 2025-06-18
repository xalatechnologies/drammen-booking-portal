
import React from "react";

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center h-16">
      <img 
        src="https://www.drammen.kommune.no/Logos/logo-drammen-new.svg" 
        alt="Drammen Kommune Logo" 
        className="h-full w-auto" 
      />
    </a>
  );
};

export default Logo;
