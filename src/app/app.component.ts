import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from './core/services/workspace.service';
import { SidebarComponent } from './features/layout/components/sidebar/sidebar.component';
import { SidebarPeekComponent } from './features/layout/components/sidebar-peek/sidebar-peek.component';
import { InboxViewComponent } from './features/inbox/inbox-view.component';
import { AgentViewComponent } from './features/agent/agent-view.component';
import { MyIssuesViewComponent } from './features/issues/my-issues-view.component';
import { GenericViewComponent } from './features/generic-view/generic-view.component';
import { FloatingAgentChatComponent } from './features/agent/components/floating-agent-chat/floating-agent-chat.component';
import { CommandPaletteComponent } from './shared/components/command-palette/command-palette.component';
import { NewIssueModalComponent } from './shared/components/new-issue-modal/new-issue-modal.component';
import { ShortcutsModalComponent } from './shared/components/shortcuts-modal/shortcuts-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    SidebarPeekComponent,
    InboxViewComponent,
    AgentViewComponent,
    MyIssuesViewComponent,
    GenericViewComponent,
    CommandPaletteComponent,
    NewIssueModalComponent,
    ShortcutsModalComponent,
    FloatingAgentChatComponent
  ],
  template: `
    <div class="linear-app-layout" (click)="onLayoutClick()">
      <!-- Sidebar Navigation (Main permanent column) -->
      <app-sidebar></app-sidebar>

      <!-- Floating Sidebar Peek Flyout (When collapsed & hovered, matching Screenshot) -->
      <app-sidebar-peek *ngIf="workspaceService.isSidebarCollapsed() && workspaceService.isSidebarPeeking()"></app-sidebar-peek>

      <!-- Main Dynamic Content Workspace (Floating Board / Inset Canvas Sheet) -->
      <main 
        class="linear-main-content"
        [class.sidebar-collapsed]="workspaceService.isSidebarCollapsed()"
      >
        <app-inbox-view *ngIf="activeView() === 'Inbox'"></app-inbox-view>
        <app-agent-view *ngIf="activeView() === 'Agent'"></app-agent-view>
        <app-my-issues-view 
          *ngIf="activeView() === 'My issues' || activeView() === 'Issues'"
          [viewTitle]="activeView()"
        ></app-my-issues-view>
        <app-generic-view 
          *ngIf="activeView() !== 'Inbox' && activeView() !== 'Agent' && activeView() !== 'My issues' && activeView() !== 'Issues'"
          [activeView]="activeView()"
        ></app-generic-view>
      </main>

      <!-- Floating Sidecar Chat Window (Screenshots 3, 4, 5) -->
      <app-floating-agent-chat *ngIf="workspaceService.isFloatingAgentChatOpen()"></app-floating-agent-chat>

      <!-- Overlays and Modals -->
      <app-command-palette></app-command-palette>
      <app-new-issue-modal></app-new-issue-modal>
      <app-shortcuts-modal></app-shortcuts-modal>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
    }

    .linear-app-layout {
      display: flex;
      width: 100%;
      height: 100%;
      background-color: #08090b;
      overflow: hidden;
      position: relative;
    }

    /* Signature Linear Floating Board / Inset Canvas Sheet */
    .linear-main-content {
      flex: 1;
      height: calc(100% - 16px);
      margin: 8px 8px 8px 0;
      background-color: #101114;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5), 0 8px 24px rgba(0, 0, 0, 0.45);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: margin 0.22s cubic-bezier(0.16, 1, 0.3, 1);
      min-height: 0;
      min-width: 0;
    }

    .linear-main-content.sidebar-collapsed {
      margin: 8px 8px 8px 8px;
    }
  `]
})
export class AppComponent {
  constructor(public workspaceService: WorkspaceService) {}

  get activeView() {
    return this.workspaceService.activeView;
  }

  onLayoutClick(): void {
    this.workspaceService.closeAllMenus();
  }
}