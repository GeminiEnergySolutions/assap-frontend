import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuditComponent} from './audit/audit.component';
import {MainComponent} from './main/main.component';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
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
  {path: 'audits/:aid', component: PreAuditComponent},
  {path: 'audits/:aid/zones/:zid', component: ZoneComponent},
  {path: 'audits/:aid/zones/:zid/types/:type/:tid', component: TypeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
