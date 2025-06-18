
export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  orgNumber?: string; // Norwegian organization number
  contactEmail: string;
  contactPhone?: string;
  address: Address;
  status: OrganizationStatus;
  verificationLevel: VerificationLevel;
  parentOrganizationId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  metadata: OrganizationMetadata;
  contacts: OrganizationContact[];
}

export type OrganizationType =
  | 'lag-foreninger'      // Sports clubs and associations
  | 'paraply'             // Umbrella organizations
  | 'private-firma'       // Private companies
  | 'kommunale-enheter'   // Municipal units
  | 'utdanning'           // Educational institutions
  | 'helse'               // Healthcare organizations
  | 'kultur'              // Cultural organizations
  | 'frivillig';          // Voluntary organizations

export type OrganizationStatus = 
  | 'active'
  | 'pending-verification'
  | 'suspended'
  | 'inactive';

export type VerificationLevel =
  | 'unverified'
  | 'email-verified'
  | 'document-verified'
  | 'fully-verified';

export interface Address {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface OrganizationMetadata {
  foundedYear?: number;
  memberCount?: number;
  website?: string;
  description?: string;
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    website?: string;
  };
  bankAccount?: string;
  vatNumber?: string;
}

export interface OrganizationContact {
  id: string;
  userId: string;
  role: string;
  isPrimary: boolean;
  canMakeBookings: boolean;
  canApproveBookings: boolean;
}

export interface OrganizationFilters {
  type?: OrganizationType;
  status?: OrganizationStatus;
  verificationLevel?: VerificationLevel;
  searchTerm?: string;
  city?: string;
}
