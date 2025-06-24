
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Zone {
  id: string;
  name: string;
  facility_id: number;
  type: string;
  capacity: number;
  description: string | null;
  is_main_zone: boolean;
  parent_zone_id: string | null;
  bookable_independently: boolean;
  area_sqm: number | null;
  floor: string | null;
  coordinates_x: number | null;
  coordinates_y: number | null;
  coordinates_width: number | null;
  coordinates_height: number | null;
  equipment: string[] | null;
  accessibility_features: string[] | null;
  status: string;
  created_at: string;
  updated_at: string;
  // Add compatibility fields for existing components
  facilityId: number;
  pricePerHour: number;
  area: string;
  isMainZone: boolean;
  parentZoneId?: string;
  subZones?: string[];
  bookingRules?: any;
  adminInfo?: any;
  layout?: any;
  accessibility?: string[];
  features?: string[];
  isActive: boolean;
}

export function useZones(facilityId?: number | string) {
  const numericFacilityId = typeof facilityId === 'string' ? parseInt(facilityId, 10) : facilityId;
  
  return useQuery({
    queryKey: ['zones', numericFacilityId],
    queryFn: async () => {
      let query = supabase
        .from('zones')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (numericFacilityId) {
        query = query.eq('facility_id', numericFacilityId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching zones:', error);
        throw error;
      }

      // Transform the data to include compatibility fields
      const transformedData = (data || []).map(zone => ({
        ...zone,
        facilityId: zone.facility_id,
        pricePerHour: 450, // Default price
        area: zone.area_sqm ? `${zone.area_sqm} m²` : "N/A",
        isMainZone: zone.is_main_zone,
        parentZoneId: zone.parent_zone_id,
        subZones: [],
        bookingRules: {
          minBookingDuration: 2,
          maxBookingDuration: 8,
          allowedTimeSlots: ["08:00-10:00", "10:00-12:00", "12:00-14:00", "14:00-16:00", "16:00-18:00", "18:00-20:00", "20:00-22:00"],
          bookingTypes: ['one-time', 'recurring', 'fixed-lease'],
          advanceBookingDays: 90,
          cancellationHours: 48
        },
        adminInfo: {
          contactPersonName: "System Admin",
          contactPersonEmail: "admin@example.com",
          specialInstructions: "Standard zone usage",
          maintenanceSchedule: []
        },
        layout: {
          coordinates: {
            x: zone.coordinates_x || 0,
            y: zone.coordinates_y || 0,
            width: zone.coordinates_width || 100,
            height: zone.coordinates_height || 80
          },
          entryPoints: ["Hovedinngang"]
        },
        accessibility: zone.accessibility_features || [],
        features: zone.equipment || [],
        isActive: zone.status === 'active'
      }));

      return transformedData;
    },
    enabled: true,
  });
}

export function useZonesByFacility(facilityId: number | string) {
  return useZones(facilityId);
}
