import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserDropdownComponent } from '../user-dropdown/user-dropdown.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, UserDropdownComponent],
  template: `
    <div class="app-container">
      <aside class="app-sidebar">
        <app-sidebar></app-sidebar>
      </aside>
      <div class="app-main-content">
        <header class="app-topbar">
          <div class="breadcrumb">Workspace / Issues</div>
          <app-user-dropdown></app-user-dropdown>
        </header>
        <main class="main-viewport">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent {}
