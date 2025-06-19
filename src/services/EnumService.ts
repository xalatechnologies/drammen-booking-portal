
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
    // Complete mock data for all enum types - will be replaced with database calls
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
      BookingType: {
        NO: [
          { id: '21', key: 'engangs', label: 'Engangslån', description: 'Engangsreservasjon for spesifikke datoer', shortLabel: 'Engangs', displayOrder: 1, isActive: true },
          { id: '22', key: 'fastlan', label: 'Fastlån', description: 'Gjentakende booking - kan gi rabatt', shortLabel: 'Fast', displayOrder: 2, isActive: true }
        ],
        EN: [
          { id: '21', key: 'engangs', label: 'One-time Booking', description: 'Single reservation for specific dates', shortLabel: 'One-time', displayOrder: 1, isActive: true },
          { id: '22', key: 'fastlan', label: 'Recurring Booking', description: 'Recurring booking - may provide discount', shortLabel: 'Recurring', displayOrder: 2, isActive: true }
        ]
      },
      EventType: {
        NO: [
          { id: '23', key: 'training', label: 'Trening', description: 'Treningsaktiviteter og øvelser', shortLabel: 'Trening', displayOrder: 1, isActive: true },
          { id: '24', key: 'competition', label: 'Konkurranse', description: 'Konkurranser og turneringer', shortLabel: 'Konkurranse', displayOrder: 2, isActive: true },
          { id: '25', key: 'meeting', label: 'Møte', description: 'Møter og konferanser', shortLabel: 'Møte', displayOrder: 3, isActive: true },
          { id: '26', key: 'celebration', label: 'Feiring', description: 'Fester og feiringer', shortLabel: 'Feiring', displayOrder: 4, isActive: true },
          { id: '27', key: 'course', label: 'Kurs', description: 'Kurs og opplæring', shortLabel: 'Kurs', displayOrder: 5, isActive: true },
          { id: '28', key: 'conference', label: 'Konferanse', description: 'Konferanser og seminarer', shortLabel: 'Konferanse', displayOrder: 6, isActive: true },
          { id: '29', key: 'performance', label: 'Forestilling', description: 'Forestillinger og show', shortLabel: 'Forestilling', displayOrder: 7, isActive: true },
          { id: '30', key: 'exhibition', label: 'Utstilling', description: 'Utstillinger og messer', shortLabel: 'Utstilling', displayOrder: 8, isActive: true },
          { id: '31', key: 'other', label: 'Annet', description: 'Andre typer arrangementer', shortLabel: 'Annet', displayOrder: 9, isActive: true }
        ],
        EN: [
          { id: '23', key: 'training', label: 'Training', description: 'Training activities and practice', shortLabel: 'Training', displayOrder: 1, isActive: true },
          { id: '24', key: 'competition', label: 'Competition', description: 'Competitions and tournaments', shortLabel: 'Competition', displayOrder: 2, isActive: true },
          { id: '25', key: 'meeting', label: 'Meeting', description: 'Meetings and conferences', shortLabel: 'Meeting', displayOrder: 3, isActive: true },
          { id: '26', key: 'celebration', label: 'Celebration', description: 'Parties and celebrations', shortLabel: 'Celebration', displayOrder: 4, isActive: true },
          { id: '27', key: 'course', label: 'Course', description: 'Courses and training', shortLabel: 'Course', displayOrder: 5, isActive: true },
          { id: '28', key: 'conference', label: 'Conference', description: 'Conferences and seminars', shortLabel: 'Conference', displayOrder: 6, isActive: true },
          { id: '29', key: 'performance', label: 'Performance', description: 'Performances and shows', shortLabel: 'Performance', displayOrder: 7, isActive: true },
          { id: '30', key: 'exhibition', label: 'Exhibition', description: 'Exhibitions and fairs', shortLabel: 'Exhibition', displayOrder: 8, isActive: true },
          { id: '31', key: 'other', label: 'Other', description: 'Other types of events', shortLabel: 'Other', displayOrder: 9, isActive: true }
        ]
      },
      AgeGroup: {
        NO: [
          { id: '32', key: 'children', label: 'Barn', description: 'Under 12 år', shortLabel: 'Barn', displayOrder: 1, isActive: true },
          { id: '33', key: 'youth', label: 'Ungdom', description: '12-19 år', shortLabel: 'Ungdom', displayOrder: 2, isActive: true },
          { id: '34', key: 'adults', label: 'Voksne', description: '20-66 år', shortLabel: 'Voksne', displayOrder: 3, isActive: true },
          { id: '35', key: 'seniors', label: 'Seniorer', description: 'Over 67 år', shortLabel: 'Seniorer', displayOrder: 4, isActive: true },
          { id: '36', key: 'mixed', label: 'Blandet', description: 'Alle aldersgrupper', shortLabel: 'Blandet', displayOrder: 5, isActive: true },
          { id: '37', key: 'family', label: 'Familie', description: 'Familieaktiviteter', shortLabel: 'Familie', displayOrder: 6, isActive: true }
        ],
        EN: [
          { id: '32', key: 'children', label: 'Children', description: 'Under 12 years', shortLabel: 'Children', displayOrder: 1, isActive: true },
          { id: '33', key: 'youth', label: 'Youth', description: '12-19 years', shortLabel: 'Youth', displayOrder: 2, isActive: true },
          { id: '34', key: 'adults', label: 'Adults', description: '20-66 years', shortLabel: 'Adults', displayOrder: 3, isActive: true },
          { id: '35', key: 'seniors', label: 'Seniors', description: 'Over 67 years', shortLabel: 'Seniors', displayOrder: 4, isActive: true },
          { id: '36', key: 'mixed', label: 'Mixed', description: 'All age groups', shortLabel: 'Mixed', displayOrder: 5, isActive: true },
          { id: '37', key: 'family', label: 'Family', description: 'Family activities', shortLabel: 'Family', displayOrder: 6, isActive: true }
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
      },
      ActorStatus: {
        NO: [
          { id: '38', key: 'active', label: 'Aktiv', description: 'Aktiv aktør', shortLabel: 'Aktiv', displayOrder: 1, isActive: true },
          { id: '39', key: 'inactive', label: 'Inaktiv', description: 'Inaktiv aktør', shortLabel: 'Inaktiv', displayOrder: 2, isActive: true },
          { id: '40', key: 'suspended', label: 'Suspendert', description: 'Midlertidig suspendert', shortLabel: 'Suspendert', displayOrder: 3, isActive: true }
        ],
        EN: [
          { id: '38', key: 'active', label: 'Active', description: 'Active actor', shortLabel: 'Active', displayOrder: 1, isActive: true },
          { id: '39', key: 'inactive', label: 'Inactive', description: 'Inactive actor', shortLabel: 'Inactive', displayOrder: 2, isActive: true },
          { id: '40', key: 'suspended', label: 'Suspended', description: 'Temporarily suspended', shortLabel: 'Suspended', displayOrder: 3, isActive: true }
        ]
      },
      TimeSlotCategory: {
        NO: [
          { id: '41', key: 'peak', label: 'Høysesong', description: 'Mest populære tider', shortLabel: 'Høy', displayOrder: 1, isActive: true },
          { id: '42', key: 'standard', label: 'Standard', description: 'Normale tider', shortLabel: 'Standard', displayOrder: 2, isActive: true },
          { id: '43', key: 'off-peak', label: 'Lavsesong', description: 'Mindre populære tider', shortLabel: 'Lav', displayOrder: 3, isActive: true }
        ],
        EN: [
          { id: '41', key: 'peak', label: 'Peak Hours', description: 'Most popular times', shortLabel: 'Peak', displayOrder: 1, isActive: true },
          { id: '42', key: 'standard', label: 'Standard', description: 'Normal times', shortLabel: 'Standard', displayOrder: 2, isActive: true },
          { id: '43', key: 'off-peak', label: 'Off-Peak', description: 'Less popular times', shortLabel: 'Off-Peak', displayOrder: 3, isActive: true }
        ]
      },
      PriceType: {
        NO: [
          { id: '44', key: 'hourly', label: 'Per time', description: 'Pris per time', shortLabel: 'Time', displayOrder: 1, isActive: true },
          { id: '45', key: 'daily', label: 'Per dag', description: 'Pris per dag', shortLabel: 'Dag', displayOrder: 2, isActive: true },
          { id: '46', key: 'fixed', label: 'Fast pris', description: 'Fast pris uavhengig av tid', shortLabel: 'Fast', displayOrder: 3, isActive: true }
        ],
        EN: [
          { id: '44', key: 'hourly', label: 'Per Hour', description: 'Price per hour', shortLabel: 'Hour', displayOrder: 1, isActive: true },
          { id: '45', key: 'daily', label: 'Per Day', description: 'Price per day', shortLabel: 'Day', displayOrder: 2, isActive: true },
          { id: '46', key: 'fixed', label: 'Fixed Price', description: 'Fixed price regardless of time', shortLabel: 'Fixed', displayOrder: 3, isActive: true }
        ]
      },
      DayType: {
        NO: [
          { id: '47', key: 'weekday', label: 'Hverdag', description: 'Mandag til fredag', shortLabel: 'Hverdag', displayOrder: 1, isActive: true },
          { id: '48', key: 'weekend', label: 'Helg', description: 'Lørdag og søndag', shortLabel: 'Helg', displayOrder: 2, isActive: true },
          { id: '49', key: 'holiday', label: 'Helligdag', description: 'Offentlige helligdager', shortLabel: 'Helligdag', displayOrder: 3, isActive: true }
        ],
        EN: [
          { id: '47', key: 'weekday', label: 'Weekday', description: 'Monday to Friday', shortLabel: 'Weekday', displayOrder: 1, isActive: true },
          { id: '48', key: 'weekend', label: 'Weekend', description: 'Saturday and Sunday', shortLabel: 'Weekend', displayOrder: 2, isActive: true },
          { id: '49', key: 'holiday', label: 'Holiday', description: 'Public holidays', shortLabel: 'Holiday', displayOrder: 3, isActive: true }
        ]
      },
      ServiceCategory: {
        NO: [
          { id: '50', key: 'cleaning', label: 'Rengjøring', description: 'Rengjøringstjenester', shortLabel: 'Rengjøring', displayOrder: 1, isActive: true },
          { id: '51', key: 'equipment', label: 'Utstyr', description: 'Utstyrsutleie', shortLabel: 'Utstyr', displayOrder: 2, isActive: true },
          { id: '52', key: 'catering', label: 'Servering', description: 'Mat og drikke', shortLabel: 'Servering', displayOrder: 3, isActive: true },
          { id: '53', key: 'personnel', label: 'Personell', description: 'Ekstra personell', shortLabel: 'Personell', displayOrder: 4, isActive: true },
          { id: '54', key: 'parking', label: 'Parkering', description: 'Parkeringstjenester', shortLabel: 'Parkering', displayOrder: 5, isActive: true }
        ],
        EN: [
          { id: '50', key: 'cleaning', label: 'Cleaning', description: 'Cleaning services', shortLabel: 'Cleaning', displayOrder: 1, isActive: true },
          { id: '51', key: 'equipment', label: 'Equipment', description: 'Equipment rental', shortLabel: 'Equipment', displayOrder: 2, isActive: true },
          { id: '52', key: 'catering', label: 'Catering', description: 'Food and beverages', shortLabel: 'Catering', displayOrder: 3, isActive: true },
          { id: '53', key: 'personnel', label: 'Personnel', description: 'Additional staff', shortLabel: 'Personnel', displayOrder: 4, isActive: true },
          { id: '54', key: 'parking', label: 'Parking', description: 'Parking services', shortLabel: 'Parking', displayOrder: 5, isActive: true }
        ]
      },
      ServiceBookingStatus: {
        NO: [
          { id: '55', key: 'requested', label: 'Forespurt', description: 'Tjeneste er forespurt', shortLabel: 'Forespurt', displayOrder: 1, isActive: true },
          { id: '56', key: 'confirmed', label: 'Bekreftet', description: 'Tjeneste er bekreftet', shortLabel: 'Bekreftet', displayOrder: 2, isActive: true },
          { id: '57', key: 'delivered', label: 'Levert', description: 'Tjeneste er levert', shortLabel: 'Levert', displayOrder: 3, isActive: true },
          { id: '58', key: 'cancelled', label: 'Avlyst', description: 'Tjeneste er avlyst', shortLabel: 'Avlyst', displayOrder: 4, isActive: true }
        ],
        EN: [
          { id: '55', key: 'requested', label: 'Requested', description: 'Service is requested', shortLabel: 'Requested', displayOrder: 1, isActive: true },
          { id: '56', key: 'confirmed', label: 'Confirmed', description: 'Service is confirmed', shortLabel: 'Confirmed', displayOrder: 2, isActive: true },
          { id: '57', key: 'delivered', label: 'Delivered', description: 'Service is delivered', shortLabel: 'Delivered', displayOrder: 3, isActive: true },
          { id: '58', key: 'cancelled', label: 'Cancelled', description: 'Service is cancelled', shortLabel: 'Cancelled', displayOrder: 4, isActive: true }
        ]
      },
      ApprovalRequestStatus: {
        NO: [
          { id: '59', key: 'pending', label: 'Venter', description: 'Venter på behandling', shortLabel: 'Venter', displayOrder: 1, isActive: true },
          { id: '60', key: 'approved', label: 'Godkjent', description: 'Forespørsel godkjent', shortLabel: 'Godkjent', displayOrder: 2, isActive: true },
          { id: '61', key: 'rejected', label: 'Avvist', description: 'Forespørsel avvist', shortLabel: 'Avvist', displayOrder: 3, isActive: true },
          { id: '62', key: 'escalated', label: 'Eskalert', description: 'Sendt til høyere nivå', shortLabel: 'Eskalert', displayOrder: 4, isActive: true }
        ],
        EN: [
          { id: '59', key: 'pending', label: 'Pending', description: 'Awaiting processing', shortLabel: 'Pending', displayOrder: 1, isActive: true },
          { id: '60', key: 'approved', label: 'Approved', description: 'Request approved', shortLabel: 'Approved', displayOrder: 2, isActive: true },
          { id: '61', key: 'rejected', label: 'Rejected', description: 'Request rejected', shortLabel: 'Rejected', displayOrder: 3, isActive: true },
          { id: '62', key: 'escalated', label: 'Escalated', description: 'Sent to higher level', shortLabel: 'Escalated', displayOrder: 4, isActive: true }
        ]
      },
      ApprovalPriority: {
        NO: [
          { id: '63', key: 'low', label: 'Lav', description: 'Lav prioritet', shortLabel: 'Lav', displayOrder: 1, isActive: true },
          { id: '64', key: 'normal', label: 'Normal', description: 'Normal prioritet', shortLabel: 'Normal', displayOrder: 2, isActive: true },
          { id: '65', key: 'high', label: 'Høy', description: 'Høy prioritet', shortLabel: 'Høy', displayOrder: 3, isActive: true },
          { id: '66', key: 'urgent', label: 'Urgent', description: 'Akutt prioritet', shortLabel: 'Urgent', displayOrder: 4, isActive: true }
        ],
        EN: [
          { id: '63', key: 'low', label: 'Low', description: 'Low priority', shortLabel: 'Low', displayOrder: 1, isActive: true },
          { id: '64', key: 'normal', label: 'Normal', description: 'Normal priority', shortLabel: 'Normal', displayOrder: 2, isActive: true },
          { id: '65', key: 'high', label: 'High', description: 'High priority', shortLabel: 'High', displayOrder: 3, isActive: true },
          { id: '66', key: 'urgent', label: 'Urgent', description: 'Urgent priority', shortLabel: 'Urgent', displayOrder: 4, isActive: true }
        ]
      },
      ConditionOperator: {
        NO: [
          { id: '67', key: 'equals', label: 'Er lik', description: 'Verdi er lik', shortLabel: '=', displayOrder: 1, isActive: true },
          { id: '68', key: 'not-equals', label: 'Er ikke lik', description: 'Verdi er ikke lik', shortLabel: '≠', displayOrder: 2, isActive: true },
          { id: '69', key: 'greater-than', label: 'Større enn', description: 'Verdi er større enn', shortLabel: '>', displayOrder: 3, isActive: true },
          { id: '70', key: 'less-than', label: 'Mindre enn', description: 'Verdi er mindre enn', shortLabel: '<', displayOrder: 4, isActive: true },
          { id: '71', key: 'contains', label: 'Inneholder', description: 'Tekst inneholder', shortLabel: '∋', displayOrder: 5, isActive: true }
        ],
        EN: [
          { id: '67', key: 'equals', label: 'Equals', description: 'Value equals', shortLabel: '=', displayOrder: 1, isActive: true },
          { id: '68', key: 'not-equals', label: 'Not Equals', description: 'Value not equals', shortLabel: '≠', displayOrder: 2, isActive: true },
          { id: '69', key: 'greater-than', label: 'Greater Than', description: 'Value greater than', shortLabel: '>', displayOrder: 3, isActive: true },
          { id: '70', key: 'less-than', label: 'Less Than', description: 'Value less than', shortLabel: '<', displayOrder: 4, isActive: true },
          { id: '71', key: 'contains', label: 'Contains', description: 'Text contains', shortLabel: '∋', displayOrder: 5, isActive: true }
        ]
      },
      NotificationType: {
        NO: [
          { id: '72', key: 'email', label: 'E-post', description: 'E-post varsling', shortLabel: 'E-post', displayOrder: 1, isActive: true },
          { id: '73', key: 'sms', label: 'SMS', description: 'SMS varsling', shortLabel: 'SMS', displayOrder: 2, isActive: true },
          { id: '74', key: 'push', label: 'Push', description: 'Push-varsling', shortLabel: 'Push', displayOrder: 3, isActive: true },
          { id: '75', key: 'system', label: 'System', description: 'Systemvarsling', shortLabel: 'System', displayOrder: 4, isActive: true }
        ],
        EN: [
          { id: '72', key: 'email', label: 'Email', description: 'Email notification', shortLabel: 'Email', displayOrder: 1, isActive: true },
          { id: '73', key: 'sms', label: 'SMS', description: 'SMS notification', shortLabel: 'SMS', displayOrder: 2, isActive: true },
          { id: '74', key: 'push', label: 'Push', description: 'Push notification', shortLabel: 'Push', displayOrder: 3, isActive: true },
          { id: '75', key: 'system', label: 'System', description: 'System notification', shortLabel: 'System', displayOrder: 4, isActive: true }
        ]
      }
    };

    return mockData[enumType]?.[language] || [];
  }

  clearCache(): void {
    this.enumCache.clear();
    this.translationCache.clear();
  }
}

export const enumService = new EnumService();
