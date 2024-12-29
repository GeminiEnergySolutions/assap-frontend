import {Routes} from '@angular/router';
import {EquipmentMasterDetailComponent} from './equipment-master-detail/equipment-master-detail.component';
import {CreateEquipmentComponent} from './create-equipment/create-equipment.component';
import {EquipmentDetailComponent} from './equipment-detail/equipment-detail.component';
import {ConnectZoneComponent} from './connect-zone/connect-zone.component';
import {PhotosComponent} from '../audit/photos/photos.component';

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
        children: [
          {path: 'connect', component: ConnectZoneComponent},
        ],
      },
    ],
  }
];
