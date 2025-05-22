
import React from "react";

const Logo: React.FC = () => {
  return (
    <a href="/" className="flex items-center">
      <img 
        src="https://www.drammen.kommune.no/Logos/logo-drammen-new.svg" 
        alt="Drammen Kommune Logo" 
        className="h-16 w-auto" 
      />
    </a>
  );
};

export default Logo;
