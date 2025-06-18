
import { ActorType, BookingType } from '../pricing';

export interface BookingCore {
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
