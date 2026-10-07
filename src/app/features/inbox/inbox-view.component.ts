import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { FilterPopoverComponent } from './components/filter-popover/filter-popover.component';

@Component({
  selector: 'app-inbox-view',
  standalone: true,
  imports: [CommonModule, IconComponent, FilterPopoverComponent],
  template: `
    <div class="inbox-container">
      <!-- Left List Column -->
      <div class="inbox-list-column">
        <!-- Inbox Column Header -->
        <div class="inbox-header">
          <div class="header-left">
            <h1 class="header-title">Inbox</h1>
            <button class="icon-btn" title="More options">
              <app-icon name="more" [size]="14"></app-icon>
            </button>
          </div>

          <div class="header-right">
            <button class="icon-btn" title="Mark all as read" (click)="markAllAsRead()">
              <app-icon name="check-all" [size]="14"></app-icon>
            </button>
            <button 
              class="icon-btn filter-btn" 
              [class.active]="workspaceService.isInboxFilterOpen()"
              title="Filter notifications (F)" 
              (click)="toggleFilter($event)"
            >
              <app-icon name="filter" [size]="14"></app-icon>
            </button>
            <button class="icon-btn" title="Display options">
              <app-icon name="sliders" [size]="14"></app-icon>
            </button>
          </div>
        </div>

        <!-- Filter Popover Popup (Screenshot 4) -->
        <app-filter-popover
          *ngIf="workspaceService.isInboxFilterOpen()"
          top="42px"
          right="40px"
          (closed)="workspaceService.isInboxFilterOpen.set(false)"
          (filterSelected)="onFilterSelected($event)"
        ></app-filter-popover>

        <!-- Column Content / Notifications List or Empty State -->
        <div class="inbox-body">
          <ng-container *ngIf="notifications().length === 0; else notificationsList">
            <!-- Empty State matching Screenshots 2 & 4 -->
            <div class="empty-state">
              <span class="empty-title">No unreads</span>
              <button class="show-all-btn" (click)="toggleShowAll()">Show all notifications</button>
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
      </div>

      <!-- Right Detail Pane Column -->
      <div class="inbox-detail-column">
        <ng-container *ngIf="!selectedNotification(); else selectedDetail">
          <!-- Exact Linear Tray Illustration matching Screenshots 2, 3, 4 -->
          <div class="detail-empty-state">
            <div class="inbox-tray-illustration">
              <svg width="86" height="86" viewBox="0 0 86 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Outer subtle rounded frame -->
                <path 
                  d="M18 16C18 11.5817 21.5817 8 26 8H60C64.4183 8 68 11.5817 68 16V60C68 64.4183 64.4183 68 60 68H26C21.5817 68 18 64.4183 18 60V16Z" 
                  stroke="rgba(255, 255, 255, 0.2)" 
                  stroke-width="2"
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                />
                <!-- Inner Tray cutout curve -->
                <path 
                  d="M18 50H28C30.2091 50 32 51.7909 32 54V55C32 58.3137 34.6863 61 38 61H48C51.3137 61 54 58.3137 54 55V54C54 51.7909 55.7909 50 58 50H68" 
                  stroke="rgba(255, 255, 255, 0.45)" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"
                />
                <!-- Glowing accent line inside tray -->
                <path 
                  d="M36 57H50" 
                  stroke="rgba(255, 255, 255, 0.25)" 
                  stroke-width="2" 
                  stroke-linecap="round"
                />
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
          <button class="history-btn" title="Chat history">
            <app-icon name="history" [size]="14"></app-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .inbox-container {
      display: flex;
      width: 100%;
      height: 100vh;
      background-color: #0b0c0e;
      overflow: hidden;
    }

    /* Left Column */
    .inbox-list-column {
      width: 320px;
      min-width: 300px;
      height: 100%;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      position: relative;
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
    }

    .detail-empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
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
      margin-top: auto;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
      padding: 0 16px;
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

  markAllAsRead(): void {
    this.workspaceService.markAllAsRead();
  }

  toggleFilter(event: MouseEvent): void {
    event.stopPropagation();
    const current = this.workspaceService.isInboxFilterOpen();
    this.workspaceService.closeAllMenus();
    this.workspaceService.isInboxFilterOpen.set(!current);
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
    this.workspaceService.setActiveView('Agent');
  }
}
