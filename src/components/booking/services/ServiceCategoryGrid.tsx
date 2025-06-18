
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceCategory } from '@/types/additionalServices';
import { serviceCategoryConfigs, ServiceCategoryConfig } from '@/data/additionalServices/serviceCategories';
import { useTranslation } from '@/i18n';
import * as Icons from 'lucide-react';

interface ServiceCategoryGridProps {
  onCategorySelect: (category: ServiceCategory) => void;
  selectedCategory?: ServiceCategory;
  showPopularOnly?: boolean;
}

export function ServiceCategoryGrid({ 
  onCategorySelect, 
  selectedCategory,
  showPopularOnly = false 
}: ServiceCategoryGridProps) {
  const { t } = useTranslation();

  const categories = showPopularOnly 
    ? serviceCategoryConfigs.filter(c => c.isPopular)
    : serviceCategoryConfigs;

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Package;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category: ServiceCategoryConfig) => {
        const IconComponent = getIcon(category.icon);
        const isSelected = selectedCategory === category.id;
        
        return (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              isSelected 
                ? 'ring-2 ring-blue-500 bg-blue-50' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${category.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {category.name}
                    </h3>
                    {category.isPopular && (
                      <Badge variant="secondary" className="text-xs">
                        {t('common.labels.popular', {}, 'Populær')}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600">
                    {category.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
