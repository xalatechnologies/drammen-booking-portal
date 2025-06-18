
import { Organization, OrganizationType, OrganizationStatus, VerificationLevel } from '@/types/organization';

export const mockOrganizations: Organization[] = [
  {
    id: 'org-001',
    name: 'Drammen Idrettsklubb',
    type: 'lag-foreninger',
    orgNumber: '123456789',
    contactEmail: 'kontakt@drammenidk.no',
    contactPhone: '+47 32123456',
    address: {
      street: 'Idrettsveien 15',
      city: 'Drammen',
      postalCode: '3017',
      country: 'Norge',
      coordinates: {
        lat: 59.7440,
        lng: 10.2052
      }
    },
    status: 'active',
    verificationLevel: 'fully-verified',
    isActive: true,
    createdAt: new Date('2020-03-01T10:00:00Z'),
    updatedAt: new Date('2024-06-01T10:00:00Z'),
    metadata: {
      foundedYear: 1956,
      memberCount: 450,
      website: 'https://drammenidk.no',
      description: 'Drammen Idrettsklubb er en allsidig idrettsklubb med fotball, håndball og friidrett.',
      socialMedia: {
        facebook: 'https://facebook.com/drammenidk',
        instagram: '@drammenidk'
      },
      bankAccount: '1234.56.78901'
    },
    contacts: [
      {
        id: 'contact-001',
        userId: 'user-004',
        role: 'Klubbleder',
        isPrimary: true,
        canMakeBookings: true,
        canApproveBookings: true
      }
    ]
  },

  {
    id: 'org-002',
    name: 'Drammen Kulturforening',
    type: 'kultur',
    orgNumber: '234567890',
    contactEmail: 'post@drammenkultur.no',
    contactPhone: '+47 32234567',
    address: {
      street: 'Kulturveien 8',
      city: 'Drammen',
      postalCode: '3045',
      country: 'Norge',
      coordinates: {
        lat: 59.7445,
        lng: 10.2045
      }
    },
    status: 'active',
    verificationLevel: 'document-verified',
    isActive: true,
    createdAt: new Date('2018-09-15T10:00:00Z'),
    updatedAt: new Date('2024-05-15T10:00:00Z'),
    metadata: {
      foundedYear: 1982,
      memberCount: 125,
      website: 'https://drammenkultur.no',
      description: 'Lokale kulturarrangementer og teaterforestillinger i Drammen.',
      socialMedia: {
        facebook: 'https://facebook.com/drammenkultur'
      },
      bankAccount: '2345.67.89012'
    },
    contacts: [
      {
        id: 'contact-002',
        userId: 'user-007',
        role: 'Kulturleder',
        isPrimary: true,
        canMakeBookings: true,
        canApproveBookings: false
      }
    ]
  },

  {
    id: 'org-003',
    name: 'Buskerud Paraplyorganisasjon',
    type: 'paraply',
    orgNumber: '345678901',
    contactEmail: 'admin@buskerudparaply.no',
    contactPhone: '+47 32345678',
    address: {
      street: 'Fylkesveien 22',
      city: 'Drammen',
      postalCode: '3012',
      country: 'Norge',
      coordinates: {
        lat: 59.7425,
        lng: 10.2067
      }
    },
    status: 'active',
    verificationLevel: 'fully-verified',
    isActive: true,
    createdAt: new Date('2015-01-01T10:00:00Z'),
    updatedAt: new Date('2024-06-10T10:00:00Z'),
    metadata: {
      foundedYear: 1995,
      memberCount: 2500,
      website: 'https://buskerudparaply.no',
      description: 'Paraplyorganisasjon for idrettslag og kulturforeninger i Buskerud.',
      bankAccount: '3456.78.90123'
    },
    contacts: [
      {
        id: 'contact-003',
        userId: 'user-008',
        role: 'Generalsekretær',
        isPrimary: true,
        canMakeBookings: true,
        canApproveBookings: true
      }
    ]
  },

  {
    id: 'org-004',
    name: 'TechConsult AS',
    type: 'private-firma',
    orgNumber: '456789012',
    contactEmail: 'booking@techconsult.no',
    contactPhone: '+47 32456789',
    address: {
      street: 'Teknologiparken 5',
      city: 'Drammen',
      postalCode: '3036',
      country: 'Norge',
      coordinates: {
        lat: 59.7356,
        lng: 10.1923
      }
    },
    status: 'active',
    verificationLevel: 'email-verified',
    isActive: true,
    createdAt: new Date('2022-08-15T10:00:00Z'),
    updatedAt: new Date('2024-06-05T10:00:00Z'),
    metadata: {
      foundedYear: 2019,
      memberCount: 25,
      website: 'https://techconsult.no',
      description: 'IT-konsulentfirma med fokus på digitale løsninger.',
      vatNumber: 'NO456789012MVA',
      bankAccount: '4567.89.01234'
    },
    contacts: [
      {
        id: 'contact-004',
        userId: 'user-009',
        role: 'Daglig leder',
        isPrimary: true,
        canMakeBookings: true,
        canApproveBookings: true
      }
    ]
  },

  {
    id: 'org-005',
    name: 'Drammen VGS',
    type: 'utdanning',
    orgNumber: '567890123',
    contactEmail: 'admin@drammenvgs.no',
    contactPhone: '+47 32567890',
    address: {
      street: 'Skoleveien 10',
      city: 'Drammen',
      postalCode: '3041',
      country: 'Norge',
      coordinates: {
        lat: 59.7464,
        lng: 10.2045
      }
    },
    status: 'active',
    verificationLevel: 'fully-verified',
    isActive: true,
    createdAt: new Date('2010-01-01T10:00:00Z'),
    updatedAt: new Date('2024-05-30T10:00:00Z'),
    metadata: {
      foundedYear: 1975,
      memberCount: 850,
      website: 'https://drammenvgs.no',
      description: 'Videregående skole med studiespesialisering og yrkesfag.',
      bankAccount: '5678.90.12345'
    },
    contacts: [
      {
        id: 'contact-005',
        userId: 'user-010',
        role: 'Rektor',
        isPrimary: true,
        canMakeBookings: true,
        canApproveBookings: true
      }
    ]
  },

  {
    id: 'org-006',
    name: 'Drammen Frivilligsentral',
    type: 'frivillig',
    orgNumber: '678901234',
    contactEmail: 'kontakt@drammenfrivillig.no',
    contactPhone: '+47 32678901',
    address: {
      street: 'Frivilligveien 3',
      city: 'Drammen',
      postalCode: '3044',
      country: 'Norge',
      coordinates: {
        lat: 59.7401,
        lng: 10.2134
      }
    },
    status: 'active',
    verificationLevel: 'document-verified',
    isActive: true,
    createdAt: new Date('2019-05-01T10:00:00Z'),
    updatedAt: new Date('2024-06-08T10:00:00Z'),
    metadata: {
      foundedYear: 2005,
      memberCount: 180,
      website: 'https://drammenfrivillig.no',
      description: 'Koordinerer frivillig arbeid og samfunnsengasjement i Drammen.',
      bankAccount: '6789.01.23456'
    },
    contacts: [
      {
        id: 'contact-006',
        userId: 'user-011',
        role: 'Koordinator',
        isPrimary: true,
        canMakeBookings: true,
        canApproveBookings: false
      }
    ]
  }
];

// Helper functions
export const getOrganizationById = (id: string): Organization | undefined => {
  return mockOrganizations.find(org => org.id === id);
};

export const getOrganizationsByType = (type: OrganizationType): Organization[] => {
  return mockOrganizations.filter(org => org.type === type);
};

export const getOrganizationsByStatus = (status: OrganizationStatus): Organization[] => {
  return mockOrganizations.filter(org => org.status === status);
};

export const getVerifiedOrganizations = (): Organization[] => {
  return mockOrganizations.filter(org => 
    org.verificationLevel === 'document-verified' || 
    org.verificationLevel === 'fully-verified'
  );
};

export const getActiveOrganizations = (): Organization[] => {
  return mockOrganizations.filter(org => org.isActive);
};
