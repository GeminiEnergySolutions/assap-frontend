import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AuthGuard} from './shared/guard/auth.guard';

const routes: Routes = [
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
    path: 'settings',
    loadChildren: () => import('./settings/setting.module').then((m) => m.SettingModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {path: '', pathMatch: 'full', redirectTo: '/auth/login'},
  {path: '**', component: PageNotFoundComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
