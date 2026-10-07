import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue } from '../../models/issue.model';

@Component({
  selector: 'app-issue-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="issue-card"
      [class.selected]="isSelected"
      (click)="selectIssue.emit(issue)"
    >
      <div class="issue-identifier">{{ issue.identifier }}</div>
      <div class="issue-title">{{ issue.title }}</div>
      <div class="issue-status-badge" [attr.data-status]="issue.status">{{ issue.status }}</div>
    </div>
  `,
  styleUrls: ['./issue-card.component.css']
})
export class IssueCardComponent {
  @Input({ required: true }) issue!: Issue;
  @Input() isSelected = false;
  @Output() selectIssue = new EventEmitter<Issue>();
}
