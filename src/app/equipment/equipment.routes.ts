import {Routes} from '@angular/router';
import {DuplicateEquipmentModalComponent} from './duplicate-equipment-modal/duplicate-equipment-modal.component';
import {EquipmentMasterDetailComponent} from './equipment-master-detail/equipment-master-detail.component';
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';
import {EquipmentDetailComponent} from './equipment-detail/equipment-detail.component';
import {ConnectZoneComponent} from './connect-zone/connect-zone.component';
import {PhotosComponent} from '../audit/photos/photos.component';
import {UnsavedChangesGuard} from '../shared/guard/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: ':eid',
    component: EquipmentMasterDetailComponent,
    children: [
      {
        path: 'new', component: CreateEquipmentComponent,
      },
      {path: 'types/:tid/photos', component: PhotosComponent},
      {
        path: 'types/:tid',
        component: EquipmentDetailComponent,
        canDeactivate: [UnsavedChangesGuard],
        children: [
          {path: 'connect', component: ConnectZoneComponent},
          {path: 'duplicate', component: DuplicateEquipmentModalComponent},
        ],
      },
    ],
  }
];
