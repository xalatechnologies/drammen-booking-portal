
export interface Database {
  public: {
    Tables: {
      facilities: {
        Row: {
          id: number
          name: string
          address_street: string
          address_city: string
          address_postal_code: string
          address_country: string
          type: string
          status: 'active' | 'maintenance' | 'inactive'
          image_url: string | null
          capacity: number
          area: string
          description: string | null
          next_available: string | null
          rating: number | null
          review_count: number | null
          price_per_hour: number
          has_auto_approval: boolean
          amenities: string[] | null
          time_slot_duration: number
          latitude: number | null
          longitude: number | null
          accessibility_features: string[] | null
          equipment: string[] | null
          allowed_booking_types: ('engangs' | 'fastlan' | 'rammetid' | 'strotimer')[]
          season_from: string | null
          season_to: string | null
          contact_name: string | null
          contact_email: string | null
          contact_phone: string | null
          booking_lead_time_hours: number
          max_advance_booking_days: number
          cancellation_deadline_hours: number
          is_featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          address_street: string
          address_city: string
          address_postal_code: string
          address_country?: string
          type: string
          status?: 'active' | 'maintenance' | 'inactive'
          image_url?: string | null
          capacity?: number
          area: string
          description?: string | null
          next_available?: string | null
          rating?: number | null
          review_count?: number | null
          price_per_hour?: number
          has_auto_approval?: boolean
          amenities?: string[] | null
          time_slot_duration?: number
          latitude?: number | null
          longitude?: number | null
          accessibility_features?: string[] | null
          equipment?: string[] | null
          allowed_booking_types?: ('engangs' | 'fastlan' | 'rammetid' | 'strotimer')[]
          season_from?: string | null
          season_to?: string | null
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          booking_lead_time_hours?: number
          max_advance_booking_days?: number
          cancellation_deadline_hours?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          address_street?: string
          address_city?: string
          address_postal_code?: string
          address_country?: string
          type?: string
          status?: 'active' | 'maintenance' | 'inactive'
          image_url?: string | null
          capacity?: number
          area?: string
          description?: string | null
          next_available?: string | null
          rating?: number | null
          review_count?: number | null
          price_per_hour?: number
          has_auto_approval?: boolean
          amenities?: string[] | null
          time_slot_duration?: number
          latitude?: number | null
          longitude?: number | null
          accessibility_features?: string[] | null
          equipment?: string[] | null
          allowed_booking_types?: ('engangs' | 'fastlan' | 'rammetid' | 'strotimer')[]
          season_from?: string | null
          season_to?: string | null
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          booking_lead_time_hours?: number
          max_advance_booking_days?: number
          cancellation_deadline_hours?: number
          is_featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      zones: {
        Row: {
          id: string
          facility_id: number
          name: string
          type: 'court' | 'room' | 'area' | 'section' | 'field'
          capacity: number
          description: string | null
          is_main_zone: boolean
          parent_zone_id: string | null
          bookable_independently: boolean
          area_sqm: number | null
          floor: string | null
          coordinates_x: number | null
          coordinates_y: number | null
          coordinates_width: number | null
          coordinates_height: number | null
          equipment: string[] | null
          accessibility_features: string[] | null
          status: 'active' | 'maintenance' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          facility_id: number
          name: string
          type?: 'court' | 'room' | 'area' | 'section' | 'field'
          capacity?: number
          description?: string | null
          is_main_zone?: boolean
          parent_zone_id?: string | null
          bookable_independently?: boolean
          area_sqm?: number | null
          floor?: string | null
          coordinates_x?: number | null
          coordinates_y?: number | null
          coordinates_width?: number | null
          coordinates_height?: number | null
          equipment?: string[] | null
          accessibility_features?: string[] | null
          status?: 'active' | 'maintenance' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          facility_id?: number
          name?: string
          type?: 'court' | 'room' | 'area' | 'section' | 'field'
          capacity?: number
          description?: string | null
          is_main_zone?: boolean
          parent_zone_id?: string | null
          bookable_independently?: boolean
          area_sqm?: number | null
          floor?: string | null
          coordinates_x?: number | null
          coordinates_y?: number | null
          coordinates_width?: number | null
          coordinates_height?: number | null
          equipment?: string[] | null
          accessibility_features?: string[] | null
          status?: 'active' | 'maintenance' | 'inactive'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
