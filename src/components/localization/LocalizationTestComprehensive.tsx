
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/i18n';
import { useLanguage } from '@/contexts/LanguageContext';

export const LocalizationTestComprehensive: React.FC = () => {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();

  const testTranslations = [
    { key: 'common.loading', section: 'Common' },
    { key: 'common.search', section: 'Common' },
    { key: 'common.cancel', section: 'Common' },
    { key: 'facility.booking.title', section: 'Facility' },
    { key: 'facility.details.capacity', section: 'Facility' },
    { key: 'booking.status.pending', section: 'Booking' },
    { key: 'booking.type.oneTime', section: 'Booking' },
    { key: 'navigation.home', section: 'Navigation' },
    { key: 'navigation.facilities', section: 'Navigation' },
    { key: 'user.profile.title', section: 'User' },
    { key: 'admin.dashboard.title', section: 'Admin' },
  ];

  // Group translations by section
  const groupedTranslations = testTranslations.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = [];
    }
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof testTranslations>);

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Comprehensive Localization Test</h1>
        <div className="flex gap-2">
          <Badge 
            variant={language === 'NO' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setLanguage('NO')}
          >
            Norwegian (NO)
          </Badge>
          <Badge 
            variant={language === 'EN' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => setLanguage('EN')}
          >
            English (EN)
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(groupedTranslations).map(([section, translations]) => (
          <Card key={section}>
            <CardHeader>
              <CardTitle className="text-lg">{section} Translations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {translations.map((item) => {
                const translation = t(item.key);
                const isTranslated = translation !== item.key;
                
                return (
                  <div key={item.key} className="space-y-1">
                    <div className="text-sm font-mono text-gray-600">
                      {item.key}
                    </div>
                    <div className={`text-sm p-2 rounded ${
                      isTranslated 
                        ? 'bg-green-50 text-green-800 border border-green-200' 
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}>
                      {translation}
                    </div>
                    <Badge size="sm" variant={isTranslated ? 'default' : 'destructive'}>
                      {isTranslated ? 'Translated' : 'Missing'}
                    </Badge>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Translation Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {testTranslations.length}
              </div>
              <div className="text-sm text-gray-600">Total Keys</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {testTranslations.filter(item => t(item.key) !== item.key).length}
              </div>
              <div className="text-sm text-gray-600">Translated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {testTranslations.filter(item => t(item.key) === item.key).length}
              </div>
              <div className="text-sm text-gray-600">Missing</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((testTranslations.filter(item => t(item.key) !== item.key).length / testTranslations.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Coverage</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
