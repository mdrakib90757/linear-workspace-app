import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../core/services/workspace.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-new-issue-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div class="modal-overlay" *ngIf="workspaceService.isNewIssueModalOpen()" (click)="close()">
      <div class="modal-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-breadcrumbs">
            <span class="team-badge">Md Rakib Sordar</span>
            <span class="divider">></span>
            <span class="modal-title">New Issue</span>
          </div>
          <button class="close-btn" (click)="close()">
            <app-icon name="close" [size]="14"></app-icon>
          </button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <input 
            type="text" 
            [(ngModel)]="issueTitle" 
            placeholder="Issue title" 
            class="issue-title-input"
            autofocus
          />

          <textarea 
            [(ngModel)]="issueDescription" 
            placeholder="Add description..." 
            class="issue-desc-input"
            rows="4"
          ></textarea>

          <!-- Properties Bar -->
          <div class="properties-row">
            <div class="prop-item">
              <span class="prop-label">Status:</span>
              <select [(ngModel)]="status" class="prop-select">
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Backlog">Backlog</option>
              </select>
            </div>

            <div class="prop-item">
              <span class="prop-label">Priority:</span>
              <select [(ngModel)]="priority" class="prop-select">
                <option value="Urgent">Urgent</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
                <option value="No priority">No priority</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button class="cancel-btn" (click)="close()">Cancel</button>
          <button 
            class="submit-btn" 
            [disabled]="!issueTitle.trim()"
            (click)="submitIssue()"
          >
            Create Issue
          </button>
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
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2500;
      animation: fadeIn 0.12s ease forwards;
    }

    .modal-card {
      width: 620px;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.75);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: slideUp 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: scale(0.96) translateY(10px);
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

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .modal-breadcrumbs {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .team-badge {
      font-size: 12px;
      color: #8a8f98;
      background: rgba(255, 255, 255, 0.06);
      padding: 2px 8px;
      border-radius: 4px;
      font-weight: 500;
    }

    .divider {
      color: #62666d;
      font-size: 12px;
    }

    .modal-title {
      font-size: 13.5px;
      font-weight: 600;
      color: #f7f8f8;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: #8a8f98;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
    }

    .close-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .modal-body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .issue-title-input {
      background: transparent;
      border: none;
      outline: none;
      color: #f7f8f8;
      font-size: 16px;
      font-weight: 500;
      font-family: inherit;
      width: 100%;
    }

    .issue-title-input::placeholder {
      color: #62666d;
    }

    .issue-desc-input {
      background: transparent;
      border: none;
      outline: none;
      color: #d1d5db;
      font-size: 13.5px;
      font-family: inherit;
      resize: vertical;
      line-height: 1.5;
    }

    .issue-desc-input::placeholder {
      color: #62666d;
    }

    .properties-row {
      display: flex;
      gap: 16px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
    }

    .prop-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12.5px;
    }

    .prop-label {
      color: #8a8f98;
    }

    .prop-select {
      background: #111215;
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #f7f8f8;
      font-size: 12px;
      padding: 3px 8px;
      border-radius: 4px;
      outline: none;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      padding: 12px 20px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(0, 0, 0, 0.15);
    }

    .cancel-btn {
      background: transparent;
      border: none;
      color: #8a8f98;
      font-size: 13px;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
    }

    .cancel-btn:hover {
      color: #f7f8f8;
    }

    .submit-btn {
      background: #5e6ad2;
      color: #ffffff;
      border: none;
      font-size: 13px;
      font-weight: 500;
      padding: 6px 14px;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      transition: all 0.1s ease;
    }

    .submit-btn:hover:not(:disabled) {
      background: #6f7cf4;
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class NewIssueModalComponent {
  issueTitle = '';
  issueDescription = '';
  status: 'Todo' | 'In Progress' | 'Done' | 'Backlog' = 'Todo';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low' | 'No priority' = 'Medium';

  constructor(public workspaceService: WorkspaceService) {}

  close(): void {
    this.workspaceService.closeNewIssueModal();
    this.resetForm();
  }

  submitIssue(): void {
    if (!this.issueTitle.trim()) return;
    this.workspaceService.createIssue({
      identifier: '',
      title: this.issueTitle.trim(),
      description: this.issueDescription.trim(),
      status: this.status,
      priority: this.priority,
      project: 'Linear Workspace App',
      assignee: { name: 'Md Rakib Sordar' }
    });
    this.close();
  }

  private resetForm(): void {
    this.issueTitle = '';
    this.issueDescription = '';
    this.status = 'Todo';
    this.priority = 'Medium';
  }
}
