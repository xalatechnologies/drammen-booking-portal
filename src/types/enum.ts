
export interface SystemEnum {
  id: string;
  enumType: string;
  enumKey: string;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnumTranslation {
  id: string;
  enumId: string;
  languageCode: 'NO' | 'EN';
  label: string;
  description?: string;
  shortLabel?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EnumCategory {
  id: string;
  name: string;
  description?: string;
  enumTypes: string[];
  displayOrder: number;
  isActive: boolean;
}

export interface EnumOption {
  id: string;
  key: string;
  label: string;
  description?: string;
  shortLabel?: string;
  displayOrder: number;
  isActive: boolean;
  metadata?: Record<string, any>;
}

export interface LocalizedEnumData {
  NO: EnumTranslation;
  EN: EnumTranslation;
}

export type EnumType = 
  | 'UserRole'
  | 'BookingStatus'
  | 'BookingType'
  | 'EventType'
  | 'AgeGroup'
  | 'ActorType'
  | 'ActorStatus'
  | 'TimeSlotCategory'
  | 'PriceType'
  | 'DayType'
  | 'ServiceCategory'
  | 'ServiceBookingStatus'
  | 'ApprovalRequestStatus'
  | 'ApprovalPriority'
  | 'ConditionOperator'
  | 'NotificationType';
