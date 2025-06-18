
import { User, UserRole } from '@/types/user';

export const mockUsers: User[] = [
  // System Administrators
  {
    id: 'user-001',
    email: 'admin@drammen.kommune.no',
    firstName: 'Lars',
    lastName: 'Hansen',
    phone: '+47 91234567',
    role: 'system-admin',
    isActive: true,
    lastLoginAt: new Date('2024-06-17T08:30:00Z'),
    createdAt: new Date('2024-01-15T10:00:00Z'),
    updatedAt: new Date('2024-06-17T08:30:00Z'),
    permissions: [
      { id: 'perm-001', resource: '*', action: 'create' },
      { id: 'perm-002', resource: '*', action: 'read' },
      { id: 'perm-003', resource: '*', action: 'update' },
      { id: 'perm-004', resource: '*', action: 'delete' },
      { id: 'perm-005', resource: '*', action: 'approve' }
    ],
    profile: {
      avatar: '/lovable-uploads/admin-avatar.png',
      bio: 'System administrator for Drammen Kommune booking system',
      preferredLanguage: 'NO',
      notifications: {
        email: true,
        sms: true,
        push: true,
        bookingReminders: true,
        approvalUpdates: true,
        marketingEmails: false
      },
      bookingPreferences: {
        defaultDuration: 120,
        preferredTimeSlots: ['09:00-11:00', '13:00-15:00'],
        frequentFacilities: [],
        autoRebook: false
      }
    }
  },

  // Facility Managers
  {
    id: 'user-002',
    email: 'facility.manager@drammen.kommune.no',
    firstName: 'Ingrid',
    lastName: 'Nordahl',
    phone: '+47 92345678',
    role: 'facility-manager',
    isActive: true,
    lastLoginAt: new Date('2024-06-17T09:15:00Z'),
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-06-17T09:15:00Z'),
    permissions: [
      { id: 'perm-006', resource: 'facility', action: 'read', scope: '1,2,3,4,5' },
      { id: 'perm-007', resource: 'facility', action: 'update', scope: '1,2,3,4,5' },
      { id: 'perm-008', resource: 'booking', action: 'approve', scope: '1,2,3,4,5' }
    ],
    profile: {
      preferredLanguage: 'NO',
      notifications: {
        email: true,
        sms: false,
        push: true,
        bookingReminders: true,
        approvalUpdates: true,
        marketingEmails: false
      },
      bookingPreferences: {
        defaultDuration: 180,
        preferredTimeSlots: ['08:00-10:00', '14:00-16:00'],
        frequentFacilities: ['1', '2', '3'],
        autoRebook: false
      }
    }
  },

  // Caseworkers
  {
    id: 'user-003',
    email: 'caseworker@drammen.kommune.no',
    firstName: 'Erik',
    lastName: 'Olsen',
    phone: '+47 93456789',
    role: 'caseworker',
    isActive: true,
    lastLoginAt: new Date('2024-06-17T10:00:00Z'),
    createdAt: new Date('2024-03-01T10:00:00Z'),
    updatedAt: new Date('2024-06-17T10:00:00Z'),
    permissions: [
      { id: 'perm-009', resource: 'booking', action: 'read' },
      { id: 'perm-010', resource: 'booking', action: 'update' },
      { id: 'perm-011', resource: 'approval', action: 'create' },
      { id: 'perm-012', resource: 'user', action: 'read' }
    ],
    profile: {
      preferredLanguage: 'NO',
      notifications: {
        email: true,
        sms: true,
        push: true,
        bookingReminders: true,
        approvalUpdates: true,
        marketingEmails: false
      },
      bookingPreferences: {
        defaultDuration: 120,
        preferredTimeSlots: ['09:00-11:00', '13:00-15:00'],
        frequentFacilities: [],
        autoRebook: false
      }
    }
  },

  // Organization Representatives
  {
    id: 'user-004',
    email: 'leder@drammenidk.no',
    firstName: 'Maria',
    lastName: 'Berg',
    phone: '+47 94567890',
    role: 'organization-rep',
    organizationId: 'org-001',
    isActive: true,
    lastLoginAt: new Date('2024-06-16T19:30:00Z'),
    createdAt: new Date('2024-04-01T10:00:00Z'),
    updatedAt: new Date('2024-06-16T19:30:00Z'),
    permissions: [
      { id: 'perm-013', resource: 'booking', action: 'create', scope: 'org-001' },
      { id: 'perm-014', resource: 'booking', action: 'read', scope: 'org-001' },
      { id: 'perm-015', resource: 'booking', action: 'update', scope: 'org-001' }
    ],
    profile: {
      bio: 'Leder for Drammen Idrettsklubb',
      preferredLanguage: 'NO',
      notifications: {
        email: true,
        sms: true,
        push: true,
        bookingReminders: true,
        approvalUpdates: true,
        marketingEmails: true
      },
      bookingPreferences: {
        defaultDuration: 120,
        preferredTimeSlots: ['17:00-19:00', '19:00-21:00'],
        frequentFacilities: ['1', '6', '11'],
        autoRebook: true
      }
    }
  },

  // Regular Users
  {
    id: 'user-005',
    email: 'ola.nordmann@gmail.com',
    firstName: 'Ola',
    lastName: 'Nordmann',
    phone: '+47 95678901',
    role: 'regular-user',
    isActive: true,
    lastLoginAt: new Date('2024-06-15T14:20:00Z'),
    createdAt: new Date('2024-05-01T10:00:00Z'),
    updatedAt: new Date('2024-06-15T14:20:00Z'),
    permissions: [
      { id: 'perm-016', resource: 'booking', action: 'create' },
      { id: 'perm-017', resource: 'booking', action: 'read', scope: 'own' },
      { id: 'perm-018', resource: 'booking', action: 'update', scope: 'own' }
    ],
    profile: {
      preferredLanguage: 'NO',
      notifications: {
        email: true,
        sms: false,
        push: true,
        bookingReminders: true,
        approvalUpdates: true,
        marketingEmails: false
      },
      bookingPreferences: {
        defaultDuration: 60,
        preferredTimeSlots: ['18:00-20:00'],
        frequentFacilities: ['7'],
        autoRebook: false
      }
    }
  },

  // Municipal Staff
  {
    id: 'user-006',
    email: 'kommune.ansatt@drammen.kommune.no',
    firstName: 'Kari',
    lastName: 'Kommunal',
    phone: '+47 96789012',
    role: 'municipal-staff',
    isActive: true,
    lastLoginAt: new Date('2024-06-17T11:45:00Z'),
    createdAt: new Date('2024-01-20T10:00:00Z'),
    updatedAt: new Date('2024-06-17T11:45:00Z'),
    permissions: [
      { id: 'perm-019', resource: 'booking', action: 'create' },
      { id: 'perm-020', resource: 'booking', action: 'read' },
      { id: 'perm-021', resource: 'facility', action: 'read' }
    ],
    profile: {
      bio: 'Ansatt i Drammen Kommune',
      preferredLanguage: 'NO',
      notifications: {
        email: true,
        sms: false,
        push: true,
        bookingReminders: true,
        approvalUpdates: true,
        marketingEmails: false
      },
      bookingPreferences: {
        defaultDuration: 120,
        preferredTimeSlots: ['09:00-11:00', '13:00-15:00'],
        frequentFacilities: ['4', '12'],
        autoRebook: false
      }
    }
  }
];

// Helper functions
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUsersByRole = (role: UserRole): User[] => {
  return mockUsers.filter(user => user.role === role);
};

export const getUsersByOrganization = (organizationId: string): User[] => {
  return mockUsers.filter(user => user.organizationId === organizationId);
};

export const getActiveUsers = (): User[] => {
  return mockUsers.filter(user => user.isActive);
};
