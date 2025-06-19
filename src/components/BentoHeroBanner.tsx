
import React from "react";
import { Search, Calendar, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const BentoHeroBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-8">
      <div className="content-center py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[600px]">
          {/* Main Hero Card - Spans 2 columns and 2 rows on large screens */}
          <Card className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 border-none shadow-2xl overflow-hidden relative group hover:shadow-3xl transition-all duration-700 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-transparent opacity-80"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_70%)]"></div>
            <CardContent className="p-12 h-full flex flex-col justify-center relative z-10">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight">
                    {t('hero.title')}
                  </h1>
                  <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed max-w-2xl font-light">
                    {t('hero.subtitle')}
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-gray-100 text-xl px-12 py-8 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <Zap className="h-6 w-6 mr-3" />
                  {t('hero.cta')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Search Card */}
          <Card className="bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100 border-emerald-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-8 h-full flex flex-col justify-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Search className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <div className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
                  {t('hero.steps.search.title')}
                </div>
                <h3 className="text-xl font-bold text-emerald-900">
                  {t('hero.steps.search.subtitle')}
                </h3>
                <p className="text-sm text-emerald-700 leading-relaxed">
                  {t('hero.steps.search.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Select Card */}
          <Card className="bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-8 h-full flex flex-col justify-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <div className="text-sm font-bold text-blue-600 uppercase tracking-wider">
                  {t('hero.steps.select.title')}
                </div>
                <h3 className="text-xl font-bold text-blue-900">
                  {t('hero.steps.select.subtitle')}
                </h3>
                <p className="text-sm text-blue-700 leading-relaxed">
                  {t('hero.steps.select.description')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Reserve Card */}
          <Card className="bg-gradient-to-br from-purple-50 via-purple-100 to-pink-100 border-purple-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 group animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-8 h-full flex flex-col justify-center text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 shadow-lg">
                <Check className="h-10 w-10 text-white" />
              </div>
              <div className="space-y-3">
                <div className="text-sm font-bold text-purple-600 uppercase tracking-wider">
                  {t('hero.steps.reserve.title')}
                </div>
                <h3 className="text-xl font-bold text-purple-900">
                  {t('hero.steps.reserve.subtitle')}
                </h3>
                <p className="text-sm text-purple-700 leading-relaxed">
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
