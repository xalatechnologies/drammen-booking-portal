
import React from "react";
import { Button } from "@/components/ui/button";

const GlobalFooter = () => {
  return (
    <footer className="bg-white py-6 px-4 border-t mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center gap-6">
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
              Om oss
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
              Kontakt
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
              Personvern
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-900 font-medium text-sm">
              Tilgjengelighetserklæring
            </Button>
          </div>
          <div className="flex items-center gap-4">
            {/* Social Media Icons */}
            <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-gray-100">
              <span className="sr-only">Facebook</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </Button>
            <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-gray-100">
              <span className="sr-only">Twitter</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Button>
            <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-gray-100">
              <span className="sr-only">Instagram</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
