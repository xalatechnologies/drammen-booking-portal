import { BookingCore, BookingStatus, EventType, AgeGroup } from './booking/bookingCore';
import { BookingTiming, RecurrencePattern } from './booking/bookingTiming';
import { BookingService, BookingPricing, PriceDiscount, PriceSurcharge, PriceTax, PriceBreakdownItem } from './booking/bookingPricing';
import { ApprovalStatus, ApprovalWorkflow, ApprovalStep, AutoApprovalRule, ApprovalCondition, EscalationRule } from './booking/bookingApproval';

export interface Booking extends BookingCore, BookingTiming {
  // Details
  purpose: string;
  eventType: EventType;
  expectedAttendees: number;
  ageGroup: AgeGroup;
  description?: string;
  specialRequirements?: string;
  
  // Contact
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  
  // Services & Pricing
  additionalServices: BookingService[];
  pricing: BookingPricing;
  
  // Approval
  requiresApproval: boolean;
  approvalStatus: ApprovalStatus;
  approvalWorkflow?: ApprovalWorkflow;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  cancellationReason?: string;
  notes: BookingNote[];
  attachments: BookingAttachment[];
}

export interface BookingNote {
  id: string;
  userId: string;
  userRole: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
}

export interface BookingAttachment {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface BookingConflict {
  id: string;
  booking_id: string;
  conflict_type: string;
  conflict_description: string;
  conflict_severity: string;
  resolved: boolean;
  created_at: string;
  conflicting_booking_id?: string;
  resolved_by?: string;
  resolved_at?: string;
  resolution_notes?: string;
}

export interface BookingFilters {
  facilityId?: string;
  zoneId?: string;
  userId?: string;
  organizationId?: string;
  status?: BookingStatus;
  eventType?: EventType;
  startDate?: Date;
  endDate?: Date;
  searchTerm?: string;
  requiresApproval?: boolean;
  approvalStatus?: ApprovalStatus;
}

export interface BookingCreateRequest {
  facilityId: string;
  zoneId: string;
  startDate: Date;
  endDate: Date;
  purpose: string;
  eventType: EventType;
  expectedAttendees: number;
  ageGroup: AgeGroup;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  additionalServices?: string[];
  specialRequirements?: string;
  organizationId?: string;
}

export interface BookingUpdateRequest extends Partial<BookingCreateRequest> {
  status?: BookingStatus;
  cancellationReason?: string;
}

// Re-export types for backward compatibility
export type {
  BookingStatus,
  EventType,
  AgeGroup,
  RecurrencePattern,
  BookingService,
  BookingPricing,
  PriceDiscount,
  PriceSurcharge,
  PriceTax,
  PriceBreakdownItem,
  ApprovalStatus,
  ApprovalWorkflow,
  ApprovalStep,
  AutoApprovalRule,
  ApprovalCondition,
  EscalationRule
};
