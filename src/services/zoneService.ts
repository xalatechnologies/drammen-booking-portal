
import { zoneRepository } from '@/dal/repositories/ZoneRepository';
import { Zone as BookingZone } from '@/components/booking/types';
import { ApiResponse } from '@/types/api';

export class ZoneService {
  static async getZones(): Promise<ApiResponse<BookingZone[]>> {
    const result = await zoneRepository.findAll();
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    // Convert facility zones to booking zones
    const bookingZones: BookingZone[] = (result.data || []).map(zone => ({
      id: zone.id,
      name: zone.name,
      facilityId: zone.facilityId || zone.facility_id?.toString() || '',
      capacity: zone.capacity,
      pricePerHour: 250,
      description: zone.description || '',
      area: zone.area_sqm ? `${zone.area_sqm} m²` : "100 m²",
      isMainZone: zone.is_main_zone || false,
      parentZoneId: zone.parent_zone_id || undefined,
      subZones: [],
      equipment: zone.equipment || [],
      amenities: zone.accessibility_features || [],
      bookingRules: {
        minBookingDuration: 1,
        maxBookingDuration: 8,
        allowedTimeSlots: [],
        bookingTypes: ['one-time', 'recurring'],
        advanceBookingDays: 30,
        cancellationHours: 24
      },
      adminInfo: {
        contactPersonName: 'Zone Manager',
        contactPersonEmail: 'zone@drammen.kommune.no',
        specialInstructions: zone.description || '',
        maintenanceSchedule: []
      },
      layout: {
        coordinates: {
          x: zone.coordinates_x || 0,
          y: zone.coordinates_y || 0,
          width: zone.coordinates_width || 100,
          height: zone.coordinates_height || 100
        },
        entryPoints: ['Hovedinngang']
      },
      accessibility: zone.accessibility_features || [],
      features: zone.equipment || [],
      isActive: zone.status === 'active'
    }));
    
    return {
      success: true,
      data: bookingZones
    };
  }

  static async getZoneById(id: string): Promise<ApiResponse<BookingZone>> {
    const result = await zoneRepository.findById(id);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    const zone = result.data!;
    const bookingZone: BookingZone = {
      id: zone.id,
      name: zone.name,
      facilityId: zone.facilityId || zone.facility_id?.toString() || '',
      capacity: zone.capacity,
      pricePerHour: 250,
      description: zone.description || '',
      area: zone.area_sqm ? `${zone.area_sqm} m²` : "100 m²",
      isMainZone: zone.is_main_zone || false,
      parentZoneId: zone.parent_zone_id || undefined,
      subZones: [],
      equipment: zone.equipment || [],
      amenities: zone.accessibility_features || [],
      bookingRules: {
        minBookingDuration: 1,
        maxBookingDuration: 8,
        allowedTimeSlots: [],
        bookingTypes: ['one-time', 'recurring'],
        advanceBookingDays: 30,
        cancellationHours: 24
      },
      adminInfo: {
        contactPersonName: 'Zone Manager',
        contactPersonEmail: 'zone@drammen.kommune.no',
        specialInstructions: zone.description || '',
        maintenanceSchedule: []
      },
      layout: {
        coordinates: {
          x: zone.coordinates_x || 0,
          y: zone.coordinates_y || 0,
          width: zone.coordinates_width || 100,
          height: zone.coordinates_height || 100
        },
        entryPoints: ['Hovedinngang']
      },
      accessibility: zone.accessibility_features || [],
      features: zone.equipment || [],
      isActive: zone.status === 'active'
    };
    
    return {
      success: true,
      data: bookingZone
    };
  }

  static async createZone(zoneData: Omit<BookingZone, 'id'>): Promise<ApiResponse<BookingZone>> {
    const facilityZoneData = {
      name: zoneData.name,
      facilityId: zoneData.facilityId,
      description: zoneData.description,
      capacity: zoneData.capacity,
      area_sqm: parseInt(zoneData.area.replace(' m²', '')) || 100,
      is_main_zone: zoneData.isMainZone,
      parent_zone_id: zoneData.parentZoneId,
      equipment: zoneData.equipment,
      accessibility_features: zoneData.amenities,
      status: zoneData.isActive ? 'active' as const : 'inactive' as const,
      coordinates_x: zoneData.layout.coordinates.x,
      coordinates_y: zoneData.layout.coordinates.y,
      coordinates_width: zoneData.layout.coordinates.width,
      coordinates_height: zoneData.layout.coordinates.height,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await zoneRepository.create(facilityZoneData);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return this.getZoneById(result.data!.id);
  }

  static async updateZone(id: string, zoneData: Partial<BookingZone>): Promise<ApiResponse<BookingZone>> {
    const updateData: any = {
      updatedAt: new Date()
    };
    
    if (zoneData.name) updateData.name = zoneData.name;
    if (zoneData.description) updateData.description = zoneData.description;
    if (zoneData.capacity) updateData.capacity = zoneData.capacity;
    if (zoneData.area) updateData.area_sqm = parseInt(zoneData.area.replace(' m²', '')) || 100;
    if (zoneData.isMainZone !== undefined) updateData.is_main_zone = zoneData.isMainZone;
    if (zoneData.parentZoneId) updateData.parent_zone_id = zoneData.parentZoneId;
    if (zoneData.equipment) updateData.equipment = zoneData.equipment;
    if (zoneData.amenities) updateData.accessibility_features = zoneData.amenities;
    if (zoneData.isActive !== undefined) updateData.status = zoneData.isActive ? 'active' as const : 'inactive' as const;
    
    if (zoneData.layout?.coordinates) {
      updateData.coordinates_x = zoneData.layout.coordinates.x;
      updateData.coordinates_y = zoneData.layout.coordinates.y;
      updateData.coordinates_width = zoneData.layout.coordinates.width;
      updateData.coordinates_height = zoneData.layout.coordinates.height;
    }
    
    const result = await zoneRepository.update(id, updateData);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return this.getZoneById(id);
  }

  static async deleteZone(id: string): Promise<ApiResponse<boolean>> {
    const result = await zoneRepository.delete(id);
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    return {
      success: true,
      data: result.data!
    };
  }

  static async getZonesByFacility(facilityId: number): Promise<ApiResponse<BookingZone[]>> {
    const result = await zoneRepository.getZonesByFacility(facilityId.toString());
    
    if (result.error) {
      return {
        success: false,
        error: { message: result.error }
      };
    }
    
    // Convert facility zones to booking zones
    const bookingZones: BookingZone[] = (result.data || []).map(zone => ({
      id: zone.id,
      name: zone.name,
      facilityId: zone.facilityId || zone.facility_id?.toString() || '',
      capacity: zone.capacity,
      pricePerHour: 250,
      description: zone.description || '',
      area: zone.area_sqm ? `${zone.area_sqm} m²` : "100 m²",
      isMainZone: zone.is_main_zone || false,
      parentZoneId: zone.parent_zone_id || undefined,
      subZones: [],
      equipment: zone.equipment || [],
      amenities: zone.accessibility_features || [],
      bookingRules: {
        minBookingDuration: 1,
        maxBookingDuration: 8,
        allowedTimeSlots: [],
        bookingTypes: ['one-time', 'recurring'],
        advanceBookingDays: 30,
        cancellationHours: 24
      },
      adminInfo: {
        contactPersonName: 'Zone Manager',
        contactPersonEmail: 'zone@drammen.kommune.no',
        specialInstructions: zone.description || '',
        maintenanceSchedule: []
      },
      layout: {
        coordinates: {
          x: zone.coordinates_x || 0,
          y: zone.coordinates_y || 0,
          width: zone.coordinates_width || 100,
          height: zone.coordinates_height || 100
        },
        entryPoints: ['Hovedinngang']
      },
      accessibility: zone.accessibility_features || [],
      features: zone.equipment || [],
      isActive: zone.status === 'active'
    }));
    
    return {
      success: true,
      data: bookingZones
    };
  }
}
