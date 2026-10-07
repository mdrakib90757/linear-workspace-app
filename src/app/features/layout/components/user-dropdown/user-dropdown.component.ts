import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="user-menu">
      <button class="avatar-button" (click)="toggleMenu()">
        <span class="avatar-text">RK</span>
      </button>
      @if (isOpen()) {
        <div class="dropdown-panel">
          <div class="user-info">
            <div class="name">Workspace User</div>
            <div class="email">user&#64;linear.app</div>
          </div>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item">Profile</button>
          <button class="dropdown-item">Preferences</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item text-danger">Log Out</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .user-menu {
      position: relative;
    }
    .avatar-button {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--accent-primary);
      border: none;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .dropdown-panel {
      position: absolute;
      right: 0;
      top: 36px;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      width: 180px;
      padding: 6px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.4);
      z-index: 100;
    }
    .user-info {
      padding: 6px 8px;
    }
    .name { font-weight: 600; font-size: 13px; }
    .email { font-size: 11px; color: var(--text-muted); }
    .dropdown-divider {
      height: 1px;
      background: var(--border-color);
      margin: 4px 0;
    }
    .dropdown-item {
      width: 100%;
      text-align: left;
      padding: 6px 8px;
      border: none;
      background: transparent;
      color: var(--text-secondary);
      border-radius: 4px;
      cursor: pointer;
    }
    .dropdown-item:hover {
      background: var(--bg-hover);
      color: var(--text-primary);
    }
    .text-danger { color: var(--danger); }
  `]
})
export class UserDropdownComponent {
  isOpen = signal<boolean>(false);

  toggleMenu() {
    this.isOpen.update(v => !v);
  }
}
