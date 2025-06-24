
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from '@/hooks/useTranslation';
import { useFacilities } from '@/hooks/useFacilities';

export const LocalizationTestComprehensive: React.FC = () => {
  const { tSync, language } = useTranslation();
  const { data: allFacilities, isLoading } = useFacilities();

  const testFacilities = (allFacilities || []).slice(0, 3);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {tSync('localization.test.title', 'Localization Test')}
          </CardTitle>
          <Badge variant="outline">
            {tSync('localization.currentLanguage', 'Current Language')}: {language}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">
              {tSync('localization.test.commonPhrases', 'Common Phrases')}
            </h3>
            <ul className="space-y-1 text-sm">
              <li>{tSync('common.loading', 'Loading...')}</li>
              <li>{tSync('common.save', 'Save')}</li>
              <li>{tSync('common.cancel', 'Cancel')}</li>
              <li>{tSync('common.search', 'Search...')}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {tSync('localization.test.facilityData', 'Facility Data')}
            </h3>
            {isLoading ? (
              <p>{tSync('common.loading', 'Loading...')}</p>
            ) : (
              <div className="space-y-2">
                {testFacilities.map((facility) => (
                  <div key={facility.id} className="p-2 border rounded">
                    <div className="font-medium">{facility.name}</div>
                    <div className="text-sm text-gray-600">
                      {tSync('facility.capacity', 'Capacity')}: {facility.capacity}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tSync('facility.area', 'Area')}: {facility.area}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-2">
              {tSync('localization.test.navigation', 'Navigation')}
            </h3>
            <ul className="space-y-1 text-sm">
              <li>{tSync('navigation.home', 'Home')}</li>
              <li>{tSync('navigation.facilities', 'Facilities')}</li>
              <li>{tSync('navigation.bookings', 'Bookings')}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
