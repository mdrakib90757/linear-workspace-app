import { Component, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

interface FilterCategory {
  id: string;
  name: string;
  icon: string;
}

interface PriorityOption {
  id: string;
  label: string;
  icon: string;
}

interface StatusOption {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-filter-popover',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <!-- Transparent backdrop to close when clicked outside -->
    <div class="popover-backdrop" (click)="closed.emit()"></div>

    <!-- Main Filter Popover Anchored Directly Below Filter Button (Screenshot 1) -->
    <div class="filter-popover-wrapper" (click)="$event.stopPropagation()" (mouseleave)="onWrapperLeave()">
      <div class="main-filter-panel">
        <!-- Search input with 'F' shortcut badge -->
        <div class="search-header">
          <input 
            type="text" 
            [(ngModel)]="mainSearchQuery" 
            placeholder="Add Filter..." 
            class="filter-search-input"
            autofocus
          />
          <span class="shortcut-key">F</span>
        </div>

        <!-- Filter Categories List -->
        <div class="categories-list">
          <button 
            type="button"
            class="category-row" 
            *ngFor="let cat of filteredCategories"
            [class.active]="activeSubmenu() === cat.id"
            (mouseenter)="onCategoryHover(cat.id)"
            (click)="onCategoryClick(cat.id)"
          >
            <div class="row-left">
              <app-icon [name]="cat.icon" [size]="14"></app-icon>
              <span>{{ cat.name }}</span>
            </div>
            <app-icon name="chevron-right" [size]="10" class="row-chevron"></app-icon>
          </button>
        </div>
      </div>

      <!-- Nested Flyout Submenu Panel (Opens to the right, exactly matching Screenshots 1, 3, 4, 5) -->
      <div class="submenu-flyout-panel" *ngIf="activeSubmenu()" [ngSwitch]="activeSubmenu()">
        
        <!-- 1. Notification Type Submenu (Screenshot 3) -->
        <div *ngSwitchCase="'notification-type'" class="submenu-container">
          <div class="submenu-search-box">
            <input 
              type="text" 
              [(ngModel)]="submenuSearchQuery" 
              placeholder="Filter..." 
              class="submenu-search-input"
              autofocus
            />
          </div>
          <div class="checkbox-scroll-list">
            <div 
              class="checkbox-item" 
              *ngFor="let item of filteredNotificationTypes"
              (click)="toggleNotificationType(item)"
            >
              <div class="custom-checkbox" [class.checked]="selectedNotificationTypes().has(item)">
                <svg *ngIf="selectedNotificationTypes().has(item)" width="10" height="10" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <span class="item-label">{{ item }}</span>
            </div>
          </div>
        </div>

        <!-- 2. From Submenu (Screenshot 4) -->
        <div *ngSwitchCase="'from'" class="submenu-container empty-container">
          <div class="empty-options-box">
            <span>No matching options</span>
          </div>
        </div>

        <!-- 3. Project Submenu -->
        <div *ngSwitchCase="'project'" class="submenu-container">
          <div class="submenu-search-box">
            <input 
              type="text" 
              [(ngModel)]="submenuSearchQuery" 
              placeholder="Filter..." 
              class="submenu-search-input"
              autofocus
            />
          </div>
          <div class="options-list">
            <button 
              type="button" 
              class="option-item" 
              *ngFor="let p of filteredProjects"
              (click)="selectOption('project', p)"
            >
              <app-icon name="project" [size]="14"></app-icon>
              <span>{{ p }}</span>
            </button>
          </div>
        </div>

        <!-- 4. Issue Priority Submenu (Screenshot 1) -->
        <div *ngSwitchCase="'issue-priority'" class="submenu-container">
          <div class="submenu-search-box">
            <input 
              type="text" 
              [(ngModel)]="submenuSearchQuery" 
              placeholder="Filter..." 
              class="submenu-search-input"
              autofocus
            />
          </div>
          <div class="options-list">
            <button 
              type="button" 
              class="option-item" 
              *ngFor="let opt of filteredPriorities"
              (click)="selectOption('priority', opt.label)"
            >
              <div class="option-icon-wrapper">
                <app-icon [name]="opt.icon" [size]="14"></app-icon>
              </div>
              <span>{{ opt.label }}</span>
            </button>
          </div>
        </div>

        <!-- 5. Issue Status Type Submenu (Screenshot 5) -->
        <div *ngSwitchCase="'issue-status-type'" class="submenu-container">
          <div class="submenu-search-box">
            <input 
              type="text" 
              [(ngModel)]="submenuSearchQuery" 
              placeholder="Filter..." 
              class="submenu-search-input"
              autofocus
            />
          </div>
          <div class="options-list">
            <button 
              type="button" 
              class="option-item" 
              *ngFor="let st of filteredStatuses"
              (click)="selectOption('status', st.label)"
            >
              <div class="option-icon-wrapper">
                <app-icon [name]="st.icon" [size]="14"></app-icon>
              </div>
              <span>{{ st.label }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    :host {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      z-index: 1000;
      display: block;
    }

    .popover-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 998;
      background: transparent;
    }

    .filter-popover-wrapper {
      position: relative;
      z-index: 999;
      display: flex;
      align-items: flex-start;
      animation: popoverFadeIn 0.14s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes popoverFadeIn {
      from {
        opacity: 0;
        transform: scale(0.97) translateY(-3px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    /* Main Menu Panel */
    .main-filter-panel {
      width: 200px;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.04);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      user-select: none;
    }

    /* Search Box */
    .search-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 8px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      margin: 2px 2px 4px 2px;
    }

    .filter-search-input {
      background: transparent;
      border: none;
      outline: none;
      color: #f3f4f6;
      font-size: 13px;
      font-family: inherit;
      width: 100%;
    }

    .filter-search-input::placeholder {
      color: #6b7280;
    }

    .shortcut-key {
      font-size: 10px;
      color: #9ca3af;
      background: rgba(255, 255, 255, 0.08);
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 500;
    }

    /* Categories List */
    .categories-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .category-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 30px;
      padding: 0 8px;
      background: transparent;
      border: none;
      border-radius: 5px;
      color: #c9cdd4;
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s ease, color 0.1s ease;
    }

    .category-row:hover,
    .category-row.active {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .row-left {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .row-chevron {
      color: #6b7280;
    }

    /* Submenu Flyout Panel (Positioned side-by-side to the right) */
    .submenu-flyout-panel {
      position: absolute;
      left: calc(100% + 4px);
      top: 0;
      z-index: 1001;
      animation: submenuFadeIn 0.12s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes submenuFadeIn {
      from {
        opacity: 0;
        transform: translateX(-4px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .submenu-container {
      width: 200px;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.04);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .submenu-search-box {
      padding: 5px 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      margin-bottom: 3px;
    }

    .submenu-search-input {
      background: transparent;
      border: none;
      outline: none;
      color: #f3f4f6;
      font-size: 13px;
      font-family: inherit;
      width: 100%;
    }

    .submenu-search-input::placeholder {
      color: #6b7280;
    }

    .options-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .option-item {
      display: flex;
      align-items: center;
      gap: 9px;
      width: 100%;
      height: 28px;
      padding: 0 8px;
      background: transparent;
      border: none;
      border-radius: 5px;
      color: #c9cdd4;
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s ease, color 0.1s ease;
    }

    .option-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .option-icon-wrapper {
      width: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* Notification Types Checkbox List (Screenshot 3) */
    .checkbox-scroll-list {
      max-height: 380px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .checkbox-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 8px;
      border-radius: 5px;
      cursor: pointer;
      color: #c9cdd4;
      font-size: 13px;
      transition: background 0.1s ease, color 0.1s ease;
    }

    .checkbox-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .custom-checkbox {
      width: 13px;
      height: 13px;
      border-radius: 3px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: all 0.12s ease;
    }

    .custom-checkbox.checked {
      background: #5e6ad2;
      border-color: #5e6ad2;
    }

    .item-label {
      flex: 1;
    }

    /* Empty Box for "From" (Screenshot 4) */
    .empty-container {
      width: 170px;
      padding: 10px 12px;
    }

    .empty-options-box {
      color: #8a8f98;
      font-size: 12.5px;
      text-align: center;
      padding: 4px 0;
    }
  `]
})
export class FilterPopoverComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() filterSelected = new EventEmitter<string>();

  mainSearchQuery = '';
  submenuSearchQuery = '';
  readonly activeSubmenu = signal<string | null>(null);

  readonly categories: FilterCategory[] = [
    { id: 'notification-type', name: 'Notification type', icon: 'notification-type' },
    { id: 'from', name: 'From', icon: 'user' },
    { id: 'project', name: 'Project', icon: 'project' },
    { id: 'issue-priority', name: 'Issue priority', icon: 'priority' },
    { id: 'issue-status-type', name: 'Issue status type', icon: 'status' }
  ];

  readonly notificationTypes: string[] = [
    'Apps and integrations',
    'Assignments',
    'Billing',
    'Comments and replies',
    'Customer requests',
    'Document changes',
    'Loops',
    'Mentions',
    'Pulse summaries',
    'Reactions',
    'Reminders and deadlines',
    'Reviews',
    'Status changes',
    'Subscriptions',
    'System notifications',
    'Triage',
    'Updates'
  ];

  readonly selectedNotificationTypes = signal<Set<string>>(new Set());

  readonly priorityOptions: PriorityOption[] = [
    { id: 'no-priority', label: 'No priority', icon: 'priority-none' },
    { id: 'urgent', label: 'Urgent', icon: 'priority-urgent' },
    { id: 'high', label: 'High', icon: 'priority-high' },
    { id: 'medium', label: 'Medium', icon: 'priority-medium' },
    { id: 'low', label: 'Low', icon: 'priority-low' }
  ];

  readonly statusOptions: StatusOption[] = [
    { id: 'triage', label: 'Triage', icon: 'status-triage' },
    { id: 'backlog', label: 'Backlog', icon: 'status-backlog' },
    { id: 'unstarted', label: 'Unstarted', icon: 'status-unstarted' },
    { id: 'started', label: 'Started', icon: 'status-started' },
    { id: 'completed', label: 'Completed', icon: 'status-completed' },
    { id: 'canceled', label: 'Canceled', icon: 'status-canceled' },
    { id: 'duplicate', label: 'Duplicate', icon: 'status-duplicate' }
  ];

  readonly projects: string[] = [
    'Linear Workspace App',
    'Design System',
    'AI Agent Engine',
    'Frontend Core'
  ];

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }

  get filteredCategories(): FilterCategory[] {
    if (!this.mainSearchQuery.trim()) return this.categories;
    const q = this.mainSearchQuery.toLowerCase();
    return this.categories.filter(c => c.name.toLowerCase().includes(q));
  }

  get filteredNotificationTypes(): string[] {
    if (!this.submenuSearchQuery.trim()) return this.notificationTypes;
    const q = this.submenuSearchQuery.toLowerCase();
    return this.notificationTypes.filter(t => t.toLowerCase().includes(q));
  }

  get filteredPriorities(): PriorityOption[] {
    if (!this.submenuSearchQuery.trim()) return this.priorityOptions;
    const q = this.submenuSearchQuery.toLowerCase();
    return this.priorityOptions.filter(p => p.label.toLowerCase().includes(q));
  }

  get filteredStatuses(): StatusOption[] {
    if (!this.submenuSearchQuery.trim()) return this.statusOptions;
    const q = this.submenuSearchQuery.toLowerCase();
    return this.statusOptions.filter(s => s.label.toLowerCase().includes(q));
  }

  get filteredProjects(): string[] {
    if (!this.submenuSearchQuery.trim()) return this.projects;
    const q = this.submenuSearchQuery.toLowerCase();
    return this.projects.filter(p => p.toLowerCase().includes(q));
  }

  onCategoryHover(id: string): void {
    this.submenuSearchQuery = '';
    this.activeSubmenu.set(id);
  }

  onCategoryClick(id: string): void {
    this.submenuSearchQuery = '';
    this.activeSubmenu.set(this.activeSubmenu() === id ? null : id);
  }

  onWrapperLeave(): void {
    this.activeSubmenu.set(null);
  }

  toggleNotificationType(item: string): void {
    const current = new Set(this.selectedNotificationTypes());
    if (current.has(item)) {
      current.delete(item);
    } else {
      current.add(item);
    }
    this.selectedNotificationTypes.set(current);
  }

  selectOption(type: string, value: string): void {
    this.filterSelected.emit(`${type}:${value}`);
    this.closed.emit();
  }
}
