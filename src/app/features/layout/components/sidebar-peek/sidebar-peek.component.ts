import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { ActiveView } from '../../../../core/models/workspace.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { TeamActionMenuComponent } from '../team-action-menu/team-action-menu.component';
import { UserProfileMenuComponent } from '../user-profile-menu/user-profile-menu.component';

@Component({
  selector: 'app-sidebar-peek',
  standalone: true,
  imports: [CommonModule, IconComponent, TeamActionMenuComponent, UserProfileMenuComponent],
  template: `
    <div 
      class="sidebar-peek-panel"
      (mouseenter)="onMouseEnter()"
      (mouseleave)="onMouseLeave()"
    >
      <!-- Top Workspace / User Header -->
      <div class="sidebar-header">
        <button class="user-profile-btn" (click)="toggleUserProfileMenu($event)">
          <div class="avatar">MRS</div>
          <span class="user-name">Md Rakib Sordar</span>
          <app-icon name="chevron-down" [size]="10" class="chevron-icon"></app-icon>
        </button>

        <div class="header-actions">
          <button class="icon-btn" title="Search (Ctrl+K)" (click)="onSearchClick()">
            <app-icon name="search" [size]="14"></app-icon>
          </button>
          <button class="icon-btn" title="New Issue (C)" (click)="onNewIssueClick()">
            <app-icon name="compose" [size]="14"></app-icon>
          </button>
        </div>
      </div>

      <!-- Scrollable Nav Tree -->
      <div class="sidebar-content">
        <!-- Main Top Level Links -->
        <nav class="nav-group">
          <button 
            class="nav-item" 
            [class.active]="activeView() === 'Inbox'"
            (click)="selectView('Inbox')"
          >
            <div class="nav-item-left">
              <app-icon name="inbox" [size]="15"></app-icon>
              <span>Inbox</span>
            </div>
            <span class="badge" *ngIf="unreadCount() > 0">{{ unreadCount() }}</span>
          </button>

          <button 
            class="nav-item" 
            [class.active]="activeView() === 'My issues'"
            (click)="selectView('My issues')"
          >
            <div class="nav-item-left">
              <app-icon name="my-issues" [size]="15"></app-icon>
              <span>My issues</span>
            </div>
          </button>

          <button 
            class="nav-item" 
            [class.active]="activeView() === 'Agent'"
            (click)="selectView('Agent')"
          >
            <div class="nav-item-left">
              <app-icon name="agent" [size]="15"></app-icon>
              <span>Agent</span>
            </div>
          </button>
        </nav>

        <!-- Workspace Section -->
        <div class="section-container">
          <button class="section-title-btn" (click)="isWorkspaceOpen = !isWorkspaceOpen">
            <span>Workspace</span>
            <app-icon [name]="isWorkspaceOpen ? 'chevron-down' : 'chevron-right'" [size]="10"></app-icon>
          </button>

          <div class="sub-nav-group" *ngIf="isWorkspaceOpen">
            <button 
              class="nav-item sub-item" 
              [class.active]="activeView() === 'Projects'"
              (click)="selectView('Projects')"
            >
              <div class="nav-item-left">
                <app-icon name="project" [size]="14"></app-icon>
                <span>Projects</span>
              </div>
            </button>

            <button 
              class="nav-item sub-item" 
              [class.active]="activeView() === 'Views'"
              (click)="selectView('Views')"
            >
              <div class="nav-item-left">
                <app-icon name="views" [size]="14"></app-icon>
                <span>Views</span>
              </div>
            </button>

            <button class="nav-item sub-item" (click)="selectView('Views')">
              <div class="nav-item-left">
                <app-icon name="more" [size]="14"></app-icon>
                <span>More</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Your teams Section -->
        <div class="section-container">
          <button class="section-title-btn" (click)="isTeamsOpen = !isTeamsOpen">
            <span>Your teams</span>
            <app-icon [name]="isTeamsOpen ? 'chevron-down' : 'chevron-right'" [size]="10"></app-icon>
          </button>

          <div class="sub-nav-group" *ngIf="isTeamsOpen">
            <div class="team-header-row">
              <div class="team-info">
                <div class="team-badge-icon">
                  <app-icon name="plus" [size]="10"></app-icon>
                </div>
                <span class="team-title">Md Rakib Sordar</span>
                <app-icon name="chevron-down" [size]="10" class="chevron-icon"></app-icon>
              </div>

              <button 
                class="team-more-btn" 
                title="Team options"
                (click)="toggleTeamMenu($event)"
              >
                <app-icon name="more" [size]="13"></app-icon>
              </button>
            </div>

            <div class="team-nested-items">
              <button 
                class="nav-item nested-item" 
                [class.active]="activeView() === 'Home'"
                (click)="selectView('Home')"
              >
                <div class="nav-item-left">
                  <app-icon name="home" [size]="14"></app-icon>
                  <span>Home</span>
                </div>
              </button>

              <button 
                class="nav-item nested-item" 
                [class.active]="activeView() === 'Issues'"
                (click)="selectView('Issues')"
              >
                <div class="nav-item-left">
                  <app-icon name="issues" [size]="14"></app-icon>
                  <span>Issues</span>
                </div>
              </button>

              <button 
                class="nav-item nested-item" 
                [class.active]="activeView() === 'Projects'"
                (click)="selectView('Projects')"
              >
                <div class="nav-item-left">
                  <app-icon name="project" [size]="14"></app-icon>
                  <span>Projects</span>
                </div>
              </button>

              <button 
                class="nav-item nested-item" 
                [class.active]="activeView() === 'Views'"
                (click)="selectView('Views')"
              >
                <div class="nav-item-left">
                  <app-icon name="views" [size]="14"></app-icon>
                  <span>Views</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Try Section -->
        <div class="section-container">
          <button class="section-title-btn" (click)="isTryOpen = !isTryOpen">
            <span>Try</span>
            <app-icon [name]="isTryOpen ? 'chevron-down' : 'chevron-right'" [size]="10"></app-icon>
          </button>

          <div class="sub-nav-group" *ngIf="isTryOpen">
            <button 
              class="nav-item sub-item" 
              [class.active]="activeView() === 'Import issues'"
              (click)="selectView('Import issues')"
            >
              <div class="nav-item-left">
                <app-icon name="import" [size]="14"></app-icon>
                <span>Import issues</span>
              </div>
            </button>

            <button 
              class="nav-item sub-item" 
              [class.active]="activeView() === 'Invite people'"
              (click)="selectView('Invite people')"
            >
              <div class="nav-item-left">
                <app-icon name="invite" [size]="14"></app-icon>
                <span>Invite people</span>
              </div>
            </button>

            <button 
              class="nav-item sub-item" 
              [class.active]="activeView() === 'Connect GitHub'"
              (click)="selectView('Connect GitHub')"
            >
              <div class="nav-item-left">
                <app-icon name="github" [size]="14"></app-icon>
                <span>Connect GitHub</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      <!-- Footer Help -->
      <div class="sidebar-footer">
        <button class="help-btn" title="Help & Shortcuts (?)" (click)="onHelpClick()">
          <app-icon name="help" [size]="13"></app-icon>
        </button>
      </div>

      <!-- Team Action Dropdown Popup -->
      <app-team-action-menu
        *ngIf="workspaceService.currentTeamActionMenu()"
        [top]="teamMenuTop"
        [left]="teamMenuLeft"
        (closed)="workspaceService.currentTeamActionMenu.set(false)"
      ></app-team-action-menu>

      <!-- User Profile Dropdown Popup -->
      <app-user-profile-menu
        *ngIf="workspaceService.isUserProfileMenuOpen()"
        top="54px"
        left="16px"
        (closed)="workspaceService.isUserProfileMenuOpen.set(false)"
      ></app-user-profile-menu>
    </div>
  `,
  styles: [`
    .sidebar-peek-panel {
      position: fixed;
      top: 48px;
      left: 8px;
      bottom: 8px;
      width: 236px;
      background: #121316;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 16px 45px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      padding: 10px 8px 12px 8px;
      z-index: 1500;
      user-select: none;
      animation: peekSlideIn 0.36s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      overflow: hidden;
    }

    @keyframes peekSlideIn {
      from {
        opacity: 0;
        transform: translateX(-20px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 4px 10px 4px;
    }

    .user-profile-btn {
      display: flex;
      align-items: center;
      gap: 7px;
      background: transparent;
      border: none;
      color: #f7f8f8;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 6px;
      transition: background 0.1s ease;
      max-width: 155px;
    }

    .user-profile-btn:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    .avatar {
      width: 20px;
      height: 20px;
      background: #ea580c;
      color: #ffffff;
      font-size: 9px;
      font-weight: 700;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      letter-spacing: -0.5px;
    }

    .user-name {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 13px;
      font-weight: 500;
      color: #f7f8f8;
    }

    .chevron-icon {
      color: #6b7280;
    }

    .header-actions {
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
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.1s ease, color 0.1s ease;
    }

    .icon-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .sidebar-content {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding-top: 4px;
    }

    .sidebar-content::-webkit-scrollbar {
      width: 4px;
    }
    .sidebar-content::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
    }

    .nav-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 5px 8px;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #8a8f98;
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s ease, color 0.1s ease;
    }

    .nav-item:hover {
      background: rgba(255, 255, 255, 0.05);
      color: #f7f8f8;
    }

    .nav-item.active {
      background: rgba(255, 255, 255, 0.09);
      color: #ffffff;
      font-weight: 500;
    }

    .nav-item-left {
      display: flex;
      align-items: center;
      gap: 9px;
    }

    .badge {
      background: rgba(255, 255, 255, 0.09);
      font-size: 11px;
      padding: 1px 6px;
      border-radius: 10px;
      color: #b0b7c3;
      font-weight: 500;
    }

    .section-container {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .section-title-btn {
      display: flex;
      align-items: center;
      gap: 5px;
      width: 100%;
      padding: 4px 8px;
      background: transparent;
      border: none;
      color: #62666d;
      font-size: 11px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
    }

    .section-title-btn:hover {
      color: #8a8f98;
    }

    .sub-nav-group {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .sub-item {
      padding: 5px 8px 5px 10px;
      font-size: 13px;
    }

    .team-header-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 4px 6px 4px 10px;
      border-radius: 6px;
    }

    .team-header-row:hover {
      background: rgba(255, 255, 255, 0.04);
    }

    .team-header-row:hover .team-more-btn {
      opacity: 1;
    }

    .team-info {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 13px;
      color: #8a8f98;
    }

    .team-badge-icon {
      width: 14px;
      height: 14px;
      background: #0284c7;
      color: #ffffff;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .team-title {
      font-size: 13px;
      color: #8a8f98;
      font-weight: 500;
    }

    .team-more-btn {
      background: transparent;
      border: none;
      color: #8a8f98;
      padding: 2px 4px;
      border-radius: 4px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.1s ease, background 0.1s ease;
    }

    .team-more-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
      opacity: 1;
    }

    .team-nested-items {
      display: flex;
      flex-direction: column;
      gap: 1px;
      padding-left: 12px;
    }

    .nested-item {
      padding: 4px 8px;
      font-size: 13px;
    }

    .sidebar-footer {
      padding-top: 8px;
      display: flex;
      align-items: center;
    }

    .help-btn {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #8a8f98;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.1s ease;
    }

    .help-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.25);
    }
  `]
})
export class SidebarPeekComponent {
  isWorkspaceOpen = true;
  isTeamsOpen = true;
  isTryOpen = true;

  teamMenuTop = '240px';
  teamMenuLeft = '200px';

  private leaveTimeout: any;

  constructor(public workspaceService: WorkspaceService) {}

  get activeView() {
    return this.workspaceService.activeView;
  }

  get unreadCount() {
    return this.workspaceService.unreadCount;
  }

  onMouseEnter(): void {
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout);
    }
    this.workspaceService.setSidebarPeeking(true);
  }

  onMouseLeave(): void {
    this.leaveTimeout = setTimeout(() => {
      this.workspaceService.setSidebarPeeking(false);
    }, 200);
  }

  selectView(view: ActiveView): void {
    this.workspaceService.setActiveView(view);
  }

  onSearchClick(): void {
    this.workspaceService.openCommandPalette();
  }

  onNewIssueClick(): void {
    this.workspaceService.openNewIssueModal();
  }

  onHelpClick(): void {
    this.workspaceService.isShortcutsModalOpen.set(true);
  }

  toggleUserProfileMenu(event: MouseEvent): void {
    event.stopPropagation();
    const current = this.workspaceService.isUserProfileMenuOpen();
    this.workspaceService.closeAllMenus();
    this.workspaceService.isUserProfileMenuOpen.set(!current);
  }

  toggleTeamMenu(event: MouseEvent): void {
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    if (target) {
      const rect = target.getBoundingClientRect();
      this.teamMenuTop = `${rect.bottom + 4}px`;
      this.teamMenuLeft = `${rect.left}px`;
    }
    const current = this.workspaceService.currentTeamActionMenu();
    this.workspaceService.closeAllMenus();
    this.workspaceService.currentTeamActionMenu.set(!current);
  }
}
