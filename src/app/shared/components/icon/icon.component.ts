import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="icon-container" [style.width.px]="size" [style.height.px]="size">
      <!-- Inbox -->
      <svg *ngIf="name === 'inbox'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-11zm9.95 7a2.5 2.5 0 0 1-4.9 0h-5.05V4.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v5.5h-2.05zM9.95 10a1.5 1.5 0 0 1-2.9 0h2.9z"/>
      </svg>

      <!-- My Issues -->
      <svg *ngIf="name === 'my-issues'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h2a.75.75 0 0 1 0 1.5h-2a.5.5 0 0 0-.5.5v2a.75.75 0 0 1-1.5 0v-2zm12 0A1.5 1.5 0 0 0 12.5 2h-2a.75.75 0 0 0 0 1.5h2a.5.5 0 0 1 .5.5v2a.75.75 0 0 0 1.5 0v-2zM2 12.5A1.5 1.5 0 0 0 3.5 14h2a.75.75 0 0 0 0-1.5h-2a.5.5 0 0 1-.5-.5v-2a.75.75 0 0 0-1.5 0v-2zm12 0a1.5 1.5 0 0 1-1.5 1.5h-2a.75.75 0 0 1 0-1.5h2a.5.5 0 0 0 .5-.5v-2a.75.75 0 0 1 1.5 0v2zM8 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
      </svg>

      <!-- Agent / Navigation Arrow -->
      <svg *ngIf="name === 'agent'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.38 1.487a.75.75 0 0 1 .862-.127l11.5 6a.75.75 0 0 1 0 1.332l-11.5 6A.75.75 0 0 1 2.15 13.9l1.83-5.5a.75.75 0 0 1 0-.48L2.15 2.42a.75.75 0 0 1 .23-.933zM4.098 7.25l-1.37-4.108 9.38 4.896-4.51 2.353-3.5-3.141zm.07 1.5l3.43 3.078 4.51-2.353-9.38 4.896 1.44-4.621z"/>
      </svg>

      <!-- Projects / Cube -->
      <svg *ngIf="name === 'project'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.708 1.087a.75.75 0 0 1 .584 0l6 2.75a.75.75 0 0 1 .458.686v7.454a.75.75 0 0 1-.458.686l-6 2.75a.75.75 0 0 1-.584 0l-6-2.75A.75.75 0 0 1 1.25 12V4.523a.75.75 0 0 1 .458-.686l6-2.75zM8 2.404L3.104 4.647 8 6.89l4.896-2.243L8 2.404zm5.25 3.447L8.75 7.896V13.31l4.5-2.062V5.851zM7.25 13.31V7.896L2.75 5.851v5.397l4.5 2.062z"/>
      </svg>

      <!-- Views / Stacked Layers -->
      <svg *ngIf="name === 'views'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.708 1.137a.75.75 0 0 1 .584 0l6.5 3a.75.75 0 0 1 0 1.366l-6.5 3a.75.75 0 0 1-.584 0l-6.5-3a.75.75 0 0 1 0-1.366l6.5-3zM8 2.433L2.656 4.9 8 7.367 13.344 4.9 8 2.433z"/>
        <path d="M1.442 8.683a.75.75 0 0 1 1.016-.366L8 10.867l5.542-2.55a.75.75 0 1 1 .632 1.366l-5.858 2.695a.75.75 0 0 1-.632 0L1.824 9.683a.75.75 0 0 1-.382-1z"/>
      </svg>

      <!-- More Horizontal Dots -->
      <svg *ngIf="name === 'more'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
      </svg>

      <!-- Home -->
      <svg *ngIf="name === 'home'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L1.646 7.146a.5.5 0 0 0 .708.708L3 7.207V13.5A1.5 1.5 0 0 0 4.5 15h7a1.5 1.5 0 0 0 1.5-1.5V7.207l.646.647a.5.5 0 0 0 .708-.708L8.707 1.5zM12 6.207V13.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5V6.207l4-4 4 4z"/>
      </svg>

      <!-- Issues / Ticket List -->
      <svg *ngIf="name === 'issues'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3 2.5A1.5 1.5 0 0 0 1.5 4v8A1.5 1.5 0 0 0 3 13.5h10a1.5 1.5 0 0 0 1.5-1.5V4A1.5 1.5 0 0 0 13 2.5H3zm0 1h10a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5zM4.75 5.5a.75.75 0 0 0 0 1.5h6.5a.75.75 0 0 0 0-1.5h-6.5zm0 3.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-4.5z"/>
      </svg>

      <!-- Import Issues -->
      <svg *ngIf="name === 'import'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8.5 1.5a.75.75 0 0 0-1.5 0v6.19L5.03 5.72a.75.75 0 0 0-1.06 1.06l3.25 3.25a.75.75 0 0 0 1.06 0l3.25-3.25a.75.75 0 0 0-1.06-1.06L8.5 7.69V1.5zM2 10.5a.75.75 0 0 1 .75.75V13h10.5v-1.75a.75.75 0 0 1 1.5 0v2.5a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1-.75-.75v-2.5a.75.75 0 0 1 .75-.75z"/>
      </svg>

      <!-- Invite People / User Plus -->
      <svg *ngIf="name === 'invite'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm-7 8a4 4 0 0 1 8 0v1.5a.75.75 0 0 1-1.5 0V13a2.5 2.5 0 0 0-5 0v1.5a.75.75 0 0 1-1.5 0V13zm11.25-4.25a.75.75 0 0 0-1.5 0v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 0 0 1.5 0v-1.5h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5z"/>
      </svg>

      <!-- GitHub -->
      <svg *ngIf="name === 'github'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8a8.01 8.01 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
      </svg>

      <!-- Search -->
      <svg *ngIf="name === 'search'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
      </svg>

      <!-- Compose / Plus Edit -->
      <svg *ngIf="name === 'compose'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M12.5 2h-9A1.5 1.5 0 0 0 2 3.5v9A1.5 1.5 0 0 0 3.5 14h9a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 12.5 2M12 8H9v3H7V8H4V6h3V3h2v3h3z"/>
      </svg>

      <!-- Filter Funnel -->
      <svg *ngIf="name === 'filter'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1.5 2.5A.75.75 0 0 1 2.25 2h11.5a.75.75 0 0 1 .53 1.28L9.5 8.06v4.69a.75.75 0 0 1-.38.65l-2.5 1.25a.75.75 0 0 1-1.09-.67V8.06L1.72 3.28a.75.75 0 0 1-.22-.53zm1.88.75l4.34 4.56a.75.75 0 0 1 .2.52v4.32l1-.5V8.33a.75.75 0 0 1 .2-.52l4.34-4.56H3.38z"/>
      </svg>

      <!-- Check / Mark Read -->
      <svg *ngIf="name === 'check-all'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v7A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 13.5 3h-11zM12 7.707l-4.5 4.5a.5.5 0 0 1-.707 0l-2-2a.5.5 0 1 1 .707-.707L7.146 11.146 11.293 7a.5.5 0 1 1 .707.707z"/>
      </svg>

      <!-- Sliders / View settings -->
      <svg *ngIf="name === 'sliders'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1.5 3.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75zm7 0a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75zM7 2.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm-5.5 6a.75.75 0 0 1 .75-.75h6.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1-.75-.75zm10.5 0a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75zm-2.75-1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zm-7.75 6a.75.75 0 0 1 .75-.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75zm6 0a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75zm-2.25-1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z"/>
      </svg>

      <!-- Favorite Star -->
      <svg *ngIf="name === 'star'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1.75a.75.75 0 0 1 .67.41l1.79 3.63 4 .58a.75.75 0 0 1 .42 1.28l-2.9 2.82.68 3.99a.75.75 0 0 1-1.09.79L8 12.37l-3.57 1.88a.75.75 0 0 1-1.09-.79l.68-3.99-2.9-2.82a.75.75 0 0 1 .42-1.28l4-.58L7.33 2.16A.75.75 0 0 1 8 1.75zM8 3.62L6.64 6.38a.75.75 0 0 1-.56.41l-3.04.44 2.2 2.14a.75.75 0 0 1 .22.66l-.52 3.03 2.72-1.43a.75.75 0 0 1 .7 0l2.72 1.43-.52-3.03a.75.75 0 0 1 .22-.66l2.2-2.14-3.04-.44a.75.75 0 0 1-.56-.41L8 3.62z"/>
      </svg>

      <!-- Settings Gear -->
      <svg *ngIf="name === 'settings'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.42 1.5a.75.75 0 0 1 .75 0l.4.23a2.5 2.5 0 0 0 2.5 0l.4-.23a.75.75 0 0 1 .94.18l.7.83a.75.75 0 0 1 .08.95l-.23.4a2.5 2.5 0 0 0 1.25 2.16l.46.26a.75.75 0 0 1 .38.65v1.07a.75.75 0 0 1-.38.65l-.46.26a2.5 2.5 0 0 0-1.25 2.16l.23.4a.75.75 0 0 1-.08.95l-.7.83a.75.75 0 0 1-.94.18l-.4-.23a2.5 2.5 0 0 0-2.5 0l-.4.23a.75.75 0 0 1-.94-.18l-.7-.83a.75.75 0 0 1-.08-.95l.23-.4A2.5 2.5 0 0 0 5.4 9.5l-.46-.26A.75.75 0 0 1 4.56 8.59V7.52a.75.75 0 0 1 .38-.65l.46-.26A2.5 2.5 0 0 0 6.65 4.45l-.23-.4a.75.75 0 0 1 .08-.95l.7-.83a.75.75 0 0 1 .22-.27zM8 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>
      </svg>

      <!-- Copy Link -->
      <svg *ngIf="name === 'link'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M6.75 4.5a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0V5.5a1.5 1.5 0 0 0-1.5-1.5H3A1.5 1.5 0 0 0 1.5 5.5v3A1.5 1.5 0 0 0 3 10h1.5a.75.75 0 0 1 0 1.5H3A3 3 0 0 1 0 8.5v-3A3 3 0 0 1 3 2.5h1.5a3 3 0 0 1 3 3v-.25a.75.75 0 0 1 .75-.75zm2.5 7a.75.75 0 0 1-.75-.75v-1.5a.75.75 0 0 1 1.5 0v1.25a1.5 1.5 0 0 0 1.5 1.5H13a1.5 1.5 0 0 0 1.5-1.5v-3A1.5 1.5 0 0 0 13 6h-1.5a.75.75 0 0 1 0-1.5H13A3 3 0 0 1 16 7.5v3a3 3 0 0 1-3 3h-1.5a3 3 0 0 1-3-3v.25a.75.75 0 0 1-.75.75zm-4.5-3.5a.75.75 0 0 1 .75-.75h5a.75.75 0 0 1 0 1.5h-5a.75.75 0 0 1-.75-.75z"/>
      </svg>

      <!-- Archive -->
      <svg *ngIf="name === 'archive'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5A1.5 1.5 0 0 1 3 1h10a1.5 1.5 0 0 1 1.5 1.5V5h.25a.75.75 0 0 1 .75.75v8.5A1.75 1.75 0 0 1 13.75 16H2.25A1.75 1.75 0 0 1 .5 14.25V5.75A.75.75 0 0 1 1.25 5H1.5V2.5zm1.5 0V5h10V2.5H3zm-1 4v7.75c0 .138.112.25.25.25h11.5a.25.25 0 0 0 .25-.25V6.5H2zm4 2a.75.75 0 0 0 0 1.5h4a.75.75 0 0 0 0-1.5H6z"/>
      </svg>

      <!-- Slack -->
      <svg *ngIf="name === 'slack'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M3.5 10.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm1-1.5a1.5 1.5 0 0 1 1.5-1.5H7.5v3A1.5 1.5 0 0 1 6 12a1.5 1.5 0 0 1-1.5-1.5V9zm1-5.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm1.5 1a1.5 1.5 0 0 1 1.5 1.5v1.5H7A1.5 1.5 0 0 1 4 7a1.5 1.5 0 0 1 1.5-1.5h1.5zm5.5 1a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0zm-1 1.5a1.5 1.5 0 0 1-1.5 1.5H8.5V6A1.5 1.5 0 0 1 10 4.5a1.5 1.5 0 0 1 1.5 1.5v3zm-1 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-1.5-1a1.5 1.5 0 0 1-1.5-1.5v-1.5H9A1.5 1.5 0 0 1 12 9a1.5 1.5 0 0 1-1.5 1.5h-1.5z"/>
      </svg>

      <!-- Skills / Cluster / Spark -->
      <svg *ngIf="name === 'skills'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM2 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-9 4.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm6 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM7 3.5h2v1H7v-1zm-3.5 5h1v2h-1v-2zm8 0h1v2h-1v-2z"/>
      </svg>

      <!-- Paperclip -->
      <svg *ngIf="name === 'paperclip'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4.5 3a2.5 2.5 0 0 1 5 0v7a1.5 1.5 0 0 1-3 0V4.5a.75.75 0 0 1 1.5 0V10a.5.5 0 0 0 1 0V3a1.5 1.5 0 0 0-3 0v7.5a2.5 2.5 0 0 0 5 0V4.5a.75.75 0 0 1 1.5 0V10.5a3.5 3.5 0 0 1-7 0V3z"/>
      </svg>

      <!-- Arrow Up (Send) -->
      <svg *ngIf="name === 'arrow-up'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.5a.75.75 0 0 1 .53.22l4 4a.75.75 0 0 1-1.06 1.06L8.75 5.06V13a.75.75 0 0 1-1.5 0V5.06L4.53 7.78a.75.75 0 0 1-1.06-1.06l4-4a.75.75 0 0 1 .53-.22z"/>
      </svg>

      <!-- Chevron Down -->
      <svg *ngIf="name === 'chevron-down'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.72 5.97a.75.75 0 0 1 1.06 0L8 9.19l3.22-3.22a.75.75 0 1 1 1.06 1.06l-3.75 3.75a.75.75 0 0 1-1.06 0L3.72 7.03a.75.75 0 0 1 0-1.06z"/>
      </svg>

      <!-- Chevron Right -->
      <svg *ngIf="name === 'chevron-right'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M5.97 3.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06L9.19 8 5.97 4.78a.75.75 0 0 1 0-1.06z"/>
      </svg>

      <!-- Users / Team -->
      <svg *ngIf="name === 'users'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M5.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm5 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm-5 1.5c-2.33 0-7 1.17-7 3.5V14.5h14v-1.5c0-2.33-4.67-3.5-7-3.5zm5 1.5c-.32 0-.7.04-1.12.11 1.04.75 1.62 1.68 1.62 2.89v.5H16v-.5c0-1.75-2.92-3-5.5-3z"/>
      </svg>

      <!-- Priority Bars -->
      <svg *ngIf="name === 'priority'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M2 11a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-3zm4.5-3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V8zm4.5-4a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1V4z"/>
      </svg>

      <!-- Status Circle -->
      <svg *ngIf="name === 'status'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
      </svg>

      <!-- User / From -->
      <svg *ngIf="name === 'user'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1.5c-2.67 0-8 1.34-8 4V15h16v-1.5c0-2.66-5.33-4-8-4z"/>
      </svg>

      <!-- History Clock -->
      <svg *ngIf="name === 'history'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 4.6 11.1l1.06 1.06A8 8 0 1 1 8 0v1.5zm.75 3.25a.75.75 0 0 0-1.5 0V8c0 .2.08.39.22.53l2.5 2.5a.75.75 0 0 0 1.06-1.06L8.75 7.69V4.75z"/>
      </svg>

      <!-- Help Question -->
      <svg *ngIf="name === 'help'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M8 1.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8 2.75a.875.875 0 1 0 0 1.75.875.875 0 0 0 0-1.75zM8 4.25c-1.24 0-2.25.9-2.25 2a.75.75 0 0 0 1.5 0c0-.28.34-.5.75-.5s.75.22.75.5c0 .35-.2.52-.61.76-.5.3-.89.65-.89 1.49v.25a.75.75 0 0 0 1.5 0v-.15c0-.18.1-.3.39-.48.5-.3.86-.67.86-1.37 0-1.1-1.01-2-2.25-2z"/>
      </svg>

      <!-- Close X -->
      <svg *ngIf="name === 'close'" [attr.width]="size" [attr.height]="size" viewBox="0 0 16 16" fill="currentColor">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"/>
      </svg>
    </span>
  `,
  styles: [`
    .icon-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      flex-shrink: 0;
      color: inherit;
    }
    svg {
      display: block;
    }
  `]
})
export class IconComponent {
  @Input() name!: string;
  @Input() size: number = 14;
}
