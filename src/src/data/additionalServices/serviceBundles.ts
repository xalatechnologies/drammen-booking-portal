
import { ServiceBundle } from '@/types/additionalServices';

export const mockServiceBundles: ServiceBundle[] = [
  {
    id: 'bundle-basic-event',
    name: 'Grunnpakke arrangement',
    description: 'Alt du trenger for et enkelt arrangement',
    serviceIds: ['service-1', 'service-2'],
    bundleDiscount: 10,
    isPopular: true,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31')
  },
  {
    id: 'bundle-sports-event',
    name: 'Sportspakke',
    description: 'Komplett pakke for sportsarrangementer',
    serviceIds: ['service-2', 'service-4', 'service-5'],
    bundleDiscount: 15,
    isPopular: true,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31')
  },
  {
    id: 'bundle-meeting',
    name: 'Møtepakke',
    description: 'Perfekt for møter og konferanser',
    serviceIds: ['service-3', 'service-5'],
    bundleDiscount: 8,
    isPopular: false,
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31')
  }
];
