import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isOpen()) {
      <div class="palette-backdrop" (click)="close()">
        <div class="palette-dialog" (click)="$event.stopPropagation()">
          <div class="search-wrapper">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Type a command or search..."
              class="palette-input"
              autofocus
            />
          </div>
          <div class="command-results">
            <div class="command-item">Quick Switch: Issues</div>
            <div class="command-item">Create New Issue (C)</div>
            <div class="command-item">Workspace Settings</div>
          </div>
        </div>
      </div>
    }
  `,
  styleUrls: ['./command-palette.component.css']
})
export class CommandPaletteComponent {
  isOpen = signal<boolean>(false);
  searchQuery = '';

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      this.toggle();
    } else if (event.key === 'Escape' && this.isOpen()) {
      this.close();
    }
  }

  toggle() {
    this.isOpen.update(v => !v);
  }

  close() {
    this.isOpen.set(false);
  }
}
