
-- Check current RLS policies on facility_images table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'facility_images';

-- Drop existing restrictive policies that might be blocking reads
DROP POLICY IF EXISTS "Only admins can upload facility images" ON public.facility_images;
DROP POLICY IF EXISTS "Only admins can update facility images" ON public.facility_images;
DROP POLICY IF EXISTS "Only admins can delete facility images" ON public.facility_images;

-- Create a public read policy for facility images since they should be viewable by everyone
CREATE POLICY "Anyone can view facility images" 
  ON public.facility_images 
  FOR SELECT 
  USING (true);

-- Keep admin-only policies for modifications
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
