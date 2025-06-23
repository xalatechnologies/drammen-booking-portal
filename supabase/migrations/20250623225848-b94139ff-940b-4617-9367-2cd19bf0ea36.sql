
-- Enable RLS on all tables that are missing it
ALTER TABLE public.zone_conflict_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zone_opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_booking_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_enums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enum_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_opening_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_blackout_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zone_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_calculations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seasonal_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_recurrence_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_recurrence_exceptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strotime_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strotime_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_workflow_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_approval_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.additional_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rammetid_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rammetid_releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translation_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_content_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facility_suitable_activities ENABLE ROW LEVEL SECURITY;

-- Create helper function to check if user has role (avoiding infinite recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  )
$$;

-- Create helper function to check if user is organization member
CREATE OR REPLACE FUNCTION public.is_organization_member(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_contacts
    WHERE user_id = _user_id
      AND organization_id = _org_id
  )
$$;

-- Public read-only data policies (facilities, translations, enums, etc)
CREATE POLICY "Anyone can view facilities" ON public.facilities FOR SELECT USING (true);
CREATE POLICY "Anyone can view facility translations" ON public.facility_translations FOR SELECT USING (true);
CREATE POLICY "Anyone can view facility opening hours" ON public.facility_opening_hours FOR SELECT USING (true);
CREATE POLICY "Anyone can view zones" ON public.zones FOR SELECT USING (true);
CREATE POLICY "Anyone can view zone translations" ON public.zone_translations FOR SELECT USING (true);
CREATE POLICY "Anyone can view system enums" ON public.system_enums FOR SELECT USING (true);
CREATE POLICY "Anyone can view enum translations" ON public.enum_translations FOR SELECT USING (true);
CREATE POLICY "Anyone can view enum categories" ON public.enum_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view additional services" ON public.additional_services FOR SELECT USING (true);
CREATE POLICY "Anyone can view service translations" ON public.service_translations FOR SELECT USING (true);
CREATE POLICY "Anyone can view translation keys" ON public.translation_keys FOR SELECT USING (true);
CREATE POLICY "Anyone can view translations" ON public.translations FOR SELECT USING (true);
CREATE POLICY "Anyone can view facility content keys" ON public.facility_content_keys FOR SELECT USING (true);
CREATE POLICY "Anyone can view facility suitable activities" ON public.facility_suitable_activities FOR SELECT USING (true);
CREATE POLICY "Anyone can view strotime slots" ON public.strotime_slots FOR SELECT USING (true);
CREATE POLICY "Anyone can view pricing rules" ON public.pricing_rules FOR SELECT USING (true);

-- User profile policies
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "System admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'system-admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'system-admin'));

-- Organization policies
CREATE POLICY "Anyone can view active organizations" ON public.organizations FOR SELECT USING (status = 'active' AND is_active = true);
CREATE POLICY "Organization members can view their organization" ON public.organizations FOR SELECT USING (public.is_organization_member(auth.uid(), id));
CREATE POLICY "System admins can manage organizations" ON public.organizations FOR ALL USING (public.has_role(auth.uid(), 'system-admin'));

-- Booking policies
CREATE POLICY "Users can view their own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Organization members can view org bookings" ON public.bookings FOR SELECT USING (
  organization_id IS NOT NULL AND 
  public.is_organization_member(auth.uid(), organization_id)
);
CREATE POLICY "Users can create their own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Facility managers can view facility bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'facility-manager'));
CREATE POLICY "Caseworkers can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'caseworker'));

-- Strotime booking policies
CREATE POLICY "Users can view their own strotime bookings" ON public.strotime_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create strotime bookings" ON public.strotime_bookings FOR INSERT WITH CHECK (true); -- Allow anonymous strotime bookings

-- Notification preferences policies
CREATE POLICY "Users can manage their notification preferences" ON public.user_notification_preferences FOR ALL USING (auth.uid() = user_id);

-- Support ticket policies
CREATE POLICY "Users can view their own tickets" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create support tickets" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Support staff can view all tickets" ON public.support_tickets FOR SELECT USING (public.has_role(auth.uid(), 'support'));

-- Admin-only policies for management tables
CREATE POLICY "Only admins can manage facility blackouts" ON public.facility_blackout_periods FOR ALL USING (public.has_role(auth.uid(), 'system-admin') OR public.has_role(auth.uid(), 'facility-manager'));
CREATE POLICY "Only admins can manage pricing calculations" ON public.pricing_calculations FOR ALL USING (public.has_role(auth.uid(), 'system-admin'));
CREATE POLICY "Only admins can manage seasonal pricing" ON public.seasonal_pricing FOR ALL USING (public.has_role(auth.uid(), 'system-admin'));
CREATE POLICY "Only admins can manage approval workflows" ON public.approval_workflows FOR ALL USING (public.has_role(auth.uid(), 'system-admin'));
CREATE POLICY "Only admins can manage notification templates" ON public.notification_templates FOR ALL USING (public.has_role(auth.uid(), 'system-admin'));
CREATE POLICY "Only admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'system-admin'));
CREATE POLICY "Only admins can manage system configurations" ON public.system_configurations FOR ALL USING (public.has_role(auth.uid(), 'system-admin'));
