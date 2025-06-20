
import React from "react";
import { Search, Calendar, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const BentoHeroBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-6 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 border-b border-slate-600/50">
      <div className="content-center py-6 px-4">
        {/* Hero Text Section - Compact */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight mb-3">
            {t('hero.title')}
          </h1>
          <p className="text-base lg:text-lg xl:text-xl text-slate-200 leading-relaxed max-w-4xl mx-auto font-light">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* 3 Step Cards - Compact inline design */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Step 1: Search Card */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4 flex items-center gap-3 min-h-[80px]">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-md flex-shrink-0">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-lg font-bold text-emerald-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.search.title')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Select Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-4 flex items-center gap-3 min-h-[80px]">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-md flex-shrink-0">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-lg font-bold text-blue-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.select.title')}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Reserve Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-4 flex items-center gap-3 min-h-[80px]">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-md flex-shrink-0">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <span className="text-lg font-bold text-purple-900 group-hover:scale-105 transition-transform duration-300">
                  {t('hero.steps.reserve.title')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BentoHeroBanner;
