
import { Language } from '../types';

// Flat structure for direct key-value enum translations
export const enumTranslations: Record<Language, Record<string, string>> = {
  NO: {
    // User Roles
    'system-admin': 'Systemadministrator',
    'facility-manager': 'Anleggsansvarlig',
    'caseworker': 'Saksbehandler',
    'municipal-staff': 'Kommuneansatt',
    'organization-rep': 'Organisasjonsrepresentant',
    'regular-user': 'Vanlig bruker',

    // Booking Status
    'draft': 'Utkast',
    'pending-approval': 'Venter godkjenning',
    'approved': 'Godkjent',
    'confirmed': 'Bekreftet',
    'in-progress': 'Pågår',
    'completed': 'Fullført',
    'cancelled': 'Avlyst',
    'rejected': 'Avvist',
    'no-show': 'Ikke møtt',

    // Actor Types
    'lag-foreninger': 'Lag og foreninger (frivillige)',
    'paraply': 'Paraplyorganisasjoner',
    'private-firma': 'Private firmaer',
    'kommunale-enheter': 'Kommunale enheter',
    'private-person': 'Private personer',

    // Event Types
    'training': 'Trening',
    'competition': 'Konkurranse',
    'meeting': 'Møte',
    'celebration': 'Feiring',
    'course': 'Kurs',
    'conference': 'Konferanse',
    'performance': 'Forestilling',
    'exhibition': 'Utstilling',
    'other': 'Annet',

    // Age Groups
    'children': 'Barn',
    'youth': 'Ungdom',
    'adults': 'Voksne',
    'seniors': 'Seniorer',
    'mixed': 'Blandet',
    'family': 'Familie'
  },
  EN: {
    // User Roles
    'system-admin': 'System Administrator',
    'facility-manager': 'Facility Manager',
    'caseworker': 'Caseworker',
    'municipal-staff': 'Municipal Staff',
    'organization-rep': 'Organization Representative',
    'regular-user': 'Regular User',

    // Booking Status
    'draft': 'Draft',
    'pending-approval': 'Pending Approval',
    'approved': 'Approved',
    'confirmed': 'Confirmed',
    'in-progress': 'In Progress',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'rejected': 'Rejected',
    'no-show': 'No Show',

    // Actor Types
    'lag-foreninger': 'Teams and Associations (Voluntary)',
    'paraply': 'Umbrella Organizations',
    'private-firma': 'Private Companies',
    'kommunale-enheter': 'Municipal Units',
    'private-person': 'Private Persons',

    // Event Types
    'training': 'Training',
    'competition': 'Competition',
    'meeting': 'Meeting',
    'celebration': 'Celebration',
    'course': 'Course',
    'conference': 'Conference',
    'performance': 'Performance',
    'exhibition': 'Exhibition',
    'other': 'Other',

    // Age Groups
    'children': 'Children',
    'youth': 'Youth',
    'adults': 'Adults',
    'seniors': 'Seniors',
    'mixed': 'Mixed',
    'family': 'Family'
  }
};
