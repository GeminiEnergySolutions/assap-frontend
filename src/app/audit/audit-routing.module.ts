import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuditDetailComponent} from './audit-detail/audit-detail.component';
import {PhotosComponent} from './photos/photos.component';
import {AuditMasterDetailComponent} from './audit-master-detail/audit-master-detail.component';
import {CleanEnergyHubComponent} from './clean-energy-hub/clean-energy-hub.component';
import {GrantsComponent} from './grants/grants.component';
import {GenerateReportDialogComponent} from './generate-report-dialog/generate-report-dialog.component';
import {PreauditFormComponent} from './preaudit-form/preaudit-form.component';

const routes: Routes = [
  {
    path: '',
    component: AuditMasterDetailComponent,
    children: [
      {path: ':aid/preaudit', component: PreauditFormComponent},
      {path: ':aid/grants', component: GrantsComponent},
      {path: ':aid/cleanenergyhub', component: CleanEnergyHubComponent},
      {path: ':aid/photos', component: PhotosComponent},
      {
        path: ':aid',
        component: AuditDetailComponent,
        children: [
          {path: 'report', component: GenerateReportDialogComponent},
        ],
      },
    ],
  },
  {
    path: ':aid/zones',
    loadChildren: () => import('../zone/zone.module').then(m => m.ZoneModule),
  },
  {
    path: ':aid/zones/:zid/equipments',
    loadChildren: () => import('../equipment/equipment.module').then(m => m.EquipmentModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRoutingModule {
}
