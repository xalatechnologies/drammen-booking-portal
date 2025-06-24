
-- Add missing fields to app_locations to align with frontend expectations
ALTER TABLE public.app_locations 
ADD COLUMN IF NOT EXISTS price_per_hour NUMERIC DEFAULT 450,
ADD COLUMN IF NOT EXISTS has_auto_approval BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS amenities TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS accessibility_features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS equipment TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS time_slot_duration INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS next_available TEXT,
ADD COLUMN IF NOT EXISTS rating NUMERIC,
ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_lead_time_hours INTEGER DEFAULT 2,
ADD COLUMN IF NOT EXISTS max_advance_booking_days INTEGER DEFAULT 365,
ADD COLUMN IF NOT EXISTS cancellation_deadline_hours INTEGER DEFAULT 24,
ADD COLUMN IF NOT EXISTS allowed_booking_types TEXT[] DEFAULT '{"engangs"}',
ADD COLUMN IF NOT EXISTS season_from TEXT,
ADD COLUMN IF NOT EXISTS season_to TEXT,
ADD COLUMN IF NOT EXISTS area_sqm NUMERIC;

-- Create organizations table since services expect it
CREATE TABLE IF NOT EXISTS public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  org_number TEXT,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,
  description TEXT,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_postal_code TEXT NOT NULL,
  address_country TEXT DEFAULT 'Norway',
  status TEXT DEFAULT 'active',
  verification_level TEXT DEFAULT 'unverified',
  parent_organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  founded_year INTEGER,
  member_count INTEGER,
  bank_account TEXT,
  vat_number TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add missing fields to app_zones to align with frontend Zone interface  
ALTER TABLE public.app_zones
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'area',
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS is_main_zone BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS parent_zone_id UUID REFERENCES public.app_zones(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS bookable_independently BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS area_sqm NUMERIC,
ADD COLUMN IF NOT EXISTS floor TEXT,
ADD COLUMN IF NOT EXISTS coordinates_x NUMERIC,
ADD COLUMN IF NOT EXISTS coordinates_y NUMERIC,
ADD COLUMN IF NOT EXISTS coordinates_width NUMERIC,
ADD COLUMN IF NOT EXISTS coordinates_height NUMERIC,
ADD COLUMN IF NOT EXISTS equipment TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS accessibility_features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';

-- Update app_zones to reference app_locations instead of location_id
ALTER TABLE public.app_zones 
ADD COLUMN IF NOT EXISTS facility_id UUID REFERENCES public.app_locations(id) ON DELETE CASCADE;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_organizations_type ON public.organizations(type);
CREATE INDEX IF NOT EXISTS idx_organizations_status ON public.organizations(status);
CREATE INDEX IF NOT EXISTS idx_app_locations_status ON public.app_locations(status);
CREATE INDEX IF NOT EXISTS idx_app_locations_is_featured ON public.app_locations(is_featured);
CREATE INDEX IF NOT EXISTS idx_app_zones_facility_id ON public.app_zones(facility_id);
CREATE INDEX IF NOT EXISTS idx_app_zones_type ON public.app_zones(type);

-- Enable RLS on organizations table
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for organizations
CREATE POLICY "Anyone can view active organizations" 
  ON public.organizations 
  FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Authenticated users can manage organizations" 
  ON public.organizations 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Add trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_organizations_updated_at 
  BEFORE UPDATE ON public.organizations 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_app_locations_updated_at 
  BEFORE UPDATE ON public.app_locations 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_app_zones_updated_at 
  BEFORE UPDATE ON public.app_zones 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
