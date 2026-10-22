import { Component, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-display-options-popover',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <!-- Transparent backdrop to capture outside clicks -->
    <div class="popover-backdrop" (click)="closeAll()"></div>

    <!-- Anchored Popover Panel matching Screenshots 1 & 2 -->
    <div class="display-popover-panel" (click)="$event.stopPropagation()">
      
      <!-- Row 1: Enable priority inbox (Screenshot 1 & 2) -->
      <div class="option-row">
        <span class="option-label">Enable priority inbox</span>
        <button 
          type="button"
          class="toggle-switch" 
          [class.active]="workspaceService.isPriorityInboxEnabled()" 
          (click)="togglePriorityInbox()"
        >
          <span class="toggle-thumb"></span>
        </button>
      </div>

      <!-- Extra Rows that appear when 'Enable priority inbox' is turned ON (Screenshot 2) -->
      <ng-container *ngIf="workspaceService.isPriorityInboxEnabled()">
        <!-- Include in priority inbox -->
        <div class="option-row extra-row">
          <span class="option-label">Include in priority inbox</span>
          <div class="dropdown-anchor">
            <button 
              type="button" 
              class="select-pill" 
              (click)="toggleDropdown('include')"
            >
              <span>{{ includeInPriority() }}</span>
              <app-icon name="chevron-down" [size]="10"></app-icon>
            </button>

            <!-- Dropdown Menu (Screenshot 1 style) -->
            <div class="custom-dropdown-menu" *ngIf="openDropdown() === 'include'">
              <div 
                class="dropdown-menu-item" 
                *ngFor="let opt of includeOptions"
                (click)="selectInclude(opt)"
              >
                <span>{{ opt }}</span>
                <svg *ngIf="includeInPriority() === opt" class="check-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Badge count -->
        <div class="option-row extra-row">
          <span class="option-label">Badge count</span>
          <div class="dropdown-anchor">
            <button 
              type="button" 
              class="select-pill" 
              (click)="toggleDropdown('badge')"
            >
              <span>{{ badgeCount() }}</span>
              <app-icon name="chevron-down" [size]="10"></app-icon>
            </button>

            <!-- Dropdown Menu (Screenshot 1 style) -->
            <div class="custom-dropdown-menu" *ngIf="openDropdown() === 'badge'">
              <div 
                class="dropdown-menu-item" 
                *ngFor="let opt of badgeOptions"
                (click)="selectBadge(opt)"
              >
                <span>{{ opt }}</span>
                <svg *ngIf="badgeCount() === opt" class="check-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </ng-container>

      <div class="section-divider" *ngIf="workspaceService.isPriorityInboxEnabled()"></div>

      <!-- Group unreads by (Screenshot 1 Red Box) -->
      <div class="option-row">
        <span class="option-label">Group unreads by</span>
        <div class="dropdown-anchor">
          <button 
            type="button" 
            class="select-pill" 
            (click)="toggleDropdown('grouping')"
          >
            <span>{{ groupUnreadsBy() }}</span>
            <app-icon name="chevron-down" [size]="10"></app-icon>
          </button>

          <!-- Dropdown Menu exactly matching Screenshot 1 Red Box -->
          <div class="custom-dropdown-menu" *ngIf="openDropdown() === 'grouping'">
            <div 
              class="dropdown-menu-item" 
              *ngFor="let opt of groupingOptions"
              (click)="selectGrouping(opt)"
            >
              <span>{{ opt }}</span>
              <svg *ngIf="groupUnreadsBy() === opt" class="check-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Ordering -->
      <div class="option-row">
        <span class="option-label">Ordering</span>
        <div class="dropdown-anchor">
          <button 
            type="button" 
            class="select-pill" 
            (click)="toggleDropdown('ordering')"
          >
            <span>{{ ordering() }}</span>
            <app-icon name="chevron-down" [size]="10"></app-icon>
          </button>

          <!-- Dropdown Menu -->
          <div class="custom-dropdown-menu" *ngIf="openDropdown() === 'ordering'">
            <div 
              class="dropdown-menu-item" 
              *ngFor="let opt of orderingOptions"
              (click)="selectOrdering(opt)"
            >
              <span>{{ opt }}</span>
              <svg *ngIf="ordering() === opt" class="check-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Show snoozed -->
      <div class="option-row">
        <span class="option-label">Show snoozed</span>
        <button 
          type="button"
          class="toggle-switch" 
          [class.active]="showSnoozed()" 
          (click)="showSnoozed.set(!showSnoozed())"
        >
          <span class="toggle-thumb"></span>
        </button>
      </div>

      <!-- Show unread first -->
      <div class="option-row">
        <span class="option-label">Show unread first</span>
        <button 
          type="button"
          class="toggle-switch" 
          [class.active]="showUnreadFirst()" 
          (click)="showUnreadFirst.set(!showUnreadFirst())"
        >
          <span class="toggle-thumb"></span>
        </button>
      </div>

    </div>
  `,
  styles: [`
    :host {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      z-index: 1000;
      display: block;
    }

    .popover-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 998;
      background: transparent;
    }

    .display-popover-panel {
      position: relative;
      z-index: 999;
      width: 280px;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.04);
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 9px;
      user-select: none;
      animation: popoverFadeIn 0.14s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes popoverFadeIn {
      from {
        opacity: 0;
        transform: scale(0.97) translateY(-3px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }

    .option-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 28px;
      position: relative;
    }

    .extra-row {
      animation: fadeInRow 0.15s ease forwards;
    }

    @keyframes fadeInRow {
      from {
        opacity: 0;
        transform: translateY(-2px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .section-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 2px 0;
    }

    .option-label {
      font-size: 13px;
      color: #9ca3af;
      font-weight: 400;
    }

    /* Toggle Switch */
    .toggle-switch {
      width: 32px;
      height: 18px;
      background: rgba(255, 255, 255, 0.14);
      border-radius: 999px;
      border: none;
      cursor: pointer;
      position: relative;
      padding: 0;
      transition: background 0.18s ease;
      display: flex;
      align-items: center;
    }

    .toggle-switch:hover {
      background: rgba(255, 255, 255, 0.22);
    }

    .toggle-switch.active {
      background: #5e6ad2;
    }

    .toggle-thumb {
      width: 14px;
      height: 14px;
      background: #ffffff;
      border-radius: 50%;
      position: absolute;
      left: 2px;
      transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    .toggle-switch.active .toggle-thumb {
      transform: translateX(14px);
    }

    /* Dropdown Anchor & Select Pill */
    .dropdown-anchor {
      position: relative;
      display: inline-flex;
      align-items: center;
    }

    .select-pill {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 5px;
      color: #e5e7eb;
      font-size: 12px;
      font-weight: 400;
      padding: 3px 8px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.12s ease;
      font-family: inherit;
    }

    .select-pill:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.14);
      color: #ffffff;
    }

    /* Custom Dropdown Menu matching Screenshot 1 */
    .custom-dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      min-width: 128px;
      background: #202228;
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.04);
      padding: 4px;
      z-index: 1020;
      display: flex;
      flex-direction: column;
      gap: 1px;
      animation: menuFade 0.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes menuFade {
      from {
        opacity: 0;
        transform: translateY(-2px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .dropdown-menu-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 5px 8px;
      border-radius: 4px;
      font-size: 12px;
      color: #e5e7eb;
      cursor: pointer;
      transition: background 0.1s ease, color 0.1s ease;
      white-space: nowrap;
    }

    .dropdown-menu-item:hover {
      background: rgba(255, 255, 255, 0.09);
      color: #ffffff;
    }

    .check-icon {
      color: #ffffff;
      flex-shrink: 0;
    }
  `]
})
export class DisplayOptionsPopoverComponent {
  @Output() closed = new EventEmitter<void>();

  constructor(public workspaceService: WorkspaceService) {}

  readonly openDropdown = signal<string | null>(null);

  // Values
  readonly groupUnreadsBy = signal<'No grouping' | 'Focus'>('No grouping');
  readonly ordering = signal<'Newest' | 'Oldest'>('Newest');
  readonly includeInPriority = signal<'All' | 'Direct mentions' | 'Assigned to me'>('All');
  readonly badgeCount = signal<'Priority & Other' | 'Priority only' | 'None'>('Priority & Other');
  readonly showSnoozed = signal(false);
  readonly showUnreadFirst = signal(false);

  // Option lists
  readonly groupingOptions: ('No grouping' | 'Focus')[] = ['No grouping', 'Focus'];
  readonly orderingOptions: ('Newest' | 'Oldest')[] = ['Newest', 'Oldest'];
  readonly includeOptions: ('All' | 'Direct mentions' | 'Assigned to me')[] = ['All', 'Direct mentions', 'Assigned to me'];
  readonly badgeOptions: ('Priority & Other' | 'Priority only' | 'None')[] = ['Priority & Other', 'Priority only', 'None'];

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.openDropdown()) {
      this.openDropdown.set(null);
    } else {
      this.closed.emit();
    }
  }

  togglePriorityInbox(): void {
    const current = this.workspaceService.isPriorityInboxEnabled();
    this.workspaceService.isPriorityInboxEnabled.set(!current);
  }

  toggleDropdown(name: string): void {
    this.openDropdown.set(this.openDropdown() === name ? null : name);
  }

  selectGrouping(val: 'No grouping' | 'Focus'): void {
    this.groupUnreadsBy.set(val);
    this.openDropdown.set(null);
  }

  selectOrdering(val: 'Newest' | 'Oldest'): void {
    this.ordering.set(val);
    this.openDropdown.set(null);
  }

  selectInclude(val: 'All' | 'Direct mentions' | 'Assigned to me'): void {
    this.includeInPriority.set(val);
    this.openDropdown.set(null);
  }

  selectBadge(val: 'Priority & Other' | 'Priority only' | 'None'): void {
    this.badgeCount.set(val);
    this.openDropdown.set(null);
  }

  closeAll(): void {
    this.openDropdown.set(null);
    this.closed.emit();
  }
}
