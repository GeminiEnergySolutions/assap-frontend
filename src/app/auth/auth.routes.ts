import {Routes} from '@angular/router';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';

export const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'change-password', redirectTo: '/settings/change-password'},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
];
