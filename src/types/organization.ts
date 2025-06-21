
export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  orgNumber?: string;
  contactEmail: string;
  contactPhone?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  status: OrganizationStatus;
  verificationLevel: VerificationLevel;
  parentOrganizationId?: string;
  isActive: boolean;
  metadata?: {
    website?: string;
    description?: string;
    foundedYear?: number;
    memberCount?: number;
    vatNumber?: string;
    bankAccount?: string;
  };
  contacts?: OrganizationContact[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationContact {
  id: string;
  userId: string;
  role: string;
  isPrimary: boolean;
  canMakeBookings: boolean;
  canApproveBookings: boolean;
  canManageMembers: boolean;
}

export type OrganizationType = 
  | 'lag-foreninger'
  | 'paraply'
  | 'private-firma'
  | 'kommunale-enheter';

export type OrganizationStatus = 
  | 'pending-verification'
  | 'verified'
  | 'suspended'
  | 'inactive';

export type VerificationLevel = 
  | 'unverified'
  | 'email-verified'
  | 'document-verified'
  | 'fully-verified';
