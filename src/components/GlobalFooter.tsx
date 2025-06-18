
import React from "react";

const GlobalFooter = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Drammen Kommune</h3>
            <p className="text-gray-300">
              Moderne bookingsystem for kommunale lokaler og fasiliteter.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <div className="text-gray-300 space-y-2">
              <p>Telefon: 32 04 70 00</p>
              <p>E-post: post@drammen.kommune.no</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Lenker</h4>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 hover:text-white">
                Personvern
              </a>
              <a href="#" className="block text-gray-300 hover:text-white">
                Tilgjengelighet
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400">
          <p>&copy; 2024 Drammen Kommune. Alle rettigheter reservert.</p>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
