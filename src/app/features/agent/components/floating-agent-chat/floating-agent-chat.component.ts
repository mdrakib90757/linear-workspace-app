import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../../../core/services/workspace.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-floating-agent-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  template: `
    <div 
      class="floating-chat-window" 
      [class.minimized]="isMinimized()"
      [class.expanded]="isExpanded()"
    >
      <!-- Titlebar (Screenshots 3, 4, 5) -->
      <div class="window-header">
        <div class="header-left">
          <span class="window-title">New chat</span>
        </div>

        <div class="header-actions">
          <!-- Minimize -->
          <button class="win-btn" title="Minimize" (click)="toggleMinimize()">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 8a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 8z"/>
            </svg>
          </button>

          <!-- Expand / Restore -->
          <button class="win-btn" title="Expand" (click)="toggleExpand()">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
              <path d="M1.5 1.5A.5.5 0 0 1 2 1h4a.5.5 0 0 1 0 1H2.707l3.147 3.146a.5.5 0 1 1-.708.708L2 2.707V6a.5.5 0 0 1-1 0V1.5zM14.5 1.5A.5.5 0 0 0 14 1h-4a.5.5 0 0 0 0 1h3.293l-3.147 3.146a.5.5 0 0 0 .708.708L14 2.707V6a.5.5 0 0 0 1 0V1.5zM1.5 14.5A.5.5 0 0 0 2 15h4a.5.5 0 0 0 0-1H2.707l3.147-3.146a.5.5 0 0 0-.708-.708L2 13.293V10a.5.5 0 0 0-1 0v4.5zm13 0a.5.5 0 0 1-.5.5h-4a.5.5 0 0 1 0-1h3.293l-3.147-3.146a.5.5 0 0 1 .708-.708L14 13.293V10a.5.5 0 0 1 1 0v4.5z"/>
            </svg>
          </button>

          <!-- Close -->
          <button class="win-btn" title="Close" (click)="close()">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Main Body (Screenshots 3, 4, 5) -->
      <div class="window-body" *ngIf="!isMinimized()">
        
        <!-- Messages Area or Welcome Empty State -->
        <div class="messages-scroll-area" #scrollArea>
          
          <ng-container *ngIf="workspaceService.chatMessages().length === 0; else msgStream">
            <!-- Welcome Empty State (Screenshots 3, 4, 5) -->
            <div class="welcome-container">
              <!-- Center Icon / Subtle Grid -->
              <div class="welcome-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="rgba(255, 255, 255, 0.45)" stroke-width="1.8" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="rgba(255, 255, 255, 0.28)" stroke-width="1.8" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="rgba(255, 255, 255, 0.35)" stroke-width="1.8" stroke-linejoin="round"/>
                </svg>
              </div>

              <h3 class="welcome-heading">Welcome to Linear</h3>
              <p class="welcome-caption">Ask anything or tell Linear what you need</p>

              <!-- Quick Action Pills matching Screenshots 3, 4, 5 -->
              <div class="action-pills-group">
                <div class="pill-row">
                  <button type="button" class="quick-pill" (click)="useExample('Create a new project')">
                    <app-icon name="project" [size]="12"></app-icon>
                    <span>Create a new project</span>
                  </button>
                  <button type="button" class="quick-pill" (click)="useExample('Research a topic')">
                    <app-icon name="search" [size]="12"></app-icon>
                    <span>Research a topic</span>
                  </button>
                </div>

                <div class="pill-row">
                  <button type="button" class="quick-pill" (click)="useExample('Set up new team')">
                    <app-icon name="users" [size]="12"></app-icon>
                    <span>Set up new team</span>
                  </button>
                </div>
              </div>
            </div>
          </ng-container>

          <ng-template #msgStream>
            <div class="chat-thread-inner">
              <div 
                class="chat-bubble-row" 
                *ngFor="let msg of workspaceService.chatMessages()"
                [class.user-row]="msg.sender === 'user'"
              >
                <div class="chat-bubble">
                  <p class="bubble-text">{{ msg.text }}</p>
                </div>
              </div>

              <!-- Thinking animation -->
              <div class="thinking-row" *ngIf="workspaceService.isAgentThinking()">
                <div class="thinking-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </ng-template>

        </div>

        <!-- Floating Input Footer (Screenshots 3, 4, 5) -->
        <div class="window-footer">
          <div class="chat-input-box">
            <textarea
              #inputArea
              [(ngModel)]="inputText"
              (keydown.enter)="onEnter($event)"
              placeholder="@ to mention any issue, project, or document"
              rows="1"
              class="chat-textarea"
            ></textarea>

            <div class="chat-input-bottom">
              <!-- Skills Popover Trigger (Screenshot 5) -->
              <div class="skills-anchor">
                <button 
                  type="button" 
                  class="skills-pill-btn" 
                  (click)="isSkillsOpen.set(!isSkillsOpen())"
                >
                  <app-icon name="skills" [size]="12"></app-icon>
                  <span>Skills</span>
                  <app-icon name="chevron-down" [size]="9"></app-icon>
                </button>

                <!-- + Create skill Popover Menu (Screenshot 5) -->
                <div class="skills-dropdown-menu" *ngIf="isSkillsOpen()">
                  <button type="button" class="create-skill-btn" (click)="onCreateSkill()">
                    <app-icon name="plus" [size]="12"></app-icon>
                    <span>Create skill</span>
                  </button>
                </div>
              </div>

              <!-- Send Button -->
              <button 
                type="button"
                class="send-btn" 
                [class.active]="inputText.trim().length > 0"
                (click)="sendMessage()"
                title="Send"
              >
                <app-icon name="arrow-up" [size]="12"></app-icon>
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  `,
  styles: [`
    .floating-chat-window {
      position: fixed;
      bottom: 48px;
      right: 16px;
      width: 350px;
      height: 480px;
      background: #141518;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      box-shadow: 0 16px 48px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.04);
      display: flex;
      flex-direction: column;
      z-index: 1000;
      overflow: hidden;
      animation: chatFadeIn 0.16s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      transition: width 0.2s ease, height 0.2s ease, transform 0.2s ease;
    }

    .floating-chat-window.minimized {
      height: 40px;
    }

    .floating-chat-window.expanded {
      width: 480px;
      height: 640px;
    }

    @keyframes chatFadeIn {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    /* Header */
    .window-header {
      height: 40px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      background: #18191d;
      flex-shrink: 0;
      user-select: none;
    }

    .window-title {
      font-size: 13px;
      font-weight: 500;
      color: #f7f8f8;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .win-btn {
      background: transparent;
      border: none;
      color: #8a8f98;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.1s ease;
    }

    .win-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    /* Body */
    .window-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #101114;
    }

    .messages-scroll-area {
      flex: 1;
      overflow-y: auto;
      padding: 14px;
      display: flex;
      flex-direction: column;
    }

    .messages-scroll-area::-webkit-scrollbar {
      width: 4px;
    }

    .messages-scroll-area::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 4px;
    }

    /* Welcome Container (Screenshots 3, 4, 5) */
    .welcome-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 6px;
      padding-top: 10px;
    }

    .welcome-icon-box {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 4px;
    }

    .welcome-heading {
      font-size: 13.5px;
      font-weight: 600;
      color: #f7f8f8;
      margin: 0;
    }

    .welcome-caption {
      font-size: 12px;
      color: #8a8f98;
      margin: 0 0 14px 0;
    }

    .action-pills-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      width: 100%;
    }

    .pill-row {
      display: flex;
      gap: 6px;
    }

    .quick-pill {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 6px;
      color: #c9cdd4;
      font-size: 11.5px;
      font-weight: 450;
      cursor: pointer;
      transition: all 0.12s ease;
      font-family: inherit;
    }

    .quick-pill:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    /* Chat Thread */
    .chat-thread-inner {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .chat-bubble-row {
      display: flex;
      justify-content: flex-start;
    }

    .chat-bubble-row.user-row {
      justify-content: flex-end;
    }

    .chat-bubble {
      max-width: 85%;
      padding: 8px 12px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: #f7f8f8;
      font-size: 12.5px;
      line-height: 1.45;
    }

    .user-row .chat-bubble {
      background: #5e6ad2;
      border-color: #5e6ad2;
      color: #ffffff;
    }

    .bubble-text {
      margin: 0;
    }

    .thinking-row {
      display: flex;
      padding: 6px;
    }

    .thinking-dots {
      display: flex;
      gap: 4px;
    }

    .thinking-dots span {
      width: 4px;
      height: 4px;
      background: #8a8f98;
      border-radius: 50%;
      animation: blink 1.2s infinite ease-in-out;
    }
    .thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
    .thinking-dots span:nth-child(3) { animation-delay: 0.4s; }

    @keyframes blink {
      0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
      40% { opacity: 1; transform: scale(1.1); }
    }

    /* Footer Input Box (Screenshots 3, 4, 5) */
    .window-footer {
      padding: 10px 12px;
      background: #141518;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      flex-shrink: 0;
    }

    .chat-input-box {
      background: #18191d;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: border-color 0.12s ease;
    }

    .chat-input-box:focus-within {
      border-color: rgba(255, 255, 255, 0.16);
    }

    .chat-textarea {
      background: transparent;
      border: none;
      outline: none;
      resize: none;
      color: #f7f8f8;
      font-size: 12px;
      line-height: 1.4;
      font-family: inherit;
      width: 100%;
    }

    .chat-textarea::placeholder {
      color: #6b7280;
    }

    .chat-input-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 2px;
    }

    .skills-anchor {
      position: relative;
    }

    .skills-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: transparent;
      border: none;
      color: #8a8f98;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
      transition: all 0.1s ease;
      font-family: inherit;
    }

    .skills-pill-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #f7f8f8;
    }

    /* Skills Popover (+ Create skill) (Screenshot 5) */
    .skills-dropdown-menu {
      position: absolute;
      bottom: calc(100% + 4px);
      left: 0;
      z-index: 1002;
      width: 120px;
      background: #1d1e23;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 6px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.8);
      padding: 3px;
      animation: menuFade 0.1s ease forwards;
    }

    @keyframes menuFade {
      from { opacity: 0; transform: translateY(2px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .create-skill-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      width: 100%;
      padding: 5px 8px;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: #f7f8f8;
      font-size: 12px;
      cursor: pointer;
      transition: background 0.1s ease;
      font-family: inherit;
    }

    .create-skill-btn:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .send-btn {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.08);
      color: #8a8f98;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.12s ease;
    }

    .send-btn.active {
      background: #5e6ad2;
      color: #ffffff;
      box-shadow: 0 0 8px rgba(94, 106, 210, 0.4);
    }
  `]
})
export class FloatingAgentChatComponent {
  @ViewChild('scrollArea') scrollArea?: ElementRef<HTMLDivElement>;

  inputText = '';
  readonly isMinimized = signal<boolean>(false);
  readonly isExpanded = signal<boolean>(false);
  readonly isSkillsOpen = signal<boolean>(false);

  constructor(public workspaceService: WorkspaceService) {}

  close(): void {
    this.workspaceService.isFloatingAgentChatOpen.set(false);
  }

  toggleMinimize(): void {
    this.isMinimized.update(v => !v);
  }

  toggleExpand(): void {
    this.isExpanded.update(v => !v);
  }

  useExample(text: string): void {
    this.workspaceService.sendAgentMessage(text);
  }

  onEnter(e: Event): void {
    const keyEvent = e as KeyboardEvent;
    if (!keyEvent.shiftKey) {
      keyEvent.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage(): void {
    if (!this.inputText.trim()) return;
    const txt = this.inputText.trim();
    this.inputText = '';
    this.isSkillsOpen.set(false);
    this.workspaceService.sendAgentMessage(txt);

    setTimeout(() => {
      if (this.scrollArea) {
        this.scrollArea.nativeElement.scrollTop = this.scrollArea.nativeElement.scrollHeight;
      }
    }, 100);
  }

  onCreateSkill(): void {
    this.isSkillsOpen.set(false);
    // Add custom skill or feedback
    this.inputText = 'Create custom AI skill: ';
  }
}

