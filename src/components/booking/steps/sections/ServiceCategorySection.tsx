
import React from "react";
import { ServiceCategoryGrid } from "../../services/ServiceCategoryGrid";
import { ServiceCategory } from "@/types/additionalServices";
import { useModelTranslation } from "@/hooks/useModelTranslation";

interface ServiceCategorySectionProps {
  selectedCategory?: ServiceCategory;
  onCategorySelect: (category: ServiceCategory) => void;
}

export function ServiceCategorySection({ selectedCategory, onCategorySelect }: ServiceCategorySectionProps) {
  const { getSectionTitle } = useModelTranslation();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        {getSectionTitle('service', 'categories')}
      </h3>
      <ServiceCategoryGrid
        onCategorySelect={onCategorySelect}
        selectedCategory={selectedCategory}
        showPopularOnly={true}
      />
    </div>
  );
}
