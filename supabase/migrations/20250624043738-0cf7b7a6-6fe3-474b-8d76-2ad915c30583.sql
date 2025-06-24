
-- Add foreign key relationship between app_location_images and app_locations
ALTER TABLE app_location_images 
ADD CONSTRAINT fk_location_images_location_id 
FOREIGN KEY (location_id) REFERENCES app_locations(id) ON DELETE CASCADE;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_location_images_location_id ON app_location_images(location_id);
