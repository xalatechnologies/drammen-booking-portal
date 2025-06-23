
import { Language } from '../types';

export const enumTranslations: Record<Language, Record<string, string>> = {
  NO: {
    // User roles
    'system-admin': 'Systemadministrator',
    'facility-manager': 'Anleggsansvarlig',
    'caseworker': 'Saksbehandler',
    'municipal-staff': 'Kommuneansatt',
    'organization-rep': 'Organisasjonsrepresentant',
    'regular-user': 'Vanlig bruker',

    // Booking status
    'draft': 'Utkast',
    'pending-approval': 'Venter på godkjenning',
    'approved': 'Godkjent',
    'rejected': 'Avvist',
    'confirmed': 'Bekreftet',
    'cancelled': 'Avlyst',
    'completed': 'Fullført',
    'no-show': 'Møtte ikke opp',

    // Facility status
    'active': 'Aktiv',
    'maintenance': 'Under vedlikehold',
    'inactive': 'Inaktiv',

    // Booking types
    'engangs': 'Engangsbooking',
    'fastlan': 'Fast leie',
    'rammetid': 'Rammetid',
    'strotimer': 'Strøtimer',

    // Actor types
    'lag-foreninger': 'Lag og foreninger',
    'paraply': 'Paraplyorganisasjon',
    'private-firma': 'Private firma',
    'kommunale-enheter': 'Kommunale enheter',
    'private-person': 'Privatperson',

    // Age groups
    'children': 'Barn',
    'youth': 'Ungdom',
    'adults': 'Voksne',
    'seniors': 'Seniorer',
    'mixed': 'Blandet',
    'family': 'Familie',
  },
  EN: {
    // User roles
    'system-admin': 'System Administrator',
    'facility-manager': 'Facility Manager',
    'caseworker': 'Caseworker',
    'municipal-staff': 'Municipal Staff',
    'organization-rep': 'Organization Representative',
    'regular-user': 'Regular User',

    // Booking status
    'draft': 'Draft',
    'pending-approval': 'Pending Approval',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'confirmed': 'Confirmed',
    'cancelled': 'Cancelled',
    'completed': 'Completed',
    'no-show': 'No Show',

    // Facility status
    'active': 'Active',
    'maintenance': 'Under Maintenance',
    'inactive': 'Inactive',

    // Booking types
    'engangs': 'One-time Booking',
    'fastlan': 'Regular Rental',
    'rammetid': 'Allocated Time',
    'strotimer': 'Drop-in Hours',

    // Actor types
    'lag-foreninger': 'Teams and Associations',
    'paraply': 'Umbrella Organization',
    'private-firma': 'Private Company',
    'kommunale-enheter': 'Municipal Units',
    'private-person': 'Private Person',

    // Age groups
    'children': 'Children',
    'youth': 'Youth',
    'adults': 'Adults',
    'seniors': 'Seniors',
    'mixed': 'Mixed',
    'family': 'Family',
  }
};

