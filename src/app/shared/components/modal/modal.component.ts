import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="onClose()">
        <div class="modal-container" (click)="$event.stopPropagation()">
          <header class="modal-header">
            <h3>{{ title }}</h3>
            <button class="close-btn" (click)="onClose()">✕</button>
          </header>
          <div class="modal-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999;
    }
    .modal-container {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      min-width: 450px;
      max-width: 90vw;
    }
    .modal-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-color);
    }
    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
    }
    .modal-body {
      padding: 16px;
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Output() closed = new EventEmitter<void>();

  onClose() {
    this.closed.emit();
  }
}
