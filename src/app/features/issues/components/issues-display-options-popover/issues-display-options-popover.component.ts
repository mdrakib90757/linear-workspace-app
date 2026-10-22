import { Component, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-issues-display-options-popover',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <!-- Transparent backdrop to capture outside clicks -->
    <div class="popover-backdrop" (click)="closeAll()"></div>

    <!-- Main Display Options Panel (Screenshots 1, 2, 4, 5) -->
    <div class="display-popover-panel" (click)="$event.stopPropagation()">
      
      <!-- Top Segmented Control: List vs Board (Screenshots 1, 2) -->
      <div class="view-mode-tabs">
        <button 
          type="button" 
          class="mode-tab-btn" 
          [class.active]="workspaceService.issuesViewMode() === 'List'"
          (click)="setViewMode('List')"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2.5 4a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2.5 4zm0 4a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5A.75.75 0 0 1 2.5 8zm0 4a.75.75 0 0 1 .75-.75h9.5a.75.75 0 0 1 0 1.5h-9.5a.75.75 0 0 1-.75-.75z"/>
          </svg>
          <span>List</span>
        </button>

        <button 
          type="button" 
          class="mode-tab-btn" 
          [class.active]="workspaceService.issuesViewMode() === 'Board'"
          (click)="setViewMode('Board')"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9zM3.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5H7V3H3.5zm4.5 10h4.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5H8v10z"/>
          </svg>
          <span>Board</span>
        </button>
      </div>

      <!-- Option Rows -->
      <!-- Grouping -->
      <div class="option-row">
        <span class="option-label">Grouping</span>
        <div class="dropdown-anchor">
          <button 
            type="button" 
            class="select-pill" 
            (click)="toggleDropdown('grouping')"
          >
            <span>{{ workspaceService.issuesGrouping() }}</span>
            <app-icon name="chevron-down" [size]="10"></app-icon>
          </button>

          <!-- Dropdown Menu matching Screenshot 1 -->
          <div class="custom-dropdown-menu" *ngIf="openDropdown() === 'grouping'">
            <div 
              class="dropdown-menu-item" 
              *ngFor="let opt of groupingOptions"
              (click)="selectGrouping(opt)"
            >
              <span>{{ opt }}</span>
              <svg *ngIf="workspaceService.issuesGrouping() === opt" class="check-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Sub-grouping -->
      <div class="option-row">
        <span class="option-label">Sub-grouping</span>
        <div class="dropdown-anchor">
          <button 
            type="button" 
            class="select-pill" 
            (click)="toggleDropdown('subgrouping')"
          >
            <span>{{ workspaceService.issuesSubGrouping() }}</span>
            <app-icon name="chevron-down" [size]="10"></app-icon>
          </button>

          <div class="custom-dropdown-menu" *ngIf="openDropdown() === 'subgrouping'">
            <div 
              class="dropdown-menu-item" 
              *ngFor="let opt of subGroupingOptions"
              (click)="selectSubGrouping(opt)"
            >
              <span>{{ opt }}</span>
              <svg *ngIf="workspaceService.issuesSubGrouping() === opt" class="check-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
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
            <span>{{ workspaceService.issuesOrdering() }}</span>
            <app-icon name="chevron-down" [size]="10"></app-icon>
          </button>

          <div class="custom-dropdown-menu" *ngIf="openDropdown() === 'ordering'">
            <div 
              class="dropdown-menu-item" 
              *ngFor="let opt of orderingOptions"
              (click)="selectOrdering(opt)"
            >
              <span>{{ opt }}</span>
              <svg *ngIf="workspaceService.issuesOrdering() === opt" class="check-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Order completed by recency -->
      <div class="option-row">
        <span class="option-label">Order completed by recency</span>
        <button 
          type="button"
          class="toggle-switch" 
          [class.active]="workspaceService.issuesOrderRecency()" 
          (click)="toggleOrderRecency()"
        >
          <span class="toggle-thumb"></span>
        </button>
      </div>

      <!-- Completed issues -->
      <div class="option-row">
        <span class="option-label">Completed issues</span>
        <div class="dropdown-anchor">
          <button 
            type="button" 
            class="select-pill" 
            (click)="toggleDropdown('completedTime')"
          >
            <span>{{ workspaceService.issuesCompletedTime() }}</span>
            <app-icon name="chevron-down" [size]="10"></app-icon>
          </button>

          <div class="custom-dropdown-menu" *ngIf="openDropdown() === 'completedTime'">
            <div 
              class="dropdown-menu-item" 
              *ngFor="let opt of completedTimeOptions"
              (click)="selectCompletedTime(opt)"
            >
              <span>{{ opt }}</span>
              <svg *ngIf="workspaceService.issuesCompletedTime() === opt" class="check-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Show sub-issues -->
      <div class="option-row">
        <span class="option-label">Show sub-issues</span>
        <button 
          type="button"
          class="toggle-switch active" 
          [class.active]="workspaceService.issuesShowSubIssues()" 
          (click)="toggleShowSubIssues()"
        >
          <span class="toggle-thumb"></span>
        </button>
      </div>

      <!-- Section: List options -->
      <div class="section-title">List options</div>

      <div class="option-row">
        <span class="option-label">Nested sub-issues</span>
        <div class="dropdown-anchor">
          <button 
            type="button" 
            class="select-pill" 
            (click)="toggleDropdown('nestedSubIssues')"
          >
            <span>{{ workspaceService.issuesNestedSubIssues() }}</span>
            <app-icon name="chevron-down" [size]="10"></app-icon>
          </button>

          <div class="custom-dropdown-menu" *ngIf="openDropdown() === 'nestedSubIssues'">
            <div 
              class="dropdown-menu-item" 
              *ngFor="let opt of nestedSubIssuesOptions"
              (click)="selectNestedSubIssues(opt)"
            >
              <span>{{ opt }}</span>
              <svg *ngIf="workspaceService.issuesNestedSubIssues() === opt" class="check-icon" width="12" height="12" viewBox="0 0 16 16" fill="none">
                <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Section: Display properties (Screenshot 1, 2) -->
      <div class="section-title">Display properties</div>

      <div class="chips-grid">
        <button 
          type="button"
          class="prop-chip" 
          *ngFor="let prop of allProperties"
          [class.active]="isPropActive(prop)"
          (click)="toggleProperty(prop)"
        >
          {{ prop }}
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
      width: 295px;
      max-height: 85vh;
      overflow-y: auto;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.04);
      padding: 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      user-select: none;
      animation: popoverFadeIn 0.14s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .display-popover-panel::-webkit-scrollbar {
      display: none;
      width: 0;
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

    /* Segmented Control: List vs Board (Screenshot 1, 2) */
    .view-mode-tabs {
      display: flex;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 6px;
      padding: 2px;
      gap: 2px;
      margin-bottom: 4px;
    }

    .mode-tab-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 5px 0;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: #8a8f98;
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.12s ease;
      font-family: inherit;
    }

    .mode-tab-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.04);
    }

    .mode-tab-btn.active {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    }

    .option-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 28px;
      position: relative;
    }

    .option-label {
      font-size: 12.5px;
      color: #9ca3af;
      font-weight: 400;
    }

    .section-title {
      font-size: 11px;
      font-weight: 600;
      color: #8a8f98;
      letter-spacing: 0.3px;
      margin-top: 6px;
      margin-bottom: 2px;
    }

    /* Select Pill */
    .dropdown-anchor {
      position: relative;
    }

    .select-pill {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 5px;
      padding: 3px 8px;
      color: #f7f8f8;
      font-size: 12px;
      font-weight: 450;
      cursor: pointer;
      transition: all 0.1s ease;
      font-family: inherit;
    }

    .select-pill:hover {
      background: rgba(255, 255, 255, 0.09);
      border-color: rgba(255, 255, 255, 0.14);
    }

    /* Custom Dropdown Menu matching Screenshot 1 */
    .custom-dropdown-menu {
      position: absolute;
      top: calc(100% + 4px);
      right: 0;
      z-index: 1002;
      width: 135px;
      background: #1d1e23;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
      padding: 4px;
      display: flex;
      flex-direction: column;
      gap: 1px;
      animation: menuFade 0.1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes menuFade {
      from { opacity: 0; transform: translateY(-2px); }
      to { opacity: 1; transform: translateY(0); }
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
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .check-icon {
      flex-shrink: 0;
    }

    /* Toggle Switch */
    .toggle-switch {
      width: 28px;
      height: 16px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.15);
      border: none;
      position: relative;
      cursor: pointer;
      transition: background 0.15s ease;
      padding: 0;
    }

    .toggle-switch.active {
      background: #5e6ad2;
    }

    .toggle-thumb {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #ffffff;
      position: absolute;
      top: 2px;
      left: 2px;
      transition: transform 0.15s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .toggle-switch.active .toggle-thumb {
      transform: translateX(12px);
    }

    /* Display properties chips grid (Screenshot 1, 2) */
    .chips-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      padding-top: 2px;
    }

    .prop-chip {
      padding: 3px 8px;
      border-radius: 5px;
      font-size: 11.5px;
      font-weight: 450;
      color: #8a8f98;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      cursor: pointer;
      transition: all 0.12s ease;
      font-family: inherit;
    }

    .prop-chip:hover {
      color: #f7f8f8;
      background: rgba(255, 255, 255, 0.07);
    }

    .prop-chip.active {
      color: #f7f8f8;
      background: rgba(255, 255, 255, 0.11);
      border-color: rgba(255, 255, 255, 0.14);
    }
  `]
})
export class IssuesDisplayOptionsPopoverComponent {
  @Output() closed = new EventEmitter<void>();

  readonly openDropdown = signal<string | null>(null);

  readonly groupingOptions = [
    'No grouping',
    'Focus',
    'Status',
    'Agent',
    'Project',
    'Priority',
    'Cycle',
    'Label',
    'Team'
  ];

  readonly subGroupingOptions = [
    'No grouping',
    'Status',
    'Agent',
    'Project',
    'Priority',
    'Cycle',
    'Label',
    'Team'
  ];

  readonly orderingOptions = [
    'Importance',
    'Manual',
    'Priority',
    'Status',
    'Created',
    'Updated'
  ];

  readonly completedTimeOptions = [
    'Past day',
    'Past week',
    'Past month',
    'All'
  ];

  readonly nestedSubIssuesOptions = [
    'Show matching',
    'Always show',
    'Collapse'
  ];

  readonly allProperties = [
    'ID',
    'Status',
    'Assignee',
    'Creator',
    'Priority',
    'Project',
    'Due date',
    'Milestone',
    'Labels',
    'Links',
    'Time in status',
    'Created',
    'Updated'
  ];

  constructor(public workspaceService: WorkspaceService) {}

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeAll();
  }

  closeAll(): void {
    this.openDropdown.set(null);
    this.closed.emit();
  }

  toggleDropdown(name: string): void {
    this.openDropdown.update(curr => curr === name ? null : name);
  }

  setViewMode(mode: 'List' | 'Board'): void {
    this.workspaceService.issuesViewMode.set(mode);
  }

  selectGrouping(val: string): void {
    this.workspaceService.issuesGrouping.set(val);
    this.openDropdown.set(null);
  }

  selectSubGrouping(val: string): void {
    this.workspaceService.issuesSubGrouping.set(val);
    this.openDropdown.set(null);
  }

  selectOrdering(val: string): void {
    this.workspaceService.issuesOrdering.set(val);
    this.openDropdown.set(null);
  }

  toggleOrderRecency(): void {
    this.workspaceService.issuesOrderRecency.update(v => !v);
  }

  selectCompletedTime(val: string): void {
    this.workspaceService.issuesCompletedTime.set(val);
    this.openDropdown.set(null);
  }

  toggleShowSubIssues(): void {
    this.workspaceService.issuesShowSubIssues.update(v => !v);
  }

  selectNestedSubIssues(val: string): void {
    this.workspaceService.issuesNestedSubIssues.set(val);
    this.openDropdown.set(null);
  }

  isPropActive(prop: string): boolean {
    return this.workspaceService.issuesDisplayProperties().has(prop);
  }

  toggleProperty(prop: string): void {
    const current = new Set(this.workspaceService.issuesDisplayProperties());
    if (current.has(prop)) {
      current.delete(prop);
    } else {
      current.add(prop);
    }
    this.workspaceService.issuesDisplayProperties.set(current);
  }
}

