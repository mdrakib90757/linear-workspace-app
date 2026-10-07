export type IssuePriority = 'urgent' | 'high' | 'medium' | 'low' | 'none';
export type IssueStatus = 'backlog' | 'todo' | 'in_progress' | 'done' | 'canceled';

export interface Issue {
  id: string;
  identifier: string;
  title: string;
  description?: string;
  status: IssueStatus;
  priority: IssuePriority;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}
