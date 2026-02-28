import {Routes} from '@angular/router';
import {UnsavedChangesGuard} from '../shared/guard/unsaved-changes.guard';
import {AuditDetailComponent} from './audit-detail/audit-detail.component';
import {AuditMasterDetailComponent} from './audit-master-detail/audit-master-detail.component';
import {CleanEnergyHubComponent} from './clean-energy-hub/clean-energy-hub.component';
import {CreateAuditModalComponent} from './create-audit-modal/create-audit-modal.component';
import {DataCollectorsComponent} from './data-collectors/data-collectors.component';
import {EquipmentOverviewComponent} from './equipment-overview/equipment-overview.component';
import {GrantsComponent} from './grants/grants.component';
import {PhotosComponent} from './photos/photos.component';
import {PreauditFormComponent} from './preaudit-form/preaudit-form.component';
import {ReportsComponent} from './reports/reports.component';

export const routes: Routes = [
  {
    path: '',
    component: AuditMasterDetailComponent,
    children: [
      {path: 'new', component: CreateAuditModalComponent},
      {path: ':aid/preaudit', component: PreauditFormComponent, canDeactivate: [UnsavedChangesGuard]},
      {path: ':aid/grants', component: GrantsComponent, canDeactivate: [UnsavedChangesGuard]},
      {path: ':aid/cleanenergyhub', component: CleanEnergyHubComponent, canDeactivate: [UnsavedChangesGuard]},
      {path: ':aid/photos', component: PhotosComponent},
      {path: ':aid/overview', component: EquipmentOverviewComponent},
      {path: ':aid/reports', component: ReportsComponent},
      {path: ':aid/data-collectors', component: DataCollectorsComponent},
      {path: ':aid', component: AuditDetailComponent},
    ],
  },
];
