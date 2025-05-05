import { Routes } from '@angular/router';
import { AdminDashboardLayoutsComponent } from './layouts/admin-dashboard-layouts/admin-dashboard-layouts.component';
import { ProductAdminPageComponent } from './pages/product-admin-page/product-admin-page.component';
import { ProductsAdminPageComponent } from './pages/products-admin-page/products-admin-page.component';
import { IsAdminGuard } from '@auth/guards/is-admin.guard';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayoutsComponent,
    canMatch:[ IsAdminGuard ],
    children: [
      {
        path: 'products',
        component: ProductsAdminPageComponent
      },
      {
        path: 'products/:id',
        component: ProductAdminPageComponent
      },
      {
        path: '**',
        redirectTo: 'products'
      }
    ]
  },


]

export default adminDashboardRoutes;
