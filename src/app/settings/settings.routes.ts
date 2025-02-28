import {Routes} from '@angular/router';
import {AuthGuard} from '../shared/guard/auth.guard';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {SettingsComponent} from './settings/settings.component';
import { SiteComponent } from './site/site.component';

export const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]},
      {path: 'site', component: SiteComponent, canActivate: [AuthGuard]},
    ],
  },
];
