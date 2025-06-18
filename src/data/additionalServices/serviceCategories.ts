
import { ServiceCategory } from '@/types/additionalServices';

export interface ServiceCategoryInfo {
  id: ServiceCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
}

export const serviceCategories: ServiceCategoryInfo[] = [
  {
    id: 'cleaning',
    name: 'Rengjøring',
    description: 'Renhold og vedlikehold',
    icon: 'Sparkles',
    color: 'blue'
  },
  {
    id: 'equipment',
    name: 'Utstyr',
    description: 'Sports- og aktivitetsutstyr',
    icon: 'Package',
    color: 'green'
  },
  {
    id: 'catering',
    name: 'Servering',
    description: 'Mat og drikke',
    icon: 'Coffee',
    color: 'orange'
  },
  {
    id: 'personnel',
    name: 'Personell',
    description: 'Vaktmester og assistanse',
    icon: 'Users',
    color: 'purple'
  },
  {
    id: 'parking',
    name: 'Parkering',
    description: 'Ekstra parkeringsplasser',
    icon: 'Car',
    color: 'gray'
  },
  {
    id: 'security',
    name: 'Sikkerhet',
    description: 'Vakt og sikkerhetstjenester',
    icon: 'Shield',
    color: 'red'
  },
  {
    id: 'technical',
    name: 'Teknisk',
    description: 'AV-utstyr og teknisk støtte',
    icon: 'Monitor',
    color: 'indigo'
  },
  {
    id: 'decoration',
    name: 'Dekorasjon',
    description: 'Event-dekorasjon',
    icon: 'Palette',
    color: 'pink'
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Transport og logistikk',
    icon: 'Truck',
    color: 'yellow'
  },
  {
    id: 'wellness',
    name: 'Velvære',
    description: 'Helse og velvære',
    icon: 'Heart',
    color: 'emerald'
  }
];
