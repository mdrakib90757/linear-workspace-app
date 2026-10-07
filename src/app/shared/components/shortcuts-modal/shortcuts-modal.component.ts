import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../../core/services/workspace.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-shortcuts-modal',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="modal-overlay" *ngIf="workspaceService.isShortcutsModalOpen()" (click)="close()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <div class="title-wrap">
            <app-icon name="help" [size]="15"></app-icon>
            <h2 class="modal-title">Keyboard Shortcuts</h2>
          </div>
          <button class="close-btn" (click)="close()">
            <app-icon name="close" [size]="14"></app-icon>
          </button>
        </div>

        <div class="shortcuts-grid">
          <div class="shortcut-item">
            <span class="label">Command menu</span>
            <span class="key">Ctrl K</span>
          </div>
          <div class="shortcut-item">
            <span class="label">New issue</span>
            <span class="key">C</span>
          </div>
          <div class="shortcut-item">
            <span class="label">Go to Inbox</span>
            <span class="key">G then I</span>
          </div>
          <div class="shortcut-item">
            <span class="label">Go to Agent</span>
            <span class="key">G then A</span>
          </div>
          <div class="shortcut-item">
            <span class="label">Filter Inbox</span>
            <span class="key">F</span>
          </div>
          <div class="shortcut-item">
            <span class="label">Close modal / popover</span>
            <span class="key">ESC</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(3px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2600;
      animation: fadeIn 0.12s ease forwards;
    }

    .modal-card {
      width: 480px;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
      padding: 16px 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      padding-bottom: 12px;
    }

    .title-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #f7f8f8;
    }

    .modal-title {
      font-size: 14px;
      font-weight: 600;
      margin: 0;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: #8a8f98;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .shortcuts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .shortcut-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 6px;
    }

    .label {
      font-size: 12.5px;
      color: #d1d5db;
    }

    .key {
      font-size: 11px;
      color: #9ca3af;
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class ShortcutsModalComponent {
  constructor(public workspaceService: WorkspaceService) {}

  close(): void {
    this.workspaceService.isShortcutsModalOpen.set(false);
  }
}
