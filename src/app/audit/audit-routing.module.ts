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
      {
        path: ':aid',
        component: AuditComponent,
        children: [
          {path: 'preaudit', component: PreauditFormComponent},
          {path: 'zones', component: ZoneListComponent},
          {path: 'photos', component: PhotosComponent},
          {path: 'cleanenergyhub', component: CleanEnergyHubComponent},
          {path: 'grants', component: GrantComponent},
          {path: 'report', component: GenerateReportDialogComponent},
          // {path: 'access', component: AccessControlComponent},
          {path: '', pathMatch: 'full', redirectTo: 'preaudit'},
        ],
      },
    ],
  },
  {
    path: ':aid/zones',
    component: PreZoneComponent,
    children: [
      {
        path: ':zid',
        component: ZoneComponent,
        children: [
          {path: '', pathMatch: 'full', component: ZoneFormComponent},
          {path: 'equipments/:eid', component: TypeListComponent},
          {path: 'equipments/:eid/new', component: CreateEquipmentComponent},
        ],
      },
    ],
  },
  {
    path: ':aid/zones/:zid/equipments/:eid',
    component: PreTypeComponent,
    children: [
      {
        path: 'types/:tid', component: TypeComponent,
        // canDeactivate: [UnsavedChangesGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuditRoutingModule {
}
