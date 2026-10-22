import { Component, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

interface FilterItem {
  id: string;
  label: string;
  icon?: string;
  hasSubmenu?: boolean;
}

@Component({
  selector: 'app-issues-filter-popover',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <!-- Transparent backdrop to capture outside clicks -->
    <div class="popover-backdrop" (click)="closed.emit()"></div>

    <!-- Filter Popover Panel matching Screenshot 3 -->
    <div class="filter-popover-wrapper" (click)="$event.stopPropagation()">
      
      <!-- Submenu Flyout (e.g. Agent submenu from Screenshot 3) -->
      <div class="submenu-flyout" *ngIf="activeSubmenu()" [ngSwitch]="activeSubmenu()">
        <!-- Agent Submenu (Screenshot 3) -->
        <div *ngSwitchCase="'agent'" class="submenu-content">
          <div class="submenu-search-box">
            <input 
              type="text" 
              [(ngModel)]="submenuSearch" 
              placeholder="Filter..." 
              class="submenu-search-input"
              autofocus
            />
          </div>

          <div class="checkbox-list">
            <div 
              class="checkbox-row" 
              *ngFor="let opt of agentOptions"
              (click)="toggleAgentOption(opt.id)"
            >
              <div class="custom-checkbox" [class.checked]="selectedAgentOptions().has(opt.id)">
                <svg *ngIf="selectedAgentOptions().has(opt.id)" width="9" height="9" viewBox="0 0 12 12" fill="none">
                  <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div class="opt-label-group">
                <app-icon *ngIf="opt.icon" [name]="opt.icon" [size]="13"></app-icon>
                <span>{{ opt.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Generic empty or options for other submenus -->
        <div *ngSwitchDefault class="submenu-content empty-content">
          <div class="empty-msg">No matching options</div>
        </div>
      </div>

      <!-- Main Filter Menu List (Screenshot 3) -->
      <div class="main-filter-panel">
        <!-- Search Header -->
        <div class="search-header">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Add Filter..." 
            class="filter-search-input"
            autofocus
          />
          <span class="shortcut-key">F</span>
        </div>

        <!-- Special Action Items -->
        <div class="special-actions">
          <button type="button" class="menu-row special-row" (click)="onSelect('ai')">
            <div class="row-left">
              <span class="ai-sparkle">✨</span>
              <span>AI filter</span>
            </div>
          </button>

          <button type="button" class="menu-row special-row" (click)="onSelect('advanced')">
            <div class="row-left">
              <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" class="opt-icon">
                <path d="M1.5 3h13a.5.5 0 0 1 .39.812L9.5 10.375V14.5a.5.5 0 0 1-.724.447l-2-1A.5.5 0 0 1 6.5 13.5v-3.125L1.11 3.812A.5.5 0 0 1 1.5 3z"/>
              </svg>
              <span>Advanced filter</span>
            </div>
          </button>
        </div>

        <div class="divider"></div>

        <!-- Category Items List (Screenshot 3) -->
        <div class="categories-scroll-list">
          <button 
            type="button" 
            class="menu-row" 
            *ngFor="let item of filteredItems"
            [class.active]="activeSubmenu() === item.id"
            (mouseenter)="onItemHover(item.id)"
            (click)="onItemClick(item.id)"
          >
            <div class="row-left">
              <app-icon *ngIf="item.icon" [name]="item.icon" [size]="13" class="opt-icon"></app-icon>
              <span>{{ item.label }}</span>
            </div>
            <app-icon name="chevron-right" [size]="9" class="row-chevron" *ngIf="item.hasSubmenu !== false"></app-icon>
          </button>
        </div>

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

    .filter-popover-wrapper {
      position: relative;
      z-index: 999;
      display: flex;
      align-items: flex-start;
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

    .main-filter-panel {
      width: 215px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.04);
      padding: 4px;
      user-select: none;
    }

    .search-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 8px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 5px;
      margin-bottom: 3px;
    }

    .filter-search-input {
      background: transparent;
      border: none;
      color: #f7f8f8;
      font-size: 12.5px;
      outline: none;
      width: 100%;
      font-family: inherit;
    }

    .filter-search-input::placeholder {
      color: #6b7280;
    }

    .shortcut-key {
      font-size: 10px;
      font-weight: 500;
      color: #8a8f98;
      background: rgba(255, 255, 255, 0.08);
      padding: 1px 4px;
      border-radius: 3px;
    }

    .special-actions {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      margin: 4px 4px;
    }

    .categories-scroll-list {
      max-height: 380px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .categories-scroll-list::-webkit-scrollbar {
      display: none;
      width: 0;
    }

    .menu-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 5px 8px;
      background: transparent;
      border: none;
      border-radius: 5px;
      color: #c9cdd4;
      font-size: 12.5px;
      cursor: pointer;
      transition: background 0.1s ease, color 0.1s ease;
      font-family: inherit;
      text-align: left;
    }

    .menu-row:hover,
    .menu-row.active {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .row-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .opt-icon {
      color: #8a8f98;
    }

    .row-chevron {
      color: #6b7280;
    }

    .ai-sparkle {
      font-size: 13px;
    }

    /* Submenu Flyout (Screenshot 3) */
    .submenu-flyout {
      position: absolute;
      right: calc(100% + 4px);
      top: 0;
      width: 180px;
      background: #1d1e23;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
      padding: 5px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      animation: flyoutFade 0.12s ease forwards;
    }

    @keyframes flyoutFade {
      from { opacity: 0; transform: translateX(4px); }
      to { opacity: 1; transform: translateX(0); }
    }

    .submenu-search-box {
      padding: 4px 6px;
      background: rgba(255, 255, 255, 0.04);
      border-radius: 4px;
      margin-bottom: 2px;
    }

    .submenu-search-input {
      background: transparent;
      border: none;
      color: #f7f8f8;
      font-size: 12px;
      outline: none;
      width: 100%;
      font-family: inherit;
    }

    .checkbox-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .checkbox-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 5px 6px;
      border-radius: 4px;
      color: #c9cdd4;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.1s ease;
    }

    .checkbox-row:hover {
      background: rgba(255, 255, 255, 0.07);
      color: #ffffff;
    }

    .custom-checkbox {
      width: 12px;
      height: 12px;
      border-radius: 3px;
      border: 1px solid rgba(255, 255, 255, 0.25);
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .custom-checkbox.checked {
      background: #5e6ad2;
      border-color: #5e6ad2;
    }

    .opt-label-group {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .empty-content {
      padding: 12px;
    }

    .empty-msg {
      color: #8a8f98;
      font-size: 12px;
      text-align: center;
    }
  `]
})
export class IssuesFilterPopoverComponent {
  @Output() closed = new EventEmitter<void>();

  searchQuery = '';
  submenuSearch = '';
  readonly activeSubmenu = signal<string | null>(null);

  readonly items: FilterItem[] = [
    { id: 'status', label: 'Status', icon: 'status' },
    { id: 'assignee', label: 'Assignee', icon: 'user' },
    { id: 'agent', label: 'Agent', icon: 'agent' },
    { id: 'agent-session', label: 'Agent Session', icon: 'agent' },
    { id: 'creator', label: 'Creator', icon: 'user' },
    { id: 'priority', label: 'Priority', icon: 'priority' },
    { id: 'labels', label: 'Labels', icon: 'project' },
    { id: 'relations', label: 'Relations', icon: 'views' },
    { id: 'suggested-label', label: 'Suggested label', icon: 'project' },
    { id: 'dates', label: 'Dates', icon: 'history' },
    { id: 'project', label: 'Project', icon: 'project' },
    { id: 'project-properties', label: 'Project properties', icon: 'project' },
    { id: 'subscribers', label: 'Subscribers', icon: 'user' },
    { id: 'auto-closed', label: 'Auto-closed', icon: 'check-all' },
    { id: 'content', label: 'Content', icon: 'views' },
    { id: 'links', label: 'Links', icon: 'views' },
    { id: 'template', label: 'Template', icon: 'views' }
  ];

  readonly agentOptions = [
    { id: 'no-agent', label: 'No agent', icon: 'agent' },
    { id: 'any-agent', label: 'Any agent', icon: 'agent' }
  ];

  readonly selectedAgentOptions = signal<Set<string>>(new Set());

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closed.emit();
  }

  get filteredItems(): FilterItem[] {
    if (!this.searchQuery.trim()) return this.items;
    const q = this.searchQuery.toLowerCase().trim();
    return this.items.filter(it => it.label.toLowerCase().includes(q));
  }

  onItemHover(id: string): void {
    this.activeSubmenu.set(id);
  }

  onItemClick(id: string): void {
    this.activeSubmenu.set(id);
  }

  onSelect(action: string): void {
    this.closed.emit();
  }

  toggleAgentOption(id: string): void {
    const curr = new Set(this.selectedAgentOptions());
    if (curr.has(id)) {
      curr.delete(id);
    } else {
      curr.add(id);
    }
    this.selectedAgentOptions.set(curr);
  }
}

