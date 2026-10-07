import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  currentSection = signal<string>('issues');
  sidebarExpanded = signal<boolean>(true);

  setSection(section: string) {
    this.currentSection.set(section);
  }

  toggleSidebar() {
    this.sidebarExpanded.update(v => !v);
  }
}
