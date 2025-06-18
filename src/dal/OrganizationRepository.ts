
import { BaseRepository } from './BaseRepository';
import { Organization, OrganizationFilters, OrganizationType, OrganizationStatus, VerificationLevel, OrganizationMetadata } from '@/types/organization';
import { mockOrganizations } from '@/data/mockOrganizations';

interface OrganizationCreateRequest {
  name: string;
  type: OrganizationType;
  contactEmail: string;
  contactPhone?: string;
  address: any;
  orgNumber?: string;
}

interface OrganizationUpdateRequest extends Partial<OrganizationCreateRequest> {
  status?: OrganizationStatus;
  verificationLevel?: VerificationLevel;
  isActive?: boolean;
  metadata?: Partial<OrganizationMetadata>;
}

export class OrganizationRepository extends BaseRepository<Organization, OrganizationFilters, OrganizationCreateRequest, OrganizationUpdateRequest> {
  constructor() {
    super(mockOrganizations);
  }

  protected getId(org: Organization): string {
    return org.id;
  }

  protected applyFilters(organizations: Organization[], filters: OrganizationFilters): Organization[] {
    return organizations.filter(org => {
      // Type filter
      if (filters.type && org.type !== filters.type) {
        return false;
      }

      // Status filter
      if (filters.status && org.status !== filters.status) {
        return false;
      }

      // Verification level filter
      if (filters.verificationLevel && org.verificationLevel !== filters.verificationLevel) {
        return false;
      }

      // City filter
      if (filters.city && !org.address.city.toLowerCase().includes(filters.city.toLowerCase())) {
        return false;
      }

      // Search term filter
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const searchFields = [
          org.name,
          org.contactEmail,
          org.metadata.description || '',
          org.orgNumber || ''
        ].join(' ').toLowerCase();
        
        if (!searchFields.includes(searchLower)) {
          return false;
        }
      }

      return true;
    });
  }

  protected createEntity(request: OrganizationCreateRequest): Organization {
    const now = this.getCurrentTimestamp();
    
    return {
      id: this.generateId(),
      name: request.name,
      type: request.type,
      orgNumber: request.orgNumber,
      contactEmail: request.contactEmail,
      contactPhone: request.contactPhone,
      address: request.address,
      status: 'pending-verification',
      verificationLevel: 'unverified',
      isActive: true,
      createdAt: now,
      updatedAt: now,
      metadata: {
        description: '',
      },
      contacts: []
    };
  }

  protected updateEntity(existing: Organization, request: OrganizationUpdateRequest): Organization {
    return {
      ...existing,
      ...request,
      updatedAt: this.getCurrentTimestamp(),
      metadata: request.metadata ? { ...existing.metadata, ...request.metadata } : existing.metadata
    };
  }

  // Organization-specific methods
  async findByOrgNumber(orgNumber: string) {
    const org = this.data.find(o => o.orgNumber === orgNumber);
    return org ? { success: true, data: org } : { success: false, error: { message: 'Organization not found', code: 'NOT_FOUND' } };
  }

  async findVerified() {
    const orgs = this.data.filter(o => 
      o.verificationLevel === 'document-verified' || 
      o.verificationLevel === 'fully-verified'
    );
    return { success: true, data: orgs };
  }

  async updateVerificationLevel(id: string, level: VerificationLevel) {
    const index = this.data.findIndex(o => o.id === id);
    if (index !== -1) {
      this.data[index].verificationLevel = level;
      this.data[index].updatedAt = this.getCurrentTimestamp();
      return { success: true, data: this.data[index] };
    }
    return { success: false, error: { message: 'Organization not found', code: 'NOT_FOUND' } };
  }
}

// Export singleton instance
export const organizationRepository = new OrganizationRepository();
