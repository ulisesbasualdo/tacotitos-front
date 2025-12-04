import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    // ruta para el delivery
    path: 'delivery',
    loadComponent: () =>
      import('./pages/delivery-page').then(m => m.DeliveryPage),
  },
  {
    // ruta para el orquestador
    path: 'admin',
    loadComponent: () =>
      import('./modules/orquestador/orquestador.component').then(
        m => m.OrquestadorComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'delivery',
  },
];
