import { NewCarComponent } from './new-car/new-car.component';
import { CarEditComponent } from './car-edit/car-edit.component';
import { AdminAuthGauardService as AdminAuthGauard } from './services/admin-auth-gauard.service';
import { ResetPasswordConfirmComponent } from './reset-password-confirm/reset-password-confirm.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { RegisterComponent } from './register/register.component';
import { MembershipComponent } from './membership/membership.component';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { Authguard } from './services/authguard.service';
import { OrderComponent } from './admin/order/order.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompareComponent } from './compare/compare.component';
import { FleetComponent } from './fleet/fleet.component';
import { ContactComponent } from './contact/contact.component';
import { AboutComponent } from './about/about.component';
import { IndexComponent } from './index/index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SingleCarComponent } from './singl-car/singl-car.component';
import { FavComponent } from './fav/fav.component';
import { SettingComponent } from './admin/setting/setting.component';
import { LoginComponent } from './login/login.component';
import { CarsComponent } from './cars/cars.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'index',
    component: IndexComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  { path: 'fleet/:id', component: SingleCarComponent },

  {
    path: 'fleet',
    component: FleetComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'compare',
    component: CompareComponent,
  },
  {
    path: 'fav',
    component: FavComponent,
  },
  {
    path: 'login',
    component: MembershipComponent,
    children: [
      {
        path: '',
        component: LoginComponent,
      },
      {
        path: 'register',
        component: RegisterComponent,
      },
      {
        path: 'reset',
        component: ResetPasswordComponent,
      },
      {
        path: 'confirm',
        component: ResetPasswordConfirmComponent,
      },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [Authguard],
    component: DashboardComponent,
    children: [
      {
        path: '',
        canActivate: [Authguard],
        component: OrdersComponent,
      },
      {
        path: 'order/:id/edit',
        canActivate: [Authguard, AdminAuthGauard],
        component: OrderEditComponent,
      },
      {
        path: 'order/:id',
        canActivate: [Authguard],
        component: OrderComponent,
      },
      {
        path: 'setting',
        canActivate: [Authguard],
        component: SettingComponent,
      },

      {
        path: 'cars',
        canActivate: [AdminAuthGauard],
        component: CarsComponent,
        pathMatch: 'full',
      },
      {
        path: 'cars/new',
        canActivate: [AdminAuthGauard],
        component: NewCarComponent,
      },
      {
        path: 'car/:id/edit',
        canActivate: [AdminAuthGauard],
        component: CarEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
