
-- Drop the existing foreign key constraint if it exists
ALTER TABLE app_location_images DROP CONSTRAINT IF EXISTS fk_location_images_location_id;

-- Add the foreign key constraint properly
ALTER TABLE app_location_images 
ADD CONSTRAINT fk_location_images_location_id 
FOREIGN KEY (location_id) REFERENCES app_locations(id) ON DELETE CASCADE;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_location_images_location_id ON app_location_images(location_id);

-- Refresh the schema cache by updating the publication
ALTER PUBLICATION supabase_realtime ADD TABLE app_locations;
ALTER PUBLICATION supabase_realtime ADD TABLE app_location_images;
