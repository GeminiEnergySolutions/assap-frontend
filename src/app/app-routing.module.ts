import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { AuthGuard } from './auth.guard';
import { LoginGuard } from './login.guard';
import { ChangePasswordComponent } from './shared/components/change-password/change-password.component';

const routes: Routes = [
  {
    path: 'audits',
    loadChildren: () => import('./audit/audit.module').then((m) => m.AuditModule),
    canActivate: [AuthGuard], // Use the AuthGuard to guard the audits route
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/setting.module').then((m) => m.SettingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [LoginGuard],
  },
  {
    path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard],
  },
  // {path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
  {path: '', pathMatch: 'full', redirectTo: '/auth/login'},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
