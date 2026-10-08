import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WorkspaceService } from '../../core/services/workspace.service';
import { IconComponent } from '../../shared/components/icon/icon.component';
import { PopoverComponent } from '../../shared/components/popover/popover.component';

@Component({
  selector: 'app-agent-view',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent, PopoverComponent],
  template: `
    <div class="agent-container">
      <!-- Top Bar: New chat dropdown -->
      <div class="agent-topbar">
        <!-- Sidebar Expand / Peek Button (when sidebar is collapsed) -->
        <button 
          class="icon-btn sidebar-toggle-btn" 
          *ngIf="workspaceService.isSidebarCollapsed()"
          title="Expand sidebar ([)" 
          (mouseenter)="onToggleEnter()"
          (mouseleave)="onToggleLeave()"
          (click)="onToggleClick()"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 3A1.5 1.5 0 0 0 0 4.5v7A1.5 1.5 0 0 0 1.5 13h13a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 14.5 3h-13zm4 1.5H1.5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h4v-8zm1.5 8h7.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5H7v8z"/>
          </svg>
        </button>

        <button class="new-chat-dropdown-btn" (click)="toggleNewChatMenu($event)">
          <span>New chat</span>
          <app-icon name="chevron-down" [size]="11" class="chevron-icon"></app-icon>
        </button>

        <app-popover 
          *ngIf="workspaceService.isAgentNewChatMenuOpen()" 
          top="42px" 
          left="24px" 
          width="180px"
          (close)="workspaceService.isAgentNewChatMenuOpen.set(false)"
        >
          <div class="chat-menu">
            <button class="chat-menu-item" (click)="startNewChat()">
              <app-icon name="plus" [size]="13"></app-icon>
              <span>New chat</span>
            </button>
            <button class="chat-menu-item" (click)="clearChatHistory()">
              <app-icon name="archive" [size]="13"></app-icon>
              <span>Clear history</span>
            </button>
          </div>
        </app-popover>
      </div>

      <!-- Main Agent Area with Linear Watermark Logo -->
      <div class="agent-main-scroll">
        <!-- Background Linear Watermark Graphic -->
        <div class="watermark-container">
          <svg class="linear-watermark-svg" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="200" cy="200" r="180" stroke="rgba(255, 255, 255, 0.03)" stroke-width="1.5" />
            <path d="M70 200C70 128.203 128.203 70 200 70" stroke="rgba(255, 255, 255, 0.04)" stroke-width="2" />
            <path d="M100 240L300 160" stroke="rgba(255, 255, 255, 0.03)" stroke-width="2.5" />
            <path d="M120 280L320 200" stroke="rgba(255, 255, 255, 0.025)" stroke-width="2.5" />
            <path d="M150 320L340 240" stroke="rgba(255, 255, 255, 0.02)" stroke-width="2.5" />
          </svg>
        </div>

        <div class="agent-center-content">
          <!-- Chat Messages (if active conversation) -->
          <div class="chat-thread" *ngIf="chatMessages().length > 0">
            <div 
              class="message-bubble" 
              *ngFor="let msg of chatMessages()"
              [class.user-msg]="msg.sender === 'user'"
              [class.agent-msg]="msg.sender === 'agent'"
            >
              <div class="msg-header">
                <div class="msg-avatar" [class.agent-avatar]="msg.sender === 'agent'">
                  {{ msg.sender === 'user' ? 'MRS' : '⚡' }}
                </div>
                <span class="msg-sender-name">{{ msg.sender === 'user' ? 'Md Rakib Sordar' : 'Linear Agent' }}</span>
                <span class="msg-time">{{ msg.timestamp }}</span>
              </div>
              <p class="msg-text">{{ msg.text }}</p>

              <!-- Action pills -->
              <div class="msg-actions" *ngIf="msg.actions">
                <button 
                  class="action-pill" 
                  *ngFor="let act of msg.actions"
                  (click)="handleAction(act.action)"
                >
                  {{ act.label }}
                </button>
              </div>
            </div>

            <!-- Thinking Indicator -->
            <div class="thinking-row" *ngIf="workspaceService.isAgentThinking()">
              <div class="msg-avatar agent-avatar">⚡</div>
              <div class="thinking-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>

          <!-- Central Prompt Input Card (Screenshot 1) -->
          <div class="prompt-card">
            <textarea
              class="prompt-textarea"
              [(ngModel)]="promptText"
              (keydown)="onKeyDown($event)"
              placeholder="Ask Linear..."
              rows="3"
            ></textarea>

            <div class="prompt-card-footer">
              <!-- Skills Dropdown Button -->
              <div class="skills-wrapper">
                <button class="skills-btn" (click)="toggleSkillsMenu($event)">
                  <app-icon name="skills" [size]="14"></app-icon>
                  <span>Skills</span>
                  <app-icon name="chevron-down" [size]="10"></app-icon>
                </button>

                <!-- Skills Popover -->
                <app-popover 
                  *ngIf="workspaceService.isSkillsMenuOpen()" 
                  bottom="36px" 
                  left="0px" 
                  width="200px"
                  (close)="workspaceService.isSkillsMenuOpen.set(false)"
                >
                  <div class="skills-menu-list">
                    <div class="skills-title">Active Capabilities</div>
                    <button class="skill-item" (click)="selectSkill('Project Scoping')">
                      <app-icon name="project" [size]="13"></app-icon>
                      <span>Project Scoping</span>
                    </button>
                    <button class="skill-item" (click)="selectSkill('Issue Triage')">
                      <app-icon name="issues" [size]="13"></app-icon>
                      <span>Issue Triage</span>
                    </button>
                    <button class="skill-item" (click)="selectSkill('GitHub Code Search')">
                      <app-icon name="github" [size]="13"></app-icon>
                      <span>GitHub Search</span>
                    </button>
                    <button class="skill-item" (click)="selectSkill('Backlog Analysis')">
                      <app-icon name="search" [size]="13"></app-icon>
                      <span>Backlog Analysis</span>
                    </button>
                  </div>
                </app-popover>
              </div>

              <!-- Right Actions: Paperclip + Purple Send Button -->
              <div class="prompt-actions-right">
                <button class="attachment-btn" title="Attach file">
                  <app-icon name="paperclip" [size]="15"></app-icon>
                </button>
                <button 
                  class="send-btn" 
                  [class.has-content]="promptText.trim().length > 0"
                  (click)="sendPrompt()"
                  title="Send message (Enter)"
                >
                  <app-icon name="arrow-up" [size]="14"></app-icon>
                </button>
              </div>
            </div>
          </div>

          <!-- Get Started Examples Grid (Screenshot 1) -->
          <div class="examples-section" *ngIf="workspaceService.showAgentExamples()">
            <div class="examples-header">
              <span class="examples-title">Get started with some examples</span>
              <button class="close-examples-btn" (click)="dismissExamples()" title="Dismiss">
                <app-icon name="close" [size]="12"></app-icon>
              </button>
            </div>

            <div class="examples-grid">
              <!-- Card 1: Create a new project -->
              <button class="example-card" (click)="useExample('Create a new project for launching Linear Workspace App')">
                <div class="card-icon">
                  <app-icon name="project" [size]="15"></app-icon>
                </div>
                <div class="card-text">
                  <h3 class="card-title">Create a new project</h3>
                  <p class="card-desc">Turn an idea into a well-scoped project</p>
                </div>
              </button>

              <!-- Card 2: Research a topic -->
              <button class="example-card" (click)="useExample('Research highest priority open issues in our backlog')">
                <div class="card-icon">
                  <app-icon name="search" [size]="15"></app-icon>
                </div>
                <div class="card-text">
                  <h3 class="card-title">Research a topic</h3>
                  <p class="card-desc">Research a topic across the issue backlog</p>
                </div>
              </button>

              <!-- Card 3: Set up new team -->
              <button class="example-card" (click)="useExample('Set up a new engineering team workflow and roadmap')">
                <div class="card-icon">
                  <app-icon name="users" [size]="15"></app-icon>
                </div>
                <div class="card-text">
                  <h3 class="card-title">Set up new team</h3>
                  <p class="card-desc">Create a team that matches how your organization works</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Agent Status Bar -->
      <div class="agent-bottom-bar">
        <div class="status-left"></div>
        <div class="status-right">
          <button class="agent-pill-btn active">
            <app-icon name="agent" [size]="13"></app-icon>
            <span>Agent</span>
          </button>
          <button class="history-btn" title="Chat history">
            <app-icon name="history" [size]="14"></app-icon>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .agent-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100vh;
      background-color: #0b0c0e;
      position: relative;
      overflow: hidden;
    }

    .agent-topbar {
      height: 48px;
      padding: 0 24px;
      display: flex;
      align-items: center;
      position: relative;
      z-index: 10;
    }

    .new-chat-dropdown-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: none;
      color: #f7f8f8;
      font-size: 14px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 6px;
      transition: background 0.1s ease;
    }

    .new-chat-dropdown-btn:hover {
      background: rgba(255, 255, 255, 0.06);
    }

    .chevron-icon {
      color: #8a8f98;
    }

    .chat-menu {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .chat-menu-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 6px 10px;
      background: transparent;
      border: none;
      border-radius: 5px;
      color: #d1d5db;
      font-size: 13px;
      cursor: pointer;
      text-align: left;
    }

    .chat-menu-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .agent-main-scroll {
      flex: 1;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 0 24px 60px 24px;
      position: relative;
    }

    .watermark-container {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 440px;
      height: 440px;
      pointer-events: none;
      z-index: 1;
    }

    .linear-watermark-svg {
      width: 100%;
      height: 100%;
      opacity: 0.6;
    }

    .agent-center-content {
      width: 100%;
      max-width: 780px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      z-index: 2;
    }

    /* Chat thread */
    .chat-thread {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 8px;
      max-height: 400px;
      overflow-y: auto;
      padding-right: 8px;
    }

    .message-bubble {
      display: flex;
      flex-direction: column;
      gap: 6px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 12px 16px;
    }

    .user-msg {
      background: rgba(255, 255, 255, 0.04);
    }

    .msg-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .msg-avatar {
      width: 20px;
      height: 20px;
      background: #ea580c;
      color: white;
      font-size: 9px;
      font-weight: 700;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .msg-avatar.agent-avatar {
      background: #5e6ad2;
    }

    .msg-sender-name {
      font-size: 13px;
      font-weight: 500;
      color: #f7f8f8;
    }

    .msg-time {
      font-size: 11px;
      color: #6b7280;
    }

    .msg-text {
      font-size: 13.5px;
      color: #d1d5db;
      line-height: 1.5;
      margin: 0;
    }

    .msg-actions {
      display: flex;
      gap: 8px;
      margin-top: 4px;
    }

    .action-pill {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: #f7f8f8;
      font-size: 12px;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.1s ease;
    }

    .action-pill:hover {
      background: rgba(255, 255, 255, 0.12);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .thinking-row {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
    }

    .thinking-dots {
      display: flex;
      gap: 4px;
    }

    .thinking-dots span {
      width: 5px;
      height: 5px;
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

    /* Central Input Box */
    .prompt-card {
      background: #121316;
      border: 1px solid rgba(255, 255, 255, 0.09);
      border-radius: 12px;
      padding: 12px 14px 10px 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .prompt-card:focus-within {
      border-color: rgba(255, 255, 255, 0.2);
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08);
    }

    .prompt-textarea {
      background: transparent;
      border: none;
      outline: none;
      resize: none;
      color: #f7f8f8;
      font-size: 14px;
      line-height: 1.5;
      font-family: inherit;
      width: 100%;
    }

    .prompt-textarea::placeholder {
      color: #565961;
      font-size: 14px;
    }

    .prompt-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 4px;
    }

    .skills-wrapper {
      position: relative;
    }

    .skills-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: none;
      color: #8a8f98;
      font-size: 13px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 6px;
      transition: all 0.1s ease;
    }

    .skills-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #f7f8f8;
    }

    .skills-menu-list {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .skills-title {
      font-size: 10px;
      color: #62666d;
      font-weight: 600;
      text-transform: uppercase;
      padding: 4px 8px;
    }

    .skill-item {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 6px 8px;
      background: transparent;
      border: none;
      border-radius: 4px;
      color: #d1d5db;
      font-size: 12.5px;
      cursor: pointer;
      text-align: left;
    }

    .skill-item:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #ffffff;
    }

    .prompt-actions-right {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .attachment-btn {
      background: transparent;
      border: none;
      color: #8a8f98;
      cursor: pointer;
      padding: 6px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      transition: all 0.1s ease;
    }

    .attachment-btn:hover {
      background: rgba(255, 255, 255, 0.06);
      color: #ffffff;
    }

    .send-btn {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #5e6ad2;
      color: #ffffff;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.15s ease;
    }

    .send-btn.has-content {
      opacity: 1;
      background: #5e6ad2;
      box-shadow: 0 0 12px rgba(94, 106, 210, 0.5);
    }

    .send-btn:hover {
      opacity: 1;
      transform: scale(1.05);
    }

    /* Examples Section */
    .examples-section {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 4px;
    }

    .examples-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .examples-title {
      font-size: 13px;
      color: #8a8f98;
      font-weight: 500;
    }

    .close-examples-btn {
      background: transparent;
      border: none;
      color: #62666d;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
    }

    .close-examples-btn:hover {
      color: #f7f8f8;
      background: rgba(255, 255, 255, 0.06);
    }

    .examples-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }

    .example-card {
      background: #111215;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 10px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;
      text-align: left;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .example-card:hover {
      background: #16171c;
      border-color: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
    }

    .card-icon {
      color: #8a8f98;
      display: flex;
      align-items: center;
    }

    .example-card:hover .card-icon {
      color: #f7f8f8;
    }

    .card-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .card-title {
      font-size: 13.5px;
      font-weight: 600;
      color: #f7f8f8;
      margin: 0;
    }

    .card-desc {
      font-size: 12px;
      color: #8a8f98;
      line-height: 1.4;
      margin: 0;
    }

    /* Bottom Status Bar */
    .agent-bottom-bar {
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.04);
      background-color: #0b0c0e;
    }

    .status-right {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-left: auto;
    }

    .agent-pill-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: transparent;
      border: none;
      color: #8a8f98;
      font-size: 12px;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.1s ease;
    }

    .agent-pill-btn.active {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.08);
    }

    .history-btn {
      background: transparent;
      border: none;
      color: #8a8f98;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      transition: all 0.1s ease;
    }

    .sidebar-toggle-btn {
      color: #8a8f98;
      margin-right: 8px;
      padding: 4px;
      border-radius: 4px;
      background: transparent;
      border: none;
      display: flex;
      align-items: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .sidebar-toggle-btn:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.09);
    }
  `]
})
export class AgentViewComponent {
  promptText = '';
  private toggleHoverTimeout: any;

  constructor(public workspaceService: WorkspaceService) {}

  onToggleEnter(): void {
    if (this.toggleHoverTimeout) {
      clearTimeout(this.toggleHoverTimeout);
    }
    this.workspaceService.setSidebarPeeking(true);
  }

  onToggleLeave(): void {
    this.toggleHoverTimeout = setTimeout(() => {
      if (!this.workspaceService.isSidebarPeeking()) {
        this.workspaceService.setSidebarPeeking(false);
      }
    }, 250);
  }

  onToggleClick(): void {
    this.workspaceService.toggleSidebar();
  }

  get chatMessages() {
    return this.workspaceService.chatMessages;
  }

  toggleNewChatMenu(event: MouseEvent): void {
    event.stopPropagation();
    const current = this.workspaceService.isAgentNewChatMenuOpen();
    this.workspaceService.closeAllMenus();
    this.workspaceService.isAgentNewChatMenuOpen.set(!current);
  }

  toggleSkillsMenu(event: MouseEvent): void {
    event.stopPropagation();
    const current = this.workspaceService.isSkillsMenuOpen();
    this.workspaceService.closeAllMenus();
    this.workspaceService.isSkillsMenuOpen.set(!current);
  }

  selectSkill(skillName: string): void {
    this.promptText = `[Skill: ${skillName}] ` + this.promptText;
    this.workspaceService.isSkillsMenuOpen.set(false);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendPrompt();
    }
  }

  sendPrompt(): void {
    if (!this.promptText.trim()) return;
    this.workspaceService.sendAgentMessage(this.promptText);
    this.promptText = '';
  }

  useExample(examplePrompt: string): void {
    this.promptText = examplePrompt;
    this.sendPrompt();
  }

  dismissExamples(): void {
    this.workspaceService.showAgentExamples.set(false);
  }

  startNewChat(): void {
    this.workspaceService.chatMessages.set([]);
    this.workspaceService.isAgentNewChatMenuOpen.set(false);
  }

  clearChatHistory(): void {
    this.workspaceService.chatMessages.set([]);
    this.workspaceService.isAgentNewChatMenuOpen.set(false);
  }

  handleAction(action: string): void {
    if (action === 'create_issue') {
      this.workspaceService.openNewIssueModal();
    } else {
      this.workspaceService.sendAgentMessage('Run comprehensive backlog analysis and summarize dependencies.');
    }
  }
}
