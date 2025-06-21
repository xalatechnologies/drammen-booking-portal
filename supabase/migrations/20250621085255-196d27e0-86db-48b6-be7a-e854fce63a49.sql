
-- Create translation system tables
CREATE TABLE translation_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_path TEXT NOT NULL UNIQUE,
  namespace TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create translations table
CREATE TABLE translations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  translation_key_id UUID NOT NULL REFERENCES translation_keys(id) ON DELETE CASCADE,
  language_code language_code NOT NULL,
  value TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(translation_key_id, language_code)
);

-- Create facility content keys table for facility-specific translatable content
CREATE TABLE facility_content_keys (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'name', 'description', 'suitableFor', 'equipment', 'amenities'
  content_key TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(facility_id, content_type)
);

-- Create indexes for performance
CREATE INDEX idx_translations_key_lang ON translations(translation_key_id, language_code);
CREATE INDEX idx_translation_keys_namespace ON translation_keys(namespace);
CREATE INDEX idx_facility_content_keys_facility ON facility_content_keys(facility_id);

-- Insert initial UI translation keys
INSERT INTO translation_keys (key_path, namespace, description) VALUES
('common.loading', 'ui', 'Loading indicator text'),
('common.save', 'ui', 'Save button text'),
('common.cancel', 'ui', 'Cancel button text'),
('common.delete', 'ui', 'Delete button text'),
('common.edit', 'ui', 'Edit button text'),
('common.search', 'ui', 'Search placeholder'),
('facility.capacity', 'facility', 'Facility capacity label'),
('facility.price_per_hour', 'facility', 'Price per hour label'),
('facility.available_now', 'facility', 'Available now label'),
('booking.book_now', 'booking', 'Book now button'),
('booking.select_time', 'booking', 'Select time label'),
('booking.contact_info', 'booking', 'Contact information label'),
('navigation.home', 'navigation', 'Home navigation item'),
('navigation.facilities', 'navigation', 'Facilities navigation item'),
('navigation.bookings', 'navigation', 'Bookings navigation item');

-- Insert UI translations
WITH translation_data AS (
  SELECT tk.id as key_id, 'NO' as lang, 
    CASE tk.key_path
      WHEN 'common.loading' THEN 'Laster...'
      WHEN 'common.save' THEN 'Lagre'
      WHEN 'common.cancel' THEN 'Avbryt'
      WHEN 'common.delete' THEN 'Slett'
      WHEN 'common.edit' THEN 'Rediger'
      WHEN 'common.search' THEN 'Søk...'
      WHEN 'facility.capacity' THEN 'Kapasitet'
      WHEN 'facility.price_per_hour' THEN 'Pris per time'
      WHEN 'facility.available_now' THEN 'Tilgjengelig nå'
      WHEN 'booking.book_now' THEN 'Book nå'
      WHEN 'booking.select_time' THEN 'Velg tid'
      WHEN 'booking.contact_info' THEN 'Kontaktinformasjon'
      WHEN 'navigation.home' THEN 'Hjem'
      WHEN 'navigation.facilities' THEN 'Lokaler'
      WHEN 'navigation.bookings' THEN 'Bookinger'
    END as value
  FROM translation_keys tk
  UNION ALL
  SELECT tk.id as key_id, 'EN' as lang,
    CASE tk.key_path
      WHEN 'common.loading' THEN 'Loading...'
      WHEN 'common.save' THEN 'Save'
      WHEN 'common.cancel' THEN 'Cancel'
      WHEN 'common.delete' THEN 'Delete'
      WHEN 'common.edit' THEN 'Edit'
      WHEN 'common.search' THEN 'Search...'
      WHEN 'facility.capacity' THEN 'Capacity'
      WHEN 'facility.price_per_hour' THEN 'Price per hour'
      WHEN 'facility.available_now' THEN 'Available now'
      WHEN 'booking.book_now' THEN 'Book now'
      WHEN 'booking.select_time' THEN 'Select time'
      WHEN 'booking.contact_info' THEN 'Contact information'
      WHEN 'navigation.home' THEN 'Home'
      WHEN 'navigation.facilities' THEN 'Facilities'
      WHEN 'navigation.bookings' THEN 'Bookings'
    END as value
  FROM translation_keys tk
)
INSERT INTO translations (translation_key_id, language_code, value)
SELECT key_id, lang::language_code, value
FROM translation_data
WHERE value IS NOT NULL;
