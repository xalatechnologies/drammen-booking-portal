
import { ServiceBundle } from '@/types/additionalServices';

export const mockServiceBundles: ServiceBundle[] = [
  {
    id: 'meeting-package',
    name: 'Møtepakke',
    description: 'Komplett pakke for møter og konferanser med AV-utstyr, kaffe og rengjøring',
    serviceIds: ['equipment-av-basic', 'catering-coffee', 'cleaning-standard'],
    bundleDiscount: 15,
    isPopular: true,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31')
  },
  {
    id: 'event-package',
    name: 'Arrangement pakke',
    description: 'Alt du trenger for større arrangementer med sikkerhet, teknisk support og catering',
    serviceIds: ['personnel-security', 'personnel-technician', 'catering-lunch', 'cleaning-deep'],
    bundleDiscount: 20,
    isPopular: true,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31')
  },
  {
    id: 'sports-package',
    name: 'Idrettspakke',
    description: 'Sportsutstyr og grunnleggende tjenester for idrettsarrangementer',
    serviceIds: ['equipment-sports-basic', 'cleaning-standard', 'parking-reserved'],
    bundleDiscount: 10,
    isPopular: true,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31')
  },
  {
    id: 'corporate-package',
    name: 'Bedriftspakke',
    description: 'Premium tjenester for bedriftsarrangementer',
    serviceIds: ['equipment-av-basic', 'personnel-technician', 'catering-lunch', 'parking-reserved', 'cleaning-deep'],
    bundleDiscount: 18,
    isPopular: false,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31')
  }
];

export const getPopularBundles = (): ServiceBundle[] => {
  return mockServiceBundles.filter(bundle => bundle.isPopular);
};

export const getBundleById = (bundleId: string): ServiceBundle | undefined => {
  return mockServiceBundles.find(bundle => bundle.id === bundleId);
};

export const getBundlesContainingService = (serviceId: string): ServiceBundle[] => {
  return mockServiceBundles.filter(bundle => 
    bundle.serviceIds.includes(serviceId)
  );
};
