
-- Remove the redundant image_url column from facilities table
ALTER TABLE public.facilities DROP COLUMN IF EXISTS image_url;

-- Enhance facility_images table with better structure
ALTER TABLE public.facility_images 
DROP COLUMN IF EXISTS is_primary,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS file_size INTEGER,
ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES public.profiles(id),
ADD COLUMN IF NOT EXISTS uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Ensure only one featured image per facility
CREATE UNIQUE INDEX IF NOT EXISTS idx_facility_images_one_featured 
ON public.facility_images (facility_id) 
WHERE is_featured = true;

-- Update existing primary images to be featured
UPDATE public.facility_images 
SET is_featured = true 
WHERE display_order = 0 OR caption ILIKE '%primary%' OR caption ILIKE '%featured%';
