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
          metadata: Json | null
          name: Json
          type: string
          updated_at: string | null
        }
        Insert: {
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name: Json
          type: string
          updated_at?: string | null
        }
        Update: {
          contact_info?: Json | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          name?: Json
          type?: string
          updated_at?: string | null
        }
        Relationships: []
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
      app_bookings: {
        Row: {
          actor_id: string | null
          created_at: string | null
          end_date_time: string
          id: string
          location_id: string | null
          metadata: Json | null
          price: number | null
          start_date_time: string
          status: string | null
          type: string
          updated_at: string | null
          user_id: string | null
          zone_id: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          end_date_time: string
          id?: string
          location_id?: string | null
          metadata?: Json | null
          price?: number | null
          start_date_time: string
          status?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
          zone_id?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          end_date_time?: string
          id?: string
          location_id?: string | null
          metadata?: Json | null
          price?: number | null
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
      app_locations: {
        Row: {
          address: string
          code: string
          created_at: string | null
          description: Json | null
          id: string
          latitude: number | null
          longitude: number | null
          metadata: Json | null
          name: Json
          updated_at: string | null
        }
        Insert: {
          address: string
          code: string
          created_at?: string | null
          description?: Json | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          metadata?: Json | null
          name: Json
          updated_at?: string | null
        }
        Update: {
          address?: string
          code?: string
          created_at?: string | null
          description?: Json | null
          id?: string
          latitude?: number | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
