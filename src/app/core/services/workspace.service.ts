import { Injectable, signal, computed } from '@angular/core';
import { ActiveView, NotificationItem, IssueItem, AgentChatMessage } from '../models/workspace.model';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  // Navigation State
  readonly activeView = signal<ActiveView>('Inbox');
  readonly previousView = signal<ActiveView>('Inbox');

  // Command Palette & Modals
  readonly isCommandPaletteOpen = signal<boolean>(false);
  readonly isNewIssueModalOpen = signal<boolean>(false);
  readonly isShortcutsModalOpen = signal<boolean>(false);

  // Active Team Menu & Filter Dropdowns
  readonly activeTeam = signal<string>('Md Rakib Sordar');
  readonly currentTeamActionMenu = signal<boolean>(false);
  readonly isInboxFilterOpen = signal<boolean>(false);
  readonly isUserProfileMenuOpen = signal<boolean>(false);
  readonly isSkillsMenuOpen = signal<boolean>(false);
  readonly isAgentNewChatMenuOpen = signal<boolean>(false);

  // Inbox & Issues State
  readonly notifications = signal<NotificationItem[]>([]);
  readonly selectedNotificationId = signal<string | null>(null);
  readonly filterQuery = signal<string>('');
  readonly activeFilterCategory = signal<string | null>(null);
  readonly showAllNotifications = signal<boolean>(false);

  // Agent Chat State
  readonly chatMessages = signal<AgentChatMessage[]>([]);
  readonly isAgentThinking = signal<boolean>(false);
  readonly showAgentExamples = signal<boolean>(true);

  // Computed state
  readonly selectedNotification = computed(() => {
    const id = this.selectedNotificationId();
    if (!id) return null;
    return this.notifications().find(n => n.id === id) || null;
  });

  readonly unreadCount = computed(() => {
    return this.notifications().filter(n => !n.isRead).length;
  });

  readonly filteredNotifications = computed(() => {
    const showAll = this.showAllNotifications();
    const query = this.filterQuery().toLowerCase().trim();
    return this.notifications().filter(n => {
      if (!showAll && n.isRead) return false;
      if (query && !n.title.toLowerCase().includes(query) && !n.subtitle.toLowerCase().includes(query)) {
        return false;
      }
      return true;
    });
  });

  // Mock Issues list for "My issues", "Issues", "Projects"
  readonly issues = signal<IssueItem[]>([
    {
      id: 'LIN-101',
      identifier: 'LIN-101',
      title: 'Implement Linear sleek dark mode styling with fine borders',
      description: 'Refactor all CSS variables to exact Linear color tones and 1px borders with subtle alpha transparency.',
      status: 'In Progress',
      priority: 'Urgent',
      assignee: { name: 'Md Rakib Sordar' },
      project: 'Linear Workspace App',
      createdAt: '2 hours ago',
      updatedAt: 'Just now'
    },
    {
      id: 'LIN-102',
      identifier: 'LIN-102',
      title: 'Build reusable popover dropdown menu system',
      description: 'Ensure all context menus and filter overlays support keyboard navigation and smooth transition animations.',
      status: 'Todo',
      priority: 'High',
      assignee: { name: 'Md Rakib Sordar' },
      project: 'Design System',
      createdAt: '1 day ago',
      updatedAt: '3 hours ago'
    },
    {
      id: 'LIN-103',
      identifier: 'LIN-103',
      title: 'Integrate Agent prompt examples and interactive assistant',
      description: 'Wire up example cards for New Project, Topic Research, and Team Setup.',
      status: 'Done',
      priority: 'Medium',
      assignee: { name: 'Md Rakib Sordar' },
      project: 'AI Agent',
      createdAt: '2 days ago',
      updatedAt: '1 day ago'
    }
  ]);

  // Methods
  setActiveView(view: ActiveView): void {
    this.previousView.set(this.activeView());
    this.activeView.set(view);
    this.closeAllMenus();
  }

  selectNotification(id: string | null): void {
    this.selectedNotificationId.set(id);
    if (id) {
      this.notifications.update(items =>
        items.map(item => item.id === id ? { ...item, isRead: true } : item)
      );
    }
  }

  markAllAsRead(): void {
    this.notifications.update(items => items.map(n => ({ ...n, isRead: true })));
  }

  toggleShowAllNotifications(): void {
    this.showAllNotifications.update(val => !val);
  }

  sendAgentMessage(text: string): void {
    if (!text.trim()) return;

    const userMsg: AgentChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: 'Just now'
    };

    this.chatMessages.update(msgs => [...msgs, userMsg]);
    this.isAgentThinking.set(true);

    setTimeout(() => {
      this.isAgentThinking.set(false);
      const agentReply: AgentChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: `I've analyzed your request: "${text}". How would you like me to proceed with this task?`,
        timestamp: 'Just now',
        actions: [
          { label: 'Create issue from prompt', action: 'create_issue' },
          { label: 'Run deeper analysis', action: 'analyze' }
        ]
      };
      this.chatMessages.update(msgs => [...msgs, agentReply]);
    }, 900);
  }

  createIssue(issue: Omit<IssueItem, 'id' | 'createdAt' | 'updatedAt'>): void {
    const id = `LIN-${100 + this.issues().length + 1}`;
    const newIssue: IssueItem = {
      ...issue,
      id,
      createdAt: 'Just now',
      updatedAt: 'Just now'
    };
    this.issues.update(list => [newIssue, ...list]);
    this.isNewIssueModalOpen.set(false);
  }

  closeAllMenus(): void {
    this.currentTeamActionMenu.set(false);
    this.isInboxFilterOpen.set(false);
    this.isUserProfileMenuOpen.set(false);
    this.isSkillsMenuOpen.set(false);
    this.isAgentNewChatMenuOpen.set(false);
  }

  openCommandPalette(): void {
    this.isCommandPaletteOpen.set(true);
  }

  closeCommandPalette(): void {
    this.isCommandPaletteOpen.set(false);
  }

  openNewIssueModal(): void {
    this.isNewIssueModalOpen.set(true);
  }

  closeNewIssueModal(): void {
    this.isNewIssueModalOpen.set(false);
  }
}
