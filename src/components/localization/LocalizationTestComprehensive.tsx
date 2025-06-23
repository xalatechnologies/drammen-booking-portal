
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useFacilities } from '@/hooks/useFacilities';
import { useTranslation } from '@/i18n/hooks/useTranslation';
import { transformFacilitiesForUI } from '@/utils/facilityTransforms';

export function LocalizationTestComprehensive() {
  const { t } = useTranslation();
  const { data: rawFacilities = [], isLoading } = useFacilities();
  
  const facilities = React.useMemo(() => {
    return transformFacilitiesForUI(rawFacilities);
  }, [rawFacilities]);

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.localization.comprehensiveTest')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('admin.facilities.title')}</h3>
              <p>{t('admin.localization.facilityCount', { count: facilities.length })}</p>
              
              {isLoading ? (
                <p>{t('admin.common.loading')}</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {facilities.slice(0, 4).map((facility) => (
                    <div key={facility.id} className="p-4 border rounded-lg">
                      <h4 className="font-medium">{facility.name}</h4>
                      <p className="text-sm text-gray-600">{facility.address}</p>
                      <p className="text-sm text-blue-600">{facility.type}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold mb-2">{t('admin.localization.testLabels')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline">{t('admin.common.add')}</Button>
                <Button variant="outline">{t('admin.common.edit')}</Button>
                <Button variant="outline">{t('admin.common.delete')}</Button>
                <Button variant="outline">{t('admin.common.save')}</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
