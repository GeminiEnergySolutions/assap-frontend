import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from "./main/main.component";
import {ZoneComponent} from "./zone/zone.component";
import {PreAuditComponent} from "./pre-audit/pre-audit.component";
import {TypeComponent} from "./type/type.component";


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'audits', component: PreAuditComponent },
  {path: 'audits/:aid', component: PreAuditComponent },
  {path: 'audits/:aid/zones/:zid', component: ZoneComponent},
  {path: 'audits/:aid/zones/:zid/types/:type/:tid', component: TypeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
