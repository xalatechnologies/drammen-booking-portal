
-- ==============================================
-- ROW LEVEL SECURITY POLICIES
-- ==============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_booking_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_verification_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.strotime_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approval_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user has role
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

-- Helper function to check if user is organization member
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

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "System admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.has_role(auth.uid(), 'system-admin'));

CREATE POLICY "System admins can update all profiles" ON public.profiles
  FOR UPDATE USING (public.has_role(auth.uid(), 'system-admin'));

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System admins can manage all roles" ON public.user_roles
  FOR ALL USING (public.has_role(auth.uid(), 'system-admin'));

-- Organization policies
CREATE POLICY "Anyone can view active organizations" ON public.organizations
  FOR SELECT USING (status = 'active' AND is_active = true);

CREATE POLICY "Organization members can view their organization" ON public.organizations
  FOR SELECT USING (public.is_organization_member(auth.uid(), id));

CREATE POLICY "System admins can manage organizations" ON public.organizations
  FOR ALL USING (public.has_role(auth.uid(), 'system-admin'));

-- Booking policies
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Organization members can view org bookings" ON public.bookings
  FOR SELECT USING (
    organization_id IS NOT NULL AND 
    public.is_organization_member(auth.uid(), organization_id)
  );

CREATE POLICY "Users can create their own bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Facility managers can view facility bookings" ON public.bookings
  FOR SELECT USING (public.has_role(auth.uid(), 'facility-manager'));

CREATE POLICY "Caseworkers can view all bookings" ON public.bookings
  FOR SELECT USING (public.has_role(auth.uid(), 'caseworker'));

-- Strotime booking policies
CREATE POLICY "Users can view their own strotime bookings" ON public.strotime_bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create strotime bookings" ON public.strotime_bookings
  FOR INSERT WITH CHECK (true); -- Allow anonymous strotime bookings

-- Notification preferences policies
CREATE POLICY "Users can manage their notification preferences" ON public.user_notification_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Support ticket policies
CREATE POLICY "Users can view their own tickets" ON public.support_tickets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create support tickets" ON public.support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Support staff can view all tickets" ON public.support_tickets
  FOR SELECT USING (public.has_role(auth.uid(), 'support'));

-- Auto-create profile trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'first_name', 'User'),
    COALESCE(new.raw_user_meta_data ->> 'last_name', '')
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'regular-user');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
