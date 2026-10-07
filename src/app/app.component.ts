// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { AppLayoutComponent } from './features/layout/components/app-layout/app-layout.component';
// import { CommandPaletteComponent } from './shared/components/command-palette/command-palette.component';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, AppLayoutComponent, CommandPaletteComponent],
//   template: `
//     <app-layout></app-layout>
//     <app-command-palette></app-command-palette>
//   `
// })
// export class AppComponent {
//   title = 'linear-workspace-app';
// }
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; import { SidebarComponent } from './features/layout/components/sidebar/sidebar.component';
import { IndexListComponent } from './features/workspace/components/index-list/index-list.component';
import { DetailPanelComponent } from './features/workspace/components/detail-panel/detail-panel.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, SidebarComponent, IndexListComponent, DetailPanelComponent],
  template: `
    <div class="app-container">
      <app-sidebar (selectSection)="activeSection.set($event)"></app-sidebar>
      <app-index-list [title]="activeSection()"></app-index-list>
      <app-detail-panel></app-detail-panel>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      height: 100vh;
      width: 100vw;
      background-color: #0b0c0e;
      color: #f7f8f8;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      overflow: hidden;
      margin: 0;
      box-sizing: border-box;
    }
    * { box-sizing: border-box; }
  `]
})
export class AppComponent {
  activeSection = signal('Inbox');
}