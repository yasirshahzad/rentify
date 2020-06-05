import { environment } from './../environments/environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { NzSwitchModule } from 'ng-zorro-antd/switch';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzProgressModule } from 'ng-zorro-antd/progress';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { IndexComponent } from './index/index.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import { FleetComponent } from './fleet/fleet.component';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { CompareComponent } from './compare/compare.component';
import { SingleCarComponent } from './singl-car/singl-car.component';
import { FavComponent } from './fav/fav.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrdersComponent } from './admin/orders/orders.component';
import { OrderComponent } from './admin/order/order.component';
import { SettingComponent } from './admin/setting/setting.component';
import { AngularFireModule } from '@angular/fire';
import { LoginComponent } from './login/login.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { OrderEditComponent } from './order-edit/order-edit.component';
import { CarsComponent } from './cars/cars.component';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { MembershipComponent } from './membership/membership.component';
import { RegisterComponent } from './register/register.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ResetPasswordConfirmComponent } from './reset-password-confirm/reset-password-confirm.component';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { CarEditComponent } from './car-edit/car-edit.component';
import { NewCarComponent } from './new-car/new-car.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    IndexComponent,
    AboutComponent,
    ContactComponent,
    FleetComponent,
    CompareComponent,
    SingleCarComponent,
    FavComponent,
    CheckoutComponent,
    DashboardComponent,
    OrdersComponent,
    OrderComponent,
    SettingComponent,
    LoginComponent,
    OrderEditComponent,
    CarsComponent,
    MembershipComponent,
    RegisterComponent,
    ResetPasswordComponent,
    ResetPasswordConfirmComponent,
    CarEditComponent,
    NewCarComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzMenuModule,
    NzDescriptionsModule,
    NzInputModule,
    NzLayoutModule,
    NzButtonModule,
    NzGridModule,
    NzUploadModule,
    NzIconModule,
    NzSkeletonModule,
    FormsModule,
    NzSelectModule,
    NzSliderModule,
    NzCardModule,
    NzCheckboxModule,
    NzTabsModule,
    NzBadgeModule,
    NzCarouselModule,
    NzNotificationModule,
    NzMessageModule,
    NzStepsModule,
    ReactiveFormsModule,
    NzAvatarModule,
    NzModalModule,
    NzAlertModule,
    NzResultModule,
    NzTableModule,
    NzDividerModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    NzSpinModule,
    NzDrawerModule,
    NzSwitchModule,
    AngularFireStorageModule,
    NzProgressModule,
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent],
  entryComponents: [CheckoutComponent],
})
export class AppModule {}
