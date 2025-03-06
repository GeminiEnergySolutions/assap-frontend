import {Routes} from '@angular/router';
import {AuthGuard} from '../shared/guard/auth.guard';
import {ProfileComponent} from './profile/profile.component';
import {SettingsComponent} from './settings/settings.component';
import { SiteSettingsComponent } from './site-settings/site-settings.component';

export const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {path: 'change-password', component: ProfileComponent, canActivate: [AuthGuard]},
      {path: 'site', component: SiteSettingsComponent, canActivate: [AuthGuard]},
    ],
  },
];
