import React from 'react';
import { useJsonTranslation } from '@/hooks/useJsonTranslation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

/**
 * Translation Demo Component
 * 
 * This component demonstrates the usage of the new JSON-based translation system.
 * It shows translations for various keys in the admin namespace and allows switching languages.
 */
const TranslationDemo: React.FC = () => {
  const { tSync } = useJsonTranslation();
  const { language, toggleLanguage } = useLanguage();

  // Example translation keys to demonstrate
  const translationKeys = [
    'admin.common.loading',
    'admin.sidebar.overview',
    'admin.sidebar.facilities',
    'admin.facilities.management',
    'admin.facilities.views.table',
    'admin.facilities.filters.type',
    'admin.facilities.search.placeholder',
    'admin.facilities.types.fotballhall'
  ];

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{tSync('admin.sidebar.overview', 'Translation Demo')}</span>
          <Button onClick={toggleLanguage} variant="outline">
            {language === 'NO' ? 'Switch to English' : 'Bytt til Norsk'}
          </Button>
        </CardTitle>
        <p className="text-sm text-gray-500">
          Current language: {language === 'NO' ? 'Norwegian' : 'English'}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Translation Examples:</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {translationKeys.map(key => (
              <div key={key} className="border rounded p-3">
                <div className="text-sm font-medium text-gray-500">{key}</div>
                <div className="mt-1 font-medium">{tSync(key, key)}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h4 className="font-medium mb-2">How to use the new translation system:</h4>
            <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
              {`// Import the hook
import { useJsonTranslation } from '@/hooks/useJsonTranslation';

// Use in your component
const { tSync } = useJsonTranslation();

// Get translations
const title = tSync('admin.facilities.management', 'Facilities Management');`}
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranslationDemo;
