
// Database types for the new Norwegian municipal booking system

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          phone?: string;
          avatar_url?: string;
          bio?: string;
          preferred_language: 'NO' | 'EN';
          date_of_birth?: string;
          address_street?: string;
          address_city?: string;
          address_postal_code?: string;
          address_country?: string;
          emergency_contact_name?: string;
          emergency_contact_phone?: string;
          is_active: boolean;
          last_login_at?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          phone?: string;
          avatar_url?: string;
          bio?: string;
          preferred_language?: 'NO' | 'EN';
          date_of_birth?: string;
          address_street?: string;
          address_city?: string;
          address_postal_code?: string;
          address_country?: string;
          emergency_contact_name?: string;
          emergency_contact_phone?: string;
          is_active?: boolean;
          last_login_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          phone?: string;
          avatar_url?: string;
          bio?: string;
          preferred_language?: 'NO' | 'EN';
          date_of_birth?: string;
          address_street?: string;
          address_city?: string;
          address_postal_code?: string;
          address_country?: string;
          emergency_contact_name?: string;
          emergency_contact_phone?: string;
          is_active?: boolean;
          last_login_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          name: string;
          type: 'lag-foreninger' | 'paraply' | 'private-firma' | 'kommunale-enheter' | 'utdanning' | 'helse' | 'kultur' | 'frivillig';
          org_number?: string;
          contact_email: string;
          contact_phone?: string;
          website?: string;
          description?: string;
          address_street: string;
          address_city: string;
          address_postal_code: string;
          address_country: string;
          status: 'active' | 'pending-verification' | 'suspended' | 'inactive';
          verification_level: 'unverified' | 'email-verified' | 'document-verified' | 'fully-verified';
          parent_organization_id?: string;
          founded_year?: number;
          member_count?: number;
          bank_account?: string;
          vat_number?: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          facility_id: number;
          zone_id?: string;
          user_id: string;
          organization_id?: string;
          booking_reference: string;
          status: 'draft' | 'pending-approval' | 'approved' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'rejected' | 'no-show';
          type: 'engangs' | 'fastlan' | 'rammetid' | 'strotimer';
          actor_type: 'lag-foreninger' | 'paraply' | 'private-firma' | 'kommunale-enheter' | 'private-person';
          purpose: string;
          event_type: 'training' | 'competition' | 'meeting' | 'celebration' | 'course' | 'conference' | 'performance' | 'exhibition' | 'drop-in' | 'other';
          expected_attendees: number;
          age_group: 'children' | 'youth' | 'adults' | 'seniors' | 'mixed' | 'family';
          description?: string;
          special_requirements?: string;
          start_date: string;
          end_date: string;
          duration_minutes: number;
          recurrence_rule?: string;
          recurrence_end_date?: string;
          contact_name: string;
          contact_email: string;
          contact_phone?: string;
          requires_approval: boolean;
          approval_status: 'not-required' | 'pending' | 'in-review' | 'approved' | 'rejected' | 'escalated';
          approved_by?: string;
          approved_at?: string;
          rejection_reason?: string;
          base_price: number;
          services_price: number;
          total_price: number;
          payment_status: string;
          payment_due_date?: string;
          cancelled_at?: string;
          cancellation_reason?: string;
          no_show_at?: string;
          internal_notes?: string;
          created_at: string;
          updated_at: string;
        };
      };
      strotime_slots: {
        Row: {
          id: string;
          facility_id: number;
          zone_id: string;
          slot_date: string;
          start_time: string;
          end_time: string;
          duration_minutes: 30 | 60;
          price_per_slot: number;
          max_participants: number;
          current_participants: number;
          is_available: boolean;
          published_at: string;
          published_by: string;
          released_from_rammetid: boolean;
          original_booking_id?: string;
          created_at: string;
        };
      };
      strotime_bookings: {
        Row: {
          id: string;
          strotime_slot_id: string;
          user_id?: string;
          contact_name: string;
          contact_email: string;
          contact_phone: string;
          participants: number;
          special_requirements?: string;
          status: 'confirmed' | 'cancelled' | 'no-show';
          booked_at: string;
          cancelled_at?: string;
          cancellation_reason?: string;
          payment_status: string;
          total_price: number;
        };
      };
    };
    Enums: {
      user_role: 'system-admin' | 'facility-manager' | 'caseworker' | 'municipal-staff' | 'organization-rep' | 'regular-user' | 'support' | 'paraply-rep';
      organization_type: 'lag-foreninger' | 'paraply' | 'private-firma' | 'kommunale-enheter' | 'utdanning' | 'helse' | 'kultur' | 'frivillig';
      booking_status: 'draft' | 'pending-approval' | 'approved' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'rejected' | 'no-show';
      booking_type: 'engangs' | 'fastlan' | 'rammetid' | 'strotimer';
      actor_type: 'lag-foreninger' | 'paraply' | 'private-firma' | 'kommunale-enheter' | 'private-person';
      language_code: 'NO' | 'EN';
    };
  };
}
