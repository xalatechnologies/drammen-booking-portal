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
      app_actor_memberships: {
        Row: {
          actor_id: string | null
          created_at: string | null
          id: string
          role: string | null
          user_id: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_actor_memberships_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "app_actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_actor_memberships_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_actors: {
        Row: {
          contact_info: Json | null
          created_at: string | null
          id: string
          is_paraply: boolean | null
          metadata: Json | null
          name: Json
          org_number: string | null
          parent_actor_id: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          is_paraply?: boolean | null
          metadata?: Json | null
          name: Json
          org_number?: string | null
          parent_actor_id?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          is_paraply?: boolean | null
          metadata?: Json | null
          name?: Json
          org_number?: string | null
          parent_actor_id?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_actors_parent_actor_id_fkey"
            columns: ["parent_actor_id"]
            isOneToOne: false
            referencedRelation: "app_actors"
            referencedColumns: ["id"]
          },
        ]
      }
      app_audit_logs: {
        Row: {
          action: string
          details: string | null
          id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          details?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          details?: string | null
          id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_availability_rules: {
        Row: {
          config: Json
          created_at: string | null
          created_by_id: string | null
          end_date_time: string | null
          id: string
          location_id: string | null
          start_date_time: string | null
          type: string
        }
        Insert: {
          config: Json
          created_at?: string | null
          created_by_id?: string | null
          end_date_time?: string | null
          id?: string
          location_id?: string | null
          start_date_time?: string | null
          type: string
        }
        Update: {
          config?: Json
          created_at?: string | null
          created_by_id?: string | null
          end_date_time?: string | null
          id?: string
          location_id?: string | null
          start_date_time?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_availability_rules_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_availability_rules_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "app_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_booking_services: {
        Row: {
          booking_id: string
          created_at: string | null
          metadata: Json | null
          quantity: number
          service_id: string
          total_price: number
          unit_price: number
        }
        Insert: {
          booking_id: string
          created_at?: string | null
          metadata?: Json | null
          quantity?: number
          service_id: string
          total_price: number
          unit_price: number
        }
        Update: {
          booking_id?: string
          created_at?: string | null
          metadata?: Json | null
          quantity?: number
          service_id?: string
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "app_booking_services_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "app_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_booking_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "app_services"
            referencedColumns: ["id"]
          },
        ]
      }
      app_bookings: {
        Row: {
          actor_id: string | null
          block_id: string | null
          booking_status: Database["public"]["Enums"]["booking_status"] | null
          booking_type: Database["public"]["Enums"]["booking_type"] | null
          comment: string | null
          created_at: string | null
          end_date_time: string
          id: string
          location_id: string | null
          metadata: Json | null
          price: number | null
          signed: boolean | null
          signed_at: string | null
          start_date_time: string
          status: string | null
          type: string
          updated_at: string | null
          user_id: string | null
          zone_id: string | null
        }
        Insert: {
          actor_id?: string | null
          block_id?: string | null
          booking_status?: Database["public"]["Enums"]["booking_status"] | null
          booking_type?: Database["public"]["Enums"]["booking_type"] | null
          comment?: string | null
          created_at?: string | null
          end_date_time: string
          id?: string
          location_id?: string | null
          metadata?: Json | null
          price?: number | null
          signed?: boolean | null
          signed_at?: string | null
          start_date_time: string
          status?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
          zone_id?: string | null
        }
        Update: {
          actor_id?: string | null
          block_id?: string | null
          booking_status?: Database["public"]["Enums"]["booking_status"] | null
          booking_type?: Database["public"]["Enums"]["booking_type"] | null
          comment?: string | null
          created_at?: string | null
          end_date_time?: string
          id?: string
          location_id?: string | null
          metadata?: Json | null
          price?: number | null
          signed?: boolean | null
          signed_at?: string | null
          start_date_time?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_bookings_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "app_actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_bookings_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "app_calendar_blocks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_bookings_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "app_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_bookings_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "app_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      app_calendar_blocks: {
        Row: {
          block_type: Database["public"]["Enums"]["block_type"]
          booking_id: string | null
          calendar_id: string
          created_at: string | null
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          block_type: Database["public"]["Enums"]["block_type"]
          booking_id?: string | null
          calendar_id: string
          created_at?: string | null
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          block_type?: Database["public"]["Enums"]["block_type"]
          booking_id?: string | null
          calendar_id?: string
          created_at?: string | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_calendar_blocks_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "app_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_calendar_blocks_calendar_id_fkey"
            columns: ["calendar_id"]
            isOneToOne: false
            referencedRelation: "app_calendars"
            referencedColumns: ["id"]
          },
        ]
      }
      app_calendars: {
        Row: {
          created_at: string | null
          date: string
          id: string
          location_id: string
          slot_length: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          location_id: string
          slot_length?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          location_id?: string
          slot_length?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_calendars_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "app_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_cart_items: {
        Row: {
          actor_id: string | null
          cart_id: string | null
          created_at: string | null
          end_date_time: string
          id: string
          location_id: string | null
          metadata: Json | null
          price: number | null
          start_date_time: string
          type: string
          zone_id: string | null
        }
        Insert: {
          actor_id?: string | null
          cart_id?: string | null
          created_at?: string | null
          end_date_time: string
          id?: string
          location_id?: string | null
          metadata?: Json | null
          price?: number | null
          start_date_time: string
          type: string
          zone_id?: string | null
        }
        Update: {
          actor_id?: string | null
          cart_id?: string | null
          created_at?: string | null
          end_date_time?: string
          id?: string
          location_id?: string | null
          metadata?: Json | null
          price?: number | null
          start_date_time?: string
          type?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_cart_items_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "app_actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_cart_items_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "app_carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_cart_items_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "app_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_cart_items_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "app_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      app_carts: {
        Row: {
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_carts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_feedbacks: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          location_id: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_feedbacks_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "app_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_feedbacks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_location_caseworkers: {
        Row: {
          created_at: string | null
          id: string
          location_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          location_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          location_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_location_caseworkers_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "app_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_location_caseworkers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_location_images: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string
          display_order: number
          file_size: number | null
          id: string
          image_url: string
          is_featured: boolean
          location_id: string
          updated_at: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          file_size?: number | null
          id?: string
          image_url: string
          is_featured?: boolean
          location_id: string
          updated_at?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string
          display_order?: number
          file_size?: number | null
          id?: string
          image_url?: string
          is_featured?: boolean
          location_id?: string
          updated_at?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_location_images_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "app_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_location_images_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_locations: {
        Row: {
          address: string
          capacity: number | null
          code: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string | null
          description: Json | null
          facilities: string[] | null
          id: string
          is_published: boolean | null
          latitude: number | null
          location_type: string | null
          longitude: number | null
          metadata: Json | null
          name: Json
          updated_at: string | null
        }
        Insert: {
          address: string
          capacity?: number | null
          code: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: Json | null
          facilities?: string[] | null
          id?: string
          is_published?: boolean | null
          latitude?: number | null
          location_type?: string | null
          longitude?: number | null
          metadata?: Json | null
          name: Json
          updated_at?: string | null
        }
        Update: {
          address?: string
          capacity?: number | null
          code?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: Json | null
          facilities?: string[] | null
          id?: string
          is_published?: boolean | null
          latitude?: number | null
          location_type?: string | null
          longitude?: number | null
          metadata?: Json | null
          name?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      app_notifications: {
        Row: {
          booking_id: string | null
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "app_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_price_rules: {
        Row: {
          actor_type: string
          config: Json | null
          created_at: string | null
          id: string
          location_id: string | null
          price: number
          priority: number | null
          type: string
        }
        Insert: {
          actor_type: string
          config?: Json | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          price: number
          priority?: number | null
          type: string
        }
        Update: {
          actor_type?: string
          config?: Json | null
          created_at?: string | null
          id?: string
          location_id?: string | null
          price?: number
          priority?: number | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "app_price_rules_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "app_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      app_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          permissions: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          permissions?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      app_services: {
        Row: {
          base_price: number
          category: string | null
          code: string
          created_at: string | null
          description: Json | null
          id: string
          is_active: boolean
          metadata: Json | null
          name: Json
          unit: string
          updated_at: string | null
        }
        Insert: {
          base_price: number
          category?: string | null
          code: string
          created_at?: string | null
          description?: Json | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name: Json
          unit: string
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          category?: string | null
          code?: string
          created_at?: string | null
          description?: Json | null
          id?: string
          is_active?: boolean
          metadata?: Json | null
          name?: Json
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      app_templates: {
        Row: {
          content: Json
          created_at: string | null
          created_by_id: string | null
          id: string
          name: string
          slug: string
          type: string
          updated_at: string | null
          visibility: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          created_by_id?: string | null
          id?: string
          name: string
          slug: string
          type: string
          updated_at?: string | null
          visibility?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          created_by_id?: string | null
          id?: string
          name?: string
          slug?: string
          type?: string
          updated_at?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_templates_created_by_id_fkey"
            columns: ["created_by_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_user_roles: {
        Row: {
          created_at: string | null
          id: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "app_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "app_users"
            referencedColumns: ["id"]
          },
        ]
      }
      app_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          locale: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          locale?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          locale?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      app_zones: {
        Row: {
          capacity: number | null
          code: string
          created_at: string | null
          id: string
          interval: string | null
          location_id: string | null
          metadata: Json | null
          name: Json
          updated_at: string | null
        }
        Insert: {
          capacity?: number | null
          code: string
          created_at?: string | null
          id?: string
          interval?: string | null
          location_id?: string | null
          metadata?: Json | null
          name: Json
          updated_at?: string | null
        }
        Update: {
          capacity?: number | null
          code?: string
          created_at?: string | null
          id?: string
          interval?: string | null
          location_id?: string | null
          metadata?: Json | null
          name?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "app_zones_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "app_locations"
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
      block_type: "STROTIME" | "FASTLÅN" | "RAMMETID" | "SPERRET"
      booking_status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"
      booking_type: "ENGANG" | "FAST"
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
      block_type: ["STROTIME", "FASTLÅN", "RAMMETID", "SPERRET"],
      booking_status: ["PENDING", "APPROVED", "REJECTED", "CANCELLED"],
      booking_type: ["ENGANG", "FAST"],
    },
  },
} as const
