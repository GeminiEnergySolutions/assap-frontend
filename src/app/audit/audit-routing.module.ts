import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UnsavedChangesGuard} from '../unsaved-changes.guard';
import {AuditComponent} from './audit/audit.component';
import {PhotosComponent} from './photos/photos.component';
import {PreAuditComponent} from './pre-audit/pre-audit.component';
import {PreZoneComponent} from './pre-zone/pre-zone.component';
import {ZoneListComponent} from './zone-list/zone-list.component';
import {PreTypeComponent} from './pre-type/pre-type.component';
import {TypeListComponent} from './type-list/type-list.component';
import {TypeComponent} from './type/type.component';
import {ZoneComponent} from './zone/zone.component';
import {CleanEnergyHubComponent} from './clean-energy-hub/clean-energy-hub.component';
import {GrantComponent} from './grant/grant.component';
import {GenerateReportDialogComponent} from './generate-report-dialog/generate-report-dialog.component';
import {PreauditFormComponent} from "./preaudit-form/preaudit-form.component";
import {ZoneFormComponent} from "./zone-form/zone-form.component";
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';

const routes: Routes = [
  {
    path: '',
    component: PreAuditComponent,
    children: [
      {path: ':aid/preaudit', component: PreauditFormComponent},
      {path: ':aid/grants', component: GrantComponent},
      {path: ':aid/cleanenergyhub', component: CleanEnergyHubComponent},
      {path: ':aid/photos', component: PhotosComponent},
      {
        path: ':aid',
        component: AuditComponent,
        children: [
          {path: 'report', component: GenerateReportDialogComponent},
        ],
      },
    ],
  },
  {
    path: ':aid/zones',
    component: PreZoneComponent,
    children: [
      {path: ':zid/details', component: ZoneFormComponent},
      {path: ':zid/photos', component: PhotosComponent},
      {path: ':zid', component: ZoneComponent},
    ],
  },
  {
    path: ':aid/zones/:zid/equipments/:eid',
    component: PreTypeComponent,
    children: [
      {
        path: 'new', component: CreateEquipmentComponent,
      },
      {path: 'types/:tid/photos', component: PhotosComponent},
      {path: 'types/:tid', component: TypeComponent,},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRoutingModule {
}
