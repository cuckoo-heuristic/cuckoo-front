import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'simulator', pathMatch: 'full' },
  {
    path: 'simulator',
    loadComponent: () =>
      import('../app/layer/simulator/simulator').then((c) => c.Simulator),
  },
];
