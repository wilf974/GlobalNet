export type DevisStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'completed' | 'skipped' | 'failed';
  assignee?: string;
  dueDate?: Date;
  completedAt?: Date;
  comments?: string[];
}

export interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  steps: WorkflowStep[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApprovalRequest {
  id: string;
  devisId: string;
  requesterId: string;
  requesterName: string;
  approverId?: string;
  approverName?: string;
  status: DevisStatus;
  workflowTemplateId: string;
  currentStep: number;
  steps: WorkflowStep[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  timestamp: Date;
  isInternal: boolean;
  attachments?: string[];
}

export interface WorkflowAction {
  type: 'approve' | 'reject' | 'request_changes' | 'delegate' | 'comment';
  stepId: string;
  comment?: string;
  assigneeId?: string;
  dueDate?: Date;
}

export interface WorkflowNotification {
  id: string;
  type: 'approval_request' | 'approval_completed' | 'approval_rejected' | 'comment_added' | 'due_date_reminder';
  title: string;
  message: string;
  recipientId: string;
  recipientName: string;
  approvalRequestId: string;
  devisId: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface WorkflowSettings {
  autoApproval: boolean;
  requireApproval: boolean;
  maxApprovers: number;
  approvalTimeout: number; // en heures
  reminderInterval: number; // en heures
  notificationPreferences: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}

export interface WorkflowStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  averageApprovalTime: number; // en heures
  overdueRequests: number;
  myPendingApprovals: number;
  mySubmittedRequests: number;
} 