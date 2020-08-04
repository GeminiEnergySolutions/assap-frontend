import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainComponent} from "./main/main.component";
import {ZoneComponent} from "./zone/zone.component";
import {PreAuditComponent} from "./pre-audit/pre-audit.component";


const routes: Routes = [
  {path: '', component: MainComponent},
  {path: 'audits', component: PreAuditComponent },
  {path: 'audits/:aid', component: PreAuditComponent },
  {path: 'audits/:aid/zones/:zid', component: ZoneComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
