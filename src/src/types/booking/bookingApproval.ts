
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
