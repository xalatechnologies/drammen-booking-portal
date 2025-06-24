
-- Add missing fields to app_locations table to match Facility type expectations
ALTER TABLE app_locations 
ADD COLUMN IF NOT EXISTS image text,
ADD COLUMN IF NOT EXISTS address_street text,
ADD COLUMN IF NOT EXISTS address_city text DEFAULT '',
ADD COLUMN IF NOT EXISTS address_postal_code text DEFAULT '',
ADD COLUMN IF NOT EXISTS address_country text DEFAULT 'Norway';

-- Update existing records to have proper address fields
UPDATE app_locations 
SET 
  image = COALESCE(image, ''),
  address_street = COALESCE(address, ''),
  address_city = COALESCE(address_city, ''),
  address_postal_code = COALESCE(address_postal_code, ''),
  address_country = COALESCE(address_country, 'Norway')
WHERE image IS NULL OR address_street IS NULL;
