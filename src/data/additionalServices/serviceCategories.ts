
import { ServiceCategory } from '@/types/additionalServices';

export interface ServiceCategoryConfig {
  id: ServiceCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  isPopular: boolean;
  sortOrder: number;
}

export const serviceCategoryConfigs: ServiceCategoryConfig[] = [
  {
    id: 'cleaning',
    name: 'Rengjøring',
    description: 'Standard og dyprengjøring etter arrangementet',
    icon: 'Sparkles',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    isPopular: true,
    sortOrder: 1
  },
  {
    id: 'equipment',
    name: 'Utstyr',
    description: 'AV-utstyr, sportsutstyr og møbler',
    icon: 'Package',
    color: 'bg-green-50 text-green-700 border-green-200',
    isPopular: true,
    sortOrder: 2
  },
  {
    id: 'catering',
    name: 'Servering',
    description: 'Kaffe, lunsj og fullstendig catering',
    icon: 'Coffee',
    color: 'bg-orange-50 text-orange-700 border-orange-200',
    isPopular: true,
    sortOrder: 3
  },
  {
    id: 'personnel',
    name: 'Personell',
    description: 'Sikkerhet, teknisk support og arrangementsassistanse',
    icon: 'Users',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    isPopular: false,
    sortOrder: 4
  },
  {
    id: 'parking',
    name: 'Parkering',
    description: 'Reserverte plasser og parkeringsservice',
    icon: 'Car',
    color: 'bg-gray-50 text-gray-700 border-gray-200',
    isPopular: false,
    sortOrder: 5
  },
  {
    id: 'security',
    name: 'Sikkerhet',
    description: 'Tilgangskontroll og sikkerhetstjenester',
    icon: 'Shield',
    color: 'bg-red-50 text-red-700 border-red-200',
    isPopular: false,
    sortOrder: 6
  },
  {
    id: 'technical',
    name: 'Teknisk',
    description: 'Lyd, lys og video utstyr med support',
    icon: 'Settings',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    isPopular: false,
    sortOrder: 7
  },
  {
    id: 'decoration',
    name: 'Dekorasjon',
    description: 'Blomster, belysning og arrangement dekorasjon',
    icon: 'Flower',
    color: 'bg-pink-50 text-pink-700 border-pink-200',
    isPopular: false,
    sortOrder: 8
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Busstransport og kjøretjenester',
    icon: 'Truck',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    isPopular: false,
    sortOrder: 9
  },
  {
    id: 'wellness',
    name: 'Helse',
    description: 'Førstehjelpstjenester og helsetjenester',
    icon: 'Heart',
    color: 'bg-teal-50 text-teal-700 border-teal-200',
    isPopular: false,
    sortOrder: 10
  }
];

export const getPopularCategories = (): ServiceCategoryConfig[] => {
  return serviceCategoryConfigs
    .filter(config => config.isPopular)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getAllCategories = (): ServiceCategoryConfig[] => {
  return serviceCategoryConfigs.sort((a, b) => a.sortOrder - b.sortOrder);
};

export const getCategoryConfig = (category: ServiceCategory): ServiceCategoryConfig | undefined => {
  return serviceCategoryConfigs.find(config => config.id === category);
};
