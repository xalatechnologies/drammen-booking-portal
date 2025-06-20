
import React from "react";
import { Search, Calendar, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const BentoHeroBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-3 overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 border-b border-slate-600/50">
      <div className="content-center py-3 px-4">
        {/* Hero Text Section - Compact */}
        <div className="text-center mb-3 animate-fade-in">
          <h1 className="text-lg lg:text-xl xl:text-2xl font-bold text-white leading-tight tracking-tight mb-1">
            {t('hero.title')}
          </h1>
          <p className="text-xs lg:text-sm xl:text-base text-slate-200 leading-relaxed max-w-4xl mx-auto font-light">
            {t('hero.subtitle')}
          </p>
        </div>

        {/* 3 Step Cards - Very compact with numbering */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 max-w-2xl mx-auto">
          {/* Step 1: Search Card */}
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-2 flex items-center justify-center gap-2 min-h-[35px]">
              <span className="text-xs font-bold text-emerald-700 flex-shrink-0">1.</span>
              <div className="w-4 h-4 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-sm flex-shrink-0">
                <Search className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-emerald-900 group-hover:scale-105 transition-transform duration-300">
                {t('hero.steps.search.title')}
              </span>
            </CardContent>
          </Card>

          {/* Step 2: Select Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-2 flex items-center justify-center gap-2 min-h-[35px]">
              <span className="text-xs font-bold text-blue-700 flex-shrink-0">2.</span>
              <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-sm flex-shrink-0">
                <Calendar className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-blue-900 group-hover:scale-105 transition-transform duration-300">
                {t('hero.steps.select.title')}
              </span>
            </CardContent>
          </Card>

          {/* Step 3: Reserve Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-2 flex items-center justify-center gap-2 min-h-[35px]">
              <span className="text-xs font-bold text-purple-700 flex-shrink-0">3.</span>
              <div className="w-4 h-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-md flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-sm flex-shrink-0">
                <Check className="h-2.5 w-2.5 text-white" />
              </div>
              <span className="text-xs font-semibold text-purple-900 group-hover:scale-105 transition-transform duration-300">
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
