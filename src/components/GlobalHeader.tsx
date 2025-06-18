
import React from "react";
import { Button } from "@/components/ui/button";
import { Menu, User } from "lucide-react";

const GlobalHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-blue-600">
              Drammen Kommune
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className="text-gray-600 hover:text-blue-600">
              Hjem
            </a>
            <a href="/bookings" className="text-gray-600 hover:text-blue-600">
              Mine bookinger
            </a>
            <Button variant="outline" size="sm">
              <User className="w-4 h-4 mr-2" />
              Logg inn
            </Button>
          </nav>
          <Button variant="ghost" size="sm" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default GlobalHeader;
