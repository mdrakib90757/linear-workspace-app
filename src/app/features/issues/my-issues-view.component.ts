import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { IssuesDisplayOptionsPopoverComponent } from './components/issues-display-options-popover/issues-display-options-popover.component';
import { IssuesFilterPopoverComponent } from './components/issues-filter-popover/issues-filter-popover.component';

@Component({
  selector: 'app-my-issues-view',
  standalone: true,
  imports: [
    CommonModule, 
    IconComponent, 
    IssuesDisplayOptionsPopoverComponent, 
    IssuesFilterPopoverComponent
  ],
  template: `
    <div class="issues-view-container">
      
      <!-- Top Header & Tabs Bar (Screenshots 1-5) -->
      <div class="issues-header">
        <div class="header-left">
          <!-- Sidebar Toggle (when collapsed) -->
          <button 
            class="icon-btn sidebar-toggle-btn" 
            *ngIf="workspaceService.isSidebarCollapsed()"
            title="Expand sidebar ([)" 
            (click)="onToggleSidebar()"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3h-13zm4 1.5H1.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h4v-8zm1.5 8h7.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H7v8z"/>
            </svg>
          </button>

          <h1 class="view-title">{{ viewTitle }}</h1>
        </div>

        <div class="header-right">
          <!-- Filter Button & Popover (Screenshot 3) -->
          <div class="popover-anchor">
            <button 
              class="icon-btn" 
              [class.active]="workspaceService.isIssuesFilterOpen()"
              title="Filter issues (F)"
              (click)="toggleFilter($event)"
            >
              <app-icon name="filter" [size]="14"></app-icon>
            </button>

            <app-issues-filter-popover
              *ngIf="workspaceService.isIssuesFilterOpen()"
              (closed)="workspaceService.isIssuesFilterOpen.set(false)"
            ></app-issues-filter-popover>
          </div>

          <!-- Display Options Button & Popover (Screenshots 1, 2, 4, 5) -->
          <div class="popover-anchor">
            <button 
              class="icon-btn" 
              [class.active]="workspaceService.isIssuesDisplayOptionsOpen()"
              title="Display options"
              (click)="toggleDisplayOptions($event)"
            >
              <app-icon name="sliders" [size]="14"></app-icon>
            </button>

            <app-issues-display-options-popover
              *ngIf="workspaceService.isIssuesDisplayOptionsOpen()"
              (closed)="workspaceService.isIssuesDisplayOptionsOpen.set(false)"
            ></app-issues-display-options-popover>
          </div>

          <!-- View Layout Icon -->
          <button class="icon-btn" title="Toggle layout">
            <app-icon name="views" [size]="14"></app-icon>
          </button>
        </div>
      </div>

      <!-- Sub-Tabs Bar: Assigned, Created, Subscribed, Activity (Screenshots 1-5) -->
      <div class="issues-tabs-bar" *ngIf="viewTitle === 'My issues'">
        <button 
          type="button"
          class="tab-chip-btn" 
          *ngFor="let tab of myIssuesTabs"
          [class.active]="workspaceService.activeMyIssuesTab() === tab"
          (click)="selectTab(tab)"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Main Canvas / Empty State (Screenshots 1, 2) -->
      <div class="issues-canvas">
        <div class="empty-state-wrapper">
          
          <!-- Exact 3D Concentric Wireframe Ring Illustration < ( O ) > (Screenshots 1, 2, 4, 5) -->
          <div class="wireframe-rings-illustration">
            <svg width="220" height="150" viewBox="0 0 220 150" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(255, 255, 255, 0.45)"/>
                  <stop offset="100%" stop-color="rgba(255, 255, 255, 0.15)"/>
                </linearGradient>
                <linearGradient id="reflectGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="rgba(255, 255, 255, 0.18)"/>
                  <stop offset="100%" stop-color="rgba(255, 255, 255, 0)"/>
                </linearGradient>
              </defs>

              <!-- Left Chevron Wing < -->
              <path d="M72 48C62 58 62 70 72 80" stroke="url(#ringGrad)" stroke-width="2.6" stroke-linecap="round"/>
              <path d="M68 51C60 60 60 69 68 77" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.6" stroke-linecap="round"/>
              <!-- Reflected Left Wing -->
              <path d="M72 102C62 92 62 80 72 70" stroke="url(#reflectGrad)" stroke-width="2.2" stroke-linecap="round" opacity="0.45"/>

              <!-- Right Chevron Wing > -->
              <path d="M148 48C158 58 158 70 148 80" stroke="url(#ringGrad)" stroke-width="2.6" stroke-linecap="round"/>
              <path d="M152 51C160 60 160 69 152 77" stroke="rgba(255, 255, 255, 0.2)" stroke-width="1.6" stroke-linecap="round"/>
              <!-- Reflected Right Wing -->
              <path d="M148 102C158 92 158 80 148 70" stroke="url(#reflectGrad)" stroke-width="2.2" stroke-linecap="round" opacity="0.45"/>

              <!-- Top Floating Dashed Ring -->
              <ellipse cx="110" cy="40" rx="22" ry="7" stroke="rgba(255, 255, 255, 0.28)" stroke-width="1.8" stroke-dasharray="3 3"/>

              <!-- Main Center Concentric Rings ( O ) -->
              <ellipse cx="110" cy="62" rx="36" ry="13" stroke="url(#ringGrad)" stroke-width="2.6"/>
              <ellipse cx="110" cy="62" rx="22" ry="8" stroke="rgba(255, 255, 255, 0.38)" stroke-width="1.8"/>

              <!-- Lower Ring Layer -->
              <ellipse cx="110" cy="74" rx="34" ry="12" stroke="rgba(255, 255, 255, 0.25)" stroke-width="1.8"/>

              <!-- Faded Reflection Layers Below -->
              <ellipse cx="110" cy="90" rx="32" ry="11" stroke="url(#reflectGrad)" stroke-width="1.8" opacity="0.5"/>
              <ellipse cx="110" cy="100" rx="28" ry="9" stroke="url(#reflectGrad)" stroke-width="1.5" opacity="0.25"/>
            </svg>
          </div>

          <!-- Empty State Headline -->
          <p class="empty-headline">
            {{ viewTitle === 'My issues' ? 'No issues assigned to you' : 'No issues found' }}
          </p>

          <!-- Primary Action Button: Create new issue (Screenshots 1, 2) -->
          <button type="button" class="create-issue-btn" (click)="createNewIssue()">
            Create new issue
          </button>

        </div>

        <!-- Floating Bottom-Right Controls (Screenshot 1, 2, 4, 5) -->
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

    .issues-view-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      background-color: #101114;
      overflow: hidden;
      position: relative;
    }

    /* Top Header */
    .issues-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 48px;
      padding: 0 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      flex-shrink: 0;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .sidebar-toggle-btn {
      color: #8a8f98;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.15s ease;
    }

    .sidebar-toggle-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.09);
    }

    .view-title {
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

    .popover-anchor {
      position: relative;
      display: inline-flex;
      align-items: center;
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

    .icon-btn:hover,
    .icon-btn.active {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    /* Sub-tabs bar: Assigned, Created, Subscribed, Activity (Screenshots 1-5) */
    .issues-tabs-bar {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 8px 20px 4px 20px;
      flex-shrink: 0;
    }

    .tab-chip-btn {
      padding: 4px 10px;
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

    .tab-chip-btn:hover {
      color: #c9cdd4;
      background: rgba(255, 255, 255, 0.04);
    }

    .tab-chip-btn.active {
      color: #f7f8f8;
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.06);
    }

    /* Main Center Canvas */
    .issues-canvas {
      flex: 1;
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .empty-state-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 14px;
      margin-top: -30px;
    }

    .wireframe-rings-illustration {
      opacity: 0.9;
      filter: drop-shadow(0 0 16px rgba(255, 255, 255, 0.02));
      transition: transform 0.25s ease, opacity 0.25s ease;
    }

    .wireframe-rings-illustration:hover {
      opacity: 1;
      transform: translateY(-2px);
    }

    .empty-headline {
      font-size: 13px;
      color: #8a8f98;
      font-weight: 400;
      letter-spacing: 0.1px;
      margin: 0;
    }

    /* Primary Linear Action Button */
    .create-issue-btn {
      background: #5e6ad2;
      color: #ffffff;
      border: none;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 12.5px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.12s ease, transform 0.1s ease;
      font-family: inherit;
      box-shadow: 0 1px 4px rgba(94, 106, 210, 0.3);
    }

    .create-issue-btn:hover {
      background: #6f7cf4;
      transform: translateY(-1px);
    }

    .create-issue-btn:active {
      transform: translateY(0);
    }

    /* Floating Bottom-Right Status Bar */
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
export class MyIssuesViewComponent {
  @Input() viewTitle: string = 'My issues';

  readonly myIssuesTabs: ('Assigned' | 'Created' | 'Subscribed' | 'Activity')[] = [
    'Assigned',
    'Created',
    'Subscribed',
    'Activity'
  ];

  constructor(public workspaceService: WorkspaceService) {}

  onToggleSidebar(): void {
    this.workspaceService.toggleSidebar();
  }

  selectTab(tab: 'Assigned' | 'Created' | 'Subscribed' | 'Activity'): void {
    this.workspaceService.activeMyIssuesTab.set(tab);
  }

  toggleFilter(e: MouseEvent): void {
    e.stopPropagation();
    const curr = this.workspaceService.isIssuesFilterOpen();
    this.workspaceService.closeAllMenus();
    this.workspaceService.isIssuesFilterOpen.set(!curr);
  }

  toggleDisplayOptions(e: MouseEvent): void {
    e.stopPropagation();
    const curr = this.workspaceService.isIssuesDisplayOptionsOpen();
    this.workspaceService.closeAllMenus();
    this.workspaceService.isIssuesDisplayOptionsOpen.set(!curr);
  }

  createNewIssue(): void {
    this.workspaceService.openNewIssueModal();
  }

  openAgent(): void {
    this.workspaceService.toggleFloatingAgentChat();
  }
}

