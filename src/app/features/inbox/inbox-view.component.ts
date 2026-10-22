import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FilterPopoverComponent } from './components/filter-popover/filter-popover.component';
import { DisplayOptionsPopoverComponent } from './components/display-options-popover/display-options-popover.component';

@Component({
  selector: 'app-inbox-view',
  standalone: true,
  imports: [CommonModule, IconComponent, FilterPopoverComponent, DisplayOptionsPopoverComponent],
  template: `
    <div class="inbox-container">
      <!-- Left List Column (Resizable) -->
      <div 
        class="inbox-list-column"
        [class.is-dragging]="isDraggingList"
        [style.width.px]="workspaceService.inboxListWidth()"
      >
        <!-- Inbox Column Header -->
        <div class="inbox-header">
          <div class="header-left">
            <!-- Sidebar Expand / Peek Button (when sidebar is collapsed) -->
            <button 
              class="icon-btn sidebar-toggle-btn" 
              *ngIf="workspaceService.isSidebarCollapsed()"
              title="Expand sidebar ([)" 
              (mouseenter)="onToggleEnter()"
              (mouseleave)="onToggleLeave()"
              (click)="onToggleClick()"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3h-13zm4 1.5H1.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h4v-8zm1.5 8h7.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H7v8z"/>
              </svg>
            </button>

            <h1 class="header-title">Inbox</h1>
            <button class="icon-btn" title="More options">
              <app-icon name="more" [size]="14"></app-icon>
            </button>
          </div>

          <div class="header-right">
            <button class="icon-btn" title="Mark all as read" (click)="markAllAsRead()">
              <app-icon name="check-all" [size]="14"></app-icon>
            </button>

            <!-- Filter Anchor & Popover (Directly underneath the Filter button) -->
            <div class="popover-anchor">
              <button 
                class="icon-btn filter-btn" 
                [class.active]="workspaceService.isInboxFilterOpen()"
                title="Filter notifications (F)" 
                (click)="toggleFilter($event)"
              >
                <app-icon name="filter" [size]="14"></app-icon>
              </button>

              <!-- Filter Popover Popup (Screenshots 1, 3, 4, 5) -->
              <app-filter-popover
                *ngIf="workspaceService.isInboxFilterOpen()"
                (closed)="workspaceService.isInboxFilterOpen.set(false)"
                (filterSelected)="onFilterSelected($event)"
              ></app-filter-popover>
            </div>

            <!-- Display Options Anchor & Popover (Directly underneath the Sliders button) -->
            <div class="popover-anchor">
              <button 
                class="icon-btn display-btn" 
                [class.active]="workspaceService.isInboxDisplayOptionsOpen()"
                title="Display options"
                (click)="toggleDisplayOptions($event)"
              >
                <app-icon name="sliders" [size]="14"></app-icon>
              </button>

              <!-- Display Options Popover Popup (Screenshot 2) -->
              <app-display-options-popover
                *ngIf="workspaceService.isInboxDisplayOptionsOpen()"
                (closed)="workspaceService.isInboxDisplayOptionsOpen.set(false)"
              ></app-display-options-popover>
            </div>
          </div>
        </div>

        <!-- Priority / Other Chips Bar (Screenshot 2) -->
        <div class="inbox-chips-bar" *ngIf="workspaceService.isPriorityInboxEnabled()">
          <button 
            type="button"
            class="inbox-chip-btn" 
            [class.active]="workspaceService.activePriorityTab() === 'Priority'"
            (click)="workspaceService.activePriorityTab.set('Priority')"
          >
            Priority
          </button>
          <button 
            type="button"
            class="inbox-chip-btn" 
            [class.active]="workspaceService.activePriorityTab() === 'Other'"
            (click)="workspaceService.activePriorityTab.set('Other')"
          >
            Other
          </button>
        </div>

        <!-- Column Content / Notifications List or Empty State -->
        <div class="inbox-body">
          <ng-container *ngIf="filteredNotifications().length === 0; else notificationsList">
            <!-- Empty State matching Screenshots 1 & 2 -->
            <div class="empty-state">
              <span class="empty-title">No unreads</span>
              <button type="button" class="show-all-btn" (click)="toggleShowAll()">Show all notifications</button>
            </div>
          </ng-container>

          <ng-template #notificationsList>
            <div class="notifications-list">
              <div 
                class="notification-row"
                *ngFor="let item of filteredNotifications()"
                [class.selected]="selectedNotificationId() === item.id"
                [class.unread]="!item.isRead"
                (click)="selectNotification(item.id)"
              >
                <div class="row-avatar">{{ item.author.name.charAt(0) }}</div>
                <div class="row-content">
                  <div class="row-top">
                    <span class="row-title">{{ item.title }}</span>
                    <span class="row-time">{{ item.timestamp }}</span>
                  </div>
                  <div class="row-sub">{{ item.subtitle }}</div>
                </div>
              </div>
            </div>
          </ng-template>
        </div>

        <!-- Resizable Splitter Gutter between List & Detail with Tapered Center Glow -->
        <div 
          class="resize-gutter"
          (mousedown)="startResizeList($event)"
          (mouseenter)="isHoveringGutter = true"
          (mouseleave)="isHoveringGutter = false"
        >
          <div class="gutter-glow-line">
            <div class="gutter-center-pip"></div>
          </div>
        </div>
      </div>

      <!-- Right Detail Pane Column -->
      <div class="inbox-detail-column">
        <ng-container *ngIf="!selectedNotification(); else selectedDetail">
          <!-- Exact Linear Tray Illustration matching Screenshots 2, 3, 4 -->
          <div class="detail-empty-state">
            <div class="inbox-tray-illustration">
              <svg width="68" height="68" viewBox="0 0 68 68" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 22C20 20.8954 20.8954 20 22 20H46C47.1046 20 48 20.8954 48 22V42C48 43.1046 47.1046 44 46 44H41C40.4477 44 40 44.4477 40 45C40 46.6569 38.6569 48 37 48H31C29.3431 48 28 46.6569 28 45C28 44.4477 27.5523 44 27 44H22C20.8954 44 20 43.1046 20 42V22Z" stroke="rgba(255, 255, 255, 0.22)" stroke-width="1.6" stroke-linejoin="round"/>
                <path d="M20 34H28C28.5523 34 29 34.4477 29 35C29 36.6569 30.3431 38 32 38H36C37.6569 38 39 36.6569 39 35C39 34.4477 39.4477 34 40 34H48" stroke="rgba(255, 255, 255, 0.22)" stroke-width="1.6" stroke-linecap="round"/>
              </svg>
            </div>
            <p class="no-selection-text">No notification selected</p>
          </div>
        </ng-container>

        <ng-template #selectedDetail>
          <div class="detail-content" *ngIf="selectedNotification() as item">
            <div class="detail-header">
              <div class="issue-badge">{{ item.issueKey || 'LIN-NOTIFICATION' }}</div>
              <h2 class="detail-title">{{ item.title }}</h2>
              <div class="detail-meta">
                <span>Created by {{ item.author.name }}</span>
                <span>•</span>
                <span>{{ item.timestamp }}</span>
              </div>
            </div>

            <div class="detail-body">
              <div class="comment-card">
                <div class="comment-author">
                  <div class="avatar-sm">{{ item.author.name.charAt(0) }}</div>
                  <span class="author-name">{{ item.author.name }}</span>
                </div>
                <p class="comment-text">{{ item.subtitle }}</p>
              </div>
            </div>
          </div>
        </ng-template>

        <!-- Bottom Agent Bar (Screenshots 1, 2, 3) -->
        <div class="bottom-status-bar">
          <button class="agent-pill-btn" (click)="openAgent()">
            <app-icon name="agent" [size]="13"></app-icon>
            <span>Agent</span>
          </button>
          <button class="history-btn" title="Chat history" (click)="openAgent()">
            <app-icon name="history" [size]="14"></app-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: flex;
      flex: 1;
      width: 100%;
      height: 100%;
      min-height: 0;
      min-width: 0;
      overflow: hidden;
    }

    .inbox-container {
      min-height: 100%;
      position: relative;
      display: flex;
      width: 100%;
      height: 100%;
      background-color: #101114;
      overflow: hidden;
    }

    /* Left Column */
    .inbox-list-column {
      height: 100%;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      position: relative;
      flex-shrink: 0;
      transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .inbox-list-column.is-dragging {
      transition: none !important;
    }

    /* Resize Gutter */
    .resize-gutter {
      position: absolute;
      top: 0;
      right: -3px;
      width: 7px;
      height: 100%;
      cursor: col-resize;
      z-index: 30;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Tapered Vertical Glow: Thin 1px, fading to edges, glowing in middle */
    .gutter-glow-line {
      width: 1px;
      height: 100%;
      background: transparent;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .gutter-center-pip {
      width: 2px;
      height: 38px;
      border-radius: 2px;
      background: transparent;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .resize-gutter:hover .gutter-glow-line,
    .inbox-list-column.is-dragging .gutter-glow-line {
      background: linear-gradient(
        180deg,
        rgba(94, 106, 210, 0) 0%,
        rgba(94, 106, 210, 0.35) 20%,
        rgba(139, 150, 255, 0.85) 50%,
        rgba(94, 106, 210, 0.35) 80%,
        rgba(94, 106, 210, 0) 100%
      );
      box-shadow: 0 0 8px rgba(94, 106, 210, 0.3);
    }

    .resize-gutter:hover .gutter-center-pip,
    .inbox-list-column.is-dragging .gutter-center-pip {
      background: #7c88f7;
      box-shadow: 0 0 6px rgba(124, 136, 247, 0.8);
    }

    .inbox-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .sidebar-toggle-btn {
      color: #8a8f98;
      margin-right: 2px;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.15s ease;
    }

    .sidebar-toggle-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.09);
    }

    .header-title {
      font-size: 14px;
      font-weight: 600;
      color: #f7f8f8;
      margin: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 2px;
    }

    .icon-btn {
      background: transparent;
      border: none;
      color: #8a8f98;
      cursor: pointer;
      padding: 5px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.1s ease, color 0.1s ease;
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .popover-anchor {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    /* Priority / Other Chips Bar matching Screenshot 2 */
    .inbox-chips-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      background: transparent;
      animation: fadeInChips 0.15s ease forwards;
    }

    @keyframes fadeInChips {
      from {
        opacity: 0;
        transform: translateY(-3px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .inbox-chip-btn {
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: #8a8f98;
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.12s ease;
      font-family: inherit;
    }

    .inbox-chip-btn:hover {
      color: #c9cdd4;
      background: rgba(255, 255, 255, 0.04);
    }

    .inbox-chip-btn.active {
      color: #f7f8f8;
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.08);
    }

    .display-btn.active,
    .filter-btn.active {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .inbox-body {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
    }

    .empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      color: #8a8f98;
    }

    .empty-title {
      font-size: 13px;
      color: #8a8f98;
    }

    .show-all-btn {
      background: transparent;
      border: none;
      color: #f7f8f8;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      font-family: inherit;
    }

    .show-all-btn:hover {
      text-decoration: underline;
    }

    .notifications-list {
      display: flex;
      flex-direction: column;
    }

    .notification-row {
      display: flex;
      gap: 10px;
      padding: 12px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      cursor: pointer;
      transition: background 0.1s ease;
    }

    .notification-row:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .notification-row.selected {
      background: rgba(255, 255, 255, 0.08);
    }

    .row-avatar {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #5e6ad2;
      color: white;
      font-size: 11px;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .row-content {
      flex: 1;
      overflow: hidden;
    }

    .row-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }

    .row-title {
      font-size: 13px;
      color: #f7f8f8;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .row-time {
      font-size: 11px;
      color: #6b7280;
      flex-shrink: 0;
    }

    .row-sub {
      font-size: 12px;
      color: #8a8f98;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }

    /* Right Detail Column */
    .inbox-detail-column {
      flex: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
    }

    .detail-empty-state {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      pointer-events: none;
    }

    .inbox-tray-illustration {
      opacity: 0.8;
      filter: drop-shadow(0 0 12px rgba(255, 255, 255, 0.03));
      transition: transform 0.2s ease, opacity 0.2s ease;
    }

    .inbox-tray-illustration:hover {
      opacity: 1;
      transform: translateY(-2px);
    }

    .no-selection-text {
      font-size: 13px;
      color: #8a8f98;
      font-weight: 400;
      letter-spacing: 0.1px;
    }

    .detail-content {
      flex: 1;
      padding: 24px 32px;
      overflow-y: auto;
    }

    .issue-badge {
      display: inline-block;
      font-size: 12px;
      font-weight: 500;
      color: #8a8f98;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 8px;
      border-radius: 4px;
      margin-bottom: 8px;
    }

    .detail-title {
      font-size: 20px;
      font-weight: 600;
      color: #f7f8f8;
      margin: 0 0 8px 0;
    }

    .detail-meta {
      display: flex;
      gap: 8px;
      font-size: 12px;
      color: #8a8f98;
      margin-bottom: 24px;
    }

    .comment-card {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 16px;
    }

    .comment-author {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
    }

    .avatar-sm {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #5e6ad2;
      color: #fff;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .author-name {
      font-size: 12px;
      font-weight: 500;
      color: #f7f8f8;
    }

    .comment-text {
      font-size: 13px;
      color: #d1d5db;
      line-height: 1.5;
    }

    /* Bottom status bar */
    .bottom-status-bar {
      position: absolute;
      bottom: 12px;
      right: 16px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .agent-pill-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: none;
      color: #8a8f98;
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.1s ease;
    }

    .agent-pill-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
    }

    .history-btn {
      background: transparent;
      border: none;
      color: #8a8f98;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      transition: all 0.1s ease;
    }

    .history-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
    }
  `]
})
export class InboxViewComponent {
  isHoveringGutter = false;
  isDraggingList = false;
  startX = 0;
  startWidth = 320;

  private toggleHoverTimeout: any;

  constructor(public workspaceService: WorkspaceService) {}

  get notifications() {
    return this.workspaceService.notifications;
  }

  get filteredNotifications() {
    return this.workspaceService.filteredNotifications;
  }

  get selectedNotificationId() {
    return this.workspaceService.selectedNotificationId;
  }

  get selectedNotification() {
    return this.workspaceService.selectedNotification;
  }

  onToggleEnter(): void {
    if (this.toggleHoverTimeout) {
      clearTimeout(this.toggleHoverTimeout);
    }
    this.workspaceService.setSidebarPeeking(true);
  }

  onToggleLeave(): void {
    this.toggleHoverTimeout = setTimeout(() => {
      // Small grace period so user can move mouse into peek sidebar
      if (!this.workspaceService.isSidebarPeeking()) {
        this.workspaceService.setSidebarPeeking(false);
      }
    }, 250);
  }

  onToggleClick(): void {
    this.workspaceService.toggleSidebar();
  }

  markAllAsRead(): void {
    this.workspaceService.markAllAsRead();
  }

  toggleFilter(event: MouseEvent): void {
    event.stopPropagation();
    const current = this.workspaceService.isInboxFilterOpen();
    this.workspaceService.closeAllMenus();
    this.workspaceService.isInboxFilterOpen.set(!current);
  }

  toggleDisplayOptions(event: MouseEvent): void {
    event.stopPropagation();
    const current = this.workspaceService.isInboxDisplayOptionsOpen();
    this.workspaceService.closeAllMenus();
    this.workspaceService.isInboxDisplayOptionsOpen.set(!current);
  }

  @HostListener('document:keydown', ['$event'])
  onGlobalKeyDown(e: KeyboardEvent): void {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
    if (e.key === 'f' || e.key === 'F') {
      e.preventDefault();
      const current = this.workspaceService.isInboxFilterOpen();
      this.workspaceService.closeAllMenus();
      this.workspaceService.isInboxFilterOpen.set(!current);
    }
  }

  onFilterSelected(filterId: string): void {
    this.workspaceService.activeFilterCategory.set(filterId);
  }

  selectNotification(id: string): void {
    this.workspaceService.selectNotification(id);
  }

  toggleShowAll(): void {
    this.workspaceService.toggleShowAllNotifications();
  }

  openAgent(): void {
    this.workspaceService.toggleFloatingAgentChat();
  }

  startResizeList(event: MouseEvent): void {
    event.preventDefault();
    this.isDraggingList = true;
    this.startX = event.clientX;
    this.startWidth = this.workspaceService.inboxListWidth();

    const mouseMoveHandler = (e: MouseEvent) => {
      const deltaX = e.clientX - this.startX;
      const newWidth = this.startWidth + deltaX;
      this.workspaceService.setInboxListWidth(newWidth);
    };

    const mouseUpHandler = () => {
      this.isDraggingList = false;
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  }
}
