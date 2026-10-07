import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popover',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="popover-backdrop" (click)="onBackdropClick($event)">
      <div 
        class="popover-panel" 
        [style.width]="width"
        [style.top]="top"
        [style.left]="left"
        [style.right]="right"
        [style.bottom]="bottom"
        (click)="$event.stopPropagation()"
      >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .popover-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 1000;
      background: transparent;
    }

    .popover-panel {
      position: absolute;
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 12px 36px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      padding: 4px;
      color: #e2e8f0;
      font-size: 13px;
      user-select: none;
      animation: popoverFadeIn 0.14s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      overflow: hidden;
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
  `]
})
export class PopoverComponent {
  @Input() width: string = '240px';
  @Input() top?: string;
  @Input() left?: string;
  @Input() right?: string;
  @Input() bottom?: string;
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    event.stopPropagation();
    this.close.emit();
  }
}
