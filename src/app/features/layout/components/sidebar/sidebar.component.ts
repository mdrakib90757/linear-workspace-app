// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NavigationService } from '../../services/navigation.service';

// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="sidebar-wrapper">
//       <div class="workspace-badge">
//         <span class="badge-icon">⚡</span>
//         <span class="workspace-name">Linear Workspace</span>
//       </div>

//       <nav class="nav-group">
//         <div class="nav-title">YOUR WORK</div>
//         <a class="nav-item active">All Issues</a>
//         <a class="nav-item">Active</a>
//         <a class="nav-item">Backlog</a>
//       </nav>

//       <nav class="nav-group">
//         <div class="nav-title">WORKSPACE</div>
//         <a class="nav-item">Projects</a>
//         <a class="nav-item">Views</a>
//         <a class="nav-item">Settings</a>
//       </nav>
//     </div>
//   `,
//   styleUrls: ['./sidebar.component.css']
// })
// export class SidebarComponent {
//   constructor(public navService: NavigationService) {}
// }
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <aside class="sidebar">
      <!-- User Profile Header -->
      <div class="sidebar-header">
        <div class="user-profile">
          <span class="avatar">MRS</span>
          <span class="name">Md Rakib Sordar</span>
          <svg class="chevron" width="12" height="12" viewBox="0 0 16 16"><path fill="currentColor" d="M4.5 6l3.5 4 3.5-4z"/></svg>
        </div>
        <div class="header-actions">
          <button title="Search"><svg width="14" height="14" viewBox="0 0 16 16"><path fill="currentColor" d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/></svg></button>
          <button title="New Issue"><svg width="14" height="14" viewBox="0 0 16 16"><path fill="currentColor" d="M12.5 2h-9A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 12.5 2M12 8H9v3H7V8H4V6h3V3h2v3h3z"/></svg></button>
        </div>
      </div>

      <!-- Main Navigation -->
      <nav class="sidebar-nav">
        <a class="nav-item active" (click)="onSelect('Inbox')">
          <span class="icon">📥</span> Inbox
          <span class="badge">1</span>
        </a>
        <a class="nav-item" (click)="onSelect('My issues')">
          <span class="icon">👤</span> My issues
        </a>
        <a class="nav-item" (click)="onSelect('Agent')">
          <span class="icon">🤖</span> Agent
        </a>
      </nav>

      <!-- Workspace Section -->
      <div class="sidebar-section">
        <div class="section-title">Workspace ▾</div>
        <a class="nav-item sub"><span class="icon">📁</span> Projects</a>
        <a class="nav-item sub"><span class="icon">👁️</span> Views</a>
        <a class="nav-item sub"><span class="icon">⋯</span> More</a>
      </div>

      <!-- Teams Section -->
      <div class="sidebar-section">
        <div class="section-title">Your teams ▾</div>
        <div class="team-group">
          <div class="team-header"><span class="team-bullet">🔵</span> Md Rakib Sordar ▾</div>
          <a class="nav-item sub-sub"><span class="icon">🏠</span> Home</a>
          <a class="nav-item sub-sub"><span class="icon">📋</span> Issues</a>
          <a class="nav-item sub-sub"><span class="icon">📁</span> Projects</a>
          <a class="nav-item sub-sub"><span class="icon">👁️</span> Views</a>
        </div>
      </div>

      <!-- Try Section -->
      <div class="sidebar-section">
        <div class="section-title">Try ▾</div>
        <a class="nav-item sub"><span class="icon">📥</span> Import issues</a>
        <a class="nav-item sub"><span class="icon">➕</span> Invite people</a>
        <a class="nav-item sub"><span class="icon">🐙</span> Connect GitHub</a>
      </div>

      <!-- Footer Help -->
      <div class="sidebar-footer">
        <button class="help-btn">?</button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100%;
      background-color: #0d0e11;
      border-right: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      flex-direction: column;
      padding: 12px 8px;
      user-select: none;
      box-sizing: border-box;
    }
    .sidebar-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 6px 8px 12px 8px; border-bottom: 1px solid rgba(255, 255, 255, 0.04); margin-bottom: 8px;
    }
    .user-profile { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: #e2e8f0; cursor: pointer; }
    .avatar { background: #5e6ad2; color: white; font-size: 10px; font-weight: 700; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 4px; }
    .header-actions { display: flex; gap: 4px; }
    .header-actions button { background: transparent; border: none; color: #8a8f98; cursor: pointer; padding: 4px; border-radius: 4px; display: flex; align-items: center; }
    .header-actions button:hover { background: rgba(255,255,255,0.06); color: #fff; }
    .sidebar-nav, .sidebar-section { display: flex; flex-direction: column; gap: 2px; margin-top: 8px; }
    .section-title { font-size: 11px; color: #62666d; padding: 4px 8px; font-weight: 500; }
    .nav-item { display: flex; align-items: center; justify-content: space-between; padding: 5px 8px; font-size: 13px; color: #9ba1ae; border-radius: 6px; cursor: pointer; text-decoration: none; }
    .nav-item:hover { background: rgba(255, 255, 255, 0.04); color: #f7f8f8; }
    .nav-item.active { background: rgba(255, 255, 255, 0.08); color: #f7f8f8; font-weight: 500; }
    .nav-item .icon { margin-right: 8px; font-size: 12px; }
    .nav-item.sub { padding-left: 12px; }
    .nav-item.sub-sub { padding-left: 20px; font-size: 12px; }
    .badge { background: rgba(255, 255, 255, 0.08); padding: 1px 6px; font-size: 11px; border-radius: 10px; color: #b0b7c3; }
    .team-header { font-size: 12px; color: #8a8f98; padding: 4px 8px; display: flex; align-items: center; gap: 6px; }
    .sidebar-footer { margin-top: auto; padding-top: 8px; }
    .help-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #8a8f98; border-radius: 50%; width: 22px; height: 22px; font-size: 12px; cursor: pointer; }
  `]
})
export class SidebarComponent {
  @Output() selectSection = new EventEmitter<string>();
  onSelect(section: string) { this.selectSection.emit(section); }
}