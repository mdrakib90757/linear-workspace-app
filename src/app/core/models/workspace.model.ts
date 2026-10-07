export type ActiveView = 
  | 'Inbox' 
  | 'My issues' 
  | 'Agent' 
  | 'Projects' 
  | 'Views' 
  | 'Home' 
  | 'Issues'
  | 'Import issues'
  | 'Invite people'
  | 'Connect GitHub';

export interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  isRead: boolean;
  type: 'mention' | 'assignment' | 'review' | 'update';
  author: {
    name: string;
    avatar?: string;
  };
  issueKey?: string;
  projectName?: string;
  priority?: 'Urgent' | 'High' | 'Medium' | 'Low' | 'No priority';
  status?: 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled';
}

export interface IssueItem {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low' | 'No priority';
  assignee?: {
    name: string;
    avatar?: string;
  };
  project?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  actions?: Array<{ label: string; action: string }>;
}

export interface FilterOption {
  id: string;
  name: string;
  icon: string;
  hasSubmenu?: boolean;
}
