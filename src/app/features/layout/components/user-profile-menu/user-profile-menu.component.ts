import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PopoverComponent } from '../../../../shared/components/popover/popover.component';

@Component({
  selector: 'app-user-profile-menu',
  standalone: true,
  imports: [CommonModule, IconComponent, PopoverComponent],
  template: `
    <app-popover width="240px" [top]="top" [left]="left" (close)="closed.emit()">
      <div class="user-menu-wrapper">
        <div class="user-summary">
          <div class="avatar-lg">MRS</div>
          <div class="user-info">
            <span class="user-name">Md Rakib Sordar</span>
            <span class="user-workspace">Personal Workspace</span>
          </div>
        </div>

        <div class="menu-divider"></div>

        <button class="menu-item" (click)="onAction('settings')">
          <app-icon name="settings" [size]="14"></app-icon>
          <span>Settings</span>
          <span class="shortcut">G then S</span>
        </button>

        <button class="menu-item" (click)="onAction('invite')">
          <app-icon name="invite" [size]="14"></app-icon>
          <span>Invite members...</span>
        </button>

        <div class="menu-divider"></div>

        <button class="menu-item" (click)="onAction('switch')">
          <app-icon name="users" [size]="14"></app-icon>
          <span>Switch workspace</span>
        </button>

        <button class="menu-item logout" (click)="onAction('logout')">
          <app-icon name="close" [size]="14"></app-icon>
          <span>Log out</span>
        </button>
      </div>
    </app-popover>
  `,
  styles: [`
    .user-menu-wrapper {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .user-summary {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 10px;
    }

    .avatar-lg {
      width: 28px;
      height: 28px;
      background: #ea580c;
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #f3f4f6;
    }

    .user-workspace {
      font-size: 11px;
      color: #8a8f98;
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 6px 10px;
      background: transparent;
      border: none;
      border-radius: 5px;
      color: #d1d5db;
      font-size: 13px;
      font-family: inherit;
      cursor: pointer;
      text-align: left;
      transition: background 0.1s ease, color 0.1s ease;
    }

    .menu-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .menu-item.logout:hover {
      color: #f87171;
    }

    .shortcut {
      margin-left: auto;
      font-size: 11px;
      color: #6b7280;
    }

    .menu-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 4px 4px;
    }
  `]
})
export class UserProfileMenuComponent {
  @Input() top: string = '48px';
  @Input() left: string = '12px';
  @Output() closed = new EventEmitter<void>();
  @Output() actionSelected = new EventEmitter<string>();

  onAction(action: string): void {
    this.actionSelected.emit(action);
    this.closed.emit();
  }
}
