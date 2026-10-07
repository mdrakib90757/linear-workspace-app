import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexListComponent } from '../../components/index-list/index-list.component';
import { DetailPanelComponent } from '../../components/detail-panel/detail-panel.component';
import { IssueService } from '../../../issues/services/issue.service';
import { Issue } from '../../../issues/models/issue.model';

@Component({
  selector: 'app-workspace-page',
  standalone: true,
  imports: [CommonModule, IndexListComponent, DetailPanelComponent],
  templateUrl: './workspace-page.component.html',
  styles: [`
    .workspace-layout {
      display: flex;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
    .list-section {
      flex: 1;
      overflow: auto;
    }
    .detail-section {
      width: 380px;
      flex-shrink: 0;
    }
  `]
})
export class WorkspacePageComponent implements OnInit {
  private issueService = inject(IssueService);
  issues: Issue[] = [];
  selectedIssue: Issue | null = null;

  ngOnInit() {
    this.issueService.getIssues().subscribe(issues => {
      this.issues = issues;
      if (issues.length > 0) {
        this.selectedIssue = issues[0];
      }
    });
  }

  onSelectIssue(issue: Issue) {
    this.selectedIssue = issue;
  }

  onCloseDetail() {
    this.selectedIssue = null;
  }
}
