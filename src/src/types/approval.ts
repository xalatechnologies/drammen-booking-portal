
export interface ApprovalWorkflow {
  id: string;
  name: string;
  description?: string;
  facilityIds: string[]; // Workflows can be facility-specific
  organizationTypes: OrganizationType[];
  eventTypes: EventType[];
  steps: WorkflowStep[];
  autoApprovalRules: AutoApprovalRule[];
  escalationRules: EscalationRule[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStep {
  id: string;
  stepNumber: number;
  name: string;
  description?: string;
  approverRoles: UserRole[];
  approverIds?: string[]; // Specific users who can approve
  isParallel: boolean; // Multiple approvers can approve simultaneously
  requiredApprovals: number; // Number of approvals needed (for parallel steps)
  isOptional: boolean;
  maxDurationHours?: number; // Auto-escalate after this time
  conditions?: StepCondition[];
  actions?: StepAction[];
}

export interface StepCondition {
  field: string; // booking field to check
  operator: 'equals' | 'not-equals' | 'greater-than' | 'less-than' | 'contains' | 'in';
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface StepAction {
  type: 'send-notification' | 'update-booking' | 'create-task' | 'external-api';
  parameters: Record<string, any>;
}

export interface AutoApprovalRule {
  id: string;
  name: string;
  conditions: ApprovalCondition[];
  action: 'auto-approve' | 'skip-step' | 'require-manual';
  priority: number; // Higher priority rules are checked first
  isActive: boolean;
}

export interface ApprovalCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export type ConditionOperator = 
  | 'equals'
  | 'not-equals'
  | 'greater-than'
  | 'less-than'
  | 'greater-than-or-equal'
  | 'less-than-or-equal'
  | 'contains'
  | 'not-contains'
  | 'in'
  | 'not-in'
  | 'is-empty'
  | 'is-not-empty';

export interface EscalationRule {
  id: string;
  triggerAfterHours: number;
  escalationType: 'notify-manager' | 'auto-approve' | 'assign-backup' | 'cancel-booking';
  escalationTarget?: string; // User ID or role
  notificationTemplate?: string;
  isActive: boolean;
}

export interface ApprovalRequest {
  id: string;
  bookingId: string;
  workflowId: string;
  currentStepId: string;
  status: ApprovalRequestStatus;
  priority: ApprovalPriority;
  requestedAt: Date;
  deadline?: Date;
  completedAt?: Date;
  approvals: ApprovalDecision[];
  comments: ApprovalComment[];
  attachments: string[];
  metadata: Record<string, any>;
}

export type ApprovalRequestStatus = 
  | 'pending'
  | 'in-review'
  | 'approved'
  | 'rejected'
  | 'escalated'
  | 'cancelled'
  | 'expired';

export type ApprovalPriority = 
  | 'low'
  | 'normal'
  | 'high'
  | 'urgent';

export interface ApprovalDecision {
  id: string;
  stepId: string;
  approverId: string;
  approverRole: string;
  decision: 'approved' | 'rejected' | 'delegated' | 'returned';
  reason?: string;
  conditions?: string; // Conditional approval terms
  decidedAt: Date;
  delegatedTo?: string;
  isSystemGenerated: boolean;
}

export interface ApprovalComment {
  id: string;
  userId: string;
  userRole: string;
  content: string;
  isInternal: boolean; // Internal comments not visible to requester
  createdAt: Date;
  attachments?: string[];
}

export interface ApprovalTemplate {
  id: string;
  name: string;
  category: 'standard' | 'express' | 'complex' | 'municipal';
  description?: string;
  workflowSteps: Partial<WorkflowStep>[];
  defaultRules: Partial<AutoApprovalRule>[];
  isSystemTemplate: boolean;
  createdBy: string;
  createdAt: Date;
}

export interface ApprovalStatistics {
  totalRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  pendingRequests: number;
  averageProcessingTime: number; // Hours
  approvalRate: number; // Percentage
  escalationRate: number;
  timeBreakdown: {
    autoApproved: number;
    manualApproved: number;
    rejected: number;
  };
}

export interface ApprovalNotification {
  id: string;
  requestId: string;
  recipientId: string;
  type: NotificationType;
  channel: 'email' | 'sms' | 'push' | 'in-app';
  title: string;
  message: string;
  data?: Record<string, any>;
  sentAt?: Date;
  readAt?: Date;
  actionTaken?: boolean;
}

export type NotificationType = 
  | 'approval-requested'
  | 'approval-approved'
  | 'approval-rejected'
  | 'approval-escalated'
  | 'approval-deadline-approaching'
  | 'approval-expired'
  | 'approval-cancelled';

// Import types from other files
type OrganizationType = 'lag-foreninger' | 'paraply' | 'private-firma' | 'kommunale-enheter' | 'utdanning' | 'helse' | 'kultur' | 'frivillig';
type EventType = 'training' | 'competition' | 'meeting' | 'celebration' | 'course' | 'conference' | 'performance' | 'exhibition' | 'other';
type UserRole = 'system-admin' | 'facility-manager' | 'caseworker' | 'municipal-staff' | 'organization-rep' | 'regular-user';
