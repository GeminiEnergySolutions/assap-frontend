import {Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthGuard} from './shared/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'audits',
    loadChildren: () => import('./audit/audit.module').then((m) => m.AuditModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'audits/:aid/zones',
    loadChildren: () => import('./zone/zone.module').then(m => m.ZoneModule),
  },
  {
    path: 'audits/:aid/zones/:zid/equipments',
    loadChildren: () => import('./equipment/equipment.module').then(m => m.EquipmentModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'schema-editor',
    loadChildren: () => import('./schema-editor/schema-editor.module').then((m) => m.SchemaEditorModule),
    canActivate: [AuthGuard],
  },
  {path: '', pathMatch: 'full', redirectTo: '/auth/login'},
  {path: '**', component: PageNotFoundComponent},
];
