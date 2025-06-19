
import React from "react";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n";

const GlobalFooter = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleQuickLinkClick = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-gray-900 text-white border-t mt-auto w-full">
      <div className="content-center py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold mb-4">Drammen Kommune</h3>
            <p className="text-gray-300 mb-4 max-w-md">
              {t('footer.description')}
            </p>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-gray-800 hover:bg-gray-700 text-white">
                <span className="sr-only">Facebook</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </Button>
              <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-gray-800 hover:bg-gray-700 text-white">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                </svg>
              </Button>
              <Button variant="ghost" className="rounded-full p-2 h-10 w-10 bg-gray-800 hover:bg-gray-700 text-white">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <div className="space-y-2">
              <button 
                onClick={() => handleQuickLinkClick('/bookings')}
                className="block text-gray-300 hover:text-white font-normal text-sm text-left transition-colors"
              >
                {t('footer.myReservations')}
              </button>
              <button 
                onClick={() => handleQuickLinkClick('/')}
                className="block text-gray-300 hover:text-white font-normal text-sm text-left transition-colors"
              >
                {t('footer.searchFacilities')}
              </button>
              <button 
                onClick={() => handleQuickLinkClick('/priser')}
                className="block text-gray-300 hover:text-white font-normal text-sm text-left transition-colors"
              >
                {t('footer.pricesTerms')}
              </button>
              <button 
                onClick={() => handleQuickLinkClick('/hjelp')}
                className="block text-gray-300 hover:text-white font-normal text-sm text-left transition-colors"
              >
                {t('footer.helpSupport')}
              </button>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contactUs')}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">32 04 70 00</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300 text-sm">post@drammen.kommune.no</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                <div className="text-gray-300 text-sm">
                  <div>Engene 1</div>
                  <div>3008 Drammen</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <button 
                onClick={() => handleQuickLinkClick('/om-oss')}
                className="text-gray-400 hover:text-white font-normal text-sm transition-colors"
              >
                {t('footer.aboutUs')}
              </button>
              <button 
                onClick={() => handleQuickLinkClick('/personvern')}
                className="text-gray-400 hover:text-white font-normal text-sm transition-colors"
              >
                {t('footer.privacy')}
              </button>
              <button 
                onClick={() => handleQuickLinkClick('/tilgjengelighet')}
                className="text-gray-400 hover:text-white font-normal text-sm transition-colors"
              >
                {t('footer.accessibility')}
              </button>
              <button 
                onClick={() => handleQuickLinkClick('/cookies')}
                className="text-gray-400 hover:text-white font-normal text-sm transition-colors"
              >
                {t('footer.cookies')}
              </button>
            </div>
            <div className="text-gray-500 text-sm">
              {t('footer.copyright')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default GlobalFooter;
