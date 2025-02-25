export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  role: 'owner' | 'admin' | 'sales_rep' | 'viewer';
  workspaceId: string;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, any>;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId?: string;
  tags: string[];
  customFields: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Company {
  id: string;
  name: string;
  industry?: string;
  size?: string;
  website?: string;
  linkedinUrl?: string;
}

export interface Deal {
  id: string;
  title: string;
  value: number;
  stageId: string;
  pipelineId: string;
  contactId: string;
  ownerId: string;
  expectedCloseDate: string;
  probability: number;
  createdAt: string;
  updatedAt: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  orderIndex: number;
  probability: number;
  isWonStage: boolean;
  isLostStage: boolean;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
  isDefault: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'overdue';
  assigneeId: string;
  contactId?: string;
  dealId?: string;
  companyId?: string;
}

export interface Notification {
  id: string;
  type: 'deal_update' | 'task_assigned' | 'mention' | 'system';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface Automation {
  id: string;
  name: string;
  isActive: boolean;
  triggerType: 'deal_stage_change' | 'contact_created' | 'date_reached';
  triggerConfig: Record<string, any>;
  actions: AutomationAction[];
}

export interface AutomationAction {
  id: string;
  actionType: 'send_email' | 'send_sms' | 'create_task' | 'add_tag' | 'webhook';
  actionConfig: Record<string, any>;
  delayMinutes: number;
}

export interface EmailSequence {
  id: string;
  name: string;
  isActive: boolean;
  steps: SequenceStep[];
}

export interface SequenceStep {
  id: string;
  stepOrder: number;
  waitDays: number;
  subject: string;
  emailBody: string;
}