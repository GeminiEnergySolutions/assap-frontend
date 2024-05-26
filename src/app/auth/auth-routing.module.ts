import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnsavedChangesGuard } from '../shared/guard/unsaved-changes.guard';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {path:'', redirectTo:'/auth/login',pathMatch:'full'},
  {path:'login', component: LoginComponent},
  {path:'signup', component: SignupComponent},
  {path:'forgot-password', component: ForgotPasswordComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
