
import { ServiceCategory } from '@/types/additionalServices';

export interface ServiceCategoryInfo {
  id: ServiceCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  items: ServiceItem[];
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  unit: string;
}

export const serviceCategories: ServiceCategoryInfo[] = [
  {
    id: 'cleaning',
    name: 'Rengjøring',
    description: 'Renhold og vedlikehold',
    icon: 'Sparkles',
    color: 'blue',
    items: [
      {
        id: 'basic-cleaning',
        name: 'Grunnrengjøring',
        description: 'Standard rengjøring etter arrangement',
        basePrice: 500,
        unit: 'per gang'
      },
      {
        id: 'deep-cleaning',
        name: 'Hovedrengjøring',
        description: 'Grundig rengjøring og desinfeksjon',
        basePrice: 1200,
        unit: 'per gang'
      }
    ]
  },
  {
    id: 'equipment',
    name: 'Utstyr',
    description: 'Sports- og aktivitetsutstyr',
    icon: 'Package',
    color: 'green',
    items: [
      {
        id: 'av-equipment',
        name: 'AV-utstyr',
        description: 'Projektor, mikrofon og lydanlegg',
        basePrice: 800,
        unit: 'per dag'
      },
      {
        id: 'sports-equipment',
        name: 'Sportsutstyr',
        description: 'Baller, matter og treningsutstyr',
        basePrice: 300,
        unit: 'per dag'
      }
    ]
  },
  {
    id: 'catering',
    name: 'Servering',
    description: 'Mat og drikke',
    icon: 'Coffee',
    color: 'orange',
    items: [
      {
        id: 'coffee-service',
        name: 'Kaffeservering',
        description: 'Kaffe, te og småkaker',
        basePrice: 150,
        unit: 'per person'
      }
    ]
  },
  {
    id: 'personnel',
    name: 'Personell',
    description: 'Vaktmester og assistanse',
    icon: 'Users',
    color: 'purple',
    items: [
      {
        id: 'janitor-service',
        name: 'Vaktmestertjeneste',
        description: 'Tilstedeværelse av vaktmester',
        basePrice: 400,
        unit: 'per time'
      }
    ]
  },
  {
    id: 'parking',
    name: 'Parkering',
    description: 'Ekstra parkeringsplasser',
    icon: 'Car',
    color: 'gray',
    items: [
      {
        id: 'extra-parking',
        name: 'Ekstra parkering',
        description: 'Reserverte parkeringsplasser',
        basePrice: 100,
        unit: 'per plass per dag'
      }
    ]
  },
  {
    id: 'security',
    name: 'Sikkerhet',
    description: 'Vakt og sikkerhetstjenester',
    icon: 'Shield',
    color: 'red',
    items: [
      {
        id: 'security-guard',
        name: 'Vakthold',
        description: 'Profesjonell vakt under arrangement',
        basePrice: 500,
        unit: 'per time'
      }
    ]
  },
  {
    id: 'technical',
    name: 'Teknisk',
    description: 'AV-utstyr og teknisk støtte',
    icon: 'Monitor',
    color: 'indigo',
    items: [
      {
        id: 'tech-support',
        name: 'Teknisk støtte',
        description: 'Tekniker tilgjengelig under arrangement',
        basePrice: 600,
        unit: 'per time'
      }
    ]
  },
  {
    id: 'decoration',
    name: 'Dekorasjon',
    description: 'Event-dekorasjon',
    icon: 'Palette',
    color: 'pink',
    items: [
      {
        id: 'basic-decoration',
        name: 'Grunndekorasjon',
        description: 'Enkel borddekorasjon og blomster',
        basePrice: 800,
        unit: 'per arrangement'
      }
    ]
  },
  {
    id: 'transport',
    name: 'Transport',
    description: 'Transport og logistikk',
    icon: 'Truck',
    color: 'yellow',
    items: [
      {
        id: 'equipment-transport',
        name: 'Utstyrstransport',
        description: 'Transport av utstyr til og fra lokalet',
        basePrice: 400,
        unit: 'per levering'
      }
    ]
  },
  {
    id: 'wellness',
    name: 'Velvære',
    description: 'Helse og velvære',
    icon: 'Heart',
    color: 'emerald',
    items: [
      {
        id: 'wellness-package',
        name: 'Velvære-pakke',
        description: 'Yoga-matter og avslapningsutstyr',
        basePrice: 200,
        unit: 'per dag'
      }
    ]
  }
];
