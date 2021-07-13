import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuditComponent} from './audit/audit.component';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {SettingsComponent} from './settings/settings.component';
import {TypeComponent} from './type/type.component';
import {ZoneComponent} from './zone/zone.component';


const routes: Routes = [
  {path: 'settings', component: SettingsComponent},
  {path: '', pathMatch: 'full', redirectTo: '/audits'},
  {
    path: 'audits',
    component: PreAuditComponent,
    children: [
      {path: ':aid', component: AuditComponent},
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
      {path: ':tid', component: TypeComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
