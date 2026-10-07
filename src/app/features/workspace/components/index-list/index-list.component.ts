import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Issue } from '../../../issues/models/issue.model';
import { IssueCardComponent } from '../../../issues/components/issue-card/issue-card.component';

@Component({
  selector: 'app-index-list',
  standalone: true,
  imports: [CommonModule, IssueCardComponent],
  template: `
    <div class="index-list-container">
      <div class="list-header">
        <span class="count">{{ issues.length }} Issues</span>
      </div>
      <div class="list-content">
        @for (issue of issues; track issue.id) {
          <app-issue-card
            [issue]="issue"
            [isSelected]="selectedIssueId === issue.id"
            (selectIssue)="issueSelected.emit($event)"
          ></app-issue-card>
        }
      </div>
    </div>
  `,
  styleUrls: ['./index-list.component.css']
})
export class IndexListComponent {
  @Input() issues: Issue[] = [];
  @Input() selectedIssueId: string | null = null;
  @Output() issueSelected = new EventEmitter<Issue>();
}