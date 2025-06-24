import { Routes } from '@angular/router';
import { ProjectListComponent } from './home/home';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: ProjectListComponent },
  {
    path: 'tasks/:projectId',
    loadComponent: () => import('./tasks/tasks')
      .then(m => m.TaskListComponent)
  }
];
