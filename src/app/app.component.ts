import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from './core/services/workspace.service';
import { SidebarComponent } from './features/layout/components/sidebar/sidebar.component';
import { InboxViewComponent } from './features/inbox/inbox-view.component';
import { AgentViewComponent } from './features/agent/agent-view.component';
import { GenericViewComponent } from './features/generic-view/generic-view.component';
import { CommandPaletteComponent } from './shared/components/command-palette/command-palette.component';
import { NewIssueModalComponent } from './shared/components/new-issue-modal/new-issue-modal.component';
import { ShortcutsModalComponent } from './shared/components/shortcuts-modal/shortcuts-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    SidebarComponent,
    InboxViewComponent,
    AgentViewComponent,
    GenericViewComponent,
    CommandPaletteComponent,
    NewIssueModalComponent,
    ShortcutsModalComponent
  ],
  template: `
    <div class="linear-app-layout" (click)="onLayoutClick()">
      <!-- Sidebar Navigation -->
      <app-sidebar></app-sidebar>

      <!-- Main Dynamic Content Workspace -->
      <main class="linear-main-content">
        <app-inbox-view *ngIf="activeView() === 'Inbox'"></app-inbox-view>
        <app-agent-view *ngIf="activeView() === 'Agent'"></app-agent-view>
        <app-generic-view 
          *ngIf="activeView() !== 'Inbox' && activeView() !== 'Agent'"
          [activeView]="activeView()"
        ></app-generic-view>
      </main>

      <!-- Overlays and Modals -->
      <app-command-palette></app-command-palette>
      <app-new-issue-modal></app-new-issue-modal>
      <app-shortcuts-modal></app-shortcuts-modal>
    </div>
  `,
  styles: [`
    .linear-app-layout {
      display: flex;
      width: 100vw;
      height: 100vh;
      background-color: #0b0c0e;
      overflow: hidden;
    }

    .linear-main-content {
      flex: 1;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent {
  constructor(public workspaceService: WorkspaceService) {}

  get activeView() {
    return this.workspaceService.activeView;
  }

  onLayoutClick(): void {
    // Closes popovers on ambient click
    this.workspaceService.closeAllMenus();
  }
}