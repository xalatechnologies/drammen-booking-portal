
import React from "react";
import { Search, Calendar, Check, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const BentoHeroBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-8 overflow-hidden">
      <div className="content-center py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-auto lg:h-[500px]">
          {/* Main Hero Card - Spans 2 columns on large screens */}
          <Card className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border-none shadow-2xl overflow-hidden relative group hover:shadow-3xl transition-all duration-700 animate-fade-in cursor-pointer">
            {/* Animated background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)] group-hover:bg-[radial-gradient(circle_at_30%_40%,rgba(255,255,255,0.15),transparent_70%)] transition-all duration-1000"></div>
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
              <div className="absolute top-3/4 left-1/3 w-1 h-1 bg-blue-300 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <CardContent className="p-12 h-full flex flex-col justify-center relative z-10">
              <div className="space-y-8">
                <div className="space-y-6">
                  <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight tracking-tight transform group-hover:scale-105 transition-transform duration-500">
                    {t('hero.title')}
                  </h1>
                  <p className="text-lg lg:text-xl xl:text-2xl text-gray-200 leading-relaxed max-w-xl font-light transform group-hover:translate-x-2 transition-transform duration-500">
                    {t('hero.subtitle')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Search Card */}
          <Card className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 group animate-fade-in cursor-pointer transform hover:rotate-1" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 h-full flex flex-col justify-center text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Search className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-emerald-400 rounded-2xl opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 blur-sm"></div>
              </div>
              <div className="space-y-2 relative z-10">
                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider group-hover:text-emerald-700 transition-colors duration-300">
                  {t('hero.steps.search.title')}
                </div>
                <h3 className="text-lg font-bold text-emerald-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.search.subtitle')}
                </h3>
                <p className="text-xs text-emerald-700 leading-relaxed group-hover:text-emerald-800 transition-colors duration-300">
                  {t('hero.steps.search.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Select Card */}
          <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 group animate-fade-in cursor-pointer transform hover:-rotate-1" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6 h-full flex flex-col justify-center text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Calendar className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-blue-400 rounded-2xl opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 blur-sm"></div>
              </div>
              <div className="space-y-2 relative z-10">
                <div className="text-xs font-bold text-blue-600 uppercase tracking-wider group-hover:text-blue-700 transition-colors duration-300">
                  {t('hero.steps.select.title')}
                </div>
                <h3 className="text-lg font-bold text-blue-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.select.subtitle')}
                </h3>
                <p className="text-xs text-blue-700 leading-relaxed group-hover:text-blue-800 transition-colors duration-300">
                  {t('hero.steps.select.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Reserve Card */}
          <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 group animate-fade-in cursor-pointer transform hover:rotate-1" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-6 h-full flex flex-col justify-center text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Check className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-purple-400 rounded-2xl opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 blur-sm"></div>
              </div>
              <div className="space-y-2 relative z-10">
                <div className="text-xs font-bold text-purple-600 uppercase tracking-wider group-hover:text-purple-700 transition-colors duration-300">
                  {t('hero.steps.reserve.title')}
                </div>
                <h3 className="text-lg font-bold text-purple-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.reserve.subtitle')}
                </h3>
                <p className="text-xs text-purple-700 leading-relaxed group-hover:text-purple-800 transition-colors duration-300">
                  {t('hero.steps.reserve.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card className="bg-gradient-to-br from-orange-50 via-orange-100 to-red-100 border-orange-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-3 group animate-fade-in cursor-pointer transform hover:-rotate-1" style={{ animationDelay: '0.8s' }}>
            <CardContent className="p-6 h-full flex flex-col justify-center text-center relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_50%)] group-hover:opacity-20 transition-opacity duration-500"></div>
              
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg relative z-10">
                <Zap className="h-8 w-8 text-white group-hover:scale-110 transition-transform duration-300" />
                {/* Icon glow effect */}
                <div className="absolute inset-0 bg-orange-400 rounded-2xl opacity-0 group-hover:opacity-30 group-hover:scale-125 transition-all duration-500 blur-sm"></div>
              </div>
              <div className="space-y-2 relative z-10">
                <div className="text-xs font-bold text-orange-600 uppercase tracking-wider group-hover:text-orange-700 transition-colors duration-300">
                  INSTANT
                </div>
                <h3 className="text-lg font-bold text-orange-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.features.instant')}
                </h3>
                <p className="text-xs text-orange-700 leading-relaxed group-hover:text-orange-800 transition-colors duration-300">
                  {t('hero.features.available')}
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
