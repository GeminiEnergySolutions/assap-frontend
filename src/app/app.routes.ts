import {Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthGuard} from './shared/guard/auth.guard';
import {TutorialComponent} from './tutorial/tutorial.component';

export const routes: Routes = [
  {
    path: 'audits',
    loadChildren: () => import('./audit/audit.routes').then((m) => m.routes),
    canActivate: [AuthGuard],
  },
  {
    path: 'audits/:aid/zones',
    loadChildren: () => import('./zone/zone.routes').then(m => m.routes),
  },
  {
    path: 'audits/:aid/zones/:zid/equipments',
    loadChildren: () => import('./equipment/equipment.routes').then(m => m.routes),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.routes').then((m) => m.routes),
  },
  {
    path: 'schema-editor',
    loadChildren: () => import('./schema-editor/schema-editor.routes').then((m) => m.routes),
    canActivate: [AuthGuard],
  },
  {path: 't/:step', outlet: 'tutorial', component: TutorialComponent},
  {path: '', pathMatch: 'full', redirectTo: '/auth/login'},
  {path: '**', component: PageNotFoundComponent},
];
