import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormsModule as AppFormsModule} from '../shared/form/form.module';
import {AuthRoutingModule} from './auth-routing.module';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {BrandHeaderComponent} from './brand-header/brand-header.component';
import {ChangePasswordComponent} from './change-password/change-password.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AppFormsModule,
  ],
  providers: [],
  declarations: [
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    ChangePasswordComponent,
    BrandHeaderComponent,
  ],
  exports: [
    BrandHeaderComponent,
  ],
})
export class AuthModule {
}
