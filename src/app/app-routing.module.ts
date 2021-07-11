import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuditComponent} from './audit/audit.component';
import {MainComponent} from './main/main.component';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {TypeComponent} from './type/type.component';
import {ZoneComponent} from './zone/zone.component';


const routes: Routes = [
  {path: '', component: MainComponent},
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
  {path: 'audits/:aid/zones/:zid/types/:type/:tid', component: TypeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
