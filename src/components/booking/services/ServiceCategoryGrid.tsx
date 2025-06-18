
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ServiceCategory } from '@/types/additionalServices';
import { serviceCategories, ServiceCategoryInfo } from '@/data/additionalServices/serviceCategories';
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
    ? serviceCategories.filter(c => c.color === 'blue' || c.color === 'green') // Using color as proxy for popular
    : serviceCategories;

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName];
    return IconComponent || Icons.Package;
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 text-blue-700',
      green: 'bg-green-100 text-green-700',
      orange: 'bg-orange-100 text-orange-700',
      purple: 'bg-purple-100 text-purple-700',
      gray: 'bg-gray-100 text-gray-700',
      red: 'bg-red-100 text-red-700',
      indigo: 'bg-indigo-100 text-indigo-700',
      pink: 'bg-pink-100 text-pink-700',
      yellow: 'bg-yellow-100 text-yellow-700',
      emerald: 'bg-emerald-100 text-emerald-700'
    };
    return colorMap[color] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category: ServiceCategoryInfo) => {
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
                <div className={`p-2 rounded-lg ${getColorClasses(category.color)}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">
                      {category.name}
                    </h3>
                    {(category.color === 'blue' || category.color === 'green') && (
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
