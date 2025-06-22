/**
 * Booking Domain Types
 * 
 * Core booking domain types that represent the business entities
 * following Single Responsibility Principle by focusing only on domain model.
 */

// Core booking information
export interface Booking {
  id: string;
  facilityId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  recurrenceRule?: string;
  purpose?: string;
  attendees?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Booking status values
export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  REJECTED = 'rejected',
  COMPLETED = 'completed'
}

// Request object for creating a new booking
export interface CreateBookingRequest {
  facilityId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status?: BookingStatus;
  recurrenceRule?: string;
  purpose?: string;
  attendees?: number;
  notes?: string;
}

// Request object for updating a booking
export interface UpdateBookingRequest {
  startTime?: Date;
  endTime?: Date;
  status?: BookingStatus;
  recurrenceRule?: string;
  purpose?: string;
  attendees?: number;
  notes?: string;
}

// Filter options for booking queries
export interface BookingFilters {
  facilityId?: string;
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  status?: BookingStatus | BookingStatus[];
}

// Time availability request
export interface AvailabilityRequest {
  facilityId: string;
  startDate: Date;
  endDate: Date;
  duration?: number; // in minutes
}

// Available time slot information
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

// Calendar view for displaying bookings
export interface BookingCalendarView {
  date: Date;
  slots: TimeSlot[];
}
