import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuditDetailComponent} from './audit-detail/audit-detail.component';
import {PhotosComponent} from './photos/photos.component';
import {AuditMasterDetailComponent} from './audit-master-detail/audit-master-detail.component';
import {CleanEnergyHubComponent} from './clean-energy-hub/clean-energy-hub.component';
import {GrantsComponent} from './grants/grants.component';
import {PreauditFormComponent} from './preaudit-form/preaudit-form.component';
import {CreateAuditModalComponent} from './create-audit-modal/create-audit-modal.component';

const routes: Routes = [
  {
    path: '',
    component: AuditMasterDetailComponent,
    children: [
      {path: 'new', component: CreateAuditModalComponent},
      {path: ':aid/preaudit', component: PreauditFormComponent},
      {path: ':aid/grants', component: GrantsComponent},
      {path: ':aid/cleanenergyhub', component: CleanEnergyHubComponent},
      {path: ':aid/photos', component: PhotosComponent},
      {path: ':aid', component: AuditDetailComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRoutingModule {
}
