
import { ActorType, BookingType } from './pricing';
import { Zone } from './zone';

export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  zoneId: string;
  zoneName: string;
  userId: string;
  organizationId?: string;
  status: BookingStatus;
  type: BookingType;
  actorType: ActorType;
  
  // Timing
  startDate: Date;
  endDate: Date;
  duration: number; // Minutes
  timeSlot: string;
  isRecurring: boolean;
  recurrencePattern?: RecurrencePattern;
  
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

export type BookingStatus = 
  | 'draft'
  | 'pending-approval'
  | 'approved'
  | 'confirmed'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'rejected'
  | 'no-show';

export type EventType = 
  | 'training'
  | 'competition'
  | 'meeting'
  | 'celebration'
  | 'course'
  | 'conference'
  | 'performance'
  | 'exhibition'
  | 'other';

export type AgeGroup = 
  | 'children'     // Under 16
  | 'youth'        // 16-25
  | 'adults'       // 26-65
  | 'seniors'      // 65+
  | 'mixed'        // Mixed ages
  | 'family';      // Family groups

export interface RecurrencePattern {
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number; // Every N days/weeks/months
  daysOfWeek?: number[]; // For weekly patterns
  dayOfMonth?: number; // For monthly patterns
  endDate?: Date;
  occurrences?: number;
  exceptions: Date[]; // Dates to skip
}

export interface BookingService {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  description?: string;
  startTime?: Date;
  endTime?: Date;
}

export interface BookingPricing {
  basePrice: number;
  servicesCost: number;
  discounts: PriceDiscount[];
  surcharges: PriceSurcharge[];
  taxes: PriceTax[];
  totalPrice: number;
  currency: string;
  calculatedAt: Date;
  breakdown: PriceBreakdownItem[];
}

export interface PriceDiscount {
  type: string;
  description: string;
  amount: number;
  percentage?: number;
}

export interface PriceSurcharge {
  type: string;
  description: string;
  amount: number;
  percentage?: number;
}

export interface PriceTax {
  type: string;
  rate: number;
  amount: number;
}

export interface PriceBreakdownItem {
  description: string;
  amount: number;
  type: 'base' | 'service' | 'discount' | 'surcharge' | 'tax';
}

export type ApprovalStatus = 
  | 'not-required'
  | 'pending'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'escalated';

export interface ApprovalWorkflow {
  id: string;
  steps: ApprovalStep[];
  currentStep: number;
  autoApprovalRules?: AutoApprovalRule[];
  escalationRules?: EscalationRule[];
}

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  approverRole: string;
  approverIds?: string[];
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  isRequired: boolean;
  deadline?: Date;
  approvedAt?: Date;
  approvedBy?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface AutoApprovalRule {
  id: string;
  conditions: ApprovalCondition[];
  action: 'approve' | 'skip-step' | 'require-approval';
}

export interface ApprovalCondition {
  field: string;
  operator: 'equals' | 'less-than' | 'greater-than' | 'contains';
  value: any;
}

export interface EscalationRule {
  id: string;
  triggerAfterHours: number;
  escalateTo: string;
  notificationMessage: string;
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
