
import React from "react";
import { Search, Calendar, Check, Clock, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/i18n/hooks/useTranslation";

const BentoHeroBanner = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full mb-8">
      <div className="content-center py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-auto lg:h-[500px]">
          {/* Main Hero Card - Spans 2 columns on large screens */}
          <Card className="md:col-span-2 lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 border-none shadow-2xl overflow-hidden relative group hover:shadow-3xl transition-all duration-500 animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/10 to-transparent"></div>
            <CardContent className="p-8 h-full flex flex-col justify-center relative z-10">
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                  {t('hero.title')}
                </h1>
                <p className="text-xl text-gray-200 leading-relaxed max-w-lg">
                  {t('hero.subtitle')}
                </p>
                <Button 
                  size="lg" 
                  className="bg-white text-slate-900 hover:bg-gray-100 text-lg px-8 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  {t('hero.cta')}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Step 1: Search Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardContent className="p-6 h-full flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                <Search className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                {t('hero.steps.search.title')}
              </h3>
              <p className="text-sm font-semibold text-blue-700 mb-2">
                {t('hero.steps.search.subtitle')}
              </p>
              <p className="text-xs text-blue-600">
                {t('hero.steps.search.description')}
              </p>
            </CardContent>
          </Card>

          {/* Step 2: Select Card */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardContent className="p-6 h-full flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition-colors duration-300">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-green-900 mb-2">
                {t('hero.steps.select.title')}
              </h3>
              <p className="text-sm font-semibold text-green-700 mb-2">
                {t('hero.steps.select.subtitle')}
              </p>
              <p className="text-xs text-green-600">
                {t('hero.steps.select.description')}
              </p>
            </CardContent>
          </Card>

          {/* Step 3: Reserve Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-6 h-full flex flex-col justify-center text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition-colors duration-300">
                <Check className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-purple-900 mb-2">
                {t('hero.steps.reserve.title')}
              </h3>
              <p className="text-sm font-semibold text-purple-700 mb-2">
                {t('hero.steps.reserve.subtitle')}
              </p>
              <p className="text-xs text-purple-600">
                {t('hero.steps.reserve.description')}
              </p>
            </CardContent>
          </Card>

          {/* Feature Card 1: Instant Confirmation */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-6 h-full flex flex-col justify-center text-center">
              <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-600 transition-colors duration-300">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-sm font-bold text-orange-900 mb-1">
                {t('hero.features.instant')}
              </h4>
            </CardContent>
          </Card>

          {/* Feature Card 2: 24/7 Availability */}
          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardContent className="p-6 h-full flex flex-col justify-center text-center">
              <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-teal-600 transition-colors duration-300">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h4 className="text-sm font-bold text-teal-900 mb-1">
                {t('hero.features.available')}
              </h4>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BentoHeroBanner;
