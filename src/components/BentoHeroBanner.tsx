
import React from "react";
import { Search, Calendar, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const BentoHeroBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-8 overflow-hidden">
      <div className="content-center py-12">
        {/* Hero Text Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight tracking-tight mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg lg:text-xl xl:text-2xl text-gray-600 leading-relaxed max-w-3xl mx-auto font-light">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1: Search Card */}
          <Card className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 group animate-fade-in cursor-pointer transform hover:rotate-1" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8 h-full flex flex-col justify-center text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Step number */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Search className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-emerald-400 rounded-3xl opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 blur-sm"></div>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider group-hover:text-emerald-700 transition-colors duration-300">
                  {t('hero.steps.search.title')}
                </div>
                <h3 className="text-xl font-bold text-emerald-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.search.subtitle')}
                </h3>
                <p className="text-sm text-emerald-700 leading-relaxed group-hover:text-emerald-800 transition-colors duration-300">
                  {t('hero.steps.search.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Select Card */}
          <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 group animate-fade-in cursor-pointer transform hover:-rotate-1" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-8 h-full flex flex-col justify-center text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Step number */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Calendar className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-blue-400 rounded-3xl opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 blur-sm"></div>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="text-sm font-bold text-blue-600 uppercase tracking-wider group-hover:text-blue-700 transition-colors duration-300">
                  {t('hero.steps.select.title')}
                </div>
                <h3 className="text-xl font-bold text-blue-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.select.subtitle')}
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed group-hover:text-blue-800 transition-colors duration-300">
                  {t('hero.steps.select.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Reserve Card */}
          <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 group animate-fade-in cursor-pointer transform hover:rotate-1" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-8 h-full flex flex-col justify-center text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              {/* Step number */}
              <div className="absolute top-4 left-4 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </div>
              
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Check className="h-10 w-10 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-purple-400 rounded-3xl opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 blur-sm"></div>
              </div>
              <div className="space-y-3 relative z-10">
                <div className="text-sm font-bold text-purple-600 uppercase tracking-wider group-hover:text-purple-700 transition-colors duration-300">
                  {t('hero.steps.reserve.title')}
                </div>
                <h3 className="text-xl font-bold text-purple-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.reserve.subtitle')}
                </h3>
                <p className="text-sm text-purple-700 leading-relaxed group-hover:text-purple-800 transition-colors duration-300">
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
