
import React from 'react';
import { TranslationMigrationTool } from '@/components/translation/TranslationMigrationTool';
import { TranslatedFacilityGrid } from '@/components/facility/TranslatedFacilityGrid';
import LanguageToggle from '@/components/header/LanguageToggle';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/hooks/useTranslation';

export default function TranslationTestPage() {
  const { language, toggleLanguage } = useLanguage();
  const { t, isInitialized } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Translation System Test</h1>
        <LanguageToggle language={language} toggleLanguage={toggleLanguage} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <TranslationMigrationTool />
          
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Translation Service Status</h3>
            <p className="text-sm">
              Status: {isInitialized ? 'Initialized' : 'Loading...'}
            </p>
            <p className="text-sm">Language: {language}</p>
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-semibold mb-4">Database-Driven Facilities</h2>
          <TranslatedFacilityGrid />
        </div>
      </div>
    </div>
  );
}
