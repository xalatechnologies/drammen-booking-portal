
-- Create storage bucket for facility images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'facility-images', 
  'facility-images', 
  true, 
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
);

-- Create policy to allow public read access to facility images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'facility-images');

-- Create policy to allow authenticated users to upload facility images
CREATE POLICY "Authenticated users can upload facility images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'facility-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update facility images
CREATE POLICY "Authenticated users can update facility images" ON storage.objects
FOR UPDATE USING (bucket_id = 'facility-images' AND auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete facility images
CREATE POLICY "Authenticated users can delete facility images" ON storage.objects
FOR DELETE USING (bucket_id = 'facility-images' AND auth.role() = 'authenticated');

-- Insert sample facility images into storage (we'll reference existing Unsplash images)
-- Update facilities table to use proper image URLs from storage or fallback to Unsplash
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop' WHERE id = 1;
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop' WHERE id = 2;
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop' WHERE id = 3;
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop' WHERE id = 4;
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop' WHERE id = 5;
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop' WHERE id = 6;
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop' WHERE id = 7;
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop' WHERE id = 8;
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop' WHERE id = 9;
UPDATE facilities SET image_url = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop' WHERE id = 10;
