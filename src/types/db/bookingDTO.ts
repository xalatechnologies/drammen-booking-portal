/**
 * Database Transfer Object types for booking-related entities
 * Follows Single Responsibility Principle by focusing solely on the database representation
 */

import { Booking, BookingCreateRequest, BookingUpdateRequest } from '../booking';
import { BookingStatus, EventType, AgeGroup } from '../booking/bookingCore';
import { BookingType, ActorType } from '../pricing';

/**
 * Represents the booking entity as stored in the database
 * Uses snake_case for properties to match database column names
 */
export interface BookingDTO {
  id: string;
  facility_id: string;
  zone_id: string;
  user_id?: string;
  organization_id?: string;
  
  // Basic info
  status: BookingStatus;
  purpose: string;
  event_type: EventType;
  expected_attendees: number;
  age_group: AgeGroup;
  special_requirements?: string;
  
  // Contact
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  
  // Timing
  start_date: string | Date; // ISO string in DB, Date in JS
  end_date: string | Date;   // ISO string in DB, Date in JS
  
  // Services & approval
  additional_services?: string; // JSON string in DB
  requires_approval: boolean;
  approval_status: string;
  
  // Metadata
  cancellation_reason?: string;
  created_at: string | Date;
  updated_at: string | Date;
  cancelled_at?: string | Date;
}

/**
 * Maps domain Booking object to database DTO
 * @param domain Domain booking object
 * @returns Database representation
 */
export function mapToDTO(domain: Booking): BookingDTO {
  return {
    id: domain.id,
    facility_id: domain.facilityId,
    zone_id: domain.zoneId,
    user_id: domain.userId,
    organization_id: domain.organizationId,
    status: domain.status,
    purpose: domain.purpose,
    event_type: domain.eventType,
    expected_attendees: domain.expectedAttendees,
    age_group: domain.ageGroup,
    special_requirements: domain.specialRequirements,
    contact_name: domain.contactName,
    contact_email: domain.contactEmail,
    contact_phone: domain.contactPhone,
    start_date: domain.startDate,
    end_date: domain.endDate,
    additional_services: JSON.stringify(domain.additionalServices),
    requires_approval: domain.requiresApproval,
    approval_status: domain.approvalStatus,
    cancellation_reason: domain.cancellationReason,
    created_at: domain.createdAt,
    updated_at: domain.updatedAt,
    cancelled_at: domain.cancelledAt
  };
}

/**
 * Maps database DTO to domain Booking object
 * @param dto Database booking DTO
 * @returns Domain booking object
 */
export function mapToDomain(dto: BookingDTO): Booking {
  // Parse dates and JSON fields
  const startDate = dto.start_date instanceof Date ? dto.start_date : new Date(dto.start_date);
  const endDate = dto.end_date instanceof Date ? dto.end_date : new Date(dto.end_date);
  const createdAt = dto.created_at instanceof Date ? dto.created_at : new Date(dto.created_at);
  const updatedAt = dto.updated_at instanceof Date ? dto.updated_at : new Date(dto.updated_at);
  const cancelledAt = dto.cancelled_at ? 
    (dto.cancelled_at instanceof Date ? dto.cancelled_at : new Date(dto.cancelled_at)) : undefined;
  
  // Parse additional services
  const additionalServices = dto.additional_services ? 
    JSON.parse(dto.additional_services) : [];
  
  // Create domain object with placeholders for required fields not in DTO
  // In a real implementation, these would need to be fetched or calculated
  return {
    id: dto.id,
    facilityId: dto.facility_id,
    facilityName: '', // This would need to be fetched or joined
    zoneId: dto.zone_id,
    zoneName: '', // This would need to be fetched or joined
    userId: dto.user_id || '',
    organizationId: dto.organization_id,
    status: dto.status,
    type: 'engangs' as BookingType, // Default value or would need to be fetched
    actorType: 'private-person' as ActorType, // Default value or would need to be fetched
    purpose: dto.purpose,
    eventType: dto.event_type,
    expectedAttendees: dto.expected_attendees,
    ageGroup: dto.age_group,
    specialRequirements: dto.special_requirements,
    contactName: dto.contact_name,
    contactEmail: dto.contact_email,
    contactPhone: dto.contact_phone,
    startDate,
    endDate,
    duration: Math.floor((endDate.getTime() - startDate.getTime()) / 60000), // Minutes
    timeSlot: `${startDate.toLocaleTimeString()} - ${endDate.toLocaleTimeString()}`, // Format for display
    isRecurring: false, // Default value or would need to be calculated
    additionalServices,
    pricing: {
      basePrice: 0, // Would need to be calculated
      servicesCost: 0, // Would need to be calculated
      discounts: [], // Would need to be calculated
      surcharges: [], // Would need to be calculated
      taxes: [], // Would need to be calculated
      totalPrice: 0, // Would need to be calculated
      currency: 'NOK', // Default value or would need to be fetched
      calculatedAt: new Date(), // Would need to be calculated
      breakdown: [] // Would need to be calculated
    },
    requiresApproval: dto.requires_approval,
    approvalStatus: dto.approval_status as any, // Cast to satisfy type
    createdAt,
    updatedAt,
    cancelledAt,
    cancellationReason: dto.cancellation_reason,
    notes: [], // Would need to be fetched
    attachments: [] // Would need to be fetched
  };
}

/**
 * Maps BookingCreateRequest to database DTO for insertion
 * @param request Create request object
 * @returns Database object ready for insertion
 */
export function mapCreateRequestToDTO(request: BookingCreateRequest): Omit<BookingDTO, 'id' | 'created_at' | 'updated_at'> {
  return {
    facility_id: request.facilityId,
    zone_id: request.zoneId,
    organization_id: request.organizationId,
    purpose: request.purpose,
    event_type: request.eventType,
    expected_attendees: request.expectedAttendees,
    age_group: request.ageGroup,
    special_requirements: request.specialRequirements,
    contact_name: request.contactName,
    contact_email: request.contactEmail,
    contact_phone: request.contactPhone,
    start_date: request.startDate,
    end_date: request.endDate,
    additional_services: request.additionalServices ? JSON.stringify(request.additionalServices) : undefined,
    // Default values for required fields
    status: 'pending-approval' as BookingStatus,
    requires_approval: true,
    approval_status: 'pending'
  };
}

/**
 * Maps BookingUpdateRequest to database DTO for update operations
 * @param request Update request object
 * @returns Partial database object with fields to update
 */
export function mapUpdateRequestToDTO(request: BookingUpdateRequest): Partial<BookingDTO> {
  const dto: Partial<BookingDTO> = {};
  
  // Only include defined fields
  if (request.facilityId !== undefined) dto.facility_id = request.facilityId;
  if (request.zoneId !== undefined) dto.zone_id = request.zoneId;
  if (request.organizationId !== undefined) dto.organization_id = request.organizationId;
  if (request.purpose !== undefined) dto.purpose = request.purpose;
  if (request.eventType !== undefined) dto.event_type = request.eventType;
  if (request.expectedAttendees !== undefined) dto.expected_attendees = request.expectedAttendees;
  if (request.ageGroup !== undefined) dto.age_group = request.ageGroup;
  if (request.specialRequirements !== undefined) dto.special_requirements = request.specialRequirements;
  if (request.contactName !== undefined) dto.contact_name = request.contactName;
  if (request.contactEmail !== undefined) dto.contact_email = request.contactEmail;
  if (request.contactPhone !== undefined) dto.contact_phone = request.contactPhone;
  if (request.startDate !== undefined) dto.start_date = request.startDate;
  if (request.endDate !== undefined) dto.end_date = request.endDate;
  if (request.additionalServices !== undefined) {
    dto.additional_services = JSON.stringify(request.additionalServices);
  }
  if (request.status !== undefined) dto.status = request.status;
  if (request.cancellationReason !== undefined) dto.cancellation_reason = request.cancellationReason;
  
  // Always update the timestamp
  dto.updated_at = new Date().toISOString();
  
  return dto;
}
