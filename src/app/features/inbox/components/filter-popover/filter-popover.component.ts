import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { PopoverComponent } from '../../../../shared/components/popover/popover.component';

@Component({
  selector: 'app-filter-popover',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, PopoverComponent],
  template: `
    <app-popover width="220px" [top]="top" [left]="left" [right]="right" (close)="closed.emit()">
      <div class="filter-popover-container">
        <!-- Search Input -->
        <div class="filter-search-box">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="onSearchChange($event)" 
            placeholder="Add Filter..." 
            class="filter-input"
            autofocus
          />
          <span class="key-badge">F</span>
        </div>

        <!-- Filter List -->
        <div class="filter-options-list">
          <button 
            class="filter-option-item" 
            *ngFor="let option of filteredOptions"
            (click)="selectFilter(option.id)"
          >
            <div class="option-left">
              <app-icon [name]="option.icon" [size]="14"></app-icon>
              <span>{{ option.name }}</span>
            </div>
            <app-icon name="chevron-right" [size]="12" class="arrow-icon"></app-icon>
          </button>
        </div>
      </div>
    </app-popover>
  `,
  styles: [`
    .filter-popover-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .filter-search-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      margin: 2px 2px 4px 2px;
    }

    .filter-input {
      background: transparent;
      border: none;
      outline: none;
      color: #f3f4f6;
      font-size: 13px;
      font-family: inherit;
      width: 100%;
    }

    .filter-input::placeholder {
      color: #6b7280;
    }

    .key-badge {
      font-size: 10px;
      color: #9ca3af;
      background: rgba(255, 255, 255, 0.08);
      padding: 1px 5px;
      border-radius: 3px;
      font-weight: 500;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .filter-options-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .filter-option-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 6px 8px;
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

    .filter-option-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .option-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .arrow-icon {
      color: #6b7280;
    }
  `]
})
export class FilterPopoverComponent {
  @Input() top: string = '45px';
  @Input() left?: string;
  @Input() right?: string = '20px';
  @Output() closed = new EventEmitter<void>();
  @Output() filterSelected = new EventEmitter<string>();

  searchQuery = '';

  filterOptions = [
    { id: 'notification-type', name: 'Notification type', icon: 'inbox' },
    { id: 'from', name: 'From', icon: 'user' },
    { id: 'project', name: 'Project', icon: 'project' },
    { id: 'issue-priority', name: 'Issue priority', icon: 'priority' },
    { id: 'issue-status-type', name: 'Issue status type', icon: 'status' }
  ];

  get filteredOptions() {
    if (!this.searchQuery.trim()) return this.filterOptions;
    return this.filterOptions.filter(opt =>
      opt.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSearchChange(query: string): void {
    this.searchQuery = query;
  }

  selectFilter(filterId: string): void {
    this.filterSelected.emit(filterId);
    this.closed.emit();
  }
}
