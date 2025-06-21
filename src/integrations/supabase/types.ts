export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      additional_services: {
        Row: {
          advance_booking_hours: number | null
          advance_booking_required: boolean
          availability_schedule: Json | null
          base_price: number
          booking_notes: string | null
          cancellation_policy: string | null
          category: Database["public"]["Enums"]["service_category"]
          created_at: string
          description: string | null
          equipment_required: string[] | null
          external_provider: string | null
          id: string
          is_active: boolean
          maximum_quantity: number | null
          minimum_quantity: number | null
          name: string
          pricing_model: string
          staff_required: boolean
          unit: string | null
          updated_at: string
        }
        Insert: {
          advance_booking_hours?: number | null
          advance_booking_required?: boolean
          availability_schedule?: Json | null
          base_price?: number
          booking_notes?: string | null
          cancellation_policy?: string | null
          category: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          equipment_required?: string[] | null
          external_provider?: string | null
          id?: string
          is_active?: boolean
          maximum_quantity?: number | null
          minimum_quantity?: number | null
          name: string
          pricing_model?: string
          staff_required?: boolean
          unit?: string | null
          updated_at?: string
        }
        Update: {
          advance_booking_hours?: number | null
          advance_booking_required?: boolean
          availability_schedule?: Json | null
          base_price?: number
          booking_notes?: string | null
          cancellation_policy?: string | null
          category?: Database["public"]["Enums"]["service_category"]
          created_at?: string
          description?: string | null
          equipment_required?: string[] | null
          external_provider?: string | null
          id?: string
          is_active?: boolean
          maximum_quantity?: number | null
          minimum_quantity?: number | null
          name?: string
          pricing_model?: string
          staff_required?: boolean
          unit?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      approval_decisions: {
        Row: {
          approval_request_id: string
          approver_id: string
          comments: string | null
          deadline: string | null
          decided_at: string
          decision: string
          id: string
          step_number: number
        }
        Insert: {
          approval_request_id: string
          approver_id: string
          comments?: string | null
          deadline?: string | null
          decided_at?: string
          decision: string
          id?: string
          step_number: number
        }
        Update: {
          approval_request_id?: string
          approver_id?: string
          comments?: string | null
          deadline?: string | null
          decided_at?: string
          decision?: string
          id?: string
          step_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "approval_decisions_approval_request_id_fkey"
            columns: ["approval_request_id"]
            isOneToOne: false
            referencedRelation: "approval_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_decisions_approver_id_fkey"
            columns: ["approver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_requests: {
        Row: {
          booking_id: string
          completed_at: string | null
          current_step: number
          escalated_at: string | null
          id: string
          notes: string | null
          priority: Database["public"]["Enums"]["approval_priority"]
          requested_at: string
          requested_by: string
          status: Database["public"]["Enums"]["approval_status"]
          workflow_id: string
        }
        Insert: {
          booking_id: string
          completed_at?: string | null
          current_step?: number
          escalated_at?: string | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["approval_priority"]
          requested_at?: string
          requested_by: string
          status?: Database["public"]["Enums"]["approval_status"]
          workflow_id: string
        }
        Update: {
          booking_id?: string
          completed_at?: string | null
          current_step?: number
          escalated_at?: string | null
          id?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["approval_priority"]
          requested_at?: string
          requested_by?: string
          status?: Database["public"]["Enums"]["approval_status"]
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_requests_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_requested_by_fkey"
            columns: ["requested_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_requests_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "approval_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_workflow_steps: {
        Row: {
          approver_role: Database["public"]["Enums"]["user_role"] | null
          approver_user_id: string | null
          auto_approve_conditions: Json | null
          created_at: string
          deadline_hours: number | null
          escalate_to_role: Database["public"]["Enums"]["user_role"] | null
          escalate_to_user_id: string | null
          escalation_hours: number | null
          id: string
          is_required: boolean
          step_name: string
          step_number: number
          workflow_id: string
        }
        Insert: {
          approver_role?: Database["public"]["Enums"]["user_role"] | null
          approver_user_id?: string | null
          auto_approve_conditions?: Json | null
          created_at?: string
          deadline_hours?: number | null
          escalate_to_role?: Database["public"]["Enums"]["user_role"] | null
          escalate_to_user_id?: string | null
          escalation_hours?: number | null
          id?: string
          is_required?: boolean
          step_name: string
          step_number: number
          workflow_id: string
        }
        Update: {
          approver_role?: Database["public"]["Enums"]["user_role"] | null
          approver_user_id?: string | null
          auto_approve_conditions?: Json | null
          created_at?: string
          deadline_hours?: number | null
          escalate_to_role?: Database["public"]["Enums"]["user_role"] | null
          escalate_to_user_id?: string | null
          escalation_hours?: number | null
          id?: string
          is_required?: boolean
          step_name?: string
          step_number?: number
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_workflow_steps_approver_user_id_fkey"
            columns: ["approver_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_workflow_steps_escalate_to_user_id_fkey"
            columns: ["escalate_to_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "approval_workflow_steps_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "approval_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      approval_workflows: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          is_active: boolean
          is_default: boolean
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_default?: boolean
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "approval_workflows_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          session_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          session_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auto_approval_rules: {
        Row: {
          action: string
          conditions: Json
          created_at: string
          id: string
          is_active: boolean
          rule_name: string
          workflow_id: string
        }
        Insert: {
          action: string
          conditions: Json
          created_at?: string
          id?: string
          is_active?: boolean
          rule_name: string
          workflow_id: string
        }
        Update: {
          action?: string
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          rule_name?: string
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "auto_approval_rules_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "approval_workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_attachments: {
        Row: {
          booking_id: string
          file_name: string
          file_size: number
          file_url: string
          id: string
          mime_type: string
          uploaded_at: string
          uploaded_by: string
        }
        Insert: {
          booking_id: string
          file_name: string
          file_size: number
          file_url: string
          id?: string
          mime_type: string
          uploaded_at?: string
          uploaded_by: string
        }
        Update: {
          booking_id?: string
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          mime_type?: string
          uploaded_at?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_attachments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_conflicts: {
        Row: {
          booking_id: string
          conflict_description: string | null
          conflict_severity: string
          conflict_type: string
          conflicting_booking_id: string | null
          created_at: string
          id: string
          resolution_notes: string | null
          resolved: boolean
          resolved_at: string | null
          resolved_by: string | null
        }
        Insert: {
          booking_id: string
          conflict_description?: string | null
          conflict_severity?: string
          conflict_type: string
          conflicting_booking_id?: string | null
          created_at?: string
          id?: string
          resolution_notes?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Update: {
          booking_id?: string
          conflict_description?: string | null
          conflict_severity?: string
          conflict_type?: string
          conflicting_booking_id?: string | null
          created_at?: string
          id?: string
          resolution_notes?: string | null
          resolved?: boolean
          resolved_at?: string | null
          resolved_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_conflicts_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_conflicts_conflicting_booking_id_fkey"
            columns: ["conflicting_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_conflicts_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_notes: {
        Row: {
          booking_id: string
          content: string
          created_at: string
          id: string
          is_important: boolean
          is_internal: boolean
          user_id: string
        }
        Insert: {
          booking_id: string
          content: string
          created_at?: string
          id?: string
          is_important?: boolean
          is_internal?: boolean
          user_id: string
        }
        Update: {
          booking_id?: string
          content?: string
          created_at?: string
          id?: string
          is_important?: boolean
          is_internal?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_notes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_recurrence_exceptions: {
        Row: {
          booking_id: string
          created_at: string
          exception_date: string
          exception_type: string
          id: string
          new_end_time: string | null
          new_start_time: string | null
          new_zone_id: string | null
          reason: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          exception_date: string
          exception_type: string
          id?: string
          new_end_time?: string | null
          new_start_time?: string | null
          new_zone_id?: string | null
          reason?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          exception_date?: string
          exception_type?: string
          id?: string
          new_end_time?: string | null
          new_start_time?: string | null
          new_zone_id?: string | null
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_recurrence_exceptions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_recurrence_exceptions_new_zone_id_fkey"
            columns: ["new_zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_recurrence_patterns: {
        Row: {
          booking_id: string
          created_at: string
          day_of_month: number | null
          days_of_week: number[] | null
          end_date: string | null
          frequency: string
          id: string
          interval_value: number
          max_occurrences: number | null
          month_of_year: number | null
          week_of_month: number | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          day_of_month?: number | null
          days_of_week?: number[] | null
          end_date?: string | null
          frequency: string
          id?: string
          interval_value?: number
          max_occurrences?: number | null
          month_of_year?: number | null
          week_of_month?: number | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          day_of_month?: number | null
          days_of_week?: number[] | null
          end_date?: string | null
          frequency?: string
          id?: string
          interval_value?: number
          max_occurrences?: number | null
          month_of_year?: number | null
          week_of_month?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_recurrence_patterns_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          actor_type: Database["public"]["Enums"]["actor_type"]
          age_group: Database["public"]["Enums"]["age_group"]
          approval_status: Database["public"]["Enums"]["approval_status"]
          approved_at: string | null
          approved_by: string | null
          base_price: number
          booking_reference: string
          cancellation_reason: string | null
          cancelled_at: string | null
          contact_email: string
          contact_name: string
          contact_phone: string | null
          created_at: string
          description: string | null
          duration_minutes: number
          end_date: string
          event_type: Database["public"]["Enums"]["event_type"]
          expected_attendees: number
          facility_id: number
          id: string
          internal_notes: string | null
          no_show_at: string | null
          organization_id: string | null
          payment_due_date: string | null
          payment_status: string
          purpose: string
          recurrence_end_date: string | null
          recurrence_rule: string | null
          rejection_reason: string | null
          requires_approval: boolean
          services_price: number
          special_requirements: string | null
          start_date: string
          status: Database["public"]["Enums"]["booking_status"]
          total_price: number
          type: Database["public"]["Enums"]["booking_type"]
          updated_at: string
          user_id: string
          zone_id: string | null
        }
        Insert: {
          actor_type: Database["public"]["Enums"]["actor_type"]
          age_group?: Database["public"]["Enums"]["age_group"]
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          base_price?: number
          booking_reference: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          contact_email: string
          contact_name: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          duration_minutes: number
          end_date: string
          event_type?: Database["public"]["Enums"]["event_type"]
          expected_attendees?: number
          facility_id: number
          id?: string
          internal_notes?: string | null
          no_show_at?: string | null
          organization_id?: string | null
          payment_due_date?: string | null
          payment_status?: string
          purpose: string
          recurrence_end_date?: string | null
          recurrence_rule?: string | null
          rejection_reason?: string | null
          requires_approval?: boolean
          services_price?: number
          special_requirements?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          type?: Database["public"]["Enums"]["booking_type"]
          updated_at?: string
          user_id: string
          zone_id?: string | null
        }
        Update: {
          actor_type?: Database["public"]["Enums"]["actor_type"]
          age_group?: Database["public"]["Enums"]["age_group"]
          approval_status?: Database["public"]["Enums"]["approval_status"]
          approved_at?: string | null
          approved_by?: string | null
          base_price?: number
          booking_reference?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          duration_minutes?: number
          end_date?: string
          event_type?: Database["public"]["Enums"]["event_type"]
          expected_attendees?: number
          facility_id?: number
          id?: string
          internal_notes?: string | null
          no_show_at?: string | null
          organization_id?: string | null
          payment_due_date?: string | null
          payment_status?: string
          purpose?: string
          recurrence_end_date?: string | null
          recurrence_rule?: string | null
          rejection_reason?: string | null
          requires_approval?: boolean
          services_price?: number
          special_requirements?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_status"]
          total_price?: number
          type?: Database["public"]["Enums"]["booking_type"]
          updated_at?: string
          user_id?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      enum_categories: {
        Row: {
          description: string | null
          display_order: number
          enum_types: string[]
          id: string
          is_active: boolean
          name: string
        }
        Insert: {
          description?: string | null
          display_order?: number
          enum_types: string[]
          id?: string
          is_active?: boolean
          name: string
        }
        Update: {
          description?: string | null
          display_order?: number
          enum_types?: string[]
          id?: string
          is_active?: boolean
          name?: string
        }
        Relationships: []
      }
      enum_translations: {
        Row: {
          created_at: string
          description: string | null
          enum_id: string
          id: string
          label: string
          language_code: Database["public"]["Enums"]["language_code"]
          short_label: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          enum_id: string
          id?: string
          label: string
          language_code: Database["public"]["Enums"]["language_code"]
          short_label?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          enum_id?: string
          id?: string
          label?: string
          language_code?: Database["public"]["Enums"]["language_code"]
          short_label?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enum_translations_enum_id_fkey"
            columns: ["enum_id"]
            isOneToOne: false
            referencedRelation: "system_enums"
            referencedColumns: ["id"]
          },
        ]
      }
      facilities: {
        Row: {
          accessibility_features: string[] | null
          address_city: string
          address_country: string
          address_postal_code: string
          address_street: string
          allowed_booking_types: Database["public"]["Enums"]["booking_type"][]
          amenities: string[] | null
          area: string
          area_sqm: number | null
          booking_lead_time_hours: number
          cancellation_deadline_hours: number
          capacity: number
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          equipment: string[] | null
          has_auto_approval: boolean
          id: number
          image_url: string | null
          is_featured: boolean
          latitude: number | null
          longitude: number | null
          max_advance_booking_days: number
          name: string
          next_available: string | null
          price_per_hour: number
          rating: number | null
          review_count: number | null
          season_from: string | null
          season_to: string | null
          status: Database["public"]["Enums"]["facility_status"]
          time_slot_duration: number
          type: string
          updated_at: string
        }
        Insert: {
          accessibility_features?: string[] | null
          address_city: string
          address_country?: string
          address_postal_code: string
          address_street: string
          allowed_booking_types?: Database["public"]["Enums"]["booking_type"][]
          amenities?: string[] | null
          area: string
          area_sqm?: number | null
          booking_lead_time_hours?: number
          cancellation_deadline_hours?: number
          capacity?: number
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          has_auto_approval?: boolean
          id?: number
          image_url?: string | null
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          max_advance_booking_days?: number
          name: string
          next_available?: string | null
          price_per_hour?: number
          rating?: number | null
          review_count?: number | null
          season_from?: string | null
          season_to?: string | null
          status?: Database["public"]["Enums"]["facility_status"]
          time_slot_duration?: number
          type: string
          updated_at?: string
        }
        Update: {
          accessibility_features?: string[] | null
          address_city?: string
          address_country?: string
          address_postal_code?: string
          address_street?: string
          allowed_booking_types?: Database["public"]["Enums"]["booking_type"][]
          amenities?: string[] | null
          area?: string
          area_sqm?: number | null
          booking_lead_time_hours?: number
          cancellation_deadline_hours?: number
          capacity?: number
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          has_auto_approval?: boolean
          id?: number
          image_url?: string | null
          is_featured?: boolean
          latitude?: number | null
          longitude?: number | null
          max_advance_booking_days?: number
          name?: string
          next_available?: string | null
          price_per_hour?: number
          rating?: number | null
          review_count?: number | null
          season_from?: string | null
          season_to?: string | null
          status?: Database["public"]["Enums"]["facility_status"]
          time_slot_duration?: number
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      facility_blackout_periods: {
        Row: {
          created_at: string
          created_by: string
          end_date: string
          facility_id: number
          id: string
          reason: string
          start_date: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          end_date: string
          facility_id: number
          id?: string
          reason: string
          start_date: string
          type?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          end_date?: string
          facility_id?: number
          id?: string
          reason?: string
          start_date?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_blackout_periods_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "facility_blackout_periods_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          display_order: number
          facility_id: number
          id: string
          image_url: string
          is_primary: boolean
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          facility_id: number
          id?: string
          image_url: string
          is_primary?: boolean
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          facility_id?: number
          id?: string
          image_url?: string
          is_primary?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "facility_images_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_opening_hours: {
        Row: {
          close_time: string
          created_at: string
          day_of_week: number
          facility_id: number
          id: string
          is_open: boolean
          open_time: string
          valid_from: string | null
          valid_to: string | null
        }
        Insert: {
          close_time: string
          created_at?: string
          day_of_week: number
          facility_id: number
          id?: string
          is_open?: boolean
          open_time: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Update: {
          close_time?: string
          created_at?: string
          day_of_week?: number
          facility_id?: number
          id?: string
          is_open?: boolean
          open_time?: string
          valid_from?: string | null
          valid_to?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "facility_opening_hours_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      facility_translations: {
        Row: {
          created_at: string
          description: string | null
          directions: string | null
          facility_id: number
          id: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          rules: string | null
          short_description: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          directions?: string | null
          facility_id: number
          id?: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          rules?: string | null
          short_description?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          directions?: string | null
          facility_id?: number
          id?: string
          language_code?: Database["public"]["Enums"]["language_code"]
          name?: string
          rules?: string | null
          short_description?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "facility_translations_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_logs: {
        Row: {
          body: string
          booking_id: string | null
          channel: string
          delivered_at: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          recipient: string
          sent_at: string
          status: string
          subject: string | null
          template_id: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          body: string
          booking_id?: string | null
          channel: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient: string
          sent_at?: string
          status?: string
          subject?: string | null
          template_id?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          body?: string
          booking_id?: string | null
          channel?: string
          delivered_at?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          recipient?: string
          sent_at?: string
          status?: string
          subject?: string | null
          template_id?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_logs_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          body_template: string
          created_at: string
          id: string
          is_active: boolean
          is_email: boolean
          is_push: boolean
          is_sms: boolean
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          subject_template: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
          variables: Json | null
        }
        Insert: {
          body_template: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_email?: boolean
          is_push?: boolean
          is_sms?: boolean
          language_code?: Database["public"]["Enums"]["language_code"]
          name: string
          subject_template: string
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          variables?: Json | null
        }
        Update: {
          body_template?: string
          created_at?: string
          id?: string
          is_active?: boolean
          is_email?: boolean
          is_push?: boolean
          is_sms?: boolean
          language_code?: Database["public"]["Enums"]["language_code"]
          name?: string
          subject_template?: string
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
          variables?: Json | null
        }
        Relationships: []
      }
      organization_contacts: {
        Row: {
          can_approve_bookings: boolean
          can_make_bookings: boolean
          can_manage_members: boolean
          created_at: string
          id: string
          is_primary: boolean
          organization_id: string
          role: string
          user_id: string
        }
        Insert: {
          can_approve_bookings?: boolean
          can_make_bookings?: boolean
          can_manage_members?: boolean
          created_at?: string
          id?: string
          is_primary?: boolean
          organization_id: string
          role?: string
          user_id: string
        }
        Update: {
          can_approve_bookings?: boolean
          can_make_bookings?: boolean
          can_manage_members?: boolean
          created_at?: string
          id?: string
          is_primary?: boolean
          organization_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_contacts_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_contacts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organization_verification_documents: {
        Row: {
          created_at: string
          document_type: string
          file_name: string
          file_size: number
          file_url: string
          id: string
          is_verified: boolean
          notes: string | null
          organization_id: string
          uploaded_by: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_type: string
          file_name: string
          file_size: number
          file_url: string
          id?: string
          is_verified?: boolean
          notes?: string | null
          organization_id: string
          uploaded_by: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_type?: string
          file_name?: string
          file_size?: number
          file_url?: string
          id?: string
          is_verified?: boolean
          notes?: string | null
          organization_id?: string
          uploaded_by?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organization_verification_documents_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_verification_documents_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_verification_documents_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          address_city: string
          address_country: string
          address_postal_code: string
          address_street: string
          bank_account: string | null
          contact_email: string
          contact_phone: string | null
          created_at: string
          description: string | null
          founded_year: number | null
          id: string
          is_active: boolean
          member_count: number | null
          name: string
          org_number: string | null
          parent_organization_id: string | null
          status: Database["public"]["Enums"]["organization_status"]
          type: Database["public"]["Enums"]["organization_type"]
          updated_at: string
          vat_number: string | null
          verification_level: Database["public"]["Enums"]["verification_level"]
          website: string | null
        }
        Insert: {
          address_city: string
          address_country?: string
          address_postal_code: string
          address_street: string
          bank_account?: string | null
          contact_email: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          is_active?: boolean
          member_count?: number | null
          name: string
          org_number?: string | null
          parent_organization_id?: string | null
          status?: Database["public"]["Enums"]["organization_status"]
          type: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
          vat_number?: string | null
          verification_level?: Database["public"]["Enums"]["verification_level"]
          website?: string | null
        }
        Update: {
          address_city?: string
          address_country?: string
          address_postal_code?: string
          address_street?: string
          bank_account?: string | null
          contact_email?: string
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          founded_year?: number | null
          id?: string
          is_active?: boolean
          member_count?: number | null
          name?: string
          org_number?: string | null
          parent_organization_id?: string | null
          status?: Database["public"]["Enums"]["organization_status"]
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
          vat_number?: string | null
          verification_level?: Database["public"]["Enums"]["verification_level"]
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "organizations_parent_organization_id_fkey"
            columns: ["parent_organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_calculations: {
        Row: {
          actor_type: Database["public"]["Enums"]["actor_type"]
          actor_type_multiplier: number
          base_price: number
          booking_id: string | null
          calculated_by: string | null
          calculation_date: string
          currency: string
          day_type_multiplier: number
          discount_amount: number
          final_price: number
          id: string
          subtotal: number
          surcharge_amount: number
          time_slot_multiplier: number
          total_hours: number
        }
        Insert: {
          actor_type: Database["public"]["Enums"]["actor_type"]
          actor_type_multiplier?: number
          base_price: number
          booking_id?: string | null
          calculated_by?: string | null
          calculation_date?: string
          currency?: string
          day_type_multiplier?: number
          discount_amount?: number
          final_price: number
          id?: string
          subtotal: number
          surcharge_amount?: number
          time_slot_multiplier?: number
          total_hours: number
        }
        Update: {
          actor_type?: Database["public"]["Enums"]["actor_type"]
          actor_type_multiplier?: number
          base_price?: number
          booking_id?: string | null
          calculated_by?: string | null
          calculation_date?: string
          currency?: string
          day_type_multiplier?: number
          discount_amount?: number
          final_price?: number
          id?: string
          subtotal?: number
          surcharge_amount?: number
          time_slot_multiplier?: number
          total_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "pricing_calculations_calculated_by_fkey"
            columns: ["calculated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_rules: {
        Row: {
          actor_type: Database["public"]["Enums"]["actor_type"]
          base_price: number
          booking_type: Database["public"]["Enums"]["booking_type"]
          created_at: string
          day_type: Database["public"]["Enums"]["day_type"] | null
          description: string | null
          facility_id: number | null
          fixed_price: number | null
          id: string
          is_active: boolean
          maximum_duration: number | null
          minimum_duration: number | null
          multiplier: number
          time_slot_category:
            | Database["public"]["Enums"]["time_slot_category"]
            | null
          updated_at: string
          valid_from: string
          valid_to: string | null
          zone_id: string | null
        }
        Insert: {
          actor_type: Database["public"]["Enums"]["actor_type"]
          base_price: number
          booking_type?: Database["public"]["Enums"]["booking_type"]
          created_at?: string
          day_type?: Database["public"]["Enums"]["day_type"] | null
          description?: string | null
          facility_id?: number | null
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          maximum_duration?: number | null
          minimum_duration?: number | null
          multiplier?: number
          time_slot_category?:
            | Database["public"]["Enums"]["time_slot_category"]
            | null
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
          zone_id?: string | null
        }
        Update: {
          actor_type?: Database["public"]["Enums"]["actor_type"]
          base_price?: number
          booking_type?: Database["public"]["Enums"]["booking_type"]
          created_at?: string
          day_type?: Database["public"]["Enums"]["day_type"] | null
          description?: string | null
          facility_id?: number | null
          fixed_price?: number | null
          id?: string
          is_active?: boolean
          maximum_duration?: number | null
          minimum_duration?: number | null
          multiplier?: number
          time_slot_category?:
            | Database["public"]["Enums"]["time_slot_category"]
            | null
          updated_at?: string
          valid_from?: string
          valid_to?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pricing_rules_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_rules_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_postal_code: string | null
          address_street: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string
          date_of_birth: string | null
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          first_name: string
          id: string
          is_active: boolean
          last_login_at: string | null
          last_name: string
          phone: string | null
          preferred_language: Database["public"]["Enums"]["language_code"]
          updated_at: string
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name: string
          id: string
          is_active?: boolean
          last_login_at?: string | null
          last_name: string
          phone?: string | null
          preferred_language?: Database["public"]["Enums"]["language_code"]
          updated_at?: string
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_postal_code?: string | null
          address_street?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          first_name?: string
          id?: string
          is_active?: boolean
          last_login_at?: string | null
          last_name?: string
          phone?: string | null
          preferred_language?: Database["public"]["Enums"]["language_code"]
          updated_at?: string
        }
        Relationships: []
      }
      rammetid_allocations: {
        Row: {
          allocated_by: string
          allocation_notes: string | null
          auto_release_hours_before: number | null
          can_release_as_strotime: boolean
          created_at: string
          day_of_week: number
          end_time: string
          facility_id: number
          id: string
          is_active: boolean
          organization_id: string
          start_time: string
          valid_from: string
          valid_to: string
          zone_id: string | null
        }
        Insert: {
          allocated_by: string
          allocation_notes?: string | null
          auto_release_hours_before?: number | null
          can_release_as_strotime?: boolean
          created_at?: string
          day_of_week: number
          end_time: string
          facility_id: number
          id?: string
          is_active?: boolean
          organization_id: string
          start_time: string
          valid_from: string
          valid_to: string
          zone_id?: string | null
        }
        Update: {
          allocated_by?: string
          allocation_notes?: string | null
          auto_release_hours_before?: number | null
          can_release_as_strotime?: boolean
          created_at?: string
          day_of_week?: number
          end_time?: string
          facility_id?: number
          id?: string
          is_active?: boolean
          organization_id?: string
          start_time?: string
          valid_from?: string
          valid_to?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rammetid_allocations_allocated_by_fkey"
            columns: ["allocated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rammetid_allocations_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rammetid_allocations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rammetid_allocations_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      rammetid_releases: {
        Row: {
          auto_released: boolean
          id: string
          rammetid_allocation_id: string
          release_date: string
          release_reason: string | null
          release_time_end: string
          release_time_start: string
          released_at: string
          released_by: string
          strotime_price: number
          strotime_slot_duration: number
        }
        Insert: {
          auto_released?: boolean
          id?: string
          rammetid_allocation_id: string
          release_date: string
          release_reason?: string | null
          release_time_end: string
          release_time_start: string
          released_at?: string
          released_by: string
          strotime_price?: number
          strotime_slot_duration?: number
        }
        Update: {
          auto_released?: boolean
          id?: string
          rammetid_allocation_id?: string
          release_date?: string
          release_reason?: string | null
          release_time_end?: string
          release_time_start?: string
          released_at?: string
          released_by?: string
          strotime_price?: number
          strotime_slot_duration?: number
        }
        Relationships: [
          {
            foreignKeyName: "rammetid_releases_rammetid_allocation_id_fkey"
            columns: ["rammetid_allocation_id"]
            isOneToOne: false
            referencedRelation: "rammetid_allocations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rammetid_releases_released_by_fkey"
            columns: ["released_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      seasonal_pricing: {
        Row: {
          created_at: string
          end_date: string
          id: string
          is_active: boolean
          multiplier: number
          pricing_rule_id: string
          season_name: string
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          is_active?: boolean
          multiplier?: number
          pricing_rule_id: string
          season_name: string
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          is_active?: boolean
          multiplier?: number
          pricing_rule_id?: string
          season_name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "seasonal_pricing_pricing_rule_id_fkey"
            columns: ["pricing_rule_id"]
            isOneToOne: false
            referencedRelation: "pricing_rules"
            referencedColumns: ["id"]
          },
        ]
      }
      service_availability: {
        Row: {
          created_at: string
          day_of_week: number | null
          end_time: string | null
          facility_id: number | null
          id: string
          is_available: boolean
          max_concurrent_bookings: number | null
          service_id: string
          start_time: string | null
          zone_id: string | null
        }
        Insert: {
          created_at?: string
          day_of_week?: number | null
          end_time?: string | null
          facility_id?: number | null
          id?: string
          is_available?: boolean
          max_concurrent_bookings?: number | null
          service_id: string
          start_time?: string | null
          zone_id?: string | null
        }
        Update: {
          created_at?: string
          day_of_week?: number | null
          end_time?: string | null
          facility_id?: number | null
          id?: string
          is_available?: boolean
          max_concurrent_bookings?: number | null
          service_id?: string
          start_time?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_availability_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_availability_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "additional_services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_availability_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      service_bookings: {
        Row: {
          booking_id: string
          created_at: string
          end_time: string | null
          id: string
          quantity: number
          service_id: string
          special_instructions: string | null
          start_time: string | null
          status: string
          total_price: number
          unit_price: number
        }
        Insert: {
          booking_id: string
          created_at?: string
          end_time?: string | null
          id?: string
          quantity?: number
          service_id: string
          special_instructions?: string | null
          start_time?: string | null
          status?: string
          total_price: number
          unit_price: number
        }
        Update: {
          booking_id?: string
          created_at?: string
          end_time?: string | null
          id?: string
          quantity?: number
          service_id?: string
          special_instructions?: string | null
          start_time?: string | null
          status?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_bookings_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "additional_services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_translations: {
        Row: {
          booking_notes: string | null
          cancellation_policy: string | null
          created_at: string
          description: string | null
          id: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          service_id: string
          unit: string | null
          updated_at: string
        }
        Insert: {
          booking_notes?: string | null
          cancellation_policy?: string | null
          created_at?: string
          description?: string | null
          id?: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          service_id: string
          unit?: string | null
          updated_at?: string
        }
        Update: {
          booking_notes?: string | null
          cancellation_policy?: string | null
          created_at?: string
          description?: string | null
          id?: string
          language_code?: Database["public"]["Enums"]["language_code"]
          name?: string
          service_id?: string
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_translations_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "additional_services"
            referencedColumns: ["id"]
          },
        ]
      }
      strotime_bookings: {
        Row: {
          booked_at: string
          cancellation_reason: string | null
          cancelled_at: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          id: string
          participants: number
          payment_status: string
          special_requirements: string | null
          status: string
          strotime_slot_id: string
          total_price: number
          user_id: string | null
        }
        Insert: {
          booked_at?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          contact_email: string
          contact_name: string
          contact_phone: string
          id?: string
          participants?: number
          payment_status?: string
          special_requirements?: string | null
          status?: string
          strotime_slot_id: string
          total_price: number
          user_id?: string | null
        }
        Update: {
          booked_at?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          contact_email?: string
          contact_name?: string
          contact_phone?: string
          id?: string
          participants?: number
          payment_status?: string
          special_requirements?: string | null
          status?: string
          strotime_slot_id?: string
          total_price?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strotime_bookings_strotime_slot_id_fkey"
            columns: ["strotime_slot_id"]
            isOneToOne: false
            referencedRelation: "strotime_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strotime_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      strotime_slots: {
        Row: {
          created_at: string
          current_participants: number
          duration_minutes: number
          end_time: string
          facility_id: number
          id: string
          is_available: boolean
          max_participants: number
          original_booking_id: string | null
          price_per_slot: number
          published_at: string
          published_by: string
          released_from_rammetid: boolean
          slot_date: string
          start_time: string
          zone_id: string
        }
        Insert: {
          created_at?: string
          current_participants?: number
          duration_minutes: number
          end_time: string
          facility_id: number
          id?: string
          is_available?: boolean
          max_participants?: number
          original_booking_id?: string | null
          price_per_slot: number
          published_at?: string
          published_by: string
          released_from_rammetid?: boolean
          slot_date: string
          start_time: string
          zone_id: string
        }
        Update: {
          created_at?: string
          current_participants?: number
          duration_minutes?: number
          end_time?: string
          facility_id?: number
          id?: string
          is_available?: boolean
          max_participants?: number
          original_booking_id?: string | null
          price_per_slot?: number
          published_at?: string
          published_by?: string
          released_from_rammetid?: boolean
          slot_date?: string
          start_time?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "strotime_slots_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strotime_slots_original_booking_id_fkey"
            columns: ["original_booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strotime_slots_published_by_fkey"
            columns: ["published_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strotime_slots_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          booking_id: string | null
          category: string
          created_at: string
          description: string
          id: string
          priority: string
          resolution_notes: string | null
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_to?: string | null
          booking_id?: string | null
          category?: string
          created_at?: string
          description: string
          id?: string
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_to?: string | null
          booking_id?: string | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: string
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_configurations: {
        Row: {
          description: string | null
          id: string
          is_public: boolean
          key: string
          updated_at: string
          updated_by: string
          value: Json
        }
        Insert: {
          description?: string | null
          id?: string
          is_public?: boolean
          key: string
          updated_at?: string
          updated_by: string
          value: Json
        }
        Update: {
          description?: string | null
          id?: string
          is_public?: boolean
          key?: string
          updated_at?: string
          updated_by?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_configurations_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_enums: {
        Row: {
          created_at: string
          display_order: number
          enum_key: string
          enum_type: string
          id: string
          is_active: boolean
          metadata: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          enum_key: string
          enum_type: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_order?: number
          enum_key?: string
          enum_type?: string
          id?: string
          is_active?: boolean
          metadata?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      user_booking_preferences: {
        Row: {
          auto_rebook: boolean
          created_at: string
          default_duration: number
          frequent_facilities: number[] | null
          id: string
          preferred_time_slots: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_rebook?: boolean
          created_at?: string
          default_duration?: number
          frequent_facilities?: number[] | null
          id?: string
          preferred_time_slots?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_rebook?: boolean
          created_at?: string
          default_duration?: number
          frequent_facilities?: number[] | null
          id?: string
          preferred_time_slots?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_booking_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notification_preferences: {
        Row: {
          approval_updates: boolean
          booking_reminders: boolean
          created_at: string
          email_enabled: boolean
          id: string
          marketing_emails: boolean
          push_enabled: boolean
          reminder_hours_before: number
          sms_enabled: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          approval_updates?: boolean
          booking_reminders?: boolean
          created_at?: string
          email_enabled?: boolean
          id?: string
          marketing_emails?: boolean
          push_enabled?: boolean
          reminder_hours_before?: number
          sms_enabled?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          approval_updates?: boolean
          booking_reminders?: boolean
          created_at?: string
          email_enabled?: boolean
          id?: string
          marketing_emails?: boolean
          push_enabled?: boolean
          reminder_hours_before?: number
          sms_enabled?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notification_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_permissions: {
        Row: {
          action: string
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          resource: string
          scope: string | null
          user_id: string
        }
        Insert: {
          action: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          resource: string
          scope?: string | null
          user_id: string
        }
        Update: {
          action?: string
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          resource?: string
          scope?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          expires_at: string | null
          granted_at: string
          granted_by: string | null
          id: string
          is_active: boolean
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          expires_at?: string | null
          granted_at?: string
          granted_by?: string | null
          id?: string
          is_active?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      zone_conflict_rules: {
        Row: {
          conflict_type: string
          conflicting_zone_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          zone_id: string
        }
        Insert: {
          conflict_type?: string
          conflicting_zone_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          zone_id: string
        }
        Update: {
          conflict_type?: string
          conflicting_zone_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zone_conflict_rules_conflicting_zone_id_fkey"
            columns: ["conflicting_zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zone_conflict_rules_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      zone_opening_hours: {
        Row: {
          close_time: string
          created_at: string
          day_of_week: number
          id: string
          is_open: boolean
          open_time: string
          valid_from: string | null
          valid_to: string | null
          zone_id: string
        }
        Insert: {
          close_time: string
          created_at?: string
          day_of_week: number
          id?: string
          is_open?: boolean
          open_time: string
          valid_from?: string | null
          valid_to?: string | null
          zone_id: string
        }
        Update: {
          close_time?: string
          created_at?: string
          day_of_week?: number
          id?: string
          is_open?: boolean
          open_time?: string
          valid_from?: string | null
          valid_to?: string | null
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zone_opening_hours_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      zone_translations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          updated_at: string
          zone_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          language_code: Database["public"]["Enums"]["language_code"]
          name: string
          updated_at?: string
          zone_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          language_code?: Database["public"]["Enums"]["language_code"]
          name?: string
          updated_at?: string
          zone_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "zone_translations_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
      zones: {
        Row: {
          accessibility_features: string[] | null
          area_sqm: number | null
          bookable_independently: boolean
          capacity: number
          coordinates_height: number | null
          coordinates_width: number | null
          coordinates_x: number | null
          coordinates_y: number | null
          created_at: string
          description: string | null
          equipment: string[] | null
          facility_id: number
          floor: string | null
          id: string
          is_main_zone: boolean
          name: string
          parent_zone_id: string | null
          status: Database["public"]["Enums"]["facility_status"]
          type: Database["public"]["Enums"]["zone_type"]
          updated_at: string
        }
        Insert: {
          accessibility_features?: string[] | null
          area_sqm?: number | null
          bookable_independently?: boolean
          capacity?: number
          coordinates_height?: number | null
          coordinates_width?: number | null
          coordinates_x?: number | null
          coordinates_y?: number | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          facility_id: number
          floor?: string | null
          id?: string
          is_main_zone?: boolean
          name: string
          parent_zone_id?: string | null
          status?: Database["public"]["Enums"]["facility_status"]
          type?: Database["public"]["Enums"]["zone_type"]
          updated_at?: string
        }
        Update: {
          accessibility_features?: string[] | null
          area_sqm?: number | null
          bookable_independently?: boolean
          capacity?: number
          coordinates_height?: number | null
          coordinates_width?: number | null
          coordinates_x?: number | null
          coordinates_y?: number | null
          created_at?: string
          description?: string | null
          equipment?: string[] | null
          facility_id?: number
          floor?: string | null
          id?: string
          is_main_zone?: boolean
          name?: string
          parent_zone_id?: string | null
          status?: Database["public"]["Enums"]["facility_status"]
          type?: Database["public"]["Enums"]["zone_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "zones_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "zones_parent_zone_id_fkey"
            columns: ["parent_zone_id"]
            isOneToOne: false
            referencedRelation: "zones"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      actor_type:
        | "lag-foreninger"
        | "paraply"
        | "private-firma"
        | "kommunale-enheter"
        | "private-person"
      age_group:
        | "children"
        | "youth"
        | "adults"
        | "seniors"
        | "mixed"
        | "family"
      approval_priority: "low" | "normal" | "high" | "urgent"
      approval_status:
        | "not-required"
        | "pending"
        | "in-review"
        | "approved"
        | "rejected"
        | "escalated"
      booking_status:
        | "draft"
        | "pending-approval"
        | "approved"
        | "confirmed"
        | "in-progress"
        | "completed"
        | "cancelled"
        | "rejected"
        | "no-show"
      booking_type: "engangs" | "fastlan" | "rammetid" | "strotimer"
      day_type: "weekday" | "weekend" | "holiday"
      event_type:
        | "training"
        | "competition"
        | "meeting"
        | "celebration"
        | "course"
        | "conference"
        | "performance"
        | "exhibition"
        | "drop-in"
        | "other"
      facility_status: "active" | "maintenance" | "inactive"
      language_code: "NO" | "EN"
      notification_type:
        | "booking-confirmation"
        | "booking-reminder"
        | "approval-request"
        | "approval-decision"
        | "cancellation"
        | "modification"
        | "payment-due"
        | "system-maintenance"
      organization_status:
        | "active"
        | "pending-verification"
        | "suspended"
        | "inactive"
      organization_type:
        | "lag-foreninger"
        | "paraply"
        | "private-firma"
        | "kommunale-enheter"
        | "utdanning"
        | "helse"
        | "kultur"
        | "frivillig"
      service_category:
        | "cleaning"
        | "parking"
        | "personnel"
        | "equipment"
        | "catering"
        | "security"
        | "technical"
        | "decoration"
        | "transport"
        | "wellness"
      time_slot_category: "morning" | "day" | "evening" | "night"
      user_role:
        | "system-admin"
        | "facility-manager"
        | "caseworker"
        | "municipal-staff"
        | "organization-rep"
        | "regular-user"
        | "support"
        | "paraply-rep"
      verification_level:
        | "unverified"
        | "email-verified"
        | "document-verified"
        | "fully-verified"
      zone_type: "court" | "room" | "area" | "section" | "field"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      actor_type: [
        "lag-foreninger",
        "paraply",
        "private-firma",
        "kommunale-enheter",
        "private-person",
      ],
      age_group: ["children", "youth", "adults", "seniors", "mixed", "family"],
      approval_priority: ["low", "normal", "high", "urgent"],
      approval_status: [
        "not-required",
        "pending",
        "in-review",
        "approved",
        "rejected",
        "escalated",
      ],
      booking_status: [
        "draft",
        "pending-approval",
        "approved",
        "confirmed",
        "in-progress",
        "completed",
        "cancelled",
        "rejected",
        "no-show",
      ],
      booking_type: ["engangs", "fastlan", "rammetid", "strotimer"],
      day_type: ["weekday", "weekend", "holiday"],
      event_type: [
        "training",
        "competition",
        "meeting",
        "celebration",
        "course",
        "conference",
        "performance",
        "exhibition",
        "drop-in",
        "other",
      ],
      facility_status: ["active", "maintenance", "inactive"],
      language_code: ["NO", "EN"],
      notification_type: [
        "booking-confirmation",
        "booking-reminder",
        "approval-request",
        "approval-decision",
        "cancellation",
        "modification",
        "payment-due",
        "system-maintenance",
      ],
      organization_status: [
        "active",
        "pending-verification",
        "suspended",
        "inactive",
      ],
      organization_type: [
        "lag-foreninger",
        "paraply",
        "private-firma",
        "kommunale-enheter",
        "utdanning",
        "helse",
        "kultur",
        "frivillig",
      ],
      service_category: [
        "cleaning",
        "parking",
        "personnel",
        "equipment",
        "catering",
        "security",
        "technical",
        "decoration",
        "transport",
        "wellness",
      ],
      time_slot_category: ["morning", "day", "evening", "night"],
      user_role: [
        "system-admin",
        "facility-manager",
        "caseworker",
        "municipal-staff",
        "organization-rep",
        "regular-user",
        "support",
        "paraply-rep",
      ],
      verification_level: [
        "unverified",
        "email-verified",
        "document-verified",
        "fully-verified",
      ],
      zone_type: ["court", "room", "area", "section", "field"],
    },
  },
} as const
