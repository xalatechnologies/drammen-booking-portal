
import React from "react";
import { Search, Calendar, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const BentoHeroBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-4 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 border-b border-slate-600/50">
      <div className="content-center py-4 px-4">
        {/* Hero Text Section - Compact */}
        <div className="text-center mb-4 animate-fade-in">
          <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-white leading-tight tracking-tight mb-2">
            {t('hero.title')}
          </h1>
          <p className="text-sm lg:text-base xl:text-lg text-slate-200 leading-relaxed max-w-4xl mx-auto font-light">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* 3 Step Cards - Larger and more focused */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {/* Step 1: Search Card */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-4 flex items-center justify-center gap-3 min-h-[50px]">
              <span className="text-sm font-bold text-emerald-700 flex-shrink-0">1.</span>
              <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-sm flex-shrink-0">
                <Search className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-emerald-900 group-hover:scale-105 transition-transform duration-300">
                {t('hero.steps.search.title')}
              </span>
            </CardContent>
          </Card>

          {/* Step 2: Select Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-4 flex items-center justify-center gap-3 min-h-[50px]">
              <span className="text-sm font-bold text-blue-700 flex-shrink-0">2.</span>
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-sm flex-shrink-0">
                <Calendar className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-900 group-hover:scale-105 transition-transform duration-300">
                {t('hero.steps.select.title')}
              </span>
            </CardContent>
          </Card>

          {/* Step 3: Reserve Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-4 flex items-center justify-center gap-3 min-h-[50px]">
              <span className="text-sm font-bold text-purple-700 flex-shrink-0">3.</span>
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-sm flex-shrink-0">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold text-purple-900 group-hover:scale-105 transition-transform duration-300">
                {t('hero.steps.reserve.title')}
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BentoHeroBanner;
