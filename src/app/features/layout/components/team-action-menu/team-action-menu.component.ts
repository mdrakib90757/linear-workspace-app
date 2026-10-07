import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PopoverComponent } from '../../../../shared/components/popover/popover.component';

@Component({
  selector: 'app-team-action-menu',
  standalone: true,
  imports: [CommonModule, IconComponent, PopoverComponent],
  template: `
    <app-popover width="240px" [top]="top" [left]="left" (close)="closed.emit()">
      <div class="menu-container">
        <button class="menu-item" (click)="onAction('favorite')">
          <div class="item-left">
            <app-icon name="star" [size]="14"></app-icon>
            <span>Favorite</span>
          </div>
          <span class="shortcut">Alt F</span>
        </button>

        <button class="menu-item" (click)="onAction('settings')">
          <div class="item-left">
            <app-icon name="settings" [size]="14"></app-icon>
            <span>Team settings</span>
          </div>
        </button>

        <button class="menu-item" (click)="onAction('copy-url')">
          <div class="item-left">
            <app-icon name="link" [size]="14"></app-icon>
            <span>Copy URL</span>
          </div>
          <span class="shortcut">Ctrl ⇧ ,</span>
        </button>

        <button class="menu-item" (click)="onAction('archive')">
          <div class="item-left">
            <app-icon name="archive" [size]="14"></app-icon>
            <span>Open archive</span>
          </div>
        </button>

        <div class="menu-divider"></div>

        <button class="menu-item" (click)="onAction('subscribe')">
          <div class="item-left">
            <app-icon name="inbox" [size]="14"></app-icon>
            <span>Subscribe</span>
          </div>
          <app-icon name="chevron-right" [size]="12" class="arrow-right"></app-icon>
        </button>

        <button class="menu-item" (click)="onAction('slack')">
          <div class="item-left">
            <app-icon name="slack" [size]="14"></app-icon>
            <span>Configure Slack notifications...</span>
          </div>
        </button>

        <div class="menu-divider"></div>

        <button class="menu-item disabled" disabled>
          <div class="item-left">
            <span>Leave team...</span>
          </div>
        </button>
      </div>
    </app-popover>
  `,
  styles: [`
    .menu-container {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    .menu-item:hover:not(:disabled) {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .menu-item.disabled {
      color: #4b5563;
      cursor: not-allowed;
    }

    .item-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .shortcut {
      font-size: 11px;
      color: #6b7280;
      letter-spacing: 0.2px;
    }

    .arrow-right {
      color: #6b7280;
    }

    .menu-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 4px 4px;
    }
  `]
})
export class TeamActionMenuComponent {
  @Input() top: string = '240px';
  @Input() left: string = '180px';
  @Output() closed = new EventEmitter<void>();
  @Output() actionSelected = new EventEmitter<string>();

  onAction(action: string): void {
    this.actionSelected.emit(action);
    this.closed.emit();
  }
}
