import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  workspaceName = signal<string>('Linear Workspace');
  activeFilter = signal<string>('all');

  setFilter(filter: string) {
    this.activeFilter.set(filter);
  }
}
