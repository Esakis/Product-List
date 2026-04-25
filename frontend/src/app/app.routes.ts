import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'products' },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/product-catalog-page.component').then(m => m.ProductCatalogPageComponent)
  },
  { path: '**', redirectTo: 'products' }
];
