
import { SystemEnum, EnumTranslation, EnumOption, LocalizedEnumData, EnumType } from '@/types/enum';
import { Language } from '@/i18n/types';

class EnumService {
  private enumCache: Map<string, EnumOption[]> = new Map();
  private translationCache: Map<string, Map<string, EnumTranslation>> = new Map();

  async getEnumOptions(enumType: EnumType, language: Language): Promise<EnumOption[]> {
    const cacheKey = `${enumType}_${language}`;
    
    if (this.enumCache.has(cacheKey)) {
      return this.enumCache.get(cacheKey)!;
    }

    // TODO: Replace with actual API call when backend is connected
    const mockData = await this.getMockEnumData(enumType, language);
    this.enumCache.set(cacheKey, mockData);
    
    return mockData;
  }

  async getEnumLabel(enumType: EnumType, key: string, language: Language): Promise<string> {
    const options = await this.getEnumOptions(enumType, language);
    const option = options.find(opt => opt.key === key);
    return option?.label || key;
  }

  async getEnumDescription(enumType: EnumType, key: string, language: Language): Promise<string | undefined> {
    const options = await this.getEnumOptions(enumType, language);
    const option = options.find(opt => opt.key === key);
    return option?.description;
  }

  async updateEnumTranslation(enumId: string, language: Language, translation: Partial<EnumTranslation>): Promise<void> {
    // TODO: Implement API call to update translation
    console.log('Updating enum translation:', { enumId, language, translation });
  }

  async addEnumOption(enumType: EnumType, key: string, translations: LocalizedEnumData): Promise<void> {
    // TODO: Implement API call to add new enum option
    console.log('Adding enum option:', { enumType, key, translations });
  }

  async deactivateEnumOption(enumId: string): Promise<void> {
    // TODO: Implement API call to deactivate enum option
    console.log('Deactivating enum option:', enumId);
  }

  private async getMockEnumData(enumType: EnumType, language: Language): Promise<EnumOption[]> {
    // Mock data based on current enums - will be replaced with database calls
    const mockData: Record<EnumType, Record<Language, EnumOption[]>> = {
      UserRole: {
        NO: [
          { id: '1', key: 'system-admin', label: 'Systemadministrator', description: 'Full systemtilgang', shortLabel: 'Admin', displayOrder: 1, isActive: true },
          { id: '2', key: 'facility-manager', label: 'Anleggsansvarlig', description: 'Ansvarlig for spesifikke anlegg', shortLabel: 'Anlegg', displayOrder: 2, isActive: true },
          { id: '3', key: 'caseworker', label: 'Saksbehandler', description: 'Behandler bookingforespørsler', shortLabel: 'Saksb.', displayOrder: 3, isActive: true },
          { id: '4', key: 'municipal-staff', label: 'Kommuneansatt', description: 'Kommunalt ansatt', shortLabel: 'Kommune', displayOrder: 4, isActive: true },
          { id: '5', key: 'organization-rep', label: 'Organisasjonsrepresentant', description: 'Representerer organisasjon', shortLabel: 'Org.rep', displayOrder: 5, isActive: true },
          { id: '6', key: 'regular-user', label: 'Vanlig bruker', description: 'Standard bruker', shortLabel: 'Bruker', displayOrder: 6, isActive: true }
        ],
        EN: [
          { id: '1', key: 'system-admin', label: 'System Administrator', description: 'Full system access', shortLabel: 'Admin', displayOrder: 1, isActive: true },
          { id: '2', key: 'facility-manager', label: 'Facility Manager', description: 'Responsible for specific facilities', shortLabel: 'Facility', displayOrder: 2, isActive: true },
          { id: '3', key: 'caseworker', label: 'Caseworker', description: 'Processes booking requests', shortLabel: 'Case', displayOrder: 3, isActive: true },
          { id: '4', key: 'municipal-staff', label: 'Municipal Staff', description: 'Municipal employee', shortLabel: 'Municipal', displayOrder: 4, isActive: true },
          { id: '5', key: 'organization-rep', label: 'Organization Representative', description: 'Represents organization', shortLabel: 'Org.rep', displayOrder: 5, isActive: true },
          { id: '6', key: 'regular-user', label: 'Regular User', description: 'Standard user', shortLabel: 'User', displayOrder: 6, isActive: true }
        ]
      },
      BookingStatus: {
        NO: [
          { id: '7', key: 'draft', label: 'Utkast', description: 'Booking er ikke sendt inn ennå', shortLabel: 'Utkast', displayOrder: 1, isActive: true },
          { id: '8', key: 'pending-approval', label: 'Venter godkjenning', description: 'Booking venter på godkjenning', shortLabel: 'Venter', displayOrder: 2, isActive: true },
          { id: '9', key: 'approved', label: 'Godkjent', description: 'Booking er godkjent', shortLabel: 'Godkjent', displayOrder: 3, isActive: true },
          { id: '10', key: 'confirmed', label: 'Bekreftet', description: 'Booking er bekreftet', shortLabel: 'Bekreftet', displayOrder: 4, isActive: true },
          { id: '11', key: 'in-progress', label: 'Pågår', description: 'Arrangement pågår', shortLabel: 'Pågår', displayOrder: 5, isActive: true },
          { id: '12', key: 'completed', label: 'Fullført', description: 'Arrangement er fullført', shortLabel: 'Fullført', displayOrder: 6, isActive: true },
          { id: '13', key: 'cancelled', label: 'Avlyst', description: 'Booking er avlyst', shortLabel: 'Avlyst', displayOrder: 7, isActive: true },
          { id: '14', key: 'rejected', label: 'Avvist', description: 'Booking er avvist', shortLabel: 'Avvist', displayOrder: 8, isActive: true },
          { id: '15', key: 'no-show', label: 'Ikke møtt', description: 'Bruker møtte ikke opp', shortLabel: 'Ikke møtt', displayOrder: 9, isActive: true }
        ],
        EN: [
          { id: '7', key: 'draft', label: 'Draft', description: 'Booking not submitted yet', shortLabel: 'Draft', displayOrder: 1, isActive: true },
          { id: '8', key: 'pending-approval', label: 'Pending Approval', description: 'Booking awaiting approval', shortLabel: 'Pending', displayOrder: 2, isActive: true },
          { id: '9', key: 'approved', label: 'Approved', description: 'Booking is approved', shortLabel: 'Approved', displayOrder: 3, isActive: true },
          { id: '10', key: 'confirmed', label: 'Confirmed', description: 'Booking is confirmed', shortLabel: 'Confirmed', displayOrder: 4, isActive: true },
          { id: '11', key: 'in-progress', label: 'In Progress', description: 'Event is ongoing', shortLabel: 'Progress', displayOrder: 5, isActive: true },
          { id: '12', key: 'completed', label: 'Completed', description: 'Event is completed', shortLabel: 'Completed', displayOrder: 6, isActive: true },
          { id: '13', key: 'cancelled', label: 'Cancelled', description: 'Booking is cancelled', shortLabel: 'Cancelled', displayOrder: 7, isActive: true },
          { id: '14', key: 'rejected', label: 'Rejected', description: 'Booking is rejected', shortLabel: 'Rejected', displayOrder: 8, isActive: true },
          { id: '15', key: 'no-show', label: 'No Show', description: 'User did not show up', shortLabel: 'No Show', displayOrder: 9, isActive: true }
        ]
      },
      ActorType: {
        NO: [
          { id: '16', key: 'lag-foreninger', label: 'Lag og foreninger (frivillige)', description: 'Gratis eller redusert pris - krever godkjenning', shortLabel: 'Lag/foreninger', displayOrder: 1, isActive: true },
          { id: '17', key: 'paraply', label: 'Paraplyorganisasjoner', description: 'Spesiell rabatt - krever godkjenning', shortLabel: 'Paraply', displayOrder: 2, isActive: true },
          { id: '18', key: 'private-firma', label: 'Private firmaer', description: 'Full markedspris', shortLabel: 'Private', displayOrder: 3, isActive: true },
          { id: '19', key: 'kommunale-enheter', label: 'Kommunale enheter', description: 'Redusert pris for kommunale aktører', shortLabel: 'Kommune', displayOrder: 4, isActive: true },
          { id: '20', key: 'private-person', label: 'Private personer', description: 'Standard pris for privatpersoner', shortLabel: 'Privatperson', displayOrder: 5, isActive: true }
        ],
        EN: [
          { id: '16', key: 'lag-foreninger', label: 'Teams and Associations (Voluntary)', description: 'Free or reduced price - requires approval', shortLabel: 'Teams/Assoc', displayOrder: 1, isActive: true },
          { id: '17', key: 'paraply', label: 'Umbrella Organizations', description: 'Special discount - requires approval', shortLabel: 'Umbrella', displayOrder: 2, isActive: true },
          { id: '18', key: 'private-firma', label: 'Private Companies', description: 'Full market price', shortLabel: 'Private', displayOrder: 3, isActive: true },
          { id: '19', key: 'kommunale-enheter', label: 'Municipal Units', description: 'Reduced price for municipal actors', shortLabel: 'Municipal', displayOrder: 4, isActive: true },
          { id: '20', key: 'private-person', label: 'Private Persons', description: 'Standard price for individuals', shortLabel: 'Individual', displayOrder: 5, isActive: true }
        ]
      }
      // Additional enum types would be added here...
    };

    return mockData[enumType]?.[language] || [];
  }

  clearCache(): void {
    this.enumCache.clear();
    this.translationCache.clear();
  }
}

export const enumService = new EnumService();
