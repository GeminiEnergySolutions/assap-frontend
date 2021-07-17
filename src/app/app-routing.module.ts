import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuditComponent} from './audit/audit.component';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {TypeComponent} from './type/type.component';
import {UnsavedChangesGuard} from './unsaved-changes.guard';
import {ZoneComponent} from './zone/zone.component';


const routes: Routes = [
  {path: 'settings', loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule)},
  {path: '', pathMatch: 'full', redirectTo: '/audits'},
  {
    path: 'audits',
    component: PreAuditComponent,
    children: [
      {path: ':aid', component: AuditComponent, canDeactivate: [UnsavedChangesGuard]},
    ],
  },
  {
    path: 'audits/:aid/zones',
    component: PreZoneComponent,
    children: [
      {path: ':zid', component: ZoneComponent},
    ],
  },
  {
    path: 'audits/:aid/zones/:zid/:type',
    component: PreTypeComponent,
    children: [
      {path: ':tid', component: TypeComponent, canDeactivate: [UnsavedChangesGuard]},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    paramsInheritanceStrategy: 'always',
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
