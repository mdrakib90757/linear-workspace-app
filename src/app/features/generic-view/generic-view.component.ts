import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../core/services/workspace.service';
import { ActiveView, IssueItem } from '../../core/models/workspace.model';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-generic-view',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="generic-view-container">
      <!-- Header -->
      <div class="view-header">
        <div class="header-left">
          <!-- Sidebar Expand / Peek Button (when sidebar is collapsed) -->
          <button 
            class="sidebar-toggle-btn" 
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

          <h1 class="view-title">{{ activeView }}</h1>
          <span class="count-badge" *ngIf="issues().length > 0">{{ issues().length }}</span>
        </div>

        <div class="header-right">
          <button class="action-btn" (click)="createNewIssue()">
            <app-icon name="compose" [size]="13"></app-icon>
            <span>New issue</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="view-content">
        <!-- If Issues list -->
        <div class="issues-table" *ngIf="activeView === 'My issues' || activeView === 'Issues' || activeView === 'Home' || activeView === 'Projects' || activeView === 'Views'">
          <div class="table-header">
            <div class="col col-id">Identifier</div>
            <div class="col col-title">Title</div>
            <div class="col col-status">Status</div>
            <div class="col col-priority">Priority</div>
            <div class="col col-time">Created</div>
          </div>

          <div class="table-body">
            <div 
              class="table-row" 
              *ngFor="let issue of issues()"
              (click)="openIssue(issue)"
            >
              <div class="col col-id">
                <span class="id-tag">{{ issue.identifier }}</span>
              </div>
              <div class="col col-title">
                <span class="title-text">{{ issue.title }}</span>
              </div>
              <div class="col col-status">
                <span class="status-pill" [attr.data-status]="issue.status">{{ issue.status }}</span>
              </div>
              <div class="col col-priority">
                <span class="priority-pill" [attr.data-priority]="issue.priority">{{ issue.priority }}</span>
              </div>
              <div class="col col-time">
                <span class="time-text">{{ issue.createdAt }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- If Import / Invite / GitHub integrations -->
        <div class="integration-placeholder" *ngIf="activeView === 'Import issues' || activeView === 'Invite people' || activeView === 'Connect GitHub'">
          <div class="integration-card">
            <app-icon [name]="activeView === 'Connect GitHub' ? 'github' : (activeView === 'Invite people' ? 'invite' : 'import')" [size]="32"></app-icon>
            <h2 class="card-headline">{{ activeView }}</h2>
            <p class="card-sub">Seamlessly configure and synchronize your workspace workflow.</p>
            <button class="primary-btn" (click)="openWorkspaceModal()">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .generic-view-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100vh;
      background-color: #0b0c0e;
      overflow: hidden;
    }

    .view-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .view-title {
      font-size: 15px;
      font-weight: 600;
      color: #f7f8f8;
      margin: 0;
    }

    .count-badge {
      font-size: 11px;
      color: #8a8f98;
      background: rgba(255, 255, 255, 0.06);
      padding: 1px 7px;
      border-radius: 10px;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #5e6ad2;
      color: #ffffff;
      border: none;
      padding: 5px 12px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: background 0.1s ease;
    }

    .action-btn:hover {
      background: #6f7cf4;
    }

    .view-content {
      flex: 1;
      overflow-y: auto;
      padding: 16px 24px;
    }

    .issues-table {
      display: flex;
      flex-direction: column;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      overflow: hidden;
      background: #0d0e11;
    }

    .table-header {
      display: flex;
      align-items: center;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      font-size: 11px;
      font-weight: 600;
      color: #62666d;
      text-transform: uppercase;
    }

    .table-row {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.03);
      cursor: pointer;
      transition: background 0.1s ease;
      font-size: 13px;
    }

    .table-row:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .col-id { width: 90px; }
    .col-title { flex: 1; padding-right: 16px; }
    .col-status { width: 120px; }
    .col-priority { width: 110px; }
    .col-time { width: 100px; text-align: right; }

    .id-tag {
      font-size: 11px;
      color: #8a8f98;
      font-weight: 500;
    }

    .title-text {
      color: #f7f8f8;
      font-weight: 500;
    }

    .status-pill {
      display: inline-block;
      font-size: 11px;
      padding: 2px 7px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.06);
      color: #d1d5db;
    }

    .status-pill[data-status="In Progress"] {
      background: rgba(245, 158, 11, 0.15);
      color: #f59e0b;
    }

    .status-pill[data-status="Done"] {
      background: rgba(16, 185, 129, 0.15);
      color: #10b981;
    }

    .priority-pill {
      font-size: 11px;
      color: #8a8f98;
    }

    .priority-pill[data-priority="Urgent"] {
      color: #ef4444;
      font-weight: 500;
    }

    .time-text {
      font-size: 11px;
      color: #6b7280;
    }

    .integration-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 70%;
    }

    .integration-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 12px;
      background: #121316;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 32px 40px;
      max-width: 420px;
    }

    .card-headline {
      font-size: 18px;
      font-weight: 600;
      color: #f7f8f8;
      margin: 0;
    }

    .card-sub {
      font-size: 13px;
      color: #8a8f98;
      line-height: 1.5;
      margin: 0;
    }

    .primary-btn {
      background: #5e6ad2;
      color: white;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 8px;
      transition: background 0.15s ease;
    }

    .sidebar-toggle-btn {
      color: #8a8f98;
      margin-right: 8px;
      padding: 4px;
      border-radius: 4px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .sidebar-toggle-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.09);
    }
  `]
})
export class GenericViewComponent {
  @Input() activeView: ActiveView = 'My issues';
  private toggleHoverTimeout: any;

  constructor(public workspaceService: WorkspaceService) {}

  onToggleEnter(): void {
    if (this.toggleHoverTimeout) {
      clearTimeout(this.toggleHoverTimeout);
    }
    this.workspaceService.setSidebarPeeking(true);
  }

  onToggleLeave(): void {
    this.toggleHoverTimeout = setTimeout(() => {
      if (!this.workspaceService.isSidebarPeeking()) {
        this.workspaceService.setSidebarPeeking(false);
      }
    }, 250);
  }

  onToggleClick(): void {
    this.workspaceService.toggleSidebar();
  }

  get issues() {
    return this.workspaceService.issues;
  }

  createNewIssue(): void {
    this.workspaceService.openNewIssueModal();
  }

  openIssue(issue: IssueItem): void {
    // Navigate or view
  }

  openWorkspaceModal(): void {
    this.workspaceService.openNewIssueModal();
  }
}
