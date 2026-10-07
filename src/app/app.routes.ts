import { Routes } from '@angular/router';
import { WorkspacePageComponent } from './features/workspace/pages/workspace-page/workspace-page.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: WorkspacePageComponent,
    canActivate: [authGuard]
  },
  {
    path: 'workspace',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
