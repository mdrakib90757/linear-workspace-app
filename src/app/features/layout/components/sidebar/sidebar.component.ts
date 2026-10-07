import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { ActiveView } from '../../../../core/models/workspace.model';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { TeamActionMenuComponent } from '../team-action-menu/team-action-menu.component';
import { UserProfileMenuComponent } from '../user-profile-menu/user-profile-menu.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, IconComponent, TeamActionMenuComponent, UserProfileMenuComponent],
  template: `
    <aside 
      class="linear-sidebar"
      [class.collapsed]="workspaceService.isSidebarCollapsed()"
      [class.is-dragging]="isDragging"
      [style.width.px]="workspaceService.isSidebarCollapsed() ? 0 : workspaceService.sidebarWidth()"
    >
      <div class="sidebar-inner" [class.slide-out]="workspaceService.isSidebarCollapsed()">
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
              <!-- Team Item with Context Action ... -->
              <div class="team-header-row">
                <div class="team-info">
                  <div class="team-badge-icon">
                    <app-icon name="plus" [size]="10"></app-icon>
                  </div>
                  <span class="team-title">Md Rakib Sordar</span>
                  <app-icon name="chevron-down" [size]="10" class="chevron-icon"></app-icon>
                </div>

                <button 
                  #teamMenuTrigger
                  class="team-more-btn" 
                  title="Team options"
                  (click)="toggleTeamMenu($event)"
                >
                  <app-icon name="more" [size]="13"></app-icon>
                </button>
              </div>

              <!-- Team Nested Items -->
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

        <!-- Sidebar Bottom Help -->
        <div class="sidebar-footer">
          <button class="help-btn" title="Help & Shortcuts (?)" (click)="onHelpClick()">
            <app-icon name="help" [size]="13"></app-icon>
          </button>
        </div>
      </div>

      <!-- Resizable Splitter Gutter (Right edge) with Tapered Center Glow -->
      <div 
        class="resize-gutter"
        (mousedown)="startResize($event)"
        (mouseenter)="isHoveringGutter = true"
        (mouseleave)="isHoveringGutter = false"
        (dblclick)="toggleCollapse()"
      >
        <!-- Tapered vertical gradient glow line -->
        <div class="gutter-glow-line">
          <div class="gutter-center-pip"></div>
        </div>

        <!-- Linear Gutter Tooltip (Screenshot 2) -->
        <div class="gutter-tooltip" *ngIf="isHoveringGutter && !isDragging && !workspaceService.isSidebarCollapsed()">
          <div class="tooltip-line">Drag to resize</div>
          <div class="tooltip-line highlight">
            <span>Click to collapse</span>
            <span class="key-tag">[</span>
          </div>
        </div>
      </div>

      <!-- Team Action Dropdown Popup (Screenshot 5) -->
      <app-team-action-menu
        *ngIf="workspaceService.currentTeamActionMenu()"
        [top]="teamMenuTop"
        [left]="teamMenuLeft"
        (closed)="workspaceService.currentTeamActionMenu.set(false)"
      ></app-team-action-menu>

      <!-- User Profile Dropdown Popup -->
      <app-user-profile-menu
        *ngIf="workspaceService.isUserProfileMenuOpen()"
        top="46px"
        left="10px"
        (closed)="workspaceService.isUserProfileMenuOpen.set(false)"
      ></app-user-profile-menu>
    </aside>
  `,
  styles: [`
    .linear-sidebar {
      position: relative;
      height: 100vh;
      background-color: #0b0c0e;
      border-right: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-direction: column;
      user-select: none;
      box-sizing: border-box;
      /* Smooth, elegant sliding animation curve */
      transition: width 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.05), opacity 0.3s ease;
      flex-shrink: 0;
      z-index: 20;
    }

    .linear-sidebar.is-dragging {
      transition: none !important; /* Instant 60fps drag response */
    }

    .linear-sidebar.collapsed {
      width: 0 !important;
      min-width: 0 !important;
      border-right: none;
      overflow: hidden;
      opacity: 0;
      pointer-events: none;
    }

    .sidebar-inner {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 10px 8px 12px 8px;
      overflow: hidden;
      transition: transform 0.32s cubic-bezier(0.2, 0.9, 0.4, 1.05), opacity 0.28s ease;
    }

    .sidebar-inner.slide-out {
      transform: translateX(-15px);
      opacity: 0;
    }

    /* Resize Gutter / Splitter Handle */
    .resize-gutter {
      position: absolute;
      top: 0;
      right: -3px;
      width: 7px;
      height: 100%;
      cursor: col-resize;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    /* Tapered Vertical Glow: Thin, soft top/bottom fading, centered smooth accent glow */
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

    /* Center Pip / Sleek subtle handle that gently appears in the middle */
    .gutter-center-pip {
      width: 2px;
      height: 38px;
      border-radius: 2px;
      background: transparent;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .resize-gutter:hover .gutter-glow-line,
    .linear-sidebar.is-dragging .gutter-glow-line {
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
    .linear-sidebar.is-dragging .gutter-center-pip {
      background: #7c88f7;
      box-shadow: 0 0 6px rgba(124, 136, 247, 0.8);
    }

    /* Gutter Tooltip matching Screenshot 2 */
    .gutter-tooltip {
      position: absolute;
      top: 45%;
      left: 14px;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6);
      border-radius: 6px;
      padding: 6px 10px;
      color: #f7f8f8;
      font-size: 11.5px;
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 3px;
      animation: tooltipFade 0.12s ease forwards;
    }

    @keyframes tooltipFade {
      from { opacity: 0; transform: translateX(-4px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .tooltip-line {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      color: #8a8f98;
    }

    .tooltip-line.highlight {
      color: #f7f8f8;
    }

    .key-tag {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #9ca3af;
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 10px;
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
export class SidebarComponent {
  isWorkspaceOpen = true;
  isTeamsOpen = true;
  isTryOpen = true;

  isHoveringGutter = false;
  isDragging = false;
  startX = 0;
  startWidth = 240;

  teamMenuTop = '240px';
  teamMenuLeft = '200px';

  constructor(public workspaceService: WorkspaceService) {}

  get activeView() {
    return this.workspaceService.activeView;
  }

  get unreadCount() {
    return this.workspaceService.unreadCount;
  }

  @HostListener('document:keydown', ['$event'])
  handleGlobalKeys(event: KeyboardEvent): void {
    if (event.key === '[' && !this.isInputFieldFocused()) {
      event.preventDefault();
      this.toggleCollapse();
    }
  }

  private isInputFieldFocused(): boolean {
    const active = document.activeElement;
    return active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
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

  toggleCollapse(): void {
    this.workspaceService.toggleSidebar();
  }

  startResize(event: MouseEvent): void {
    event.preventDefault();
    this.isDragging = true;
    this.startX = event.clientX;
    this.startWidth = this.workspaceService.sidebarWidth();

    const mouseMoveHandler = (e: MouseEvent) => {
      const deltaX = e.clientX - this.startX;
      const newWidth = this.startWidth + deltaX;
      this.workspaceService.setSidebarWidth(newWidth);
    };

    const mouseUpHandler = () => {
      this.isDragging = false;
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
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