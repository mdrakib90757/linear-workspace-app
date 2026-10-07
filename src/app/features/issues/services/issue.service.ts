import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({
  providedIn: 'root'
})
export class IssueService {
  private initialIssues: Issue[] = [
    {
      id: '1',
      identifier: 'LIN-101',
      title: 'Setup Angular standalone architecture & layout',
      description: 'Implement modern standalone component architecture matching the design specs.',
      status: 'in_progress',
      priority: 'high',
      assignee: 'Rakib',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '2',
      identifier: 'LIN-102',
      title: 'Integrate global command palette (Cmd+K)',
      description: 'Add quick navigation and command runner modal across views.',
      status: 'todo',
      priority: 'medium',
      assignee: 'Rakib',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: '3',
      identifier: 'LIN-103',
      title: 'Implement index list and detail drawer view',
      description: 'Split screen layout with responsive issue selection drawer.',
      status: 'backlog',
      priority: 'low',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  private issues$ = new BehaviorSubject<Issue[]>(this.initialIssues);

  getIssues(): Observable<Issue[]> {
    return this.issues$.asObservable();
  }

  addIssue(issue: Omit<Issue, 'id' | 'createdAt' | 'updatedAt'>): void {
    const newIssue: Issue = {
      ...issue,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.issues$.next([newIssue, ...this.issues$.value]);
  }
}
