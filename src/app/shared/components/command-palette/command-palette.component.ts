import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../core/services/workspace.service';
import { IconComponent } from '../icon/icon.component';
import { ActiveView } from '../../../core/models/workspace.model';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="palette-overlay" *ngIf="workspaceService.isCommandPaletteOpen()" (click)="close()">
      <div class="palette-modal" (click)="$event.stopPropagation()">
        <!-- Search Header -->
        <div class="search-header">
          <app-icon name="search" [size]="16" class="search-icon"></app-icon>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Type a command or search..." 
            class="palette-input"
            autofocus
          />
          <span class="esc-badge">ESC</span>
        </div>

        <!-- Commands List -->
        <div class="commands-scroll">
          <div class="command-group">
            <div class="group-title">Navigation</div>
            <button 
              class="command-row" 
              *ngFor="let item of navCommands"
              (click)="navigateTo(item.view)"
            >
              <div class="cmd-left">
                <app-icon [name]="item.icon" [size]="14"></app-icon>
                <span>Go to {{ item.label }}</span>
              </div>
              <span class="cmd-shortcut">{{ item.shortcut }}</span>
            </button>
          </div>

          <div class="command-group">
            <div class="group-title">Actions</div>
            <button class="command-row" (click)="openCreateIssue()">
              <div class="cmd-left">
                <app-icon name="compose" [size]="14"></app-icon>
                <span>Create new issue</span>
              </div>
              <span class="cmd-shortcut">C</span>
            </button>
            <button class="command-row" (click)="markAllRead()">
              <div class="cmd-left">
                <app-icon name="check-all" [size]="14"></app-icon>
                <span>Mark all notifications as read</span>
              </div>
              <span class="cmd-shortcut">Shift I</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .palette-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.65);
      backdrop-filter: blur(2px);
      display: flex;
      justify-content: center;
      padding-top: 12vh;
      z-index: 2000;
      animation: fadeIn 0.12s ease forwards;
    }

    .palette-modal {
      width: 580px;
      max-height: 420px;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideDown 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: scale(0.96) translateY(-10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .search-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .search-icon {
      color: #8a8f98;
    }

    .palette-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #f7f8f8;
      font-size: 15px;
      font-family: inherit;
    }

    .palette-input::placeholder {
      color: #62666d;
    }

    .esc-badge {
      font-size: 11px;
      color: #8a8f98;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 500;
    }

    .commands-scroll {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .group-title {
      font-size: 11px;
      color: #62666d;
      font-weight: 600;
      text-transform: uppercase;
      padding: 4px 10px;
    }

    .command-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 8px 10px;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #d1d5db;
      font-size: 13.5px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s ease, color 0.1s ease;
    }

    .command-row:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .cmd-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .cmd-shortcut {
      font-size: 11px;
      color: #6b7280;
    }
  `]
})
export class CommandPaletteComponent {
  searchQuery = '';

  navCommands: Array<{ label: string; view: ActiveView; icon: string; shortcut: string }> = [
    { label: 'Inbox', view: 'Inbox', icon: 'inbox', shortcut: 'G then I' },
    { label: 'My issues', view: 'My issues', icon: 'my-issues', shortcut: 'G then M' },
    { label: 'Agent', view: 'Agent', icon: 'agent', shortcut: 'G then A' },
    { label: 'Projects', view: 'Projects', icon: 'project', shortcut: 'G then P' },
    { label: 'Views', view: 'Views', icon: 'views', shortcut: 'G then V' },
    { label: 'Home', view: 'Home', icon: 'home', shortcut: 'G then H' },
    { label: 'Issues', view: 'Issues', icon: 'issues', shortcut: 'G then S' }
  ];

  constructor(public workspaceService: WorkspaceService) {}

  @HostListener('document:keydown', ['$event'])
  handleGlobalKeys(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.workspaceService.isCommandPaletteOpen.set(!this.workspaceService.isCommandPaletteOpen());
    } else if (event.key === 'c' && !this.isInputFieldFocused() && !this.workspaceService.isCommandPaletteOpen()) {
      event.preventDefault();
      this.workspaceService.openNewIssueModal();
    }
  }

  private isInputFieldFocused(): boolean {
    const active = document.activeElement;
    return active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement;
  }

  close(): void {
    this.workspaceService.closeCommandPalette();
  }

  navigateTo(view: ActiveView): void {
    this.workspaceService.setActiveView(view);
    this.close();
  }

  openCreateIssue(): void {
    this.close();
    this.workspaceService.openNewIssueModal();
  }

  markAllRead(): void {
    this.workspaceService.markAllAsRead();
    this.close();
  }
}
