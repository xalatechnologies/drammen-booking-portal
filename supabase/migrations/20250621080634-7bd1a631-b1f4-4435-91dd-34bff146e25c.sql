
-- Drop existing policies for facility_images
DROP POLICY IF EXISTS "Authenticated users can upload facility images" ON public.facility_images;
DROP POLICY IF EXISTS "Users can update their own uploads or admins can update any" ON public.facility_images;
DROP POLICY IF EXISTS "Users can delete their own uploads or admins can delete any" ON public.facility_images;

-- Policy for inserting images (only admins)
CREATE POLICY "Only admins can upload facility images" 
  ON public.facility_images 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system-admin', 'facility-manager')
      AND is_active = true
    )
  );

-- Policy for updating images (only admins)
CREATE POLICY "Only admins can update facility images" 
  ON public.facility_images 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system-admin', 'facility-manager')
      AND is_active = true
    )
  );

-- Policy for deleting images (only admins)
CREATE POLICY "Only admins can delete facility images" 
  ON public.facility_images 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() 
      AND role IN ('system-admin', 'facility-manager')
      AND is_active = true
    )
  );
