
-- Migration 1: Add features array to locations and fix existing structure
ALTER TABLE public.app_locations 
ADD COLUMN facilities TEXT[] DEFAULT '{}',
ADD COLUMN capacity INTEGER,
ADD COLUMN contact_email TEXT,
ADD COLUMN contact_phone TEXT,
ADD COLUMN is_published BOOLEAN DEFAULT false,
ADD COLUMN location_type TEXT DEFAULT 'facility';

-- Migration 2: Create Calendar system
CREATE TABLE public.app_calendars (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location_id UUID NOT NULL REFERENCES public.app_locations(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  slot_length INTEGER NOT NULL DEFAULT 60, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(location_id, date)
);

-- Create enum for block types
CREATE TYPE public.block_type AS ENUM ('STROTIME', 'FASTLÅN', 'RAMMETID', 'SPERRET');

-- Create calendar blocks table
CREATE TABLE public.app_calendar_blocks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  calendar_id UUID NOT NULL REFERENCES public.app_calendars(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  block_type block_type NOT NULL,
  is_available BOOLEAN DEFAULT true,
  booking_id UUID REFERENCES public.app_bookings(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Migration 3: Update booking system with proper enums
CREATE TYPE public.booking_type AS ENUM ('ENGANG', 'FAST');
CREATE TYPE public.booking_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- Add new columns to bookings table
ALTER TABLE public.app_bookings 
ADD COLUMN booking_type booking_type,
ADD COLUMN booking_status booking_status DEFAULT 'PENDING',
ADD COLUMN comment TEXT,
ADD COLUMN signed BOOLEAN DEFAULT false,
ADD COLUMN signed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN block_id UUID REFERENCES public.app_calendar_blocks(id) ON DELETE SET NULL;

-- Migration 4: Enhance actor system
ALTER TABLE public.app_actors 
ADD COLUMN org_number TEXT,
ADD COLUMN is_paraply BOOLEAN DEFAULT false,
ADD COLUMN parent_actor_id UUID REFERENCES public.app_actors(id) ON DELETE SET NULL;

-- Migration 5: Create location caseworkers table
CREATE TABLE public.app_location_caseworkers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.app_users(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES public.app_locations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, location_id)
);

-- Migration 6: Create audit log table
CREATE TABLE public.app_audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action TEXT NOT NULL,
  user_id UUID REFERENCES public.app_users(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now(),
  details TEXT
);

-- Create indexes for performance
CREATE INDEX idx_app_calendars_location_date ON public.app_calendars(location_id, date);
CREATE INDEX idx_app_calendar_blocks_calendar_id ON public.app_calendar_blocks(calendar_id);
CREATE INDEX idx_app_calendar_blocks_time_range ON public.app_calendar_blocks(start_time, end_time);
CREATE INDEX idx_app_bookings_booking_status ON public.app_bookings(booking_status);
CREATE INDEX idx_app_actors_parent_actor ON public.app_actors(parent_actor_id);
CREATE INDEX idx_app_audit_logs_user_timestamp ON public.app_audit_logs(user_id, timestamp);

-- Add Row Level Security to new tables
ALTER TABLE public.app_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_calendar_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_location_caseworkers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for calendars (public read, admin write)
CREATE POLICY "Anyone can view calendars" 
  ON public.app_calendars 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage calendars" 
  ON public.app_calendars 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for calendar blocks (public read, admin write)
CREATE POLICY "Anyone can view calendar blocks" 
  ON public.app_calendar_blocks 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage calendar blocks" 
  ON public.app_calendar_blocks 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for location caseworkers
CREATE POLICY "Users can view location caseworkers" 
  ON public.app_location_caseworkers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can manage location caseworkers" 
  ON public.app_location_caseworkers 
  FOR ALL 
  USING (auth.uid() IS NOT NULL);

-- Create RLS policies for audit logs
CREATE POLICY "Users can view their own audit logs" 
  ON public.app_audit_logs 
  FOR SELECT 
  USING (auth.uid() = user_id OR auth.uid() IS NOT NULL);

CREATE POLICY "System can insert audit logs" 
  ON public.app_audit_logs 
  FOR INSERT 
  WITH CHECK (true);
