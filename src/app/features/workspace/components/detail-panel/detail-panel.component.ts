import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue } from '../../../issues/models/issue.model';

@Component({
  selector: 'app-detail-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (issue) {
      <div class="detail-panel-wrapper">
        <div class="panel-header">
          <span class="issue-identifier">{{ issue.identifier }}</span>
          <button class="close-btn" (click)="closed.emit()">✕</button>
        </div>
        <div class="panel-body">
          <h2 class="title">{{ issue.title }}</h2>
          <p class="description">{{ issue.description || 'No description provided.' }}</p>

          <div class="metadata-grid">
            <div class="meta-row">
              <span class="label">Status</span>
              <span class="value">{{ issue.status }}</span>
            </div>
            <div class="meta-row">
              <span class="label">Priority</span>
              <span class="value">{{ issue.priority }}</span>
            </div>
            <div class="meta-row">
              <span class="label">Assignee</span>
              <span class="value">{{ issue.assignee || 'Unassigned' }}</span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./detail-panel.component.css']
})
export class DetailPanelComponent {
  @Input() issue: Issue | null = null;
  @Output() closed = new EventEmitter<void>();
}