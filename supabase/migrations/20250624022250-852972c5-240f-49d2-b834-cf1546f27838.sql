
-- Create app_location_images table to store images for locations
CREATE TABLE public.app_location_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.app_locations(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  file_size INTEGER,
  uploaded_by UUID REFERENCES public.app_users(id),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX idx_app_location_images_location_id ON public.app_location_images(location_id);
CREATE INDEX idx_app_location_images_display_order ON public.app_location_images(display_order);
CREATE INDEX idx_app_location_images_is_featured ON public.app_location_images(is_featured);

-- Add Row Level Security
ALTER TABLE public.app_location_images ENABLE ROW LEVEL SECURITY;

-- Create policies for location images (public read access, admin write access)
CREATE POLICY "Anyone can view location images" 
  ON public.app_location_images 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage location images" 
  ON public.app_location_images 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);
