
-- Add missing contact_name field to app_locations table
ALTER TABLE app_locations 
ADD COLUMN contact_name text;

-- Update the trigger to handle updated_at for app_locations if it doesn't exist
DROP TRIGGER IF EXISTS update_app_locations_updated_at ON app_locations;
CREATE TRIGGER update_app_locations_updated_at
    BEFORE UPDATE ON app_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
