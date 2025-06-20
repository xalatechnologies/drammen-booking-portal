
-- ==============================================
-- PHASE 1: CORE ENUMS AND TYPES
-- ==============================================

-- Create all enum types for the Norwegian municipal system
CREATE TYPE public.user_role AS ENUM (
  'system-admin',
  'facility-manager',
  'caseworker',
  'municipal-staff',
  'organization-rep',
  'regular-user',
  'support',
  'paraply-rep'
);

CREATE TYPE public.organization_type AS ENUM (
  'lag-foreninger',
  'paraply',
  'private-firma',
  'kommunale-enheter',
  'utdanning',
  'helse',
  'kultur',
  'frivillig'
);

CREATE TYPE public.organization_status AS ENUM (
  'active',
  'pending-verification',
  'suspended',
  'inactive'
);

CREATE TYPE public.verification_level AS ENUM (
  'unverified',
  'email-verified',
  'document-verified',
  'fully-verified'
);

CREATE TYPE public.booking_status AS ENUM (
  'draft',
  'pending-approval',
  'approved',
  'confirmed',
  'in-progress',
  'completed',
  'cancelled',
  'rejected',
  'no-show'
);

CREATE TYPE public.booking_type AS ENUM (
  'engangs',
  'fastlan',
  'rammetid',
  'strotimer'
);

CREATE TYPE public.event_type AS ENUM (
  'training',
  'competition',
  'meeting',
  'celebration',
  'course',
  'conference',
  'performance',
  'exhibition',
  'drop-in',
  'other'
);

CREATE TYPE public.age_group AS ENUM (
  'children',
  'youth',
  'adults',
  'seniors',
  'mixed',
  'family'
);

CREATE TYPE public.actor_type AS ENUM (
  'lag-foreninger',
  'paraply',
  'private-firma',
  'kommunale-enheter',
  'private-person'
);

CREATE TYPE public.facility_status AS ENUM (
  'active',
  'maintenance',
  'inactive'
);

CREATE TYPE public.zone_type AS ENUM (
  'court',
  'room',
  'area',
  'section',
  'field'
);

CREATE TYPE public.time_slot_category AS ENUM (
  'morning',
  'day',
  'evening',
  'night'
);

CREATE TYPE public.day_type AS ENUM (
  'weekday',
  'weekend',
  'holiday'
);

CREATE TYPE public.approval_status AS ENUM (
  'not-required',
  'pending',
  'in-review',
  'approved',
  'rejected',
  'escalated'
);

CREATE TYPE public.approval_priority AS ENUM (
  'low',
  'normal',
  'high',
  'urgent'
);

CREATE TYPE public.service_category AS ENUM (
  'cleaning',
  'parking',
  'personnel',
  'equipment',
  'catering',
  'security',
  'technical',
  'decoration',
  'transport',
  'wellness'
);

CREATE TYPE public.notification_type AS ENUM (
  'booking-confirmation',
  'booking-reminder',
  'approval-request',
  'approval-decision',
  'cancellation',
  'modification',
  'payment-due',
  'system-maintenance'
);

CREATE TYPE public.language_code AS ENUM ('NO', 'EN');

-- ==============================================
-- PHASE 2: USER MANAGEMENT & AUTHENTICATION
-- ==============================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  preferred_language language_code NOT NULL DEFAULT 'NO',
  date_of_birth DATE,
  address_street TEXT,
  address_city TEXT,
  address_postal_code TEXT,
  address_country TEXT DEFAULT 'Norway',
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User roles and permissions
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  granted_by UUID REFERENCES public.profiles(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(user_id, role)
);

CREATE TABLE public.user_permissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  scope TEXT,
  granted_by UUID REFERENCES public.profiles(id),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- Notification preferences
CREATE TABLE public.user_notification_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  sms_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  push_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  booking_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  approval_updates BOOLEAN NOT NULL DEFAULT TRUE,
  marketing_emails BOOLEAN NOT NULL DEFAULT FALSE,
  reminder_hours_before INTEGER NOT NULL DEFAULT 24,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Booking preferences
CREATE TABLE public.user_booking_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  default_duration INTEGER NOT NULL DEFAULT 120,
  preferred_time_slots TEXT[],
  frequent_facilities INTEGER[],
  auto_rebook BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ==============================================
-- PHASE 3: ORGANIZATION MANAGEMENT
-- ==============================================

CREATE TABLE public.organizations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type organization_type NOT NULL,
  org_number TEXT UNIQUE,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  website TEXT,
  description TEXT,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_postal_code TEXT NOT NULL,
  address_country TEXT NOT NULL DEFAULT 'Norway',
  status organization_status NOT NULL DEFAULT 'pending-verification',
  verification_level verification_level NOT NULL DEFAULT 'unverified',
  parent_organization_id UUID REFERENCES public.organizations(id),
  founded_year INTEGER,
  member_count INTEGER,
  bank_account TEXT,
  vat_number TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.organization_contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'contact',
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  can_make_bookings BOOLEAN NOT NULL DEFAULT FALSE,
  can_approve_bookings BOOLEAN NOT NULL DEFAULT FALSE,
  can_manage_members BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(organization_id, user_id)
);

CREATE TABLE public.organization_verification_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  verified_by UUID REFERENCES public.profiles(id),
  verified_at TIMESTAMPTZ,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================
-- PHASE 4: ENUM AND TRANSLATION SYSTEM
-- ==============================================

CREATE TABLE public.system_enums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enum_type TEXT NOT NULL,
  enum_key TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(enum_type, enum_key)
);

CREATE TABLE public.enum_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enum_id UUID NOT NULL REFERENCES public.system_enums(id) ON DELETE CASCADE,
  language_code language_code NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  short_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(enum_id, language_code)
);

CREATE TABLE public.enum_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  enum_types TEXT[] NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

-- ==============================================
-- PHASE 5: FACILITY MANAGEMENT
-- ==============================================

CREATE TABLE public.facilities (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  address_street TEXT NOT NULL,
  address_city TEXT NOT NULL,
  address_postal_code TEXT NOT NULL,
  address_country TEXT NOT NULL DEFAULT 'Norway',
  type TEXT NOT NULL,
  status facility_status NOT NULL DEFAULT 'active',
  image_url TEXT,
  capacity INTEGER NOT NULL DEFAULT 1,
  area TEXT NOT NULL,
  description TEXT,
  next_available TEXT,
  rating DECIMAL(3,2),
  review_count INTEGER DEFAULT 0,
  price_per_hour DECIMAL(10,2) NOT NULL DEFAULT 450.00,
  has_auto_approval BOOLEAN NOT NULL DEFAULT FALSE,
  time_slot_duration INTEGER NOT NULL DEFAULT 1 CHECK (time_slot_duration IN (1, 2)),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  accessibility_features TEXT[],
  equipment TEXT[],
  amenities TEXT[],
  allowed_booking_types booking_type[] NOT NULL DEFAULT '{"engangs"}',
  season_from DATE,
  season_to DATE,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  booking_lead_time_hours INTEGER NOT NULL DEFAULT 2,
  max_advance_booking_days INTEGER NOT NULL DEFAULT 365,
  cancellation_deadline_hours INTEGER NOT NULL DEFAULT 24,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.facility_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  language_code language_code NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  short_description TEXT,
  rules TEXT,
  directions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(facility_id, language_code)
);

CREATE TABLE public.facility_opening_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.facility_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.facility_blackout_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  reason TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'maintenance',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================
-- PHASE 6: ZONE MANAGEMENT
-- ==============================================

CREATE TABLE public.zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES public.facilities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type zone_type NOT NULL DEFAULT 'area',
  capacity INTEGER NOT NULL DEFAULT 1,
  description TEXT,
  is_main_zone BOOLEAN NOT NULL DEFAULT FALSE,
  parent_zone_id UUID REFERENCES public.zones(id),
  bookable_independently BOOLEAN NOT NULL DEFAULT TRUE,
  area_sqm DECIMAL(10,2),
  floor TEXT,
  coordinates_x INTEGER,
  coordinates_y INTEGER,
  coordinates_width INTEGER,
  coordinates_height INTEGER,
  equipment TEXT[],
  accessibility_features TEXT[],
  status facility_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.zone_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  language_code language_code NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(zone_id, language_code)
);

CREATE TABLE public.zone_conflict_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  conflicting_zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL DEFAULT 'mutually_exclusive',
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (zone_id != conflicting_zone_id)
);

CREATE TABLE public.zone_opening_hours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID NOT NULL REFERENCES public.zones(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  open_time TIME NOT NULL,
  close_time TIME NOT NULL,
  is_open BOOLEAN NOT NULL DEFAULT TRUE,
  valid_from DATE,
  valid_to DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================
-- PHASE 7: PRICING ENGINE
-- ==============================================

CREATE TABLE public.pricing_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_id UUID REFERENCES public.zones(id) ON DELETE CASCADE,
  facility_id INTEGER REFERENCES public.facilities(id) ON DELETE CASCADE,
  actor_type actor_type NOT NULL,
  booking_type booking_type NOT NULL DEFAULT 'engangs',
  time_slot_category time_slot_category,
  day_type day_type,
  base_price DECIMAL(10,2) NOT NULL,
  multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
  fixed_price DECIMAL(10,2),
  minimum_duration INTEGER DEFAULT 60,
  maximum_duration INTEGER DEFAULT 480,
  valid_from DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_to DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (zone_id IS NOT NULL OR facility_id IS NOT NULL)
);

CREATE TABLE public.pricing_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID,
  actor_type actor_type NOT NULL,
  base_price DECIMAL(10,2) NOT NULL,
  total_hours DECIMAL(5,2) NOT NULL,
  actor_type_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
  time_slot_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
  day_type_multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
  subtotal DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  surcharge_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  final_price DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NOK',
  calculation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  calculated_by UUID REFERENCES public.profiles(id)
);

CREATE TABLE public.seasonal_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pricing_rule_id UUID NOT NULL REFERENCES public.pricing_rules(id) ON DELETE CASCADE,
  season_name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  multiplier DECIMAL(5,4) NOT NULL DEFAULT 1.0000,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================
-- PHASE 8: BOOKING SYSTEM
-- ==============================================

CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES public.facilities(id),
  zone_id UUID REFERENCES public.zones(id),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  organization_id UUID REFERENCES public.organizations(id),
  booking_reference TEXT NOT NULL UNIQUE,
  status booking_status NOT NULL DEFAULT 'draft',
  type booking_type NOT NULL DEFAULT 'engangs',
  actor_type actor_type NOT NULL,
  purpose TEXT NOT NULL,
  event_type event_type NOT NULL DEFAULT 'other',
  expected_attendees INTEGER NOT NULL DEFAULT 1,
  age_group age_group NOT NULL DEFAULT 'mixed',
  description TEXT,
  special_requirements TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL,
  recurrence_rule TEXT,
  recurrence_end_date TIMESTAMPTZ,
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
  approval_status approval_status NOT NULL DEFAULT 'not-required',
  approved_by UUID REFERENCES public.profiles(id),
  approved_at TIMESTAMPTZ,
  rejection_reason TEXT,
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  services_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  payment_due_date DATE,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  no_show_at TIMESTAMPTZ,
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.booking_recurrence_patterns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  interval_value INTEGER NOT NULL DEFAULT 1,
  days_of_week INTEGER[],
  day_of_month INTEGER,
  week_of_month INTEGER,
  month_of_year INTEGER,
  end_date DATE,
  max_occurrences INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.booking_recurrence_exceptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  exception_date DATE NOT NULL,
  exception_type TEXT NOT NULL CHECK (exception_type IN ('skip', 'modify', 'cancel')),
  new_start_time TIME,
  new_end_time TIME,
  new_zone_id UUID REFERENCES public.zones(id),
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(booking_id, exception_date)
);

CREATE TABLE public.booking_conflicts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  conflicting_booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  conflict_type TEXT NOT NULL,
  conflict_severity TEXT NOT NULL DEFAULT 'medium',
  conflict_description TEXT,
  resolved BOOLEAN NOT NULL DEFAULT FALSE,
  resolved_by UUID REFERENCES public.profiles(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.booking_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  content TEXT NOT NULL,
  is_internal BOOLEAN NOT NULL DEFAULT FALSE,
  is_important BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.booking_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES public.profiles(id),
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================
-- PHASE 9: STRØTIMER (DROP-IN) SYSTEM
-- ==============================================

CREATE TABLE public.strotime_slots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  facility_id INTEGER NOT NULL REFERENCES public.facilities(id),
  zone_id UUID NOT NULL REFERENCES public.zones(id),
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (30, 60)),
  price_per_slot DECIMAL(10,2) NOT NULL,
  max_participants INTEGER NOT NULL DEFAULT 1,
  current_participants INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_by UUID NOT NULL REFERENCES public.profiles(id),
  released_from_rammetid BOOLEAN NOT NULL DEFAULT FALSE,
  original_booking_id UUID REFERENCES public.bookings(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.strotime_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  strotime_slot_id UUID NOT NULL REFERENCES public.strotime_slots(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id),
  contact_name TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  participants INTEGER NOT NULL DEFAULT 1,
  special_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'no-show')),
  booked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  total_price DECIMAL(10,2) NOT NULL
);

-- ==============================================
-- PHASE 10: APPROVAL WORKFLOWS
-- ==============================================

CREATE TABLE public.approval_workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.approval_workflow_steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.approval_workflows(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  step_name TEXT NOT NULL,
  approver_role user_role,
  approver_user_id UUID REFERENCES public.profiles(id),
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  auto_approve_conditions JSONB,
  deadline_hours INTEGER DEFAULT 72,
  escalation_hours INTEGER DEFAULT 96,
  escalate_to_role user_role,
  escalate_to_user_id UUID REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workflow_id, step_number)
);

CREATE TABLE public.approval_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  workflow_id UUID NOT NULL REFERENCES public.approval_workflows(id),
  current_step INTEGER NOT NULL DEFAULT 1,
  status approval_status NOT NULL DEFAULT 'pending',
  priority approval_priority NOT NULL DEFAULT 'normal',
  requested_by UUID NOT NULL REFERENCES public.profiles(id),
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  escalated_at TIMESTAMPTZ,
  notes TEXT
);

CREATE TABLE public.approval_decisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  approval_request_id UUID NOT NULL REFERENCES public.approval_requests(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  approver_id UUID NOT NULL REFERENCES public.profiles(id),
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected', 'escalated')),
  comments TEXT,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deadline TIMESTAMPTZ,
  UNIQUE(approval_request_id, step_number)
);

CREATE TABLE public.auto_approval_rules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.approval_workflows(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  conditions JSONB NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('approve', 'skip-step', 'require-approval')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================
-- PHASE 11: ADDITIONAL SERVICES
-- ==============================================

CREATE TABLE public.additional_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category service_category NOT NULL,
  description TEXT,
  pricing_model TEXT NOT NULL DEFAULT 'fixed' CHECK (pricing_model IN ('fixed', 'hourly', 'per_person', 'per_item')),
  base_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  unit TEXT,
  minimum_quantity INTEGER DEFAULT 1,
  maximum_quantity INTEGER,
  advance_booking_required BOOLEAN NOT NULL DEFAULT FALSE,
  advance_booking_hours INTEGER DEFAULT 24,
  availability_schedule JSONB,
  equipment_required TEXT[],
  staff_required BOOLEAN NOT NULL DEFAULT FALSE,
  external_provider TEXT,
  booking_notes TEXT,
  cancellation_policy TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.service_translations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.additional_services(id) ON DELETE CASCADE,
  language_code language_code NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT,
  booking_notes TEXT,
  cancellation_policy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(service_id, language_code)
);

CREATE TABLE public.service_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.additional_services(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'confirmed', 'delivered', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.service_availability (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id UUID NOT NULL REFERENCES public.additional_services(id) ON DELETE CASCADE,
  facility_id INTEGER REFERENCES public.facilities(id) ON DELETE CASCADE,
  zone_id UUID REFERENCES public.zones(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME,
  end_time TIME,
  max_concurrent_bookings INTEGER DEFAULT 1,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================
-- PHASE 12: RAMMETID ALLOCATIONS
-- ==============================================

CREATE TABLE public.rammetid_allocations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  facility_id INTEGER NOT NULL REFERENCES public.facilities(id),
  zone_id UUID REFERENCES public.zones(id),
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  valid_from DATE NOT NULL,
  valid_to DATE NOT NULL,
  allocated_by UUID NOT NULL REFERENCES public.profiles(id),
  allocation_notes TEXT,
  can_release_as_strotime BOOLEAN NOT NULL DEFAULT TRUE,
  auto_release_hours_before INTEGER DEFAULT 48,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.rammetid_releases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rammetid_allocation_id UUID NOT NULL REFERENCES public.rammetid_allocations(id) ON DELETE CASCADE,
  release_date DATE NOT NULL,
  release_time_start TIME NOT NULL,
  release_time_end TIME NOT NULL,
  released_by UUID NOT NULL REFERENCES public.profiles(id),
  release_reason TEXT,
  strotime_slot_duration INTEGER NOT NULL DEFAULT 60 CHECK (strotime_slot_duration IN (30, 60)),
  strotime_price DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  auto_released BOOLEAN NOT NULL DEFAULT FALSE,
  released_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================
-- PHASE 13: NOTIFICATIONS & COMMUNICATIONS
-- ==============================================

CREATE TABLE public.notification_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type notification_type NOT NULL,
  subject_template TEXT NOT NULL,
  body_template TEXT NOT NULL,
  is_sms BOOLEAN NOT NULL DEFAULT FALSE,
  is_email BOOLEAN NOT NULL DEFAULT TRUE,
  is_push BOOLEAN NOT NULL DEFAULT FALSE,
  language_code language_code NOT NULL DEFAULT 'NO',
  variables JSONB,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.notification_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  template_id UUID REFERENCES public.notification_templates(id),
  type notification_type NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'sms', 'push')),
  recipient TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
  error_message TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  booking_id UUID REFERENCES public.bookings(id),
  metadata JSONB
);

-- ==============================================
-- PHASE 14: AUDIT & SYSTEM CONFIGURATION
-- ==============================================

CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id TEXT,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.system_configurations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by UUID NOT NULL REFERENCES public.profiles(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE public.support_tickets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
  assigned_to UUID REFERENCES public.profiles(id),
  booking_id UUID REFERENCES public.bookings(id),
  resolution_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- ==============================================
-- INDEXES FOR PERFORMANCE
-- ==============================================

-- User and profile indexes
CREATE INDEX idx_profiles_user_id ON public.profiles(id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_permissions_user_id ON public.user_permissions(user_id);

-- Organization indexes
CREATE INDEX idx_organizations_type ON public.organizations(type);
CREATE INDEX idx_organizations_status ON public.organizations(status);
CREATE INDEX idx_organization_contacts_org_id ON public.organization_contacts(organization_id);
CREATE INDEX idx_organization_contacts_user_id ON public.organization_contacts(user_id);

-- Facility and zone indexes
CREATE INDEX idx_facilities_status ON public.facilities(status);
CREATE INDEX idx_facilities_type ON public.facilities(type);
CREATE INDEX idx_facilities_location ON public.facilities(address_city, address_postal_code);
CREATE INDEX idx_zones_facility_id ON public.zones(facility_id);
CREATE INDEX idx_zone_conflict_rules_zone_id ON public.zone_conflict_rules(zone_id);

-- Booking indexes
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_facility_id ON public.bookings(facility_id);
CREATE INDEX idx_bookings_zone_id ON public.bookings(zone_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_dates ON public.bookings(start_date, end_date);
CREATE INDEX idx_bookings_organization_id ON public.bookings(organization_id);

-- Pricing indexes
CREATE INDEX idx_pricing_rules_zone_id ON public.pricing_rules(zone_id);
CREATE INDEX idx_pricing_rules_facility_id ON public.pricing_rules(facility_id);
CREATE INDEX idx_pricing_rules_actor_type ON public.pricing_rules(actor_type);

-- Strotime indexes
CREATE INDEX idx_strotime_slots_facility_zone ON public.strotime_slots(facility_id, zone_id);
CREATE INDEX idx_strotime_slots_date ON public.strotime_slots(slot_date);
CREATE INDEX idx_strotime_bookings_slot_id ON public.strotime_bookings(strotime_slot_id);

-- Approval indexes
CREATE INDEX idx_approval_requests_booking_id ON public.approval_requests(booking_id);
CREATE INDEX idx_approval_decisions_request_id ON public.approval_decisions(approval_request_id);

-- Service indexes
CREATE INDEX idx_service_bookings_booking_id ON public.service_bookings(booking_id);
CREATE INDEX idx_service_availability_service_id ON public.service_availability(service_id);

-- Notification indexes
CREATE INDEX idx_notification_logs_user_id ON public.notification_logs(user_id);
CREATE INDEX idx_notification_logs_sent_at ON public.notification_logs(sent_at);

-- Audit indexes
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at);
