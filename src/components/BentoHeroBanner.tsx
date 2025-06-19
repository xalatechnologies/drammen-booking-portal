
import React from "react";
import { Search, Calendar, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const BentoHeroBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-8 overflow-hidden bg-gradient-to-b from-slate-100/60 via-blue-50/40 to-slate-50/30">
      <div className="content-center py-10">
        {/* Hero Text Section */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg lg:text-xl xl:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Step 1: Search Card */}
          <Card className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group animate-fade-in cursor-pointer transform hover:rotate-1" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-3 h-full flex flex-col justify-center text-center relative overflow-hidden min-h-[140px]">
              {/* Floating particles background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
                <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-teal-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
                <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
              </div>
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Step number */}
              <div className="absolute top-2 left-2 w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                1
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Search className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-emerald-400 rounded-2xl opacity-0 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500 blur-lg"></div>
              </div>
              <div className="space-y-1 relative z-10">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider group-hover:text-emerald-700 transition-colors duration-300">
                  {t('hero.steps.search.title')}
                </div>
                <h3 className="text-base font-bold text-emerald-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.search.subtitle')}
                </h3>
                <p className="text-xs text-emerald-700 leading-relaxed group-hover:text-emerald-800 transition-colors duration-300">
                  {t('hero.steps.search.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Select Card */}
          <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group animate-fade-in cursor-pointer transform hover:-rotate-1" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-3 h-full flex flex-col justify-center text-center relative overflow-hidden min-h-[140px]">
              {/* Floating particles background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
                <div className="absolute bottom-1/4 left-1/4 w-1 h-1 bg-indigo-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
                <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '5.5s' }}></div>
              </div>
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Step number */}
              <div className="absolute top-2 left-2 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                2
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Calendar className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-blue-400 rounded-2xl opacity-0 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500 blur-lg"></div>
              </div>
              <div className="space-y-1 relative z-10">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider group-hover:text-blue-700 transition-colors duration-300">
                  {t('hero.steps.select.title')}
                </div>
                <h3 className="text-base font-bold text-blue-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.select.subtitle')}
                </h3>
                <p className="text-xs text-blue-700 leading-relaxed group-hover:text-blue-800 transition-colors duration-300">
                  {t('hero.steps.select.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Reserve Card */}
          <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group animate-fade-in cursor-pointer transform hover:rotate-1" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-3 h-full flex flex-col justify-center text-center relative overflow-hidden min-h-[140px]">
              {/* Floating particles background */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-purple-300 rounded-full opacity-60 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.2s' }}></div>
                <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-pink-400 rounded-full opacity-40 animate-bounce" style={{ animationDelay: '2s', animationDuration: '4.2s' }}></div>
                <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-50 animate-bounce" style={{ animationDelay: '3s', animationDuration: '5.2s' }}></div>
              </div>
              
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Step number */}
              <div className="absolute top-2 left-2 w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg group-hover:scale-110 transition-transform duration-300">
                3
              </div>
              
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Check className="h-6 w-6 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-purple-400 rounded-2xl opacity-0 group-hover:opacity-40 group-hover:scale-125 transition-all duration-500 blur-lg"></div>
              </div>
              <div className="space-y-1 relative z-10">
                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider group-hover:text-purple-700 transition-colors duration-300">
                  {t('hero.steps.reserve.title')}
                </div>
                <h3 className="text-base font-bold text-purple-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.reserve.subtitle')}
                </h3>
                <p className="text-xs text-purple-700 leading-relaxed group-hover:text-purple-800 transition-colors duration-300">
                  {t('hero.steps.reserve.description')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BentoHeroBanner;
