
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const GlobalHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white py-2 px-4 shadow-md sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo (left) */}
        <div className="flex items-center">
          <a href="/">
            <img src="https://www.drammen.kommune.no/Logos/logo-drammen-new.svg" alt="Drammen Kommune Logo" className="h-20 w-auto" />
          </a>
        </div>

        {/* Navigation (center) */}
        <nav className="hidden md:flex space-x-8">
          <Button variant="link" className="text-blue-700 font-medium" onClick={() => navigate("/")}>Book lokaler</Button>
          <Button variant="link" className="text-blue-700 font-medium" onClick={() => navigate("/bookings")}>Mine bookinger</Button>
          <Button variant="link" className="text-blue-700 font-medium">Hjelp</Button>
        </nav>

        {/* Language & Profile (right) */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 border rounded-md px-2 py-1">
            <Button variant="ghost" className="h-8 p-1">NO</Button>
            <span className="text-gray-300">|</span>
            <Button variant="ghost" className="h-8 p-1">EN</Button>
          </div>
          <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-gray-100">
            <span className="sr-only">User profile</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
