
-- Insert admin translation keys that are currently hard-coded
INSERT INTO translation_keys (key_path, namespace, description) VALUES
-- Loading and error states
('admin.common.loading', 'admin', 'Loading indicator for admin pages'),
('admin.common.noResults', 'admin', 'No results found message'),
('admin.facilities.search.noResults', 'admin', 'No facilities found message'),

-- Role names
('admin.roles.systemadmin', 'admin', 'System Admin role display name'),
('admin.roles.admin', 'admin', 'Admin role display name'),  
('admin.roles.saksbehandler', 'admin', 'Saksbehandler role display name'),

-- Notification messages (currently hard-coded in AdminHeader)
('admin.notifications.newFacilityRequest.title', 'admin', 'New facility request notification title'),
('admin.notifications.newFacilityRequest.description', 'admin', 'New facility request notification description'),
('admin.notifications.userRoleUpdated.title', 'admin', 'User role updated notification title'),
('admin.notifications.userRoleUpdated.description', 'admin', 'User role updated notification description'),
('admin.notifications.systemAlert.title', 'admin', 'System alert notification title'),
('admin.notifications.systemAlert.description', 'admin', 'System alert notification description'),
('admin.notifications.newMessage.title', 'admin', 'New message notification title'),
('admin.notifications.newMessage.description', 'admin', 'New message notification description'),

-- Time indicators
('admin.notifications.time.minutesAgo', 'admin', 'Minutes ago time indicator'),
('admin.notifications.time.hourAgo', 'admin', 'Hour ago time indicator'),
('admin.notifications.time.hoursAgo', 'admin', 'Hours ago time indicator'),
('admin.notifications.time.dayAgo', 'admin', 'Day ago time indicator'),

-- Facility details
('admin.facilities.details.people', 'admin', 'People capacity unit'),
('admin.facilities.details.type', 'admin', 'Facility type label'),
('admin.facilities.details.capacity', 'admin', 'Facility capacity label'),
('admin.facilities.details.area', 'admin', 'Facility area label'),
('admin.facilities.details.notAvailable', 'admin', 'Not available indicator'),

-- Action buttons
('admin.facilities.actions.view', 'admin', 'View button text'),

-- Page descriptions
('admin.facilities.pageDescription', 'admin', 'Facility management page description');

-- Insert Norwegian translations
INSERT INTO translations (translation_key_id, language_code, value)
SELECT tk.id, 'NO'::language_code,
  CASE tk.key_path
    WHEN 'admin.common.loading' THEN 'Laster...'
    WHEN 'admin.common.noResults' THEN 'Ingen resultater funnet'
    WHEN 'admin.facilities.search.noResults' THEN 'Ingen lokaler funnet som matcher dine kriterier.'
    WHEN 'admin.roles.systemadmin' THEN 'System Admin'
    WHEN 'admin.roles.admin' THEN 'Admin'
    WHEN 'admin.roles.saksbehandler' THEN 'Saksbehandler'
    WHEN 'admin.notifications.newFacilityRequest.title' THEN 'Ny forespørsel om lokale'
    WHEN 'admin.notifications.newFacilityRequest.description' THEN 'Brandengen Skole ba om godkjenning'
    WHEN 'admin.notifications.userRoleUpdated.title' THEN 'Brukerrolle oppdatert'
    WHEN 'admin.notifications.userRoleUpdated.description' THEN 'Thomas Hansen er nå administrator'
    WHEN 'admin.notifications.systemAlert.title' THEN 'Systemvarsel'
    WHEN 'admin.notifications.systemAlert.description' THEN 'Planlagt vedlikehold i kveld kl. 23:00.'
    WHEN 'admin.notifications.newMessage.title' THEN 'Ny melding mottatt'
    WHEN 'admin.notifications.newMessage.description' THEN 'Du har en ny melding fra Per Olsen.'
    WHEN 'admin.notifications.time.minutesAgo' THEN 'minutter siden'
    WHEN 'admin.notifications.time.hourAgo' THEN 'time siden'
    WHEN 'admin.notifications.time.hoursAgo' THEN 'timer siden'
    WHEN 'admin.notifications.time.dayAgo' THEN 'dag siden'
    WHEN 'admin.facilities.details.people' THEN 'personer'
    WHEN 'admin.facilities.details.type' THEN 'Type:'
    WHEN 'admin.facilities.details.capacity' THEN 'Kapasitet:'
    WHEN 'admin.facilities.details.area' THEN 'Areal:'
    WHEN 'admin.facilities.details.notAvailable' THEN 'Ikke tilgjengelig'
    WHEN 'admin.facilities.actions.view' THEN 'Vis'
    WHEN 'admin.facilities.pageDescription' THEN 'Administrer lokalinformasjon, tilgjengelighet og innstillinger'
  END
FROM translation_keys tk
WHERE tk.key_path IN (
  'admin.common.loading', 'admin.common.noResults', 'admin.facilities.search.noResults',
  'admin.roles.systemadmin', 'admin.roles.admin', 'admin.roles.saksbehandler',
  'admin.notifications.newFacilityRequest.title', 'admin.notifications.newFacilityRequest.description',
  'admin.notifications.userRoleUpdated.title', 'admin.notifications.userRoleUpdated.description',
  'admin.notifications.systemAlert.title', 'admin.notifications.systemAlert.description',
  'admin.notifications.newMessage.title', 'admin.notifications.newMessage.description',
  'admin.notifications.time.minutesAgo', 'admin.notifications.time.hourAgo', 
  'admin.notifications.time.hoursAgo', 'admin.notifications.time.dayAgo',
  'admin.facilities.details.people', 'admin.facilities.details.type', 
  'admin.facilities.details.capacity', 'admin.facilities.details.area', 
  'admin.facilities.details.notAvailable', 'admin.facilities.actions.view',
  'admin.facilities.pageDescription'
);

-- Insert English translations
INSERT INTO translations (translation_key_id, language_code, value)
SELECT tk.id, 'EN'::language_code,
  CASE tk.key_path
    WHEN 'admin.common.loading' THEN 'Loading...'
    WHEN 'admin.common.noResults' THEN 'No results found'
    WHEN 'admin.facilities.search.noResults' THEN 'No facilities found matching your criteria.'
    WHEN 'admin.roles.systemadmin' THEN 'System Admin'
    WHEN 'admin.roles.admin' THEN 'Admin'
    WHEN 'admin.roles.saksbehandler' THEN 'Case Handler'
    WHEN 'admin.notifications.newFacilityRequest.title' THEN 'New facility request'
    WHEN 'admin.notifications.newFacilityRequest.description' THEN 'Brandengen School requested approval'
    WHEN 'admin.notifications.userRoleUpdated.title' THEN 'User role updated'
    WHEN 'admin.notifications.userRoleUpdated.description' THEN 'Thomas Hansen is now administrator'
    WHEN 'admin.notifications.systemAlert.title' THEN 'System alert'
    WHEN 'admin.notifications.systemAlert.description' THEN 'Scheduled maintenance tonight at 23:00.'
    WHEN 'admin.notifications.newMessage.title' THEN 'New message received'
    WHEN 'admin.notifications.newMessage.description' THEN 'You have a new message from Per Olsen.'
    WHEN 'admin.notifications.time.minutesAgo' THEN 'minutes ago'
    WHEN 'admin.notifications.time.hourAgo' THEN 'hour ago'
    WHEN 'admin.notifications.time.hoursAgo' THEN 'hours ago'
    WHEN 'admin.notifications.time.dayAgo' THEN 'day ago'
    WHEN 'admin.facilities.details.people' THEN 'people'
    WHEN 'admin.facilities.details.type' THEN 'Type:'
    WHEN 'admin.facilities.details.capacity' THEN 'Capacity:'
    WHEN 'admin.facilities.details.area' THEN 'Area:'
    WHEN 'admin.facilities.details.notAvailable' THEN 'N/A'
    WHEN 'admin.facilities.actions.view' THEN 'View'
    WHEN 'admin.facilities.pageDescription' THEN 'Manage facility information, availability, and settings'
  END
FROM translation_keys tk
WHERE tk.key_path IN (
  'admin.common.loading', 'admin.common.noResults', 'admin.facilities.search.noResults',
  'admin.roles.systemadmin', 'admin.roles.admin', 'admin.roles.saksbehandler',
  'admin.notifications.newFacilityRequest.title', 'admin.notifications.newFacilityRequest.description',
  'admin.notifications.userRoleUpdated.title', 'admin.notifications.userRoleUpdated.description',
  'admin.notifications.systemAlert.title', 'admin.notifications.systemAlert.description',
  'admin.notifications.newMessage.title', 'admin.notifications.newMessage.description',
  'admin.notifications.time.minutesAgo', 'admin.notifications.time.hourAgo', 
  'admin.notifications.time.hoursAgo', 'admin.notifications.time.dayAgo',
  'admin.facilities.details.people', 'admin.facilities.details.type', 
  'admin.facilities.details.capacity', 'admin.facilities.details.area', 
  'admin.facilities.details.notAvailable', 'admin.facilities.actions.view',
  'admin.facilities.pageDescription'
);
